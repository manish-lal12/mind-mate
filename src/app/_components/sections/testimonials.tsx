"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Student",
    text: "MindEase helped me understand my anxiety in ways I never could alone. The AI guidance was compassionate and the connection to a therapist changed my life.",
    rating: 5,
  },
  {
    name: "James K.",
    role: "Professional",
    text: "Finally, a mental health app that feels human. The balance between AI support and real therapists is perfect for my busy lifestyle.",
    rating: 5,
  },
  {
    name: "Emma L.",
    role: "Artist",
    text: "I was skeptical about AI therapy, but MindEase genuinely understands emotional nuance. Highly recommend to anyone seeking support.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const testimonial = testimonials[current];

  if (!testimonial) {
    return null;
  }

  return (
    <section className="bg-white/40 px-4 py-20 backdrop-blur-sm md:px-8 md:py-32">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-4 text-center text-4xl font-bold text-balance text-slate-900 md:text-5xl">
          Real Stories, Real Impact
        </h2>
        <p className="mb-16 text-center text-lg text-slate-600">
          Hear from people who found clarity with MindEase
        </p>

        {/* Testimonial Card */}
        <div className="mb-8 flex min-h-64 flex-col justify-between rounded-3xl bg-linear-to-br from-blue-50/80 to-green-50/80 p-8 shadow-lg md:p-12">
          <div className="mb-6 flex gap-1">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="mb-8 text-xl leading-relaxed text-slate-700 italic">
            &quot;{testimonial.text}&quot;
          </p>
          <div>
            <p className="text-lg font-semibold text-slate-900">
              {testimonial.name}
            </p>
            <p className="text-slate-600">{testimonial.role}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() =>
              setCurrent(
                (current - 1 + testimonials.length) % testimonials.length,
              )
            }
            className="rounded-full p-2 transition-all hover:bg-blue-100"
          >
            <ChevronLeft className="h-6 w-6 text-slate-600" />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === current ? "w-8 bg-blue-500" : "bg-slate-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrent((current + 1) % testimonials.length)}
            className="rounded-full p-2 transition-all hover:bg-blue-100"
          >
            <ChevronRight className="h-6 w-6 text-slate-600" />
          </button>
        </div>
      </div>
    </section>
  );
}
