/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProductData } from "@/types/product";

gsap.registerPlugin(ScrollTrigger);

export default function ShowcaseSection({
  data,
}: {
  data: ProductData;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const img1Ref = useRef<HTMLDivElement>(null);
  const img2Ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const borderRingRef = useRef<HTMLDivElement>(null);
  const borderRing2Ref = useRef<HTMLDivElement>(null);
  const glintOverlayRef = useRef<HTMLDivElement>(null);
  const sc = data.showcase;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: "+=140%",
          scrub: 1,
          pin: true,
          pinSpacing: true,
        },
      });
      tl.fromTo(
        img1Ref.current,
        {
          scale: 0.05,
          opacity: 0,
          clipPath: "circle(0% at 50% 50%)",
          filter: "brightness(0)",
        },
        {
          scale: 1.02,
          opacity: 1,
          clipPath: "circle(50% at 50% 50%)",
          filter: "brightness(1)",
          ease: "power3.out",
        },
        0
      );
      tl.fromTo(
        borderRingRef.current,
        { scale: 0, opacity: 0, rotate: -90 },
        { scale: 1, opacity: 1, rotate: 0, ease: "power3.out" },
        0.1
      );
      tl.fromTo(
        img2Ref.current,
        {
          scale: 0.2,
          opacity: 0,
          x: 80,
          y: 80,
          clipPath: "circle(0% at 50% 50%)",
        },
        {
          scale: 1,
          opacity: 1,
          x: 0,
          y: 0,
          clipPath: "circle(50% at 50% 50%)",
          ease: "expo.out",
        },
        0.3
      );
      tl.fromTo(
        borderRing2Ref.current,
        { scale: 0, opacity: 0, rotate: 90 },
        {
          scale: 1,
          opacity: 0.6,
          rotate: 0,
          ease: "power3.out",
        },
        0.4
      );
      tl.fromTo(
        eyebrowRef.current,
        {
          clipPath: "inset(0 100% 0 0)",
          opacity: 0,
        },
        {
          clipPath: "inset(0 0% 0 0)",
          opacity: 1,
          ease: "power3.out",
        },
        0.4
      );
      const words =
        headlineRef.current?.querySelectorAll(".sc-word") || [];
      tl.fromTo(
        words,
        { yPercent: 120, opacity: 0, rotateX: -60 },
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.08,
          ease: "expo.out",
        },
        0.45
      );
      tl.fromTo(
        glintOverlayRef.current,
        { x: "-100%", opacity: 0 },
        {
          x: "100%",
          opacity: 0,
          keyframes: {
            opacity: [0, 0.3, 0.3, 0],
          },
          ease: "power2.inOut",
        },
        0.7
      );
      tl.fromTo(
        labelRef.current,
        { opacity: 0, scale: 0.5, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: "back.out(2.5)",
        },
        0.85
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: "#111111" }}
    >
      <div
        ref={pinRef}
        className="relative min-h-[100dvh] flex flex-col items-center justify-center py-20 overflow-hidden"
      >
        <div
          ref={eyebrowRef}
          className="mb-6 text-center z-20 relative"
          style={{
            opacity: 0,
            clipPath: "inset(0 100% 0 0)",
          }}
        >
          <p
            className="text-[9px] uppercase tracking-[0.6em]"
            style={{ color: "var(--accent-gold)" }}
          >
            {sc.eyebrow}
          </p>
        </div>
        <div
          ref={headlineRef}
          className="mb-14 text-center z-20 relative"
          style={{ perspective: 800, overflow: "hidden" }}
        >
          {sc.headline.map((line, i) => (
            <div key={i} style={{ overflow: "hidden" }}>
              <span
                className="sc-word block text-4xl lg:text-6xl font-black uppercase"
                style={{
                  color:
                    i === 0
                      ? "var(--text-primary)"
                      : "var(--accent-gold)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                }}
              >
                {line}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-8 lg:gap-16 relative z-10">
          <div className="relative">
            <div
              ref={borderRingRef}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                border: "1px solid rgba(212,175,55,0.3)",
                margin: "-12px",
                opacity: 0,
              }}
            />
            <div
              ref={img1Ref}
              className="relative w-[260px] h-[260px] lg:w-[380px] lg:h-[380px] rounded-full overflow-hidden cursor-hover"
              style={{
                opacity: 0,
                willChange: "transform",
              }}
            >
              <img
                src={sc.image1}
                alt="Product experience"
                className="w-full h-full object-cover"
              />
              <div
                ref={glintOverlayRef}
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 30%, rgba(212,175,55,0.4) 50%, transparent 70%)",
                  opacity: 0,
                }}
              />
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div
              ref={borderRing2Ref}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                border: "1px solid rgba(154,154,154,0.25)",
                margin: "-10px",
                opacity: 0,
              }}
            />
            <div
              ref={img2Ref}
              className="relative w-[180px] h-[180px] lg:w-[260px] lg:h-[260px] rounded-full overflow-hidden cursor-hover"
              style={{
                opacity: 0,
                willChange: "transform",
              }}
            >
              <img
                src={sc.image2}
                alt="Product detail"
                className="w-full h-full object-cover grayscale"
              />
            </div>
          </div>
        </div>
        <div
          ref={labelRef}
          className="mt-10 px-6 py-2.5 rounded-pill text-xs font-black uppercase tracking-[0.3em] z-20 relative"
          style={{
            background: "var(--accent-gold)",
            color: "#0A0A0A",
            opacity: 0,
          }}
        >
          {sc.label}
        </div>
      </div>
    </section>
  );
}
