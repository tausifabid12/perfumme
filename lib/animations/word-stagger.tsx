"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function WordStagger({
  text,
  className,
  style,
  triggerRef,
  delay = 0,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  triggerRef?: React.RefObject<HTMLElement | null>;
  delay?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const wordEls =
        containerRef.current?.querySelectorAll(".word-inner");
      if (!wordEls?.length) return;
      gsap.fromTo(
        wordEls,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.06,
          delay,
          scrollTrigger: {
            trigger: triggerRef?.current || containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });
    return () => ctx.revert();
  }, [delay, triggerRef]);

  return (
    <div ref={containerRef} className={className} style={style}>
      {words.map((word, i) => (
        <span
          key={i}
          className="word-wrap"
          style={{ marginRight: "0.3em" }}
        >
          <span className="word-inner">{word}</span>
        </span>
      ))}
    </div>
  );
}
