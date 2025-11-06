"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "~/lib/auth-client";

export default function ChatIdLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if session is not loaded and not loading
    if (!isPending && !session?.user?.id) {
      router.push("/auth/login");
    }
  }, [session?.user?.id, isPending, router]);

  // Show loading state while session is being fetched
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-green-50">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
          </div>
          <p className="text-slate-600">Loading your session...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (redirect happens in useEffect)
  if (!session?.user?.id) {
    return null;
  }

  return <>{children}</>;
}
