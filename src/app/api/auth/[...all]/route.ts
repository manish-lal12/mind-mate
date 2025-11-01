import { auth } from "~/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// TODO - check these types

// ESLint suppression for better-auth type resolution issues
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
export const { GET, POST } = toNextJsHandler(auth);
