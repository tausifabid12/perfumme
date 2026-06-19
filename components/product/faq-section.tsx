"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BlurReveal from "@/lib/animations/blur-reveal";
import WordStagger from "@/lib/animations/word-stagger";
import FAQItem from "./faq-item";
import type { ProductData } from "@/types/product";

gsap.registerPlugin(ScrollTrigger);

export default function FAQSection({ data }: { data: ProductData }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const fs = data.faqSection || {};

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".faq-item",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-36 overflow-hidden"
      style={{ background: "#111111" }}
    >
      <div className="max-w-[800px] mx-auto px-6 lg:px-10">
        <div className="mb-12">
          <BlurReveal>
            <span
              className="inline-block px-4 py-2 rounded-tag text-[9px] font-black uppercase tracking-[0.3em] mb-6"
              style={{
                background: "var(--accent-gold)",
                color: "#0A0A0A",
              }}
            >
              {fs.tag || "Frequently Asked Questions"}
            </span>
          </BlurReveal>
          <WordStagger
            text={
              fs.title ||
              "Got questions? We've got answers."
            }
            className="text-3xl lg:text-4xl font-black uppercase"
            style={{
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
            triggerRef={sectionRef}
          />
        </div>
        <div className="flex flex-col gap-3">
          {data.faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              isOpen={openIndex === i}
              onToggle={() =>
                setOpenIndex(
                  openIndex === i ? null : i
                )
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
