"use client";

import { Lock, Brain, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Natural Language Understanding",
    description: "Our AI truly understands context and nuance in your words.",
  },
  {
    icon: Lock,
    title: "Privacy-First Design",
    description:
      "Your conversations are encrypted and never shared. Your privacy is sacred.",
  },
  {
    icon: Zap,
    title: "Adaptive Recommendations",
    description:
      "Get smarter, more personalized guidance as the AI learns your preferences.",
  },
];

export default function AIFeaturesSection() {
  return (
    <section className="relative overflow-hidden px-4 py-20 md:px-8 md:py-32">
      {/* Floating decorative elements */}
      <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-200/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-green-200/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <h2 className="mb-16 text-center text-4xl font-bold text-balance text-slate-900 md:text-5xl">
          AI Features Built for You
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-start rounded-2xl border border-white/80 bg-white/60 p-8 backdrop-blur-sm transition-all duration-300 hover:border-blue-200/50 hover:shadow-xl"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-400 to-green-400">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
