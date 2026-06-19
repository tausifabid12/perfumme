"use client";

import { useEffect } from "react";
import gsap from "gsap";

export default function useScrollVelocitySkew() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let lastScroll = window.scrollY;
    let raf: number;
    const targets = document.querySelectorAll(".scroll-skew");

    const tick = () => {
      const current = window.scrollY;
      const delta = current - lastScroll;
      const skew = gsap.utils.clamp(-8, 8, delta * 0.3);
      targets.forEach((el) => {
        gsap.to(el, { skewY: skew, duration: 0.4, ease: "power2.out" });
      });
      lastScroll = current;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
}
