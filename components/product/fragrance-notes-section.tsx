/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProductData } from "@/types/product";

gsap.registerPlugin(ScrollTrigger);

export default function FragranceNotesSection({
  data,
}: {
  data: ProductData;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<HTMLImageElement>(null);
  const note1Ref = useRef<HTMLDivElement>(null);
  const note2Ref = useRef<HTMLDivElement>(null);
  const note3Ref = useRef<HTMLDivElement>(null);
  const notes = data.fragranceNotes.notes;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: "+=250%",
          scrub: 1,
          pin: true,
          pinSpacing: true,
        },
      });
      tl.fromTo(
        bottleRef.current,
        { scale: 0.6, opacity: 0, filter: "blur(20px)" },
        {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1,
        },
        0
      )
        .fromTo(
          note1Ref.current,
          { opacity: 0, x: -120, filter: "blur(10px)" },
          {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            duration: 0.8,
          },
          1.1
        )
        .to(
          note1Ref.current,
          { opacity: 0, x: -60, duration: 0.5 },
          2.2
        )
        .fromTo(
          note2Ref.current,
          { opacity: 0, x: 120, filter: "blur(10px)" },
          {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            duration: 0.8,
          },
          2.4
        )
        .to(
          note2Ref.current,
          { opacity: 0, x: 60, duration: 0.5 },
          3.5
        )
        .fromTo(
          note3Ref.current,
          { opacity: 0, y: 80, filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
          },
          3.7
        );
      gsap.to(bottleRef.current, {
        y: -20,
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const noteBaseStyle: React.CSSProperties = {
    position: "absolute",
    opacity: 0,
    pointerEvents: "none",
    maxWidth: 220,
  };

  return (
    <section ref={sectionRef} style={{ background: "#0A0A0A" }}>
      <div
        ref={pinRef}
        className="relative flex items-center justify-center overflow-hidden"
        style={{ height: "100dvh" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 60%, #161616 0%, #0A0A0A 70%)",
          }}
        />
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20">
          <p
            className="text-[9px] uppercase tracking-[0.5em] text-center"
            style={{ color: "var(--text-secondary)" }}
          >
            {data.fragranceNotes.title}
          </p>
        </div>
        <img
          ref={bottleRef}
          src={data.product.image}
          alt={data.brand.name}
          className="relative z-10"
          style={{
            height: "65vh",
            filter:
              "drop-shadow(0 40px 100px rgba(0,0,0,0.9)) drop-shadow(0 0 60px rgba(212,175,55,0.06))",
            willChange: "transform",
            opacity: 0,
          }}
        />

        <div
          ref={note1Ref}
          style={{
            ...noteBaseStyle,
            left: "6%",
            top: "30%",
            zIndex: 20,
          }}
        >
          <div
            style={{
              borderLeft: "2px solid var(--accent-gold)",
              paddingLeft: 16,
            }}
          >
            <p
              className="text-[8px] uppercase tracking-[0.4em] mb-2"
              style={{ color: "var(--accent-gold)" }}
            >
              {notes[0].type}
            </p>
            <p
              className="text-2xl font-black uppercase mb-2"
              style={{
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                whiteSpace: "pre-line",
              }}
            >
              {notes[0].title}
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {notes[0].description}
            </p>
          </div>
        </div>

        <div
          ref={note2Ref}
          style={{
            ...noteBaseStyle,
            right: "6%",
            top: "25%",
            zIndex: 20,
            textAlign: "right",
          }}
        >
          <div
            style={{
              borderRight: "2px solid var(--accent-silver)",
              paddingRight: 16,
            }}
          >
            <p
              className="text-[8px] uppercase tracking-[0.4em] mb-2"
              style={{ color: "var(--accent-silver)" }}
            >
              {notes[1].type}
            </p>
            <p
              className="text-2xl font-black uppercase mb-2"
              style={{
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                whiteSpace: "pre-line",
              }}
            >
              {notes[1].title}
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {notes[1].description}
            </p>
          </div>
        </div>

        <div
          ref={note3Ref}
          style={{
            ...noteBaseStyle,
            bottom: "12%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
            textAlign: "center",
            maxWidth: 280,
          }}
        >
          <div
            style={{
              borderTop: "1px solid rgba(245,245,245,0.15)",
              paddingTop: 16,
            }}
          >
            <p
              className="text-[8px] uppercase tracking-[0.4em] mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              {notes[2].type}
            </p>
            <p
              className="text-2xl font-black uppercase mb-2"
              style={{
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                whiteSpace: "pre-line",
              }}
            >
              {notes[2].title}
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {notes[2].description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
