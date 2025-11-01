"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "~/lib/auth-client";

export function GoogleSignInButton() {
  const searchParams = useSearchParams();
  const callbackPath = decodeURIComponent(
    searchParams.get("callbackPath") ?? "/",
  );

  const handleSignIn = () => {
    // ESLint suppression for better-auth type resolution issues
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    signIn.social({
      provider: "google",
      callbackURL: callbackPath,
    });
  };

  return (
    <button
      onClick={handleSignIn}
      className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
    >
      Sign in with Google
    </button>
  );
}
