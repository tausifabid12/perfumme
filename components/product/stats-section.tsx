/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BlurReveal from "@/lib/animations/blur-reveal";
import StatCard from "./stat-card";
import type { ProductData } from "@/types/product";

gsap.registerPlugin(ScrollTrigger);

export default function StatsSection({ data }: { data: ProductData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const bottleRef = useRef<HTMLImageElement>(null);
  const bgFarRef = useRef<HTMLDivElement>(null);
  const bgNearRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgFarRef.current, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(bgNearRef.current, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.fromTo(
        bottleRef.current,
        { y: 100, scale: 0.9 },
        {
          y: -60,
          scale: 1.05,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const stats = data.stats;
  // Split: first 4 in a 2×2 grid, last one centered below
  const mainStats = stats.slice(0, 4);
  const lastStat = stats[4];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden py-24"
      style={{ background: "var(--bg-primary)" }}
    >
      <div
        ref={bgFarRef}
        className="absolute inset-0 depth-far scale-110"
        style={{
          backgroundImage: `url(${data.product.statsBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.25) grayscale(0.5)",
        }}
      />
      <div
        ref={bgNearRef}
        className="absolute inset-0 depth-mid"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.2) 50%, rgba(10,10,10,0.6) 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center w-full px-4">
        {/* Mobile: 2-col grid — Desktop: single flex row */}
        <div className="w-full max-w-xs sm:max-w-none sm:w-auto mb-14">
          {/* Mobile layout */}
          <div className="flex flex-col items-center gap-4 sm:hidden">
            <div className="grid grid-cols-2 gap-4 w-full">
              {mainStats.map((stat, i) => (
                <StatCard key={stat.label} stat={stat} index={i} />
              ))}
            </div>
            {lastStat && (
              <div className="w-1/2">
                <StatCard stat={lastStat} index={4} />
              </div>
            )}
          </div>

          {/* Desktop layout — original flex row */}
          <div className="hidden sm:flex flex-wrap justify-center gap-4 lg:gap-6">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>

        <img
          ref={bottleRef}
          src={data.product.image}
          alt={data.product.name}
          className="h-[45vh] lg:h-[55vh] w-auto object-contain"
          style={{
            filter:
              "drop-shadow(0 30px 80px rgba(0,0,0,0.8)) drop-shadow(0 0 40px rgba(212,175,55,0.08))",
            willChange: "transform",
          }}
        />
        <BlurReveal delay={0.2} style={{ marginTop: 40 }}>
          <p
            className="text-lg lg:text-xl font-black italic tracking-wide uppercase text-center px-4"
            style={{ color: "var(--text-primary)" }}
          >
            *MEANWHILE FREAKING DELICIOUS
          </p>
        </BlurReveal>
      </div>
    </section>
  );
}