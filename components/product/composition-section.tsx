/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import WordStagger from "@/lib/animations/word-stagger";
import type { ProductData } from "@/types/product";

gsap.registerPlugin(ScrollTrigger);

export default function CompositionSection({
  data,
}: {
  data: ProductData;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);
  const ingredientsRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const bottleWrapRef = useRef<HTMLDivElement>(null);
  const composition = data.composition;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        tagRef.current,
        { opacity: 0, y: 20, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
      const cards = ingredientsRef.current?.children || [];
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50, rotateY: -60, scale: 0.85 },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: {
            trigger: ingredientsRef.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        labelRef.current,
        { clipPath: "inset(0 0 100% 0)", opacity: 0 },
        {
          clipPath: "inset(0 0 0% 0)",
          opacity: 1,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: labelRef.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        bottleWrapRef.current,
        {
          clipPath: "inset(20% 20% 20% 20% round 32px)",
          scale: 0.75,
          opacity: 0,
        },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: bottleWrapRef.current,
            start: "top 88%",
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
      style={{ background: "var(--bg-cream)" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="mb-14 lg:mb-20">
          <span
            ref={tagRef}
            className="inline-block px-4 py-2 rounded-tag text-[10px] font-black uppercase tracking-[0.3em] mb-6"
            style={{
              background: "var(--accent-gold)",
              color: "#0A0A0A",
              opacity: 0,
            }}
          >
            {composition.tag}
          </span>
          <WordStagger
            text={composition.title}
            className="text-3xl lg:text-5xl font-black uppercase"
            style={{
              color: "var(--text-dark)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
            triggerRef={sectionRef}
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          <div className="flex-1">
            <div
              ref={ingredientsRef}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4"
              style={{ perspective: 800 }}
            >
              {composition.ingredients.map((ing) => (
                <div
                  key={ing.name}
                  className="flex flex-col items-center gap-2 p-5 rounded-card transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-hover"
                  style={{
                    background: "rgba(26,26,26,0.06)",
                    border: "1px solid rgba(26,26,26,0.1)",
                    opacity: 0,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-black"
                    style={{
                      background: "var(--text-dark)",
                      color: "#D4AF37",
                    }}
                  >
                    {ing.icon}
                  </div>
                  <span
                    className="text-xs font-black uppercase tracking-wider text-center"
                    style={{ color: "var(--text-dark)" }}
                  >
                    {ing.name}
                  </span>
                  {ing.sub && (
                    <span
                      className="text-[10px] uppercase tracking-wider"
                      style={{
                        color: "var(--text-dark)",
                        opacity: 0.5,
                      }}
                    >
                      {ing.sub}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <a
              href="/collections"
              className="inline-flex items-center gap-2 mt-8 text-sm font-black uppercase tracking-wider cursor-hover"
              style={{ color: "var(--text-dark)" }}
            >
              VIEW FULL COLLECTION <ArrowRight size={14} />
            </a>
          </div>
          <div className="flex-1 flex flex-col sm:flex-row gap-8 items-start">
            <div
              ref={labelRef}
              className="w-full sm:max-w-[300px] p-6 rounded-xl"
              style={{
                background: "#fff",
                border: "2px solid rgba(26,26,26,0.12)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <h3
                className="text-xl font-bold border-b-2 border-black pb-2 mb-3"
                style={{
                  color: "var(--text-dark)",
                  fontFamily: "serif",
                }}
              >
                {composition.facts.title}
              </h3>
              <p
                className="text-xs mb-3"
                style={{ color: "var(--text-dark)" }}
              >
                {composition.facts.serving}
              </p>
              <div className="border-b border-black pb-2 mb-2">
                <div className="flex justify-between items-baseline">
                  <span
                    className="text-lg font-bold"
                    style={{ color: "var(--text-dark)" }}
                  >
                    Concentration
                  </span>
                  <span
                    className="text-2xl font-bold"
                    style={{ color: "var(--text-dark)" }}
                  >
                    {composition.facts.items[0][1]}
                  </span>
                </div>
              </div>
              {composition.facts.items.slice(1).map(([label, val]) => (
                <div
                  key={label}
                  className="flex justify-between py-1 border-b border-gray-200"
                >
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-dark)" }}
                  >
                    {label}
                  </span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "var(--text-dark)" }}
                  >
                    {val}
                  </span>
                </div>
              ))}
            </div>
            <div
              ref={bottleWrapRef}
              className="self-center"
              style={{ willChange: "transform", opacity: 0 }}
            >
              <img
                src={data.product.image}
                alt={data.product.name}
                className="h-[300px] lg:h-[380px] w-auto object-contain"
                style={{
                  filter:
                    "drop-shadow(0 10px 40px rgba(0,0,0,0.2))",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
