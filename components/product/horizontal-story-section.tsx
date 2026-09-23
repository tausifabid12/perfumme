"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import BlurReveal from "@/lib/animations/blur-reveal";
import WordStagger from "@/lib/animations/word-stagger";
import type { ProductData } from "@/types/product";

gsap.registerPlugin(ScrollTrigger);

// ── Mobile slide card with scroll-triggered animations ─────────────────────
function MobileSlide({
  slide,
  index,
  total,
}: {
  slide: ProductData["storySlides"][number];
  index: number;
  total: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "expo.out" },
      });

      tl.fromTo(counterRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5 }, 0)
        .fromTo(badgeRef.current,
          { opacity: 0, y: 14, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.55 }, 0.1)
        .fromTo(headRef.current,
          { opacity: 0, y: 32, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.75 }, 0.18)
        .fromTo(ruleRef.current,
          { scaleX: 0, opacity: 0, transformOrigin: "left" },
          { scaleX: 1, opacity: 1, duration: 0.5 }, 0.45)
        .fromTo(bodyRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 }, 0.52);

      if (ctaRef.current) {
        tl.fromTo(ctaRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5 }, 0.7);
      }
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative flex flex-col px-6 py-10 gap-5"
      style={{ borderBottom: "1px solid rgba(212,175,55,0.06)" }}
    >
      <span
        ref={counterRef}
        className="text-[8px] uppercase tracking-[0.4em]"
        style={{ color: "var(--text-secondary)", opacity: 0 }}
      >
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>

      <span
        ref={badgeRef}
        className="self-start px-3 py-1.5 rounded-tag text-[8px] font-black uppercase tracking-[0.25em]"
        style={{
          background: "rgba(212,175,55,0.1)",
          border: "1px solid rgba(212,175,55,0.25)",
          color: "var(--accent-gold)",
          opacity: 0,
        }}
      >
        {slide.label}
      </span>

      <h2
        ref={headRef}
        className="font-black uppercase"
        style={{
          fontSize: "clamp(28px, 9vw, 52px)",
          letterSpacing: "-0.03em",
          lineHeight: 0.92,
          color: "var(--text-primary)",
          whiteSpace: "pre-line",
          opacity: 0,
        }}
      >
        {slide.headline}
      </h2>

      <div
        ref={ruleRef}
        style={{ width: 40, height: 1, background: "rgba(212,175,55,0.4)", opacity: 0 }}
      />

      <p
        ref={bodyRef}
        className="text-sm leading-relaxed"
        style={{ color: "var(--text-secondary)", maxWidth: 320, opacity: 0 }}
      >
        {slide.sub}
      </p>

      {index === total - 1 && (
        <a
          ref={ctaRef}
          href="/collections"
          className="self-start inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-pill text-xs font-bold uppercase tracking-wider cursor-hover"
          style={{ background: "var(--accent-gold)", color: "#0A0A0A", opacity: 0 }}
        >
          Shop Now <ArrowRight size={13} />
        </a>
      )}
    </div>
  );
}

export default function HorizontalStorySection({
  data,
}: {
  data: ProductData;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile once on mount
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // Horizontal scroll — desktop only
  useEffect(() => {
    if (isMobile) return;

    const ctx = gsap.context(() => {
      const totalWidth =
        (trackRef.current?.scrollWidth || 0) - window.innerWidth;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: () => `+=${totalWidth + window.innerWidth}`,
          scrub: 1.2,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
        },
      });
      tl.to(trackRef.current, { x: -totalWidth, ease: "none" });
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: () => `+=${totalWidth + window.innerWidth}`,
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section ref={sectionRef} style={{ background: "#111111" }}>
      {/* ── Header — desktop only ── */}
      <div
        className="hidden md:flex flex-col items-center justify-center py-10 sm:py-20 px-6"
        style={{ borderBottom: "1px solid rgba(212,175,55,0.08)" }}
      >
        <BlurReveal>
          <p
            className="text-[8px] sm:text-[9px] uppercase tracking-[0.5em] sm:tracking-[0.6em] mb-3 sm:mb-4 text-center"
            style={{ color: "var(--text-secondary)" }}
          >
            The full story
          </p>
        </BlurReveal>
        <WordStagger
          text="Scroll to explore"
          className="text-3xl sm:text-4xl lg:text-6xl font-black uppercase text-center"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.04em" }}
        />
      </div>

      {/* ── MOBILE: vertical stack with scroll-triggered animations ── */}
      <div className="md:hidden flex flex-col">
        {data.storySlides.map((slide, i) => (
          <MobileSlide
            key={i}
            slide={slide}
            index={i}
            total={data.storySlides.length}
          />
        ))}
      </div>

      {/* ── DESKTOP: pinned horizontal scroll ── */}
      <div
        ref={pinRef}
        className="relative overflow-hidden hidden md:block"
        style={{ height: "100dvh" }}
      >
        <div
          ref={trackRef}
          className="flex h-full"
          style={{ width: `${data.storySlides.length * 100}vw` }}
        >
          {data.storySlides.map((slide, i) => (
            <div
              key={i}
              className="relative flex flex-row items-center justify-between px-14 lg:px-24 gap-10 lg:gap-20"
              style={{
                width: "100vw",
                height: "100%",
                flexShrink: 0,
                borderRight: "1px solid rgba(212,175,55,0.06)",
              }}
            >
              <span
                className="absolute top-10 left-10 lg:left-12 text-[9px] uppercase tracking-[0.4em] lg:tracking-[0.5em]"
                style={{ color: "var(--text-secondary)" }}
              >
                {String(i + 1).padStart(2, "0")} /{" "}
                {String(data.storySlides.length).padStart(2, "0")}
              </span>

              {/* Headline column */}
              <div className="flex-1 max-w-lg lg:max-w-xl">
                <span
                  className="inline-block px-3 py-1.5 rounded-tag text-[9px] font-black uppercase tracking-[0.3em] mb-8"
                  style={{
                    background: "rgba(212,175,55,0.1)",
                    border: "1px solid rgba(212,175,55,0.25)",
                    color: "var(--accent-gold)",
                  }}
                >
                  {slide.label}
                </span>
                <h2
                  className="font-black uppercase"
                  style={{
                    fontSize: "clamp(32px, 7vw, 130px)",
                    letterSpacing: "-0.03em",
                    lineHeight: 0.92,
                    color: "var(--text-primary)",
                    whiteSpace: "pre-line",
                  }}
                >
                  {slide.headline}
                </h2>
              </div>

              {/* Divider */}
              <div
                style={{
                  width: 1,
                  height: "40%",
                  background: "rgba(212,175,55,0.12)",
                  flexShrink: 0,
                }}
              />

              {/* Body copy + CTA */}
              <div className="flex-1 max-w-xs lg:max-w-sm">
                <p
                  className="text-base lg:text-lg xl:text-xl leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {slide.sub}
                </p>
                {i === data.storySlides.length - 1 && (
                  <a
                    href="/collections"
                    className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-pill text-sm font-bold uppercase tracking-wider cursor-hover"
                    style={{ background: "var(--accent-gold)", color: "#0A0A0A" }}
                  >
                    Shop Now <ArrowRight size={13} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-[170px] lg:w-[200px]"
          style={{ height: 1, background: "rgba(245,245,245,0.08)" }}
        >
          <div
            ref={progressRef}
            className="h-full origin-left"
            style={{ background: "var(--accent-gold)", transform: "scaleX(0)" }}
          />
        </div>

        {/* Scroll hint */}
        <div className="absolute right-7 lg:right-10 top-1/2 -translate-y-1/2 flex items-center gap-2 z-20">
          <span
            className="text-[9px] uppercase tracking-[0.3em] lg:tracking-[0.4em]"
            style={{ color: "var(--text-secondary)" }}
          >
            Scroll
          </span>
          <ArrowRight size={13} style={{ color: "var(--text-secondary)" }} />
        </div>
      </div>
    </section>
  );
}
