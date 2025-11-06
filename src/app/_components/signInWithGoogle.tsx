"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "~/lib/auth-client";
import { FcGoogle } from "react-icons/fc";
import { Button } from "~/app/_components/ui/button";

export function GoogleSignInButton() {
  const searchParams = useSearchParams();
  const callbackPath = decodeURIComponent(
    searchParams.get("callbackPath") ?? "/chat",
  );

  const handleSignIn = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: callbackPath,
    });
  };

  return (
    <Button
      onClick={handleSignIn}
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 font-medium text-slate-700 transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md active:scale-95"
    >
      <FcGoogle className="text-xl" />
      <span>Continue with Google</span>
    </Button>
  );
}
