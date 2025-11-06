import { PrismaClient } from "@prisma/client";

import { env } from "~/env";

const createPrismaClient = (): PrismaClient =>
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// Use type assertion to properly define the global
const globalWithPrisma = globalThis as {
  prisma?: PrismaClient;
};

export const db: PrismaClient = globalWithPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") {
  globalWithPrisma.prisma = db;
}
