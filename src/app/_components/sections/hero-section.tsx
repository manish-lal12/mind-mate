"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "~/app/_components/ui/button";

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden bg-[url('/hero_bg.jpg')] bg-cover">
      {/* Parallax Background */}
      <div
        className="absolute inset-0 bg-linear-to-b from-blue-100/40 via-transparent to-green-100/40"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />

      {/* Decorative Circles - Parallax Effect */}
      <div
        className="absolute top-20 right-10 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl"
        style={{
          transform: `translate(${scrollY * 0.3}px, ${scrollY * 0.2}px)`,
        }}
      />
      <div
        className="absolute bottom-20 left-10 h-96 w-96 rounded-full bg-green-200/20 blur-3xl"
        style={{
          transform: `translate(${-scrollY * 0.2}px, ${scrollY * 0.15}px)`,
        }}
      />

      {/* Content */}
      <div className="animate-fade-in relative z-10 mx-auto max-w-4xl px-4 text-center md:px-8">
        <h1 className="mb-6 text-5xl leading-tight font-bold text-balance text-slate-900 md:text-7xl">
          Find Calm, Clarity, and Guidance — Powered by AI
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-balance text-slate-600 md:text-xl">
          MindEase helps you understand and navigate your emotions, offering
          gentle AI support and real human connections when you need them.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/chat">
            <Button
              size="lg"
              className="rounded-full bg-blue-500 px-8 py-6 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:cursor-pointer hover:bg-blue-600 hover:shadow-lg"
            >
              Start Your Journey
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full border-slate-300 bg-transparent px-8 py-6 text-lg font-semibold transition-all duration-300 hover:cursor-pointer hover:bg-slate-50"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}
