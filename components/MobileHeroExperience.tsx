"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import TransitionLink from "@/components/TransitionLink";

// ─────────────────────────────────────────────────────────────────────────────
const CARDS = [
    {
        id: "imperial-smoke",
        no: "001",
        name: ["IMPERIAL", "SMOKE"],
        tag: "For Him",
        sub: "Crafted in shadow. Remembered forever.",
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
        sub: "Wild confidence. Wrapped in elegance.",
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
        sub: "The Final Statement.",
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
        sub: "Irresistible first impression.",
        href: "/products/blind-date",
        img: "/images/blind-date-bottle.png",
        accent: "#A89FC8",
        rgb: "168,159,200",
    },
];

// ─── Single slide ─────────────────────────────────────────────────────────────
function Slide({
    card,
    index,
    isActive,
}: {
    card: typeof CARDS[number];
    index: number;
    isActive: boolean;
}) {
    const imgRef = useRef<HTMLImageElement>(null);
    const noRef = useRef<HTMLDivElement>(null);
    const nameRef = useRef<HTMLDivElement>(null);
    const ruleRef = useRef<HTMLDivElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const prevActive = useRef(false);
    const floatRef = useRef<gsap.core.Tween | null>(null);

    useEffect(() => {
        const img = imgRef.current;
        if (!img) return;

        if (isActive && !prevActive.current) {
            floatRef.current?.kill();
            // Entrance — scale + opacity only, no y on container
            gsap.killTweensOf([img, noRef.current, nameRef.current, ruleRef.current, subRef.current, ctaRef.current]);

            gsap.fromTo(img,
                { scale: 0.9, opacity: 0, filter: "blur(14px)" },
                { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.75, ease: "expo.out" }
            );
            gsap.fromTo(
                [noRef.current, nameRef.current, ruleRef.current, subRef.current, ctaRef.current],
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", stagger: 0.07, delay: 0.18 }
            );

            // Gentle float after entrance
            setTimeout(() => {
                if (!imgRef.current) return;
                floatRef.current = gsap.to(imgRef.current, {
                    y: -9, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1,
                });
            }, 800);

        } else if (!isActive && prevActive.current) {
            floatRef.current?.kill();
            floatRef.current = null;
            gsap.killTweensOf([img, noRef.current, nameRef.current, ruleRef.current, subRef.current, ctaRef.current]);
            // Snap reset — instant, no visible animation
            gsap.set(img, { scale: 0.9, opacity: 0, filter: "blur(14px)", y: 0 });
            gsap.set([noRef.current, nameRef.current, ruleRef.current, subRef.current, ctaRef.current], { opacity: 0, y: 20 });
        }

        prevActive.current = isActive;
    }, [isActive]);

    return (
        <div
            className="relative flex flex-col overflow-hidden flex-shrink-0"
            style={{
                width: "100vw",
                height: "100dvh",
                scrollSnapAlign: "start",
                scrollSnapStop: "always",
                background: `
                    radial-gradient(ellipse 65% 55% at 50% 28%, rgba(${card.rgb},0.14) 0%, transparent 62%),
                    linear-gradient(180deg, #090909 0%, #050505 100%)
                `,
            }}
        >
            {/* Top accent line */}
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(90deg, transparent, rgba(${card.rgb},0.65), transparent)`,
            }} />

            {/* No — top left */}
            <div ref={noRef} className="absolute top-20 left-6 z-10" style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.4em",
                textTransform: "uppercase", color: `rgba(${card.rgb},0.55)`,
                opacity: 0,
            }}>
                {card.no}
            </div>

            {/* Tag — top right */}
            <div className="absolute top-[74px] right-6 z-10" style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "4px 12px", borderRadius: 999,
                border: `1px solid rgba(${card.rgb},0.38)`,
                color: `rgba(${card.rgb},0.92)`,
            }}>
                {card.tag}
            </div>

            {/* Bottle */}
            <div className="flex-1 flex items-center justify-center relative" style={{ minHeight: 0 }}>
                {/* Glow */}
                <div className="absolute pointer-events-none" style={{
                    width: "60vw", height: "60vw", borderRadius: "50%",
                    background: `radial-gradient(circle, rgba(${card.rgb},0.16) 0%, transparent 65%)`,
                }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    ref={imgRef}
                    src={card.img}
                    alt={card.name.join(" ")}
                    style={{
                        height: "42dvh", width: "auto", objectFit: "contain",
                        willChange: "transform, opacity, filter",
                        filter: `drop-shadow(0 24px 52px rgba(0,0,0,0.9)) drop-shadow(0 0 28px rgba(${card.rgb},0.22))`,
                        opacity: 0,
                    }}
                />
            </div>

            {/* Text block */}
            <div className="flex flex-col px-6" style={{
                paddingBottom: "max(28px, env(safe-area-inset-bottom, 28px))",
                gap: 0,
            }}>
                {/* Name */}
                <div ref={nameRef} style={{ marginBottom: 8, opacity: 0 }}>
                    {card.name.map((line, i) => (
                        <div key={i} style={{
                            fontSize: "clamp(50px, 16.5vw, 74px)",
                            fontWeight: 900,
                            lineHeight: 0.88,
                            letterSpacing: "-0.04em",
                            textTransform: "uppercase",
                            color: i === 1 ? card.accent : "#F5F5F5",
                        }}>
                            {line}
                        </div>
                    ))}
                </div>

                {/* Rule */}
                <div ref={ruleRef} style={{
                    width: 40, height: 1, marginBottom: 10,
                    background: `linear-gradient(90deg, ${card.accent}, transparent)`,
                    opacity: 0,
                }} />

                {/* Subtitle */}
                <p ref={subRef} style={{
                    fontSize: 13, lineHeight: 1.65,
                    color: "rgba(245,245,245,0.48)",
                    marginBottom: 20,
                    maxWidth: "78%",
                    opacity: 0,
                }}>
                    {card.sub}
                </p>

                {/* CTA */}
                <div ref={ctaRef} style={{ opacity: 0 }}>
                    <TransitionLink
                        href={card.href}
                        label={card.name.join(" ")}
                        style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            height: 44, padding: "0 22px", borderRadius: 999,
                            background: card.accent, color: "#0A0A0A",
                            fontSize: 10, fontWeight: 800,
                            letterSpacing: "0.22em", textTransform: "uppercase",
                            boxShadow: `0 0 20px rgba(${card.rgb},0.38), 0 4px 12px rgba(0,0,0,0.5)`,
                            textDecoration: "none",
                        }}
                    >
                        Discover
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4"
                                strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </TransitionLink>
                </div>
            </div>

            {/* Bottom accent */}
            <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(90deg, transparent, rgba(${card.rgb},0.15), transparent)`,
            }} />
        </div>
    );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function MobileHeroExperience({ onReady }: { onReady?: () => void }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [dotsVisible, setDotsVisible] = useState(true);

    useEffect(() => { onReady?.(); }, [onReady]);

    // Track active slide via scroll position
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const onScroll = () => {
            const idx = Math.round(el.scrollLeft / window.innerWidth);
            setActiveIndex(Math.min(Math.max(idx, 0), CARDS.length - 1));
        };

        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, []);

    // Hide dots when hero section is fully scrolled past
    useEffect(() => {
        const wrap = wrapRef.current;
        if (!wrap) return;

        const obs = new IntersectionObserver(
            ([entry]) => setDotsVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );
        obs.observe(wrap);
        return () => obs.disconnect();
    }, []);

    return (
        <div ref={wrapRef} style={{ position: "relative" }}>

            {/* ── Horizontal scroll-snap strip ── */}
            <div
                ref={scrollRef}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    overflowX: "scroll",
                    overflowY: "hidden",
                    scrollSnapType: "x mandatory",
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "none",
                    height: "100dvh",
                    // Prevent rubber-band bleed on iOS in vertical direction
                    overscrollBehaviorX: "contain",
                    overscrollBehaviorY: "none",
                }}
            >
                {CARDS.map((card, i) => (
                    <Slide key={card.id} card={card} index={i} isActive={i === activeIndex} />
                ))}
            </div>

            {/* ── Swipe hint — first slide only ── */}
            {activeIndex === 0 && dotsVisible && (
                <div
                    className="pointer-events-none"
                    style={{
                        position: "absolute",
                        bottom: 36,
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 6,
                        zIndex: 20,
                        animation: "swipe-nudge 2s ease-in-out infinite",
                    }}
                >
                    <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
                        <path d="M2 7h18M13 2l7 5-7 5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.3"
                            strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{
                        fontSize: 8, letterSpacing: "0.45em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.28)",
                    }}>
                        Swipe
                    </span>
                </div>
            )}

            {/* ── Progress dots — right center, hidden once out of view ── */}
            {dotsVisible && (
                <div
                    className="pointer-events-none"
                    style={{
                        position: "fixed",
                        right: 14,
                        top: "50%",
                        transform: "translateY(-50%)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 7,
                        zIndex: 50,
                    }}
                >
                    {CARDS.map((card, i) => (
                        <div
                            key={card.id}
                            style={{
                                width: i === activeIndex ? 4 : 3,
                                height: i === activeIndex ? 18 : 3,
                                borderRadius: 999,
                                background: i === activeIndex ? card.accent : "rgba(255,255,255,0.2)",
                                transition: "all 0.38s cubic-bezier(0.34,1.56,0.64,1)",
                                boxShadow: i === activeIndex ? `0 0 8px rgba(${card.rgb},0.65)` : "none",
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Swipe hint keyframe */}
            <style>{`
                @keyframes swipe-nudge {
                    0%, 100% { transform: translateX(-50%) translateX(0); opacity: 0.6; }
                    50% { transform: translateX(-50%) translateX(5px); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
