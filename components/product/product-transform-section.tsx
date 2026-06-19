/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import type { ProductData } from "@/types/product";

gsap.registerPlugin(ScrollTrigger);

export default function ProductTransformSection({
  data,
}: {
  data: ProductData;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<HTMLImageElement>(null);
  const frame1Ref = useRef<HTMLDivElement>(null);
  const frame2Ref = useRef<HTMLDivElement>(null);
  const frame3Ref = useRef<HTMLDivElement>(null);
  const frame4Ref = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const frames = data.productTransform.frames;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wipeRef.current,
        { scaleY: 1, transformOrigin: "50% 100%" },
        {
          scaleY: 0,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            end: "top 20%",
            scrub: 1.5,
          },
        }
      );

      gsap.fromTo(
        pinRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: 1.5,
          },
        }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: "+=400%",
          scrub: 1.5,
          pin: true,
          pinSpacing: true,
        },
      });

      tl.fromTo(
        bottleRef.current,
        { scale: 0.5, opacity: 0, y: 60 },
        { scale: 1, opacity: 1, y: 0, duration: 1, ease: "power2.out" },
        0
      )
        .fromTo(
          frame1Ref.current,
          { opacity: 0, y: 30, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
          },
          0.2
        )
        .to(
          frame1Ref.current,
          { opacity: 0, y: -40, filter: "blur(8px)", duration: 0.5 },
          1.2
        )
        .to(
          bottleRef.current,
          { scale: 1.3, rotate: 8, duration: 1.2, ease: "power2.inOut" },
          1.2
        )
        .fromTo(
          frame2Ref.current,
          { opacity: 0, x: 60, filter: "blur(8px)" },
          {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            duration: 0.8,
          },
          1.6
        )
        .to(
          frame2Ref.current,
          { opacity: 0, x: -40, duration: 0.5 },
          2.5
        )
        .to(
          bottleRef.current,
          {
            x: "-20vw",
            scale: 1.1,
            rotate: 0,
            duration: 1.2,
            ease: "power2.inOut",
          },
          2.5
        )
        .fromTo(
          frame3Ref.current,
          { opacity: 0, x: "15vw", filter: "blur(12px)" },
          {
            opacity: 1,
            x: "20vw",
            filter: "blur(0px)",
            duration: 0.9,
          },
          2.9
        )
        .to(
          frame3Ref.current,
          { opacity: 0, x: "40vw", duration: 0.5 },
          3.8
        )
        .to(
          bottleRef.current,
          {
            x: "20vw",
            scale: 0.9,
            duration: 1,
            ease: "power2.inOut",
          },
          3.8
        )
        .fromTo(
          frame4Ref.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.8 },
          4.1
        )
        .to(
          bottleRef.current,
          { scale: 0.3, opacity: 0, y: -80, duration: 1 },
          5
        )
        .to(
          frame4Ref.current,
          { opacity: 0, y: -40, duration: 0.6 },
          5
        );

      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: "+=400%",
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const frameStyle: React.CSSProperties = {
    position: "absolute",
    textAlign: "center" as const,
    opacity: 0,
    pointerEvents: "none",
  };

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#070709",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        ref={wipeRef}
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: "#070709",
          transformOrigin: "50% 100%",
        }}
      />

      <div
        ref={pinRef}
        className="relative flex items-center justify-center overflow-hidden"
        style={{ height: "100dvh" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, #141414 0%, #070709 70%)",
          }}
        />
        <img
          ref={bottleRef}
          src={data.product.image}
          alt={data.brand.name}
          className="relative z-10 w-auto h-[40vh] sm:h-[48vh] lg:h-[60vh]"
          style={{
            filter:
              "drop-shadow(0 40px 100px rgba(212,175,55,0.12))",
            willChange: "transform",
            opacity: 0,
          }}
        />

        {/* FRAME 1 — "Built To Dominate" intro */}
        <div
          ref={frame1Ref}
          className="px-4 w-full sm:w-auto"
          style={{
            ...frameStyle,
            top: "8%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
          }}
        >
          <span
            className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em]"
            style={{ color: "var(--accent-gold)" }}
          >
            {frames[0].label}
          </span>
          <p
            className="mt-2 text-2xl sm:text-4xl lg:text-6xl font-black uppercase"
            style={{
              color: "var(--text-primary)",
              letterSpacing: "-0.04em",
              lineHeight: 1,
              whiteSpace: "pre-line",
            }}
          >
            {frames[0].headline}
          </p>
        </div>

        {/* FRAME 2 — "35% Oil Concentration" bottom-right stat */}
        <div
          ref={frame2Ref}
          className="px-4 max-w-[90%] sm:max-w-none"
          style={{
            ...frameStyle,
            bottom: "14%",
            right: "6%",
            zIndex: 20,
            textAlign: "right",
          }}
        >
          <span
            className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] sm:tracking-[0.3em]"
            style={{ color: "var(--text-secondary)" }}
          >
            {frames[1].label}
          </span>
          <p
            className="text-3xl sm:text-5xl lg:text-7xl font-black"
            style={{
              color: "var(--accent-gold)",
              letterSpacing: "-0.05em",
              lineHeight: 1,
            }}
          >
            {frames[1].stat}
          </p>
          <p
            className="text-xs sm:text-sm font-bold uppercase tracking-widest mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            {frames[1].statLabel}
          </p>
        </div>

        {/*
          FRAME 3 — "Crafted with 12HR+ Performance"
          This block travels rightward via the GSAP timeline:
            x: 15vw -> 20vw (fade in, the "visible" moment)
            x: 20vw -> 40vw (fade out, travels further off-screen)
          The original right:0 anchor meant that during the visible
          phase (x:20vw) the block was already pushed past the right
          edge of the viewport on every screen size, which is why the
          text was clipped on mobile and invisible entirely on desktop.
          right:22% keeps the text on-screen during the x:20vw moment
          on any viewport width, while still letting it drift off-screen
          during the x:40vw fade-out (harmless since opacity is 0 by then).
          No GSAP timeline values are changed.
        */}
        <div
          ref={frame3Ref}
          className="max-w-[50vw] sm:max-w-none px-2 sm:px-0"
          style={{
            ...frameStyle,
            top: "50%",
            right: "22%",
            transform: "translateY(-50%)",
            zIndex: 20,
            textAlign: "left",
          }}
        >
          <div
            style={{
              borderLeft: "2px solid var(--accent-gold)",
              paddingLeft: 20,
            }}
          >
            <p
              className="text-[8px] sm:text-[9px] uppercase tracking-widest"
              style={{ color: "var(--accent-gold)" }}
            >
              {frames[2].label}
            </p>
            <p
              className="text-3xl sm:text-5xl font-black"
              style={{
                color: "var(--text-primary)",
                letterSpacing: "-0.04em",
              }}
            >
              {frames[2].stat}
            </p>
            <p
              className="text-xs sm:text-sm font-bold uppercase tracking-widest"
              style={{ color: "var(--text-secondary)" }}
            >
              {frames[2].statLabel}
            </p>
            <p
              className="text-[11px] sm:text-xs mt-2 max-w-[140px] sm:max-w-[160px]"
              style={{
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              {frames[2].sub}
            </p>
          </div>
        </div>

        {/* FRAME 4 — "Own The Moment" CTA close */}
        <div
          ref={frame4Ref}
          style={{
            ...frameStyle,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 20,
            width: "90%",
            maxWidth: 600,
          }}
        >
          <p
            className="text-[8px] sm:text-[9px] uppercase tracking-[0.35em] sm:tracking-[0.5em] mb-3 sm:mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            {frames[3].label}
          </p>
          <p
            className="text-4xl sm:text-6xl lg:text-8xl font-black uppercase"
            style={{
              color: "var(--text-primary)",
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
              whiteSpace: "pre-line",
            }}
          >
            {frames[3].headline}
          </p>
          <a
            href="/collections"
            className="inline-flex items-center gap-3 mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 rounded-pill font-bold uppercase tracking-widest text-xs sm:text-sm cursor-hover"
            style={{
              background: "var(--accent-gold)",
              color: "#0A0A0A",
            }}
          >
            {frames[3].cta} <ArrowRight size={14} />
          </a>
        </div>

        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
          style={{
            width: 120,
            height: 1,
            background: "rgba(245,245,245,0.08)",
            borderRadius: 2,
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
      </div>
    </section>
  );
}