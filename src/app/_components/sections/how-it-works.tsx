"use client";

import { Heart, Lightbulb, Users } from "lucide-react";

const steps = [
  {
    icon: Heart,
    title: "Share How You Feel",
    description:
      "Express your thoughts and emotions in your own words. Our AI listens without judgment.",
  },
  {
    icon: Lightbulb,
    title: "Get Personalized Insights",
    description:
      "Receive tailored guidance and perspectives to help you understand your emotions better.",
  },
  {
    icon: Users,
    title: "Connect With Professionals",
    description:
      "When needed, seamlessly connect with certified therapists and mental health experts.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white/40 px-4 py-20 backdrop-blur-sm md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-6 text-center text-4xl font-bold text-balance text-slate-900 md:text-5xl">
          How It Works
        </h2>
        <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-slate-600">
          Three simple steps to find the support you need
        </p>

        <div className="grid gap-8 md:grid-cols-3 md:gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="group animate-fade-in-up flex flex-col items-center rounded-3xl bg-gradient-to-br from-blue-50/80 to-green-50/80 p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animationFillMode: "both",
                }}
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-green-400 transition-all group-hover:shadow-lg">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-slate-900 md:text-2xl">
                  {step.title}
                </h3>
                <p className="leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
