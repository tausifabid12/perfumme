"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function DripTransition() {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        pathRef.current,
        { scaleY: 0.5, transformOrigin: "50% 0%" },
        {
          scaleY: 1.3,
          ease: "none",
          scrollTrigger: {
            trigger: pathRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: 100, marginTop: -1 }}
    >
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="absolute bottom-0 w-full h-full"
      >
        <path
          ref={pathRef}
          d="M0,0 L1440,0 L1440,50 Q1380,90 1320,55 Q1260,30 1200,65 Q1140,100 1080,55 Q1020,20 960,60 Q900,90 840,50 Q780,20 720,60 Q660,90 600,45 Q540,15 480,55 Q420,80 360,50 Q300,30 240,60 Q180,90 120,55 Q60,25 0,60 Z"
          fill="#0D0D0D"
        />
      </svg>
    </div>
  );
}
