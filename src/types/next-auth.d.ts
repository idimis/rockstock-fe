// next-auth.d.ts
import NextAuth from "next-auth";

// Extending JWT to include custom properties like accessToken and refreshToken
declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    userId: number;
    scope: string;
  }
}

// Extending Session to include custom properties like accessToken and refreshToken
declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;
    userId: number;
    scope: string;
  }
}
