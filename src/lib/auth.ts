import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "~/lib/db";

const getAuthBaseURL = (): string => {
  // For Vercel deployments - automatically set
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // For custom domains in production
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  // Local development - default
  return "http://localhost:3000";
};

const getAllowedOrigins = (): string[] => {
  const origins = ["http://localhost:3000", "http://localhost"];

  // Add Vercel URL
  if (process.env.VERCEL_URL) {
    origins.push(`https://${process.env.VERCEL_URL}`);
  }

  // Add custom domain
  if (process.env.NEXT_PUBLIC_APP_URL) {
    origins.push(process.env.NEXT_PUBLIC_APP_URL);
  }

  return origins;
};

export const auth = betterAuth({
  basePath: "/api/auth",
  baseURL: getAuthBaseURL(),
  trustHost: true,
  allowedOrigins: getAllowedOrigins(),
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
