"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import type { ProductData } from "@/types/product";

export default function MarqueeSection({ data }: { data: ProductData }) {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const tween1Ref = useRef<gsap.core.Tween | null>(null);
  const tween2Ref = useRef<gsap.core.Tween | null>(null);

  const row1Content = data.marqueeItems.map((name, i) => (
    <span
      key={`r1-${i}`}
      className="flex items-center gap-6 lg:gap-10 shrink-0"
    >
      <span
        className="text-display-marquee uppercase whitespace-nowrap"
        style={{ color: "var(--text-primary)" }}
      >
        {name}
      </span>
      <span style={{ color: "var(--accent-gold)", fontSize: 20 }}>
        ◆
      </span>
    </span>
  ));

  const row2Content = data.marqueeItems.map((name, i) => (
    <span
      key={`r2-${i}`}
      className="flex items-center gap-6 lg:gap-10 shrink-0"
    >
      <span
        className="text-display-marquee uppercase whitespace-nowrap"
        style={{ color: "rgba(245,245,245,0.12)" }}
      >
        {name}
      </span>
      <span
        style={{ color: "rgba(212,175,55,0.18)", fontSize: 20 }}
      >
        ◆
      </span>
    </span>
  ));

  useEffect(() => {
    tween1Ref.current = gsap.to(row1Ref.current, {
      xPercent: -50,
      duration: 20,
      repeat: -1,
      ease: "linear",
    });
    gsap.set(row2Ref.current, { xPercent: -50 });
    tween2Ref.current = gsap.to(row2Ref.current, {
      xPercent: 0,
      duration: 25,
      repeat: -1,
      ease: "linear",
    });

    let lastY = window.scrollY;
    let resetTimeout: ReturnType<typeof setTimeout>;

    const onScroll = () => {
      const delta = Math.abs(window.scrollY - lastY);
      const speed = gsap.utils.clamp(0.6, 7, 1 + delta * 0.1);
      tween1Ref.current?.timeScale(speed);
      tween2Ref.current?.timeScale(speed);
      lastY = window.scrollY;
      clearTimeout(resetTimeout);
      resetTimeout = setTimeout(() => {
        gsap.to(
          { ts: speed },
          {
            ts: 1,
            duration: 0.8,
            ease: "power2.out",
            onUpdate: function () {
              const ts = gsap.getProperty(this.targets()[0], "ts");
              const val = typeof ts === "number" ? ts : 1;
              tween1Ref.current?.timeScale(val);
              tween2Ref.current?.timeScale(val);
            },
          }
        );
      }, 150);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(resetTimeout);
      tween1Ref.current?.kill();
      tween2Ref.current?.kill();
    };
  }, []);

  return (
    <section
      className="relative py-20 lg:py-28 overflow-hidden"
      style={{ background: "#0D0D0D" }}
    >
      <div className="overflow-hidden whitespace-nowrap mb-4 scroll-skew">
        <div
          ref={row1Ref}
          className="inline-flex items-center gap-6 lg:gap-10"
          style={{ willChange: "transform" }}
        >
          {row1Content}
          {row1Content}
        </div>
      </div>
      <div
        className="w-full h-px my-4"
        style={{ background: "rgba(212,175,55,0.08)" }}
      />
      <div className="overflow-hidden whitespace-nowrap scroll-skew">
        <div
          ref={row2Ref}
          className="inline-flex items-center gap-6 lg:gap-10"
          style={{ willChange: "transform" }}
        >
          {row2Content}
          {row2Content}
        </div>
      </div>
    </section>
  );
}
