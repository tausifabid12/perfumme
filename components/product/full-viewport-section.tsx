"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import type { ProductData } from "@/types/product";

gsap.registerPlugin(ScrollTrigger);

export default function FullViewportSection({
  data,
}: {
  data: ProductData;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const glintRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const fv = data.fullViewport;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imgRef.current,
        { scale: 1.18, yPercent: -4 },
        {
          scale: 1,
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0.5 },
        {
          opacity: 0.75,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom top",
            scrub: true,
          },
        }
      );
      gsap.fromTo(
        eyebrowRef.current,
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            toggleActions: "play none none none",
          },
        }
      );
      const words =
        headlineRef.current?.querySelectorAll(".vp-word") || [];
      gsap.fromTo(
        words,
        {
          yPercent: 100,
          skewY: 8,
          opacity: 0,
          filter: "blur(4px)",
        },
        {
          yPercent: 0,
          skewY: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "expo.out",
          stagger: { each: 0.12, from: "start" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 62%",
            toggleActions: "play none none none",
          },
          delay: 0.15,
        }
      );
      gsap.fromTo(
        line1Ref.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            toggleActions: "play none none none",
          },
          delay: 0.5,
        }
      );
      gsap.fromTo(
        line2Ref.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            toggleActions: "play none none none",
          },
          delay: 0.7,
        }
      );
      gsap.fromTo(
        subtextRef.current,
        { opacity: 0, x: -24 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 58%",
            toggleActions: "play none none none",
          },
          delay: 0.6,
        }
      );
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.9,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 55%",
            toggleActions: "play none none none",
          },
          delay: 0.8,
        }
      );
      gsap.fromTo(
        glintRef.current,
        { x: "-30%", opacity: 0, skewX: -20 },
        {
          x: "130%",
          opacity: 0,
          keyframes: {
            opacity: [0, 0.18, 0.18, 0],
            x: ["-30%", "0%", "80%", "130%"],
          },
          duration: 2.2,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 62%",
            toggleActions: "play none none none",
          },
          delay: 1,
        }
      );
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 65%",
        once: true,
        onEnter: () => {
          gsap.to(words, {
            textShadow:
              "0 0 40px rgba(212,175,55,0.25)",
            duration: 1.8,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: 1.5,
          });
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ height: "90vh", minHeight: 500 }}
    >
      <div
        ref={imgRef}
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${fv.bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          willChange: "transform",
        }}
      />
      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(10,10,10,0.92) 30%, rgba(10,10,10,0.45) 70%, rgba(10,10,10,0.1) 100%)",
        }}
      />
      <div
        ref={glintRef}
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(105deg, transparent 30%, rgba(212,175,55,0.15) 50%, transparent 70%)",
          opacity: 0,
        }}
      />
      <div className="absolute inset-0 flex items-center px-8 lg:px-20 z-20">
        <div>
          <div style={{ overflow: "hidden", marginBottom: 24 }}>
            <p
              ref={eyebrowRef}
              className="text-[10px] uppercase tracking-[0.6em] font-bold"
              style={{ color: "var(--accent-gold)" }}
            >
              {fv.eyebrow}
            </p>
          </div>
          <div
            ref={line1Ref}
            className="mb-6"
            style={{
              width: 60,
              height: 1,
              background:
                "linear-gradient(90deg, var(--accent-gold), transparent)",
              transformOrigin: "left",
            }}
          />
          <div ref={headlineRef} className="overflow-hidden">
            {fv.headline.map((word, i) => (
              <div key={i} style={{ overflow: "hidden" }}>
                <span
                  className="vp-word block font-black uppercase"
                  style={{
                    fontSize:
                      "clamp(48px, 9vw, 130px)",
                    letterSpacing: "-0.04em",
                    lineHeight: 0.92,
                    color:
                      i === 0
                        ? "var(--text-primary)"
                        : "var(--accent-gold)",
                  }}
                >
                  {word}
                </span>
              </div>
            ))}
          </div>
          <div
            ref={line2Ref}
            className="mt-6"
            style={{
              width: 120,
              height: 1,
              background:
                "linear-gradient(90deg, var(--accent-gold) 0%, rgba(212,175,55,0.2) 100%)",
              transformOrigin: "left",
            }}
          />
          <p
            ref={subtextRef}
            className="mt-8 text-base lg:text-lg max-w-sm opacity-0"
            style={{
              color: "rgba(245,245,245,0.55)",
              lineHeight: 1.75,
            }}
          >
            {fv.subtext}
          </p>
          <div
            ref={ctaRef}
            style={{ opacity: 0 }}
            className="mt-8"
          >
            <a
              href="/collections"
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-pill text-sm font-bold uppercase tracking-widest cursor-hover transition-all duration-300"
              style={{
                background: "var(--accent-gold)",
                color: "#0A0A0A",
                boxShadow: "0 0 0 0 rgba(212,175,55,0.4)",
              }}
              onMouseEnter={(e) =>
                gsap.to(e.currentTarget, {
                  boxShadow:
                    "0 0 30px 8px rgba(212,175,55,0.2)",
                  duration: 0.3,
                })
              }
              onMouseLeave={(e) =>
                gsap.to(e.currentTarget, {
                  boxShadow:
                    "0 0 0 0 rgba(212,175,55,0)",
                  duration: 0.4,
                })
              }
            >
              {fv.cta} <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
