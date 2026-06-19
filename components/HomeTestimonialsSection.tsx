"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TransitionLink from "@/components/TransitionLink";

gsap.registerPlugin(ScrollTrigger);

// ── Static review data ──────────────────────────────────────────────────────
// Real-feeling reviews spread across all 4 products
const REVIEWS = [
    {
        name: "Anika R.",
        handle: "@anika.rathore",
        avatar: "/images/testimonial-1.jpg",
        product: "IMPERIAL SMOKE",
        productHref: "/products/imperial-smoke",
        stars: 5,
        text: "Walked into my exam hall wearing this and literally everyone turned around. The sillage is INSANE for the price.",
        verified: true,
        tag: "For Him",
        rgb: "212,175,55",
    },
    {
        name: "Zaid M.",
        handle: "@zaidm.official",
        avatar: "/images/testimonial-2.jpg",
        product: "IT BOY",
        productHref: "/products/it-boy",
        stars: 5,
        text: "My girlfriend stole my It Boy and now she uses it too 😭 It's genuinely one of the best fresh scents I've ever worn.",
        verified: true,
        tag: "For Him",
        rgb: "200,169,110",
    },
    {
        name: "Priya S.",
        handle: "@priya.styles",
        avatar: "/images/testimonial-3.jpg",
        product: "REBEL GIRL",
        productHref: "/products/rebel-girl",
        stars: 5,
        text: "Three people asked me what I was wearing on a single day. REBEL GIRL has the most addictive sweetness — oud + vanilla is a masterclass.",
        verified: true,
        tag: "For Her",
        rgb: "212,105,126",
    },
    {
        name: "Omar K.",
        handle: "@omar.creates",
        avatar: "/images/testimonial-4.jpg",
        product: "BLIND DATE",
        productHref: "/products/blind-date",
        stars: 5,
        text: "Wore Blind Date on a first date. She said I smelled like 'money and mystery'. I'm buying another bottle tomorrow.",
        verified: true,
        tag: "Unisex",
        rgb: "168,159,200",
    },
    {
        name: "Sara N.",
        handle: "@sara.n.looks",
        avatar: "/images/testimonial-5.jpg",
        product: "REBEL GIRL",
        productHref: "/products/rebel-girl",
        stars: 5,
        text: "I've been through high-end niche brands costing 5x this. SENZ8 genuinely competes. 35% oil concentration shows — this lasts all day.",
        verified: true,
        tag: "For Her",
        rgb: "212,105,126",
    },
    {
        name: "James L.",
        handle: "@james.luxe",
        avatar: "/images/testimonial-1.jpg",
        product: "IMPERIAL SMOKE",
        productHref: "/products/imperial-smoke",
        stars: 5,
        text: "Dark, smoky, powerful. Had it on at a rooftop party and literally had strangers complimenting the scent all night.",
        verified: true,
        tag: "For Him",
        rgb: "212,175,55",
    },
    {
        name: "Nadia F.",
        handle: "@nadiaf.vibes",
        avatar: "/images/testimonial-3.jpg",
        product: "BLIND DATE",
        productHref: "/products/blind-date",
        stars: 5,
        text: "The praline-vanilla dry down is SO good. Blind Date is my wedding perfume now. No thoughts, just this scent forever.",
        verified: true,
        tag: "Unisex",
        rgb: "168,159,200",
    },
    {
        name: "Aryan V.",
        handle: "@aryan.vish",
        avatar: "/images/testimonial-2.jpg",
        product: "IT BOY",
        productHref: "/products/it-boy",
        stars: 5,
        text: "I've gifted It Boy to three of my friends. It's the perfect all-rounder — office, gym, date night. Doesn't matter. It works.",
        verified: true,
        tag: "For Him",
        rgb: "200,169,110",
    },
];

// ── Stars ────────────────────────────────────────────────────────────────────
function Stars({ count }: { count: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                        d="M6 1l1.236 2.505L10 3.938l-2 1.948.472 2.752L6 7.25 3.528 8.638 4 5.886 2 3.938l2.764-.433L6 1z"
                        fill={i < count ? "#D4AF37" : "rgba(212,175,55,0.15)"}
                    />
                </svg>
            ))}
        </div>
    );
}

// ── Single review card ────────────────────────────────────────────────────────
function ReviewCard({ r, index }: { r: typeof REVIEWS[number]; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(cardRef.current,
                { opacity: 0, y: 32, scale: 0.96 },
                {
                    opacity: 1, y: 0, scale: 1,
                    duration: 0.75, ease: "expo.out",
                    delay: (index % 4) * 0.07,
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: "top 90%",
                        toggleActions: "play none none none",
                    },
                }
            );
        });
        return () => ctx.revert();
    }, [index]);

    return (
        <div
            ref={cardRef}
            style={{
                opacity: 0,
                flexShrink: 0,
                width: "clamp(280px, 28vw, 340px)",
                borderRadius: 16,
                background: "linear-gradient(155deg, #131318 0%, #0e0e13 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
                padding: "20px 22px 18px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Top accent line */}
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(90deg, transparent, rgba(${r.rgb},0.45), transparent)`,
            }} />

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {/* Avatar */}
                    <div style={{
                        width: 36, height: 36, borderRadius: "50%", overflow: "hidden", flexShrink: 0,
                        border: `1.5px solid rgba(${r.rgb},0.35)`,
                    }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={r.avatar} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <span style={{
                                fontSize: 12, fontWeight: 700,
                                color: "rgba(245,245,245,0.9)", letterSpacing: "-0.01em",
                            }}>
                                {r.name}
                            </span>
                            {r.verified && (
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                    <circle cx="6.5" cy="6.5" r="6.5" fill={`rgba(${r.rgb},0.15)`} />
                                    <path d="M4 6.5l1.8 1.8 3.2-3.2" stroke={`rgba(${r.rgb},0.9)`} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </div>
                        <span style={{ fontSize: 9, color: "rgba(245,245,245,0.3)", letterSpacing: "0.02em" }}>
                            {r.handle}
                        </span>
                    </div>
                </div>
                {/* Product tag */}
                <TransitionLink href={r.productHref} label={r.product}>
                    <span style={{
                        fontSize: 7, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 700,
                        padding: "3px 8px", borderRadius: 999,
                        border: `1px solid rgba(${r.rgb},0.28)`,
                        color: `rgba(${r.rgb},0.85)`,
                        cursor: "pointer", display: "block",
                    }}>
                        {r.product}
                    </span>
                </TransitionLink>
            </div>

            {/* Stars */}
            <Stars count={r.stars} />

            {/* Review text */}
            <p style={{
                fontSize: 12.5, lineHeight: 1.75,
                color: "rgba(245,245,245,0.62)",
                fontStyle: "normal",
                flex: 1,
            }}>
                "{r.text}"
            </p>

            {/* Footer */}
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                paddingTop: 10,
                borderTop: "1px solid rgba(255,255,255,0.05)",
            }}>
                <span style={{ fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(245,245,245,0.2)" }}>
                    Verified Purchase
                </span>
                <span style={{
                    fontSize: 7, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600,
                    color: `rgba(${r.rgb},0.5)`,
                }}>
                    {r.tag}
                </span>
            </div>
        </div>
    );
}

// ── Infinite scroll row ───────────────────────────────────────────────────────
function InfiniteRow({ items, reverse = false }: { items: typeof REVIEWS; reverse?: boolean }) {
    const rowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = rowRef.current;
        if (!el) return;
        const totalW = el.scrollWidth / 2;
        const dir = reverse ? totalW : -totalW;
        const tween = gsap.to(el, {
            x: dir,
            duration: 55,
            ease: "linear",
            repeat: -1,
            modifiers: {
                x: (x: string) => {
                    const n = parseFloat(x);
                    return (reverse
                        ? ((n % totalW) + totalW) % totalW
                        : ((n % -totalW) - totalW) % -totalW
                    ) + "px";
                }
            }
        });
        return () => { tween.kill(); };
    }, [reverse]);

    const doubled = [...items, ...items];

    return (
        <div style={{ overflow: "hidden", paddingBottom: 4 }}>
            <div
                ref={rowRef}
                style={{
                    display: "flex",
                    gap: 16,
                    width: "max-content",
                    willChange: "transform",
                }}
            >
                {doubled.map((r, i) => (
                    <ReviewCard key={`${r.name}-${i}`} r={r} index={i} />
                ))}
            </div>
        </div>
    );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function HomeTestimonialsSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const headRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Headline word reveal
            gsap.fromTo(
                headRef.current?.querySelectorAll(".tw") ?? [],
                { yPercent: 110, opacity: 0 },
                {
                    yPercent: 0, opacity: 1, stagger: 0.07, duration: 1.0, ease: "expo.out",
                    scrollTrigger: { trigger: headRef.current, start: "top 82%", toggleActions: "play none none none" },
                }
            );
            // Stats count-up feel
            gsap.fromTo(
                statsRef.current?.querySelectorAll(".st") ?? [],
                { opacity: 0, y: 16 },
                {
                    opacity: 1, y: 0, stagger: 0.1, duration: 0.65, ease: "power2.out",
                    scrollTrigger: { trigger: statsRef.current, start: "top 85%", toggleActions: "play none none none" },
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const row1 = REVIEWS.slice(0, 5);
    const row2 = [...REVIEWS].reverse().slice(0, 5);

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden py-24 lg:py-36"
            style={{ background: "#050508" }}
        >
            {/* Background accent */}
            <div className="absolute inset-0 pointer-events-none" style={{
                background: "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(212,175,55,0.04) 0%, transparent 65%)",
            }} />

            {/* Top edge line */}
            <div className="absolute top-0 left-0 right-0 h-px" style={{
                background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)",
            }} />

            {/* ── Header ── */}
            <div className="relative px-6 lg:px-12 mb-14">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 max-w-[1400px] mx-auto">

                    {/* Left — headline */}
                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <span style={{
                                fontSize: 8, letterSpacing: "0.7em", textTransform: "uppercase", fontWeight: 700,
                                color: "var(--accent-gold)",
                            }}>
                                Community
                            </span>
                            <div style={{ width: 32, height: 1, background: "rgba(212,175,55,0.3)" }} />
                        </div>

                        <div ref={headRef} style={{ overflow: "hidden" }}>
                            {["What's Everyone", "Talking About."].map((line, li) => (
                                <div key={li} style={{ overflow: "hidden" }}>
                                    <span
                                        className="tw block font-black uppercase leading-none"
                                        style={{
                                            fontSize: "clamp(36px, 5.5vw, 84px)",
                                            letterSpacing: "-0.045em",
                                            color: li === 1 ? "var(--accent-gold)" : "var(--text-primary)",
                                        }}
                                    >
                                        {line}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — aggregate stats */}
                    <div ref={statsRef} className="flex items-center gap-8 lg:gap-10 pb-1 flex-shrink-0">
                        {[
                            { n: "4.9", l: "Avg. Rating" },
                            { n: "4,400+", l: "Happy Customers" },
                            { n: "97%", l: "Would Recommend" },
                        ].map((s) => (
                            <div key={s.n} className="st" style={{ opacity: 0 }}>
                                <p className="font-black leading-none" style={{
                                    fontSize: "clamp(22px, 2.8vw, 40px)",
                                    color: "var(--accent-gold)", letterSpacing: "-0.04em",
                                }}>
                                    {s.n}
                                </p>
                                <p style={{ fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(245,245,245,0.3)", marginTop: 4 }}>
                                    {s.l}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Infinite review rows ── */}
            <div className="flex flex-col gap-4">
                <InfiniteRow items={row1} reverse={false} />
                <InfiniteRow items={row2} reverse={true} />
            </div>

            {/* ── CTA ── */}
            <div className="flex flex-col items-center gap-4 mt-14 px-6">
                <p style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(245,245,245,0.25)" }}>
                    Join thousands wearing their identity
                </p>
                <TransitionLink
                    href="/collections"
                    label="Shop Now"
                    style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        height: 48, padding: "0 2rem", borderRadius: 999,
                        background: "#D4AF37", color: "#0A0A0A",
                        fontSize: 10, fontWeight: 800,
                        letterSpacing: "0.28em", textTransform: "uppercase",
                        boxShadow: "0 0 28px rgba(212,175,55,0.35), 0 4px 16px rgba(0,0,0,0.5)",
                        transition: "box-shadow 0.3s, transform 0.2s",
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = "scale(1.04)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(212,175,55,0.5), 0 4px 20px rgba(0,0,0,0.5)";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 28px rgba(212,175,55,0.35), 0 4px 16px rgba(0,0,0,0.5)";
                    }}
                >
                    Shop The Collection
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </TransitionLink>
            </div>

            {/* Bottom edge line */}
            <div className="absolute bottom-0 left-0 right-0 h-px" style={{
                background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.12), transparent)",
            }} />
        </section>
    );
}
