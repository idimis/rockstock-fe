import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { JWT } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";

// Koneksi Database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "",
});

// Konfigurasi NextAuth
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

      // Jika user login pertama kali, tambahkan role ke token
      if (user) {
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }: { session: any; token: JWT }) {
      session.user.id = token.sub;
      session.user.role = token.role; 
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },

    async redirect({ url, baseUrl, token }: { url: string; baseUrl: string; token?: JWT }) {
      if (token?.role === "admin") {
        return `${baseUrl}/dashboard/admin`;
      } else {
        return `${baseUrl}/dashboard/user`;
      }
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
