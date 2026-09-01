"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TransitionLink from "@/components/TransitionLink";

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
    {
        id: "imperial-smoke",
        no: "001",
        name: ["IMPERIAL", "SMOKE"],
        tag: "For Him",
        sub: "Crafted in shadow.\nRemembered forever.",
        href: "/products/imperial-smoke",
        img: "/images/imps-1.png",
        accent: "#D4AF37",
        rgb: "212,175,55",
    },
    {
        id: "rebel-girl",
        no: "002",
        name: ["REBEL", "GIRL"],
        tag: "For Her",
        sub: "Wild confidence.\nWrapped in elegance.",
        href: "/products/rebel-girl",
        img: "/images/rabel-girl-bottle.png",
        accent: "#D4697E",
        rgb: "212,105,126",
    },
    {
        id: "it-boy",
        no: "003",
        name: ["IT", "BOY"],
        tag: "For Him",
        sub: "The Final\nStatement.",
        href: "/products/it-boy",
        img: "/images/it-boy-bottle.png",
        accent: "#C8A96E",
        rgb: "200,169,110",
    },
    {
        id: "blind-date",
        no: "004",
        name: ["BLIND", "DATE"],
        tag: "Unisex",
        sub: "Irresistible\nFirst impression.",
        href: "/products/blind-date",
        img: "/images/blind-date-bottle.png",
        accent: "#A89FC8",
        rgb: "168,159,200",
    },
];

export default function MobileHeroExperience({ onReady }: { onReady?: () => void }) {
    const sectionRef = useRef<HTMLElement>(null);
    const pinRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    // Per-card element refs
    const cardRefs = useRef<HTMLDivElement[]>([]);
    const bottleRefs = useRef<HTMLImageElement[]>([]);
    const glowRefs = useRef<HTMLDivElement[]>([]);
    const nameLineRefs = useRef<HTMLDivElement[][]>([[], [], [], []]);
    const ruleRefs = useRef<HTMLDivElement[]>([]);
    const subRefs = useRef<HTMLParagraphElement[]>([]);
    const ctaRefs = useRef<HTMLDivElement[]>([]);
    const tagRefs = useRef<HTMLDivElement[]>([]);
    const noRefs = useRef<HTMLDivElement[]>([]);

    // Keep the card-0 timeout ID so we can cancel on unmount
    const card0TimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => { onReady?.(); }, [onReady]);

    useEffect(() => {
        // ── Build one reveal timeline per card ───────────────────────────
        // Declared outside gsap.context so card0TimerRef can reference them
        const revealTimelines: gsap.core.Timeline[] = [];
        // Per-card looping zoom tween refs so we can kill them on reset
        const zoomTweens: (gsap.core.Tween | null)[] = CARDS.map(() => null);

        const buildReveal = (i: number): gsap.core.Timeline => {
            const bottle = bottleRefs.current[i];
            const glow = glowRefs.current[i];
            const nameLines = nameLineRefs.current[i];
            const rule = ruleRefs.current[i];
            const sub = subRefs.current[i];
            const cta = ctaRefs.current[i];
            const tag = tagRefs.current[i];
            const no = noRefs.current[i];

            const tl = gsap.timeline({
                paused: true,
                onComplete: () => {
                    // After reveal finishes, start the slow breathe-zoom loop
                    if (!bottle) return;
                    zoomTweens[i]?.kill();
                    zoomTweens[i] = gsap.to(bottle, {
                        scale: 1.12,
                        duration: 6.5,
                        ease: "sine.inOut",
                        yoyo: true,
                        repeat: -1,
                    });
                },
            });

            if (tag) tl.fromTo(tag,
                { opacity: 0, y: -16 },
                { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, 0);

            if (no) tl.fromTo(no,
                { opacity: 0, y: -16 },
                { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, 0.07);

            if (bottle) tl.fromTo(bottle,
                { y: 52, scale: 0.82, opacity: 0, filter: "blur(16px)" },
                { y: 0, scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.9, ease: "expo.out" }, 0.05);

            if (glow) tl.fromTo(glow,
                { opacity: 0, scale: 0.5 },
                { opacity: 1, scale: 1, duration: 1.0, ease: "expo.out" }, 0.05);

            nameLines.forEach((line, li) => {
                if (!line) return;
                tl.fromTo(line,
                    { yPercent: 112, opacity: 0 },
                    { yPercent: 0, opacity: 1, duration: 0.78, ease: "expo.out" },
                    0.18 + li * 0.1);
            });

            if (rule) tl.fromTo(rule,
                { scaleX: 0, opacity: 0 },
                { scaleX: 1, opacity: 1, duration: 0.55, ease: "expo.out" }, 0.42);

            if (sub) tl.fromTo(sub,
                { opacity: 0, y: 18, filter: "blur(8px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.65, ease: "power3.out" }, 0.50);

            if (cta) tl.fromTo(cta,
                { opacity: 0, y: 18 },
                { opacity: 1, y: 0, duration: 0.60, ease: "expo.out" }, 0.62);

            return tl;
        };

        const resetCard = (i: number) => {
            const bottle = bottleRefs.current[i];
            const glow = glowRefs.current[i];
            const nameLines = nameLineRefs.current[i];
            const rule = ruleRefs.current[i];
            const sub = subRefs.current[i];
            const cta = ctaRefs.current[i];
            const tag = tagRefs.current[i];
            const no = noRefs.current[i];

            // Kill zoom loop first
            zoomTweens[i]?.kill();
            zoomTweens[i] = null;

            if (tag) gsap.set(tag, { opacity: 0, y: -16 });
            if (no) gsap.set(no, { opacity: 0, y: -16 });
            if (bottle) gsap.set(bottle, { y: 52, scale: 0.82, opacity: 0, filter: "blur(16px)" });
            if (glow) gsap.set(glow, { opacity: 0, scale: 0.5 });
            nameLines.forEach((l) => l && gsap.set(l, { yPercent: 112, opacity: 0 }));
            if (rule) gsap.set(rule, { scaleX: 0, opacity: 0 });
            if (sub) gsap.set(sub, { opacity: 0, y: 18, filter: "blur(8px)" });
            if (cta) gsap.set(cta, { opacity: 0, y: 18 });
        };

        // Reset all cards to hidden state first
        CARDS.forEach((_, i) => resetCard(i));

        const ctx = gsap.context(() => {
            const totalWidth = (trackRef.current?.scrollWidth ?? 0) - window.innerWidth;

            // ── Master horizontal pin + scroll ──
            const mainTl = gsap.timeline({
                scrollTrigger: {
                    trigger: pinRef.current,
                    start: "top top",
                    end: () => `+=${totalWidth + window.innerWidth}`,
                    scrub: 1.2,
                    pin: true,
                    pinSpacing: true,
                    invalidateOnRefresh: true,
                },
            });
            mainTl.to(trackRef.current, { x: -totalWidth, ease: "none" });

            // ── Progress bar ──
            gsap.to(progressRef.current, {
                scaleX: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: pinRef.current,
                    start: "top top",
                    end: () => `+=${totalWidth + window.innerWidth}`,
                    scrub: true,
                },
            });

            // ── Build all reveal timelines ──
            CARDS.forEach((_, i) => {
                revealTimelines[i] = buildReveal(i);
            });

            // ── Cards 1–3: fire when card enters viewport via containerAnimation ──
            CARDS.forEach((_, i) => {
                if (i === 0) return; // card 0 handled separately below
                const card = cardRefs.current[i];
                if (!card) return;

                ScrollTrigger.create({
                    trigger: card,
                    containerAnimation: mainTl,
                    start: "left 92%",
                    onEnter: () => revealTimelines[i]?.play(),
                    onLeaveBack: () => {
                        revealTimelines[i]?.pause(0);
                        resetCard(i);
                    },
                });
            });

            // ── Card 0: play after ScrollTrigger has initialised the pin ──
            card0TimerRef.current = setTimeout(() => {
                revealTimelines[0]?.play();
            }, 350);
        }, sectionRef);

        return () => {
            if (card0TimerRef.current !== null) {
                clearTimeout(card0TimerRef.current);
                card0TimerRef.current = null;
            }
            // Kill any running zoom loops
            zoomTweens.forEach((t) => t?.kill());
            ctx.revert();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section ref={sectionRef}>
            <div
                ref={pinRef}
                className="relative overflow-hidden"
                style={{ height: "100dvh" }}
            >
                {/* Scrolling track */}
                <div
                    ref={trackRef}
                    className="flex h-full"
                    style={{ width: `${CARDS.length * 100}vw` }}
                >
                    {CARDS.map((card, i) => (
                        <div
                            key={card.id}
                            ref={(el) => { if (el) cardRefs.current[i] = el; }}
                            className="relative flex flex-col overflow-hidden"
                            style={{
                                width: "100vw",
                                height: "100%",
                                flexShrink: 0,
                                background: `
                                    radial-gradient(ellipse 70% 60% at 50% 30%, rgba(${card.rgb},0.13) 0%, transparent 65%),
                                    linear-gradient(180deg, #090909 0%, #040404 100%)
                                `,
                            }}
                        >
                            {/* Top accent line */}
                            <div style={{
                                position: "absolute", top: 0, left: 0, right: 0, height: 1,
                                background: `linear-gradient(90deg, transparent, rgba(${card.rgb},0.7), transparent)`,
                                zIndex: 2,
                            }} />

                            {/* Card number — padded well below the navbar */}
                            <div
                                ref={(el) => { if (el) noRefs.current[i] = el; }}
                                style={{
                                    position: "absolute", top: 108, left: 24, zIndex: 10,
                                    fontSize: 10, fontWeight: 700, letterSpacing: "0.45em",
                                    textTransform: "uppercase",
                                    color: `rgba(${card.rgb},0.5)`,
                                    opacity: 0,
                                }}
                            >
                                {String(i + 1).padStart(2, "0")} / {String(CARDS.length).padStart(2, "0")}
                            </div>

                            {/* Tag pill — padded well below the navbar */}
                            <div
                                ref={(el) => { if (el) tagRefs.current[i] = el; }}
                                style={{
                                    position: "absolute", top: 104, right: 24, zIndex: 10,
                                    fontSize: 9, fontWeight: 700, letterSpacing: "0.22em",
                                    textTransform: "uppercase",
                                    padding: "5px 14px", borderRadius: 999,
                                    border: `1px solid rgba(${card.rgb},0.4)`,
                                    color: `rgba(${card.rgb},0.95)`,
                                    background: `rgba(${card.rgb},0.07)`,
                                    backdropFilter: "blur(8px)",
                                    opacity: 0,
                                }}
                            >
                                {card.tag}
                            </div>

                            {/* Bottle — center */}
                            <div
                                className="flex-1 flex items-center justify-center relative"
                                style={{ minHeight: 0 }}
                            >
                                <div
                                    ref={(el) => { if (el) glowRefs.current[i] = el; }}
                                    className="absolute pointer-events-none"
                                    style={{
                                        width: "72vw", height: "72vw", borderRadius: "50%",
                                        background: `radial-gradient(circle, rgba(${card.rgb},0.18) 0%, transparent 68%)`,
                                        opacity: 0,
                                    }}
                                />
                                <div className="absolute pointer-events-none" style={{
                                    width: "55vw", height: "55vw", borderRadius: "50%",
                                    border: `1px solid rgba(${card.rgb},0.1)`,
                                }} />
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    ref={(el) => { if (el) bottleRefs.current[i] = el; }}
                                    src={card.img}
                                    alt={card.name.join(" ")}
                                    style={{
                                        height: "44dvh", width: "auto",
                                        objectFit: "contain",
                                        willChange: "transform, opacity, filter",
                                        filter: `drop-shadow(0 28px 56px rgba(0,0,0,0.92)) drop-shadow(0 0 32px rgba(${card.rgb},0.25))`,
                                        opacity: 0,
                                        position: "relative", zIndex: 1,
                                    }}
                                />
                            </div>

                            {/* Text block — bottom */}
                            <div
                                className="flex flex-col px-6"
                                style={{ paddingBottom: "max(36px, env(safe-area-inset-bottom, 36px))" }}
                            >
                                {/* Name lines — overflow hidden wrapper = mask for slide-up */}
                                <div style={{ marginBottom: 12 }}>
                                    {card.name.map((line, li) => (
                                        <div key={li} style={{ overflow: "hidden", lineHeight: 1 }}>
                                            <div
                                                ref={(el) => { if (el) nameLineRefs.current[i][li] = el; }}
                                                style={{
                                                    fontSize: "clamp(50px, 16.5vw, 74px)",
                                                    fontWeight: 900, lineHeight: 0.9,
                                                    letterSpacing: "-0.045em", textTransform: "uppercase",
                                                    color: li === 1 ? card.accent : "#F5F5F5",
                                                    opacity: 0, paddingBottom: "0.05em",
                                                }}
                                            >
                                                {line}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Gold rule */}
                                <div
                                    ref={(el) => { if (el) ruleRefs.current[i] = el; }}
                                    style={{
                                        width: 44, height: 1, marginBottom: 12,
                                        background: `linear-gradient(90deg, ${card.accent}, transparent)`,
                                        transformOrigin: "left center",
                                        opacity: 0,
                                    }}
                                />

                                {/* Sub text */}
                                <p
                                    ref={(el) => { if (el) subRefs.current[i] = el; }}
                                    style={{
                                        fontSize: 13, lineHeight: 1.72,
                                        color: "rgba(245,245,245,0.45)",
                                        marginBottom: 22, maxWidth: "75%",
                                        whiteSpace: "pre-line", opacity: 0,
                                    }}
                                >
                                    {card.sub}
                                </p>

                                {/* CTA */}
                                <div
                                    ref={(el) => { if (el) ctaRefs.current[i] = el; }}
                                    style={{ opacity: 0 }}
                                >
                                    <TransitionLink
                                        href={card.href}
                                        label={card.name.join(" ")}
                                        style={{
                                            display: "inline-flex", alignItems: "center", gap: 9,
                                            height: 46, padding: "0 24px", borderRadius: 999,
                                            background: card.accent, color: "#0A0A0A",
                                            fontSize: 10, fontWeight: 800,
                                            letterSpacing: "0.24em", textTransform: "uppercase",
                                            textDecoration: "none",
                                            boxShadow: `0 0 24px rgba(${card.rgb},0.42), 0 6px 16px rgba(0,0,0,0.55)`,
                                        }}
                                    >
                                        Discover
                                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                                            <path d="M2 7h10M8 3l4 4-4 4"
                                                stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </TransitionLink>
                                </div>
                            </div>

                            {/* Bottom accent */}
                            <div style={{
                                position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
                                background: `linear-gradient(90deg, transparent, rgba(${card.rgb},0.18), transparent)`,
                            }} />
                        </div>
                    ))}
                </div>

                {/* Progress bar — bottom center */}
                <div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
                    style={{ width: 100, height: 1, background: "rgba(255,255,255,0.08)" }}
                >
                    <div
                        ref={progressRef}
                        className="h-full origin-left"
                        style={{ background: "var(--accent-gold)", transform: "scaleX(0)" }}
                    />
                </div>

                {/* Scroll indicator — right side, vertical layout */}
                <div
                    className="absolute z-30 pointer-events-none"
                    style={{
                        right: 18,
                        bottom: 28,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 8,
                        animation: "scroll-hint-bob 2.2s ease-in-out infinite",
                    }}
                >
                    {/* Label rotated 90° */}
                    <span style={{
                        fontSize: 8,
                        letterSpacing: "0.38em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.5)",
                        writingMode: "vertical-rl",
                        lineHeight: 1,
                    }}>
                        Scroll
                    </span>
                    {/* Short tick line */}
                    <div style={{
                        width: 1,
                        height: 22,
                        background: "linear-gradient(to bottom, rgba(255,255,255,0.45), transparent)",
                    }} />
                    {/* Down chevron */}
                    <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
                        <path d="M1 1l4 4 4-4"
                            stroke="rgba(255,255,255,0.55)" strokeWidth="1.4"
                            strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <style>{`
                    @keyframes scroll-hint-bob {
                        0%, 100% { opacity: 0.7; transform: translateY(0px);  }
                        50%       { opacity: 1;   transform: translateY(4px);  }
                    }
                `}</style>
            </div>
        </section>
    );
}
