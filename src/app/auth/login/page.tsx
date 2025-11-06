"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { GoogleSignInButton } from "~/app/_components/signInWithGoogle";

function LoginContent() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[url('/hero_bg.jpg')] bg-cover px-4">
      {/* Parallax Background Gradient */}
      <div
        className="absolute inset-0 bg-linear-to-b from-blue-50/30 via-white to-green-50/30"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />

      {/* Decorative Blurred Orbs - Left Side */}
      <div
        className="absolute top-1/4 -left-32 h-80 w-80 rounded-full bg-blue-200/20 blur-3xl"
        style={{
          transform: `translate(${-scrollY * 0.2}px, ${scrollY * 0.15}px)`,
        }}
      />

      {/* Decorative Blurred Orbs - Right Side */}
      <div
        className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-green-200/20 blur-3xl"
        style={{
          transform: `translate(${scrollY * 0.2}px, ${scrollY * 0.1}px)`,
        }}
      />

      {/* Login Card */}
      <div className="animate-fade-in relative z-10 w-full max-w-md">
        {/* Card Container */}
        <div className="rounded-2xl border border-slate-200/50 bg-white/95 shadow-xl backdrop-blur-sm">
          {/* Header */}
          <div className="border-b border-slate-100/50 px-8 py-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-slate-900">
              Welcome Back
            </h1>
            <p className="text-sm text-slate-600">
              Sign in to continue your mental wellness journey
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* Main Sign In Button */}
            <div className="mb-6">
              <Suspense
                fallback={
                  <div className="h-10 animate-pulse rounded-lg bg-slate-200" />
                }
              >
                <GoogleSignInButton />
              </Suspense>
            </div>

            {/* Divider */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex-1 border-t border-slate-200" />
              <span className="text-xs font-medium text-slate-500">OR</span>
              <div className="flex-1 border-t border-slate-200" />
            </div>

            {/* Benefits List */}
            <div className="mb-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Personalized Support
                  </p>
                  <p className="text-xs text-slate-600">
                    AI-powered guidance tailored to you
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Your Privacy Matters
                  </p>
                  <p className="text-xs text-slate-600">
                    Secure and confidential conversations
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Available 24/7
                  </p>
                  <p className="text-xs text-slate-600">
                    Support whenever you need it
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Text */}
            <p className="text-center text-xs text-slate-600">
              By signing in, you agree to our{" "}
              <Link
                href="/terms"
                className="font-medium text-blue-600 hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-medium text-blue-600 hover:underline"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Link */}
        <p className="mt-6 text-center text-sm text-slate-600">
          Not signed up yet?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold text-blue-600 hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return <LoginContent />;
}
