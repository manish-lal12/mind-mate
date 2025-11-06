"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "~/lib/auth-client";
import { FcGoogle } from "react-icons/fc";
import { Button } from "~/app/_components/ui/button";
import { useState } from "react";

export function GoogleSignInButton() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const callbackPath = decodeURIComponent(
    searchParams.get("callbackPath") ?? "/chat",
  );

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn.social({
        provider: "google",
        callbackURL: callbackPath,
      });
    } catch (error) {
      console.error("Sign in error:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignIn}
      disabled={isLoading}
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 font-medium text-slate-700 transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md active:scale-95 disabled:opacity-50"
    >
      <FcGoogle className="text-xl" />
      <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
    </Button>
  );
}
