"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ChevronDown } from "lucide-react";
import type { FAQData } from "@/types/product";

export default function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: FAQData;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    gsap.to(
      contentRef.current,
      isOpen
        ? {
            height: "auto",
            opacity: 1,
            duration: 0.45,
            ease: "power3.out",
          }
        : {
            height: 0,
            opacity: 0,
            duration: 0.35,
            ease: "power3.inOut",
          }
    );
  }, [isOpen]);

  return (
    <div
      className="faq-item rounded-2xl overflow-hidden"
      style={{
        background: "rgba(245,245,245,0.03)",
        border: "1px solid rgba(245,245,245,0.07)",
        opacity: 0,
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 lg:px-8 py-5 text-left cursor-hover"
      >
        <span
          className="text-sm lg:text-base font-medium pr-4"
          style={{ color: "var(--text-primary)" }}
        >
          {faq.q}
        </span>
        <ChevronDown
          size={18}
          className="shrink-0 transition-transform duration-300"
          style={{
            color: "var(--accent-gold)",
            transform: isOpen
              ? "rotate(180deg)"
              : "rotate(0)",
          }}
        />
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        <p
          className="px-6 lg:px-8 pb-5 text-sm leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {faq.a}
        </p>
      </div>
    </div>
  );
}
