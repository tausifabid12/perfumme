"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) =>
        gsap.to(barRef.current, {
          scaleX: self.progress,
          duration: 0.1,
          ease: "none",
        }),
    });
    return () => trigger.kill();
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[150] pointer-events-none">
      <div
        ref={barRef}
        className="h-full origin-left"
        style={{
          background: "linear-gradient(90deg, #D4AF37, #FFFFFF)",
          transform: "scaleX(0)",
        }}
      />
    </div>
  );
}
