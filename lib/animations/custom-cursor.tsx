"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      gsap.to(dotRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.08,
        ease: "power2.out",
      });
      gsap.to(ringRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: "power3.out",
      });
    };

    const onDown = () =>
      gsap.to(ringRef.current, { scale: 0.6, duration: 0.2 });
    const onUp = () =>
      gsap.to(ringRef.current, { scale: 1, duration: 0.3 });

    const onEnter = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const label = target.dataset.cursor;
      gsap.to(ringRef.current, {
        scale: label ? 2 : 1.8,
        duration: 0.3,
        ease: "power2.out",
      });
      if (label && labelRef.current) {
        labelRef.current.textContent = label;
        gsap.to(labelRef.current, { opacity: 1, duration: 0.2 });
      }
    };

    const onLeave = () => {
      gsap.to(ringRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(labelRef.current, { opacity: 0, duration: 0.2 });
    };

    const hoverables = document.querySelectorAll(
      "a, button, .cursor-hover"
    );
    hoverables.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      hoverables.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="hidden lg:block fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[300] -translate-x-1/2 -translate-y-1/2"
        style={{ background: "#D4AF37" }}
      />
      <div
        ref={ringRef}
        className="hidden lg:block fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[300] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        style={{
          border: "1.5px solid rgba(212,175,55,0.6)",
          mixBlendMode: "difference",
        }}
      >
        <span
          ref={labelRef}
          className="text-[8px] font-bold uppercase tracking-widest"
          style={{ color: "white", opacity: 0 }}
        />
      </div>
    </>
  );
}
