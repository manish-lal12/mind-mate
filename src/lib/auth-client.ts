import { createAuthClient } from "better-auth/react";

// Type assertion needed due to better-auth's complex type re-exports
// which cause TypeScript's project service to resolve some types as 'error'
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
/* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
