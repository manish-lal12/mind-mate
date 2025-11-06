"use client";

import HeroSection from "~/app/_components/sections/hero-section";
import HowItWorks from "~/app/_components/sections/how-it-works";
import AIFeaturesSection from "~/app/_components/sections/ai-features";
import HumanConnectionSection from "~/app/_components/sections/human-connection";
import TestimonialsSection from "~/app/_components/sections/testimonials";
import FooterSection from "~/app/_components/sections/footer-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-green-50">
      <HeroSection />
      <HowItWorks />
      <AIFeaturesSection />
      <HumanConnectionSection />
      <TestimonialsSection />
      <FooterSection />
    </main>
  );
}
