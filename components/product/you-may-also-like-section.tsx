"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import WordStagger from "@/lib/animations/word-stagger";
import TransitionLink from "@/components/TransitionLink";
import type { ProductData } from "@/types/product";

gsap.registerPlugin(ScrollTrigger);

// ── Per-product accent colours (matches CollectionsClient palette) ────────────
const PALETTE: Record<string, { primary: string; rgb: string; glow: string }> = {
  "imperial-smoke": { primary: "#D4AF37", rgb: "212,175,55", glow: "rgba(212,175,55,0.22)" },
  "it-boy": { primary: "#C8A96E", rgb: "200,169,110", glow: "rgba(200,169,110,0.22)" },
  "rebel-girl": { primary: "#D4697E", rgb: "212,105,126", glow: "rgba(212,105,126,0.25)" },
  "blind-date": { primary: "#A89FC8", rgb: "168,159,200", glow: "rgba(168,159,200,0.25)" },
};
const DEFAULT_PAL = PALETTE["imperial-smoke"];
const P = (slug: string) => PALETTE[slug] ?? DEFAULT_PAL;

// ── Individual card ────────────────────────────────────────────────────────────
function AlsoLikeCard({
  name,
  image,
  slug,
  index,
}: {
  name: string;
  image: string;
  slug: string;
  index: number;
}) {
  const p = P(slug);
  const cardRef = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const [hov, setHov] = useState(false);

  // Scroll-reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 52, scale: 0.94 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.9, ease: "expo.out",
          delay: index * 0.1,
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    });
    return () => ctx.revert();
  }, [index]);

  const onEnter = () => {
    setHov(true);
    gsap.to(bottleRef.current, { y: -10, scale: 1.07, duration: 0.55, ease: "power3.out" });
    gsap.to(glowRef.current, { opacity: 1, scale: 1.3, duration: 0.45 });
    gsap.fromTo(
      shineRef.current,
      { x: "-115%", opacity: 0 },
      { x: "115%", opacity: 0, keyframes: { opacity: [0, 0.28, 0.28, 0] }, duration: 0.6, ease: "power2.inOut" }
    );
  };
  const onLeave = () => {
    setHov(false);
    gsap.to(bottleRef.current, { y: 0, scale: 1, duration: 0.5, ease: "power2.out" });
    gsap.to(glowRef.current, { opacity: 0, scale: 1, duration: 0.4 });
  };

  // Friendly display name (all caps)
  const displayName = name.toUpperCase();

  return (
    <div ref={cardRef} className="shrink-0 w-[230px] lg:w-[270px]" style={{ opacity: 0 }}>
      <TransitionLink
        href={`/products/${slug}`}
        label={displayName}
        className="block cursor-hover"
      >
        <div
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          className="relative flex flex-col overflow-hidden"
          style={{
            background: "linear-gradient(160deg,#141419 0%,#0f0f14 100%)",
            border: `1px solid ${hov ? p.primary + "45" : "rgba(255,255,255,0.07)"}`,
            borderRadius: 20,
            transition: "border-color 0.4s ease",
          }}
        >
          {/* Gold top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-[1px] z-10 pointer-events-none transition-opacity duration-500"
            style={{
              background: `linear-gradient(90deg,transparent,${p.primary},transparent)`,
              opacity: hov ? 0.7 : 0.15,
            }}
          />

          {/* ── IMAGE ZONE ── */}
          <div
            className="relative overflow-hidden flex items-center justify-center"
            style={{
              height: 230,
              background: `radial-gradient(ellipse 80% 70% at 50% 60%, rgba(${p.rgb},0.07) 0%, transparent 70%)`,
            }}
          >
            {/* Glow orb */}
            <div
              ref={glowRef}
              className="absolute pointer-events-none"
              style={{
                width: 170, height: 170,
                background: `radial-gradient(circle,${p.glow} 0%,transparent 65%)`,
                opacity: 0,
                willChange: "transform,opacity",
              }}
            />

            {/* Shine sweep */}
            <div
              ref={shineRef}
              className="absolute inset-0 pointer-events-none z-20"
              style={{
                background: `linear-gradient(105deg,transparent 28%,rgba(${p.rgb},0.35) 50%,transparent 72%)`,
                opacity: 0,
              }}
            />

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={bottleRef}
              src={image}
              alt={displayName}
              className="relative z-10 object-contain"
              style={{
                height: 195, width: "auto",
                filter: `drop-shadow(0 20px 40px rgba(0,0,0,0.85)) drop-shadow(0 0 24px ${p.glow})`,
                willChange: "transform",
              }}
            />

            {/* Fade to card body */}
            <div
              className="absolute bottom-0 left-0 right-0 h-14 pointer-events-none z-10"
              style={{ background: "linear-gradient(to bottom,transparent,#0f0f14)" }}
            />
          </div>

          {/* ── INFO ZONE ── */}
          <div className="px-5 pt-3.5 pb-5 flex flex-col gap-2.5">
            {/* Divider */}
            <div
              style={{
                height: 1,
                background: `linear-gradient(90deg,rgba(${p.rgb},0.25),rgba(255,255,255,0.04),transparent)`,
              }}
            />

            {/* Name + subtitle row */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3
                  className="font-black uppercase leading-none mb-0.5"
                  style={{
                    fontSize: "clamp(14px,1.5vw,17px)",
                    letterSpacing: "-0.02em",
                    color: "var(--text-primary)",
                  }}
                >
                  {displayName}
                </h3>
                <p
                  className="text-[7px] uppercase tracking-[0.25em]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Extrait de Parfum
                </p>
              </div>

              {/* Discover arrow badge */}
              <div
                className="flex items-center justify-center shrink-0 transition-all duration-350"
                style={{
                  width: 30, height: 30,
                  borderRadius: "50%",
                  border: `1px solid ${hov ? p.primary : `rgba(${p.rgb},0.25)`}`,
                  background: hov ? p.primary : "transparent",
                  transition: "background 0.35s ease, border-color 0.35s ease",
                }}
              >
                <ArrowRight
                  size={12}
                  style={{ color: hov ? "#0A0A0A" : p.primary }}
                />
              </div>
            </div>

            {/* Bottom accent bar */}
            <div
              className="transition-all duration-500"
              style={{
                height: 2,
                borderRadius: 999,
                background: `linear-gradient(90deg,${p.primary},transparent)`,
                opacity: hov ? 0.6 : 0.12,
              }}
            />
          </div>
        </div>
      </TransitionLink>
    </div>
  );
}

// ── Section ────────────────────────────────────────────────────────────────────
export default function YouMayAlsoLikeSection({ data }: { data: ProductData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const ymal = data.youMayAlsoLike || {};

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        eyebrowRef.current,
        { clipPath: "inset(0 100% 0 0)", opacity: 0 },
        {
          clipPath: "inset(0 0% 0 0)", opacity: 1,
          duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" },
        }
      );
      gsap.fromTo(
        dividerRef.current,
        { scaleX: 0 },
        {
          scaleX: 1, transformOrigin: "left",
          duration: 1.4, ease: "expo.out", delay: 0.3,
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%", toggleActions: "play none none none" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const toSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-36 overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Subtle background radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(212,175,55,0.03) 0%, transparent 70%)",
        }}
      />

      {/* Section header */}
      <div className="px-6 lg:px-12 mb-10">
        <div ref={eyebrowRef} className="flex items-center gap-3 mb-4" style={{ opacity: 0 }}>
          <span
            className="text-[9px] uppercase tracking-[0.6em] font-bold"
            style={{ color: "var(--accent-gold)" }}
          >
            {ymal.eyebrow || "Our Full Range"}
          </span>
          <div style={{ width: 36, height: 1, background: "rgba(212,175,55,0.35)" }} />
        </div>

        <WordStagger
          text={ymal.title || "You May Also Like"}
          className="text-display-section uppercase"
          style={{ color: "var(--text-primary)" }}
          triggerRef={sectionRef}
        />

        <div
          ref={dividerRef}
          className="mt-6"
          style={{
            height: 1,
            background: "linear-gradient(90deg, var(--accent-gold) 0%, rgba(212,175,55,0.15) 60%, transparent 100%)",
            transformOrigin: "left",
          }}
        />
      </div>

      {/* Cards strip */}
      <div className="flex gap-5 px-6 lg:px-12 overflow-x-auto hide-scrollbar pb-4">
        {data.collection.map((product, i) => (
          <AlsoLikeCard
            key={product.name}
            name={product.name}
            image={product.image}
            slug={toSlug(product.name)}
            index={i}
          />
        ))}
      </div>

      {/* View all link */}
      <div className="mt-10 px-6 lg:px-12">
        <TransitionLink
          href="/collections"
          label="View All"
          className="inline-flex items-center gap-2.5 px-7 py-3 rounded-pill text-[10px] font-black uppercase tracking-widest cursor-hover transition-all duration-300"
          style={{
            border: "1px solid rgba(212,175,55,0.3)",
            color: "var(--accent-gold)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(212,175,55,0.08)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          View All Signatures <ArrowRight size={11} />
        </TransitionLink>
      </div>
    </section>
  );
}
