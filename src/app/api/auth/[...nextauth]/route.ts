import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { JWT } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "",
});

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials?: Record<"email" | "password", string>) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const client = await pool.connect();
        try {
          const result = await client.query("SELECT * FROM users WHERE email = $1", [credentials.email]);
          const user = result.rows[0];

          if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role, 
          };
        } finally {
          client.release();
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { scope: "openid email profile" } },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, account, user }: { token: JWT; account?: any; user?: any }) {
      console.log("JWT CALLBACK:", { token, account, user });

      // Jika user login pertama kali dengan Google
      if (account?.provider === "google" && account.id_token && account.access_token) {
        try {
          // Step 9: Ambil user info dari Google API
          const googleUserInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
              Authorization: `Bearer ${account.access_token}`,
            },
          }).then((res) => res.json());

          console.log("GOOGLE USER INFO:", googleUserInfo);

          // Step 10 & 11: Kirim data ke backend untuk dicek di database
          const backendResponse = await fetch(`${BACKEND_URL}/api/v1/auth/oauth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              idToken: account.id_token,
              accessToken: account.access_token,
              email: googleUserInfo.email,
              name: googleUserInfo.name,
              photoProfileUrl: googleUserInfo.picture,
            }),
          });

          if (!backendResponse.ok) {
            const errorText = await backendResponse.text();
            console.error("Backend Authentication Error:", backendResponse.status, errorText);
            throw new Error(`Failed to authenticate with backend: ${backendResponse.status} - ${errorText}`);
          }
          

          const backendData = await backendResponse.json();
          console.log("BACKEND RESPONSE:", backendData);

          // Step 12: Assign role, access token & refresh token dari backend
          token.id = backendData.id;
          token.email = backendData.email;
          token.role = backendData.role;
          token.accessToken = backendData.accessToken;
          token.refreshToken = backendData.refreshToken;
          token.scope = backendData.scope; 
        } catch (error) {
          console.error("Error processing Google login:", error);
        }
      }

      return token;
    },

    async session({ session, token }: { session: any; token: JWT }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.role = token.role;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.scope = token.scope; 
      return session;
    },

    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },
};

// Handler API NextAuth
const handler = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, authOptions);

export { handler as GET, handler as POST };
