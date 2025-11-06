import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "~/lib/db";

export const auth = betterAuth({
  basePath: "/api/auth",
  baseURL: process.env.BETTER_AUTH_URL ?? 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  trustHost: true,
  database: prismaAdapter(
    prisma as unknown as Parameters<typeof prismaAdapter>[0],
    {
      provider: "postgresql",
    },
  ),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
