import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "~/lib/db";
import { getBaseURL } from "~/lib/get-base-url";

export const auth = betterAuth({
  basePath: "/api/auth",
  baseURL: getBaseURL(),
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
