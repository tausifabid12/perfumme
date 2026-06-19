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
        className="flex flex-col items-center justify-center py-20 px-6"
        style={{
          borderBottom: "1px solid rgba(212,175,55,0.08)",
        }}
      >
        <BlurReveal>
          <p
            className="text-[9px] uppercase tracking-[0.6em] mb-4 text-center"
            style={{ color: "var(--text-secondary)" }}
          >
            The full story
          </p>
        </BlurReveal>
        <WordStagger
          text="Scroll to explore"
          className="text-4xl lg:text-6xl font-black uppercase text-center"
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
              className="relative flex items-center justify-between px-16 lg:px-24 gap-20"
              style={{
                width: "100vw",
                height: "100%",
                flexShrink: 0,
                borderRight:
                  "1px solid rgba(212,175,55,0.06)",
              }}
            >
              <span
                className="absolute top-10 left-12 text-[9px] uppercase tracking-[0.5em]"
                style={{ color: "var(--text-secondary)" }}
              >
                {String(i + 1).padStart(2, "0")} /{" "}
                {String(data.storySlides.length).padStart(2, "0")}
              </span>
              <div className="flex-1 max-w-xl">
                <span
                  className="inline-block px-3 py-1.5 rounded-tag text-[9px] font-black uppercase tracking-[0.3em] mb-8"
                  style={{
                    background: "rgba(212,175,55,0.1)",
                    border:
                      "1px solid rgba(212,175,55,0.25)",
                    color: "var(--accent-gold)",
                  }}
                >
                  {slide.label}
                </span>
                <h2
                  className="font-black uppercase"
                  style={{
                    fontSize:
                      "clamp(56px, 9vw, 130px)",
                    letterSpacing: "-0.04em",
                    lineHeight: 0.9,
                    color: "var(--text-primary)",
                    whiteSpace: "pre-line",
                  }}
                >
                  {slide.headline}
                </h2>
              </div>
              <div
                style={{
                  width: 1,
                  height: "40%",
                  background:
                    "rgba(212,175,55,0.12)",
                  flexShrink: 0,
                }}
              />
              <div className="flex-1 max-w-sm">
                <p
                  className="text-lg lg:text-xl leading-relaxed"
                  style={{
                    color: "var(--text-secondary)",
                  }}
                >
                  {slide.sub}
                </p>
                {i ===
                  data.storySlides.length - 1 && (
                    <a
                      href="/collections"
                      className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-pill text-sm font-bold uppercase tracking-wider cursor-hover"
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
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          style={{
            width: 200,
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
        <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-2 z-20">
          <span
            className="text-[9px] uppercase tracking-[0.4em]"
            style={{ color: "var(--text-secondary)" }}
          >
            Scroll
          </span>
          <ArrowRight
            size={14}
            style={{ color: "var(--text-secondary)" }}
          />
        </div>
      </div>
    </section>
  );
}
