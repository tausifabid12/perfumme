/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { TestimonialData } from "@/types/product";

gsap.registerPlugin(ScrollTrigger);

export default function TestimonialCard({
  t,
  index,
}: {
  t: TestimonialData;
  index: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        {
          clipPath:
            "inset(50% 50% 50% 50% round 50%)",
          scale: 0.6,
          rotate:
            index % 3 === 0
              ? -14
              : index % 3 === 1
                ? 6
                : -8,
          opacity: 0,
        },
        {
          clipPath:
            "inset(0% 0% 0% 0% round 12px)",
          scale: 1,
          rotate: index % 2 === 0 ? -3 : 3,
          opacity: 1,
          duration: 1.0,
          ease: "expo.out",
          delay: index * 0.06,
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 92%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.to(cardRef.current, {
        y: index % 2 === 0 ? -35 : 35,
        ease: "none",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
      const el = wrapRef.current;
      const onEnter = () => {
        gsap.to(imgRef.current, {
          scale: 1.06,
          duration: 0.5,
          ease: "power2.out",
        });
        gsap.to(overlayRef.current, {
          opacity: 1,
          duration: 0.3,
        });
      };
      const onLeave = () => {
        gsap.to(imgRef.current, {
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
        });
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.4,
        });
      };
      el?.addEventListener("mouseenter", onEnter);
      el?.addEventListener("mouseleave", onLeave);
      return () => {
        el?.removeEventListener("mouseenter", onEnter);
        el?.removeEventListener("mouseleave", onLeave);
      };
    });
    return () => ctx.revert();
  }, [index]);

  return (
    <div ref={wrapRef} className="testimonial-wrap relative">
      <div className="testimonial-glow rounded-2xl" />
      <div
        ref={cardRef}
        className="relative w-[155px] lg:w-[190px] rounded-2xl overflow-hidden cursor-hover"
        style={{
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          opacity: 0,
          willChange: "transform",
        }}
      >
        <div className="aspect-[3/4] overflow-hidden">
          <img
            ref={imgRef}
            src={t.image}
            alt={t.name}
            className="w-full h-full object-cover"
            style={{ willChange: "transform" }}
          />
        </div>
        <div
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(212,175,55,0.12) 0%, transparent 60%)",
            opacity: 0,
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 p-2.5 flex items-center gap-2"
          style={{
            background:
              "linear-gradient(transparent, rgba(0,0,0,0.8))",
          }}
        >
          <div
            className="w-5 h-5 rounded-full overflow-hidden"
            style={{
              border: "1px solid rgba(212,175,55,0.5)",
            }}
          >
            <img
              src={t.image}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xs font-bold text-white">
            {t.name}
          </span>
        </div>
      </div>
    </div>
  );
}
