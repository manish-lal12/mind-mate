"use client";

import Image from "next/image";

export default function HumanConnectionSection() {
  return (
    <section className="bg-linear-to-r from-blue-50/60 via-green-50/60 to-blue-50/60 px-4 py-20 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        {/* Image Side */}
        <div className="relative flex h-96 items-center justify-center md:h-full">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-blue-300/20 to-green-300/20 blur-2xl" />
            <Image
              src="/hero_consultation.jpg"
              alt="Human connection and professional consultation"
              className="relative z-10 w-full rounded-3xl object-cover shadow-xl"
              width={600}
              height={400}
            />
          </div>
        </div>

        {/* Content Side */}
        <div>
          <h2 className="mb-6 text-4xl font-bold text-balance text-slate-900 md:text-5xl">
            Because Sometimes, AI Isn&apos;t Enough
          </h2>
          <p className="mb-8 text-lg leading-relaxed text-slate-600">
            Connect with certified mental health experts who care. Our network
            of licensed therapists, counselors, and medical professionals are
            ready to provide personalized support when you need it most.
          </p>
          <ul className="mb-10 space-y-4">
            {[
              "Licensed Therapists",
              "Verified Counselors",
              "Medical Professionals",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-400" />
                <span className="font-medium text-slate-700">{item}</span>
              </li>
            ))}
          </ul>
          <button className="rounded-full bg-blue-500 px-8 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-blue-600 hover:shadow-lg">
            Find a Professional
          </button>
        </div>
      </div>
    </section>
  );
}
