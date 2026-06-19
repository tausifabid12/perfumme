"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Stat } from "@/types/product";

gsap.registerPlugin(ScrollTrigger);

export default function StatCard({
  stat,
  index,
}: {
  stat: Stat;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.6, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "back.out(2)",
          delay: index * 0.08,
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
      const match = stat.number.match(/[\d.]+/);
      if (match && numberRef.current) {
        const target = parseFloat(match[0]);
        const suffix = stat.number.replace(match[0], "");
        const counter = { val: 0 };
        ScrollTrigger.create({
          trigger: cardRef.current,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.to(counter, {
              val: target,
              duration: 1.6,
              delay: 0.3 + index * 0.08,
              ease: "power2.out",
              onUpdate: () => {
                if (!numberRef.current) return;
                numberRef.current.textContent = `${Math.floor(counter.val)}${suffix}`;
              },
            });
          },
        });
      }
    });
    return () => ctx.revert();
  }, [index, stat.number]);

  return (
    <div
      ref={cardRef}
      className="flex flex-col items-center px-6 py-5 lg:px-8 lg:py-7 rounded-tag cursor-hover transition-all duration-400 hover:scale-110 hover:-translate-y-2"
      style={{
        background: "rgba(212,175,55,0.04)",
        border: "1px solid rgba(212,175,55,0.14)",
        backdropFilter: "blur(12px)",
        opacity: 0,
      }}
    >
      <span
        ref={numberRef}
        className="text-stat-number"
        style={{ color: "var(--text-primary)" }}
      >
        {stat.number}
      </span>
      <span
        className="text-stat-label mt-1"
        style={{ color: "var(--accent-gold)" }}
      >
        {stat.label}
      </span>
    </div>
  );
}
