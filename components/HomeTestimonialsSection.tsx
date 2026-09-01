"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TransitionLink from "@/components/TransitionLink";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────────────────
const REVIEWS = [
    {
        name: "Anika R.",
        handle: "@anika.rathore",
        product: "IMPERIAL SMOKE",
        productHref: "/products/imperial-smoke",
        stars: 5,
        text: "Walked into my exam hall wearing this and literally everyone turned around. The sillage is insane for the price.",
        tag: "For Him",
        rgb: "212,175,55",
    },
    {
        name: "Priya S.",
        handle: "@priya.styles",
        product: "REBEL GIRL",
        productHref: "/products/rebel-girl",
        stars: 5,
        text: "Three people asked what I was wearing in a single day. REBEL GIRL's oud + vanilla is a masterclass.",
        tag: "For Her",
        rgb: "212,105,126",
    },
    {
        name: "Zaid M.",
        handle: "@zaidm.official",
        product: "IT BOY",
        productHref: "/products/it-boy",
        stars: 5,
        text: "My girlfriend stole my It Boy and now she uses it too. Genuinely one of the best fresh scents I've worn.",
        tag: "For Him",
        rgb: "200,169,110",
    },
    {
        name: "Omar K.",
        handle: "@omar.creates",
        product: "BLIND DATE",
        productHref: "/products/blind-date",
        stars: 5,
        text: "Wore Blind Date on a first date. She said I smelled like 'money and mystery'. Buying another bottle tomorrow.",
        tag: "Unisex",
        rgb: "168,159,200",
    },
    {
        name: "Sara N.",
        handle: "@sara.n.looks",
        product: "REBEL GIRL",
        productHref: "/products/rebel-girl",
        stars: 5,
        text: "I've tried niche brands costing 5× this. SENZ8 genuinely competes — 35% oil concentration shows.",
        tag: "For Her",
        rgb: "212,105,126",
    },
    {
        name: "James L.",
        handle: "@james.luxe",
        product: "IMPERIAL SMOKE",
        productHref: "/products/imperial-smoke",
        stars: 5,
        text: "Dark, smoky, powerful. At a rooftop party strangers were asking about my scent all night long.",
        tag: "For Him",
        rgb: "212,175,55",
    },
];

const STATS = [
    { n: "4.9", l: "Avg. Rating" },
    { n: "4,400+", l: "Happy Customers" },
    { n: "97%", l: "Would Recommend" },
];

// ─────────────────────────────────────────────────────────────────────────────
function Stars({ count, rgb }: { count: number; rgb: string }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path
                        d="M6 1l1.236 2.505L10 3.938l-2 1.948.472 2.752L6 7.25 3.528 8.638 4 5.886 2 3.938l2.764-.433L6 1z"
                        fill={i < count ? `rgba(${rgb},1)` : `rgba(${rgb},0.15)`}
                    />
                </svg>
            ))}
        </div>
    );
}

// ── Review card — clip-path reveal on enter ───────────────────────────────────
function ReviewCard({ r, index }: { r: typeof REVIEWS[number]; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Card: clip-path iris-open from bottom + y lift
            gsap.fromTo(
                cardRef.current,
                { opacity: 0, y: 40, clipPath: "inset(100% 0% 0% 0%)" },
                {
                    opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)",
                    duration: 0.9, ease: "expo.out",
                    delay: (index % 3) * 0.1,
                    scrollTrigger: { trigger: cardRef.current, start: "top 92%", toggleActions: "play none none none" },
                }
            );
            // Top accent line scales in from left
            gsap.fromTo(
                lineRef.current,
                { scaleX: 0 },
                {
                    scaleX: 1, duration: 0.8, ease: "expo.out",
                    delay: (index % 3) * 0.1 + 0.3,
                    scrollTrigger: { trigger: cardRef.current, start: "top 92%", toggleActions: "play none none none" },
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
                clipPath: "inset(100% 0% 0% 0%)",
                borderRadius: 16,
                background: "linear-gradient(155deg,#111116 0%,#0b0b10 100%)",
                border: "1px solid rgba(255,255,255,0.055)",
                padding: "22px",
                display: "flex", flexDirection: "column", gap: 14,
                position: "relative", overflow: "hidden", breakInside: "avoid",
                transition: "border-color 0.4s",
            }}
            onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = `rgba(${r.rgb},0.28)`;
                gsap.to(el, { y: -4, duration: 0.35, ease: "power3.out" });
            }}
            onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "rgba(255,255,255,0.055)";
                gsap.to(el, { y: 0, duration: 0.4, ease: "power2.out" });
            }}
        >
            {/* Top accent — origin left scale */}
            <div
                ref={lineRef}
                style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 1,
                    background: `linear-gradient(90deg,transparent,rgba(${r.rgb},0.6),transparent)`,
                    transformOrigin: "left center",
                }}
            />

            {/* Large decorative quote mark */}
            <div aria-hidden style={{
                position: "absolute", top: 12, right: 16,
                fontSize: 72, lineHeight: 1, fontWeight: 900,
                color: `rgba(${r.rgb},0.05)`, userSelect: "none",
                fontFamily: "Georgia, serif",
            }}>
                "
            </div>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    {/* Initials avatar */}
                    <div style={{
                        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                        background: `rgba(${r.rgb},0.1)`,
                        border: `1.5px solid rgba(${r.rgb},0.3)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 800, color: `rgba(${r.rgb},0.9)`,
                    }}>
                        {r.name.charAt(0)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(245,245,245,0.9)", whiteSpace: "nowrap" }}>
                                {r.name}
                            </span>
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
                                <circle cx="6.5" cy="6.5" r="6.5" fill={`rgba(${r.rgb},0.15)`} />
                                <path d="M4 6.5l1.8 1.8 3.2-3.2" stroke={`rgba(${r.rgb},0.9)`} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span style={{ fontSize: 10, color: "rgba(245,245,245,0.38)", letterSpacing: "0.02em" }}>
                            {r.handle}
                        </span>
                    </div>
                </div>
                <TransitionLink href={r.productHref} label={r.product}>
                    <span style={{
                        fontSize: 8, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700,
                        padding: "3px 8px", borderRadius: 999, flexShrink: 0, whiteSpace: "nowrap",
                        border: `1px solid rgba(${r.rgb},0.3)`,
                        color: `rgba(${r.rgb},0.85)`,
                        background: `rgba(${r.rgb},0.06)`,
                        display: "block", transition: "background 0.3s",
                    }}>
                        {r.product}
                    </span>
                </TransitionLink>
            </div>

            <Stars count={r.stars} rgb={r.rgb} />

            <p style={{ fontSize: 13, lineHeight: 1.78, color: "rgba(245,245,245,0.78)", flex: 1, position: "relative", zIndex: 1 }}>
                &ldquo;{r.text}&rdquo;
            </p>

            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.05)",
            }}>
                <span style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(245,245,245,0.35)" }}>
                    Verified Purchase
                </span>
                <span style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, color: `rgba(${r.rgb},0.6)` }}>
                    {r.tag}
                </span>
            </div>
        </div>
    );
}

// ── Slow-scrolling marquee strip ──────────────────────────────────────────────
function ReviewMarquee() {
    const rowRef = useRef<HTMLDivElement>(null);
    const snippets = REVIEWS.map((r) => `"${r.text.slice(0, 48)}…"`);

    useEffect(() => {
        const tw = gsap.to(rowRef.current, {
            xPercent: -50, duration: 40, ease: "linear", repeat: -1,
        });
        return () => { tw.kill(); };
    }, []);

    const items = [...snippets, ...snippets];

    return (
        <div className="overflow-hidden py-5 my-16"
            style={{ borderTop: "1px solid rgba(212,175,55,0.06)", borderBottom: "1px solid rgba(212,175,55,0.06)" }}>
            <div ref={rowRef} className="flex gap-16 w-max will-change-transform">
                {items.map((s, i) => (
                    <span key={i} className="flex items-center gap-8 flex-shrink-0"
                        style={{ fontSize: "clamp(11px,1.1vw,14px)", color: "rgba(245,245,245,0.18)", letterSpacing: "0.05em", fontStyle: "italic" }}>
                        {s}
                        <span style={{ color: "rgba(212,175,55,0.2)", fontStyle: "normal" }}>✦</span>
                    </span>
                ))}
            </div>
        </div>
    );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function HomeTestimonialsSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const headRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const bgGlowRef = useRef<HTMLDivElement>(null);
    const ambientRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // ── Parallax background glow ──
            gsap.to(bgGlowRef.current, {
                yPercent: 25, ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom", end: "bottom top", scrub: true,
                },
            });

            // ── Ambient text: scrub-driven word reveal ──────────────────────
            // All words animate across ONE shared scrub range so they sequence
            // correctly regardless of scroll speed or element position.
            const words = Array.from(
                ambientRef.current?.querySelectorAll<HTMLElement>(".amb-word") ?? []
            );
            if (words.length) {
                // Start all dim
                gsap.set(words, { color: "rgba(245,245,245,0.08)" });

                const total = words.length;
                // Each word owns (1/total) of the scroll range
                // Active word = gold, revealed word = white, dim = near-invisible
                words.forEach((word, i) => {
                    const startFrac = i / total;
                    const peakFrac = (i + 0.5) / total;
                    const endFrac = (i + 1) / total;

                    ScrollTrigger.create({
                        trigger: ambientRef.current,
                        start: "top 60%",
                        end: "bottom 30%",
                        scrub: 0.8,
                        onUpdate: (self) => {
                            const p = self.progress;
                            if (p < startFrac) {
                                // Not yet — dim
                                gsap.set(word, { color: "rgba(245,245,245,0.08)" });
                            } else if (p < peakFrac) {
                                // Entering — interpolate dim → gold
                                const t = (p - startFrac) / (peakFrac - startFrac);
                                const r = Math.round(212 * t + 245 * (1 - t));
                                const g = Math.round(175 * t + 245 * (1 - t));
                                const b = Math.round(55 * t + 245 * (1 - t));
                                const a = 0.08 + t * 0.92;
                                gsap.set(word, { color: `rgba(${r},${g},${b},${a})` });
                            } else if (p < endFrac) {
                                // Leaving gold → white
                                const t = (p - peakFrac) / (endFrac - peakFrac);
                                const v = Math.round(212 + (245 - 212) * t);
                                const vg = Math.round(175 + (245 - 175) * t);
                                const vb = Math.round(55 + (245 - 55) * t);
                                gsap.set(word, { color: `rgba(${v},${vg},${vb},1)` });
                            } else {
                                // Fully revealed — bright white
                                gsap.set(word, { color: "rgba(245,245,245,0.9)" });
                            }
                        },
                    });
                });
            }

            // ── Headline: word mask slide-up ──
            gsap.fromTo(
                headRef.current?.querySelectorAll(".tw") ?? [],
                { yPercent: 110, opacity: 0 },
                {
                    yPercent: 0, opacity: 1, stagger: 0.07, duration: 1.1, ease: "expo.out",
                    scrollTrigger: { trigger: headRef.current, start: "top 82%", toggleActions: "play none none none" },
                }
            );

            // ── Stats: each number clips in from bottom ──
            gsap.fromTo(
                statsRef.current?.querySelectorAll(".st") ?? [],
                { yPercent: 80, opacity: 0, clipPath: "inset(100% 0 0 0)" },
                {
                    yPercent: 0, opacity: 1, clipPath: "inset(0% 0 0 0)",
                    stagger: 0.1, duration: 0.9, ease: "expo.out",
                    scrollTrigger: { trigger: statsRef.current, start: "top 85%", toggleActions: "play none none none" },
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    // Split reviews into 3 columns manually so we control order
    const col1 = [REVIEWS[0], REVIEWS[3]];
    const col2 = [REVIEWS[1], REVIEWS[4]];
    const col3 = [REVIEWS[2], REVIEWS[5]];

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden"
            style={{ background: "#050508" }}
        >
            {/* ── Edge lines ── */}
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.18),transparent)" }} />
            <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.1),transparent)" }} />

            {/* ── Parallax background glow ── */}
            <div ref={bgGlowRef} className="absolute inset-0 pointer-events-none" style={{
                background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(212,175,55,0.07) 0%, transparent 65%)",
            }} />

            {/* ── DESKTOP LAYOUT ── */}
            <div className="hidden lg:block">
                <div className="max-w-[1440px] mx-auto px-12 pt-28 pb-0">

                    {/* Hero header row */}
                    <div className="flex items-end justify-between mb-20">

                        {/* Left: overline + giant headline */}
                        <div style={{ maxWidth: 680 }}>
                            <div className="flex items-center gap-4 mb-6">
                                <div style={{ width: 40, height: 1, background: "rgba(212,175,55,0.45)" }} />
                                <span style={{ fontSize: 10, letterSpacing: "0.6em", textTransform: "uppercase", fontWeight: 700, color: "var(--accent-gold)" }}>
                                    Community Voice
                                </span>
                            </div>
                            <div ref={headRef}>
                                {["What They're", "Saying About Us."].map((line, li) => (
                                    <div key={li} style={{ overflow: "hidden" }}>
                                        <span
                                            className="tw block font-black uppercase"
                                            style={{
                                                fontSize: "clamp(52px,6.5vw,98px)",
                                                letterSpacing: "-0.045em",
                                                lineHeight: 0.88,
                                                color: li === 1 ? "var(--accent-gold)" : "var(--text-primary)",
                                            }}
                                        >
                                            {line}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: stat trio */}
                        <div ref={statsRef} className="flex items-end gap-12 pb-2">
                            {STATS.map((s, si) => (
                                <div
                                    key={s.n}
                                    className="st flex flex-col items-end"
                                    style={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
                                >
                                    <p className="font-black leading-none"
                                        style={{ fontSize: "clamp(36px,3.5vw,56px)", color: "var(--accent-gold)", letterSpacing: "-0.05em" }}>
                                        {s.n}
                                    </p>
                                    <div style={{ width: "100%", height: 1, background: `rgba(212,175,55,${0.15 + si * 0.05})`, margin: "8px 0" }} />
                                    <p style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(245,245,245,0.5)" }}>
                                        {s.l}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Ambient oversized quote — scroll-driven word reveal ── */}
                    <div
                        ref={ambientRef}
                        className="relative mb-4 select-none pointer-events-none overflow-hidden"
                    >
                        {/* Line 1 — solid fill words */}
                        <p style={{
                            fontSize: "clamp(64px,9.5vw,138px)",
                            fontWeight: 900,
                            lineHeight: 0.88,
                            letterSpacing: "-0.055em",
                            textTransform: "uppercase",
                        }}>
                            {['"Crafted', 'in', 'shadow.'].map((w, i) => (
                                <span
                                    key={i}
                                    className="amb-word inline-block"
                                    style={{ color: "rgba(245,245,245,0.08)", marginRight: "0.2em" }}
                                >
                                    {w}
                                </span>
                            ))}
                        </p>
                        {/* Line 2 — gold tint on reveal for contrast */}
                        <p style={{
                            fontSize: "clamp(64px,9.5vw,138px)",
                            fontWeight: 900,
                            lineHeight: 0.88,
                            letterSpacing: "-0.055em",
                            textTransform: "uppercase",
                        }}>
                            {['Remembered', 'Forever."'].map((w, i) => (
                                <span
                                    key={i}
                                    className="amb-word inline-block"
                                    style={{ color: "rgba(245,245,245,0.08)", marginRight: "0.2em" }}
                                >
                                    {w}
                                </span>
                            ))}
                        </p>
                    </div>
                </div>

                {/* ── Review marquee strip ── */}
                <ReviewMarquee />

                {/* ── 3-column card grid ── */}
                <div className="max-w-[1440px] mx-auto px-12 pb-28">
                    <div className="grid grid-cols-3 gap-5 items-start">
                        {/* Col 1 — offset down for visual tension */}
                        <div className="flex flex-col gap-5 mt-8">
                            {col1.map((r, i) => (
                                <ReviewCard key={r.name + i} r={r} index={i * 3} />
                            ))}
                        </div>
                        {/* Col 2 — no offset, natural anchor */}
                        <div className="flex flex-col gap-5">
                            {col2.map((r, i) => (
                                <ReviewCard key={r.name + i} r={r} index={i * 3 + 1} />
                            ))}
                        </div>
                        {/* Col 3 — offset up */}
                        <div className="flex flex-col gap-5 -mt-8">
                            {col3.map((r, i) => (
                                <ReviewCard key={r.name + i} r={r} index={i * 3 + 2} />
                            ))}
                        </div>
                    </div>

                    {/* ── CTA row ── */}
                    <div className="flex items-center justify-between mt-20 pt-12"
                        style={{ borderTop: "1px solid rgba(212,175,55,0.08)" }}>
                        <div>
                            <p className="font-black uppercase"
                                style={{ fontSize: "clamp(24px,2.5vw,40px)", letterSpacing: "-0.04em", color: "var(--text-primary)", lineHeight: 1 }}>
                                Wear Your Identity.
                            </p>
                            <p style={{ fontSize: 13, color: "rgba(245,245,245,0.45)", marginTop: 8, letterSpacing: "0.05em" }}>
                                Join 4,400+ customers who made the switch.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* White outline button */}
                            <TransitionLink
                                href="/collections"
                                label="View All"
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: 8,
                                    height: 52, padding: "0 2rem", borderRadius: 999,
                                    background: "transparent", color: "rgba(245,245,245,0.85)",
                                    fontSize: 10, fontWeight: 700,
                                    letterSpacing: "0.28em", textTransform: "uppercase",
                                    textDecoration: "none",
                                    border: "1px solid rgba(245,245,245,0.2)",
                                    transition: "border-color 0.3s, color 0.3s",
                                }}
                                onMouseEnter={(e) => {
                                    const el = e.currentTarget as HTMLElement;
                                    el.style.borderColor = "rgba(245,245,245,0.5)";
                                    el.style.color = "#ffffff";
                                }}
                                onMouseLeave={(e) => {
                                    const el = e.currentTarget as HTMLElement;
                                    el.style.borderColor = "rgba(245,245,245,0.2)";
                                    el.style.color = "rgba(245,245,245,0.85)";
                                }}
                            >
                                View All
                                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </TransitionLink>
                            {/* Gold CTA button */}
                            <TransitionLink
                                href="/collections"
                                label="Shop Now"
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: 10,
                                    height: 52, padding: "0 2.5rem", borderRadius: 999,
                                    background: "#D4AF37", color: "#0A0A0A",
                                    fontSize: 10, fontWeight: 800,
                                    letterSpacing: "0.3em", textTransform: "uppercase",
                                    textDecoration: "none",
                                    boxShadow: "0 0 32px rgba(212,175,55,0.38), 0 4px 20px rgba(0,0,0,0.55)",
                                    transition: "box-shadow 0.3s, transform 0.25s",
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
                                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 52px rgba(212,175,55,0.6), 0 4px 24px rgba(0,0,0,0.55)";
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 32px rgba(212,175,55,0.38), 0 4px 20px rgba(0,0,0,0.55)";
                                }}
                            >
                                Shop The Collection
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </TransitionLink>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MOBILE LAYOUT ── */}
            <div className="lg:hidden">
                <div className="px-5 sm:px-8 pt-16 pb-0">
                    <div className="flex items-center gap-3 mb-4">
                        <div style={{ width: 28, height: 1, background: "rgba(212,175,55,0.4)" }} />
                        <span style={{ fontSize: 9, letterSpacing: "0.55em", textTransform: "uppercase", fontWeight: 700, color: "var(--accent-gold)" }}>
                            Community
                        </span>
                    </div>

                    {/* Mobile headline */}
                    <div ref={headRef} className="mb-8">
                        {["Real People.", "Real Reactions."].map((line, li) => (
                            <div key={li} style={{ overflow: "hidden" }}>
                                <span className="tw block font-black uppercase"
                                    style={{
                                        fontSize: "clamp(30px,9vw,52px)",
                                        letterSpacing: "-0.04em", lineHeight: 0.9,
                                        color: li === 1 ? "var(--accent-gold)" : "var(--text-primary)",
                                    }}>
                                    {line}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Mobile stats */}
                    <div ref={statsRef} className="flex gap-8 mb-8 flex-wrap">
                        {STATS.map((s) => (
                            <div key={s.n} className="st" style={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}>
                                <p className="font-black leading-none" style={{ fontSize: "clamp(22px,6vw,32px)", color: "var(--accent-gold)", letterSpacing: "-0.04em" }}>
                                    {s.n}
                                </p>
                                <p style={{ fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(245,245,245,0.5)", marginTop: 3 }}>
                                    {s.l}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile marquee */}
                <ReviewMarquee />

                {/* Mobile: CSS columns masonry */}
                <div className="px-5 sm:px-8 pb-16"
                    style={{ columnCount: 1, columnGap: 14 }}
                    // @ts-expect-error - Tailwind responsive column-count via class
                    className="px-5 sm:px-8 pb-16 sm:[column-count:2]"
                >
                    {REVIEWS.map((r, i) => (
                        <div key={r.name + i} style={{ marginBottom: 14, breakInside: "avoid" }}>
                            <ReviewCard r={r} index={i} />
                        </div>
                    ))}
                </div>

                {/* Mobile CTA */}
                <div className="flex flex-col items-center gap-4 pb-16 px-5">
                    <TransitionLink
                        href="/collections"
                        label="Shop Now"
                        style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            height: 48, padding: "0 2rem", borderRadius: 999,
                            background: "#D4AF37", color: "#0A0A0A",
                            fontSize: 10, fontWeight: 800,
                            letterSpacing: "0.28em", textTransform: "uppercase",
                            textDecoration: "none",
                            boxShadow: "0 0 28px rgba(212,175,55,0.35), 0 4px 16px rgba(0,0,0,0.5)",
                        }}
                    >
                        Shop The Collection
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </TransitionLink>
                </div>
            </div>
        </section>
    );
}
