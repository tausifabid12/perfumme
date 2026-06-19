"use client";

import { useRef } from "react";
import WordStagger from "@/lib/animations/word-stagger";
import useMagnetic from "@/lib/animations/use-magnetic";
import TestimonialCard from "./testimonial-card";
import type { ProductData } from "@/types/product";

export default function TestimonialsSection({
  data,
}: {
  data: ProductData;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const buttonMagnetic = useMagnetic(0.2);
  const ts = data.testimonialsSection || {};

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-36 overflow-hidden"
      style={{ background: "var(--bg-cream)" }}
    >
      <div className="px-6 lg:px-10 mb-14">
        <WordStagger
          text={ts.title || "What's Everyone Talking About"}
          className="text-display-section uppercase"
          style={{
            color: "var(--text-dark)",
            maxWidth: 700,
            lineHeight: 0.9,
          }}
          triggerRef={sectionRef}
        />
      </div>
      <div className="flex flex-wrap justify-center gap-5 lg:gap-6 px-6 lg:px-10">
        {data.testimonials.map((t, i) => (
          <TestimonialCard key={t.name} t={t} index={i} />
        ))}
      </div>
      <div className="flex justify-center mt-12">
        <a
          ref={buttonMagnetic}
          href="/collections"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-pill text-sm font-black uppercase tracking-wider cursor-hover"
          style={{
            background: "var(--text-dark)",
            color: "var(--accent-gold)",
            border: "1px solid rgba(212,175,55,0.2)",
          }}
        >
          EXPLORE ALL
        </a>
      </div>
    </section>
  );
}
