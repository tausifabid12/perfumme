"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import BlurReveal from "@/lib/animations/blur-reveal";
import WordStagger from "@/lib/animations/word-stagger";
import type { ProductData } from "@/types/product";

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalStorySection({
  data,
}: {
  data: ProductData;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, []);

  return (
    <section ref={sectionRef} style={{ background: "#111111" }}>
      <div
        className="flex flex-col items-center justify-center py-14 sm:py-20 px-6"
        style={{
          borderBottom: "1px solid rgba(212,175,55,0.08)",
        }}
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
          style={{
            color: "var(--text-primary)",
            letterSpacing: "-0.04em",
          }}
        />
      </div>
      <div
        ref={pinRef}
        className="relative overflow-hidden"
        style={{ height: "100dvh" }}
      >
        <div
          ref={trackRef}
          className="flex h-full"
          style={{
            width: `${data.storySlides.length * 100}vw`,
          }}
        >
          {data.storySlides.map((slide, i) => (
            <div
              key={i}
              className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between px-6 sm:px-10 lg:px-24 py-20 sm:py-24 gap-6 sm:gap-8 lg:gap-20"
              style={{
                width: "100vw",
                height: "100%",
                flexShrink: 0,
                borderRight: "1px solid rgba(212,175,55,0.06)",
              }}
            >
              <span
                className="absolute top-6 left-6 sm:top-8 sm:left-8 lg:top-10 lg:left-12 text-[8px] sm:text-[9px] uppercase tracking-[0.4em] lg:tracking-[0.5em]"
                style={{ color: "var(--text-secondary)" }}
              >
                {String(i + 1).padStart(2, "0")} /{" "}
                {String(data.storySlides.length).padStart(2, "0")}
              </span>

              <div className="lg:flex-1 lg:max-w-xl mt-10 lg:mt-0">
                <span
                  className="inline-block px-3 py-1.5 rounded-tag text-[8px] sm:text-[9px] font-black uppercase tracking-[0.25em] lg:tracking-[0.3em] mb-4 sm:mb-6 lg:mb-8"
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
                    fontSize: "clamp(36px, 11vw, 130px)",
                    letterSpacing: "-0.03em",
                    lineHeight: 0.92,
                    color: "var(--text-primary)",
                    whiteSpace: "pre-line",
                  }}
                >
                  {slide.headline}
                </h2>
              </div>

              <div
                className="hidden lg:block"
                style={{
                  width: 1,
                  height: "40%",
                  background: "rgba(212,175,55,0.12)",
                  flexShrink: 0,
                }}
              />

              <div className="lg:flex-1 lg:max-w-sm">
                <p
                  className="text-sm sm:text-base lg:text-lg xl:text-xl leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {slide.sub}
                </p>
                {i === data.storySlides.length - 1 && (
                  <a
                    href="/collections"
                    className="inline-flex items-center gap-2 mt-5 sm:mt-6 lg:mt-8 px-5 sm:px-6 py-2.5 sm:py-3 rounded-pill text-xs sm:text-sm font-bold uppercase tracking-wider cursor-hover"
                    style={{
                      background: "var(--accent-gold)",
                      color: "#0A0A0A",
                    }}
                  >
                    Shop Now <ArrowRight size={13} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        <div
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 w-[140px] sm:w-[170px] lg:w-[200px]"
          style={{
            height: 1,
            background: "rgba(245,245,245,0.08)",
          }}
        >
          <div
            ref={progressRef}
            className="h-full origin-left"
            style={{
              background: "var(--accent-gold)",
              transform: "scaleX(0)",
            }}
          />
        </div>
        <div className="absolute right-5 sm:right-7 lg:right-10 top-1/2 -translate-y-1/2 flex items-center gap-2 z-20">
          <span
            className="text-[8px] sm:text-[9px] uppercase tracking-[0.3em] lg:tracking-[0.4em]"
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