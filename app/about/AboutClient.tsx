"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowLeft } from "lucide-react";
import CinematicNav from "@/components/Cinematicnav";
import SiteFooter from "@/components/SiteFooter";
import TransitionLink from "@/components/TransitionLink";
import ScrollProgress from "@/lib/animations/scroll-progress";

gsap.registerPlugin(ScrollTrigger);

// ── Data ──────────────────────────────────────────────────────────────────────
const PILLARS = [
    {
        num: "01",
        title: "Unapologetically Bold",
        body: "We don't make safe scents for safe people. Every formula is engineered to make an entrance — loud, lingering, and impossible to ignore.",
    },
    {
        num: "02",
        title: "Extrait. Always.",
        body: "35% oil concentration. No compromises, no fillers. When we say 12-hour longevity, we mean it. Your fragrance should outlast your night.",
    },
    {
        num: "03",
        title: "Gen Z Identity",
        body: "Senz8 was built for a generation that wears its personality on its sleeve — and its skin. Your scent is your signature. Own it.",
    },
    {
        num: "04",
        title: "Accessible Luxury",
        body: "Fine fragrance shouldn't require a trust fund. We deliver Maison-grade quality at a price point that's actually yours.",
    },
];

const TIMELINE = [
    { year: "2023", event: "The Idea", detail: "Three friends, one shared obsession: why did luxury fragrance feel so exclusive, so out of reach for young India?" },
    { year: "2024", event: "Born in Bangalore", detail: "Senz8 Aroma Private Limited was incorporated. Our first formulations came to life in a small studio in Domlur, Bangalore." },
    { year: "2024", event: "First Four Drops", detail: "Imperial Smoke, IT Boy, Rebel Girl, and Blind Date — four scents, four identities, one house. Extrait de Parfum, each one." },
    { year: "2025", event: "The Community Grows", detail: "Thousands of wearers later, the community defines us. Every review, every story, every tagged moment tells us we got it right." },
];

const STATS = [
    { n: "4", l: "Signature Scents" },
    { n: "35%", l: "Oil Concentration" },
    { n: "12HR+", l: "Longevity" },
    { n: "1247+", l: "Community Reviews" },
];

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const wordRefs = useRef<HTMLSpanElement[]>([]);
    const subRef = useRef<HTMLParagraphElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(glowRef.current, {
                scale: 1.4, opacity: 0.7, duration: 4,
                ease: "sine.inOut", repeat: -1, yoyo: true,
            });

            const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
            tl.fromTo(badgeRef.current,
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0, duration: 0.9 }, 0.2)
                .fromTo(wordRefs.current,
                    { yPercent: 110, opacity: 0 },
                    { yPercent: 0, opacity: 1, stagger: 0.1, duration: 1.2 }, 0.4)
                .fromTo(lineRef.current,
                    { scaleX: 0 },
                    { scaleX: 1, transformOrigin: "left", duration: 1.1 }, 0.95)
                .fromTo(subRef.current,
                    { opacity: 0, y: 16, filter: "blur(6px)" },
                    { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 }, 1.15);
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const headline = ["Our", "Story."];

    return (
        <div ref={sectionRef}
            className="relative min-h-[60vh] flex flex-col justify-end px-6 lg:px-12 pb-20 pt-36 overflow-hidden"
            style={{ background: "var(--bg-primary)" }}>

            {/* Ambient glow */}
            <div ref={glowRef} className="absolute top-1/4 left-1/2 -translate-x-1/2 pointer-events-none"
                style={{
                    width: 700, height: 700,
                    background: "radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 65%)",
                    willChange: "transform, opacity"
                }} />

            {/* Grid decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.025]"
                style={{
                    backgroundImage: "linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)",
                    backgroundSize: "80px 80px"
                }} />

            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)" }} />

            <div className="relative max-w-[900px]">
                <TransitionLink href="/" label="Home"
                    className="inline-flex items-center gap-2 mb-8 text-[9px] uppercase tracking-[0.4em] cursor-hover transition-colors duration-300"
                    style={{ color: "rgba(245,245,245,0.3)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--accent-gold)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(245,245,245,0.3)"; }}>
                    <ArrowLeft size={11} /> Back to Home
                </TransitionLink>

                <div ref={badgeRef} className="flex items-center gap-3 mb-5 opacity-0">
                    <span className="text-[8px] uppercase tracking-[0.7em] font-bold" style={{ color: "var(--accent-gold)" }}>
                        About Us
                    </span>
                    <div style={{ width: 32, height: 1, background: "rgba(212,175,55,0.4)" }} />
                    <span className="text-[8px] uppercase tracking-[0.4em]" style={{ color: "var(--text-secondary)" }}>
                        SENZ8 Aroma Private Limited
                    </span>
                </div>

                <div className="flex flex-wrap gap-x-4 mb-1">
                    {headline.map((w, i) => (
                        <div key={w} style={{ overflow: "hidden" }}>
                            <span
                                ref={el => { if (el) wordRefs.current[i] = el; }}
                                className="block font-black uppercase"
                                style={{
                                    fontFamily: "var(--font-bodoni), 'Georgia', serif",
                                    fontSize: "clamp(44px,7.5vw,110px)",
                                    letterSpacing: "-0.04em", lineHeight: 0.88,
                                    color: i === headline.length - 1 ? "var(--accent-gold)" : "var(--text-primary)",
                                }}>
                                {w}
                            </span>
                        </div>
                    ))}
                </div>

                <div ref={lineRef} className="mt-7 mb-6"
                    style={{
                        height: 1, width: "100%", maxWidth: 480,
                        background: "linear-gradient(90deg, #D4AF37, rgba(212,175,55,0.15), transparent)",
                        transformOrigin: "left"
                    }} />

                <p ref={subRef} className="text-sm max-w-lg opacity-0"
                    style={{ color: "var(--text-secondary)", lineHeight: 1.9 }}>
                    A fragrance house built for a generation that refuses to be ordinary.
                    Crafted in Bangalore. Worn everywhere.
                </p>
            </div>
        </div>
    );
}

// ── Origin Story ──────────────────────────────────────────────────────────────
function OriginStory() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(sectionRef.current?.querySelectorAll(".os-item") ?? [],
                { opacity: 0, y: 36 },
                {
                    opacity: 1, y: 0, stagger: 0.14, duration: 0.9, ease: "power2.out",
                    scrollTrigger: { trigger: sectionRef.current, start: "top 78%", toggleActions: "play none none none" }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-28 px-6 lg:px-12 overflow-hidden"
            style={{ background: "#060609", borderTop: "1px solid rgba(212,175,55,0.06)" }}>

            <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 60% 40% at 80% 50%, rgba(212,175,55,0.03) 0%, transparent 70%)" }} />

            <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                {/* Left — pull quote */}
                <div className="os-item opacity-0">
                    <p className="text-[8px] uppercase tracking-[0.6em] font-bold mb-6"
                        style={{ color: "var(--accent-gold)" }}>Est. 2024 · Bangalore</p>
                    <blockquote className="font-black uppercase"
                        style={{
                            fontFamily: "var(--font-bodoni), 'Georgia', serif",
                            fontSize: "clamp(30px,4vw,60px)",
                            letterSpacing: "-0.04em",
                            lineHeight: 0.92,
                            color: "var(--text-primary)"
                        }}>
                        "Wear Your<br />
                        <span style={{ color: "var(--accent-gold)" }}>Identity."</span>
                    </blockquote>
                    <div className="mt-8" style={{ height: 1, width: 200, background: "linear-gradient(90deg, #D4AF37, transparent)" }} />
                    <p className="mt-6 text-[9px] uppercase tracking-[0.4em]"
                        style={{ color: "rgba(212,175,55,0.45)" }}>
                        — The SENZ8 Manifesto
                    </p>
                </div>

                {/* Right — story paragraphs */}
                <div className="os-item opacity-0 flex flex-col gap-6">
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)", lineHeight: 1.95 }}>
                        Senz8 Aroma Private Limited  started with a question: why does luxury fragrance feel like it belongs to someone else?
                        Three fragrance obsessives in Bangalore decided the answer was simple — it shouldn't.
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)", lineHeight: 1.95 }}>
                        We built Senz8 Aroma Private Limited to bridge the gap between Maison-grade quality and
                        real, accessible pricing. No watered-down Eau de Toilettes. No compromise on longevity.
                        Every fragrance in our line is an Extrait de Parfum — 35% oil concentration —
                        because we believe your scent should last as long as your ambition.
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)", lineHeight: 1.95 }}>
                        We're not a heritage house. We're not chasing nostalgia. We're a generation that
                        knows exactly who it is — and we crafted four scents to prove it.
                    </p>
                </div>
            </div>
        </section>
    );
}

// ── Stats Bar ─────────────────────────────────────────────────────────────────
function StatsBar() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(sectionRef.current?.querySelectorAll(".stat-item") ?? [],
                { opacity: 0, y: 20 },
                {
                    opacity: 1, y: 0, stagger: 0.1, duration: 0.75, ease: "power2.out",
                    scrollTrigger: { trigger: sectionRef.current, start: "top 84%", toggleActions: "play none none none" }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-16 px-6 lg:px-12"
            style={{ background: "var(--bg-primary)", borderTop: "1px solid rgba(212,175,55,0.06)", borderBottom: "1px solid rgba(212,175,55,0.06)" }}>

            <div className="max-w-[1100px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
                {STATS.map((s) => (
                    <div key={s.n} className="stat-item opacity-0 flex flex-col items-start gap-1 lg:border-r last:border-r-0"
                        style={{ borderColor: "rgba(212,175,55,0.08)" }}>
                        <p className="font-black leading-none"
                            style={{ fontSize: "clamp(32px,4vw,58px)", color: "var(--accent-gold)", letterSpacing: "-0.04em" }}>
                            {s.n}
                        </p>
                        <p className="text-[8px] uppercase tracking-[0.3em]" style={{ color: "var(--text-secondary)" }}>
                            {s.l}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

// ── Pillars ───────────────────────────────────────────────────────────────────
function Pillars() {
    const sectionRef = useRef<HTMLElement>(null);
    const headRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(headRef.current?.querySelectorAll(".hw") ?? [],
                { yPercent: 110, opacity: 0 },
                {
                    yPercent: 0, opacity: 1, stagger: 0.08, duration: 1.1, ease: "expo.out",
                    scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" }
                }
            );
            gsap.fromTo(sectionRef.current?.querySelectorAll(".pillar-card") ?? [],
                { opacity: 0, y: 36 },
                {
                    opacity: 1, y: 0, stagger: 0.1, duration: 0.85, ease: "power2.out",
                    scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none none" }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-28 px-6 lg:px-12 overflow-hidden"
            style={{ background: "#060609" }}>

            <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 70% 50% at 20% 50%, rgba(212,175,55,0.03) 0%, transparent 65%)" }} />

            <div className="max-w-[1100px] mx-auto">
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="text-[8px] uppercase tracking-[0.7em]" style={{ color: "var(--accent-gold)" }}>
                            What We Stand For
                        </span>
                        <div style={{ width: 32, height: 1, background: "rgba(212,175,55,0.35)" }} />
                    </div>
                    <div ref={headRef}>
                        {["Our", "Pillars."].map((w, i) => (
                            <div key={w} style={{ overflow: "hidden" }}>
                                <span className="hw block font-black uppercase"
                                    style={{
                                        fontSize: "clamp(36px,5.5vw,80px)", letterSpacing: "-0.045em", lineHeight: 0.88,
                                        color: i === 1 ? "var(--accent-gold)" : "var(--text-primary)"
                                    }}>
                                    {w}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {PILLARS.map((p) => (
                        <div key={p.num} className="pillar-card opacity-0 flex flex-col gap-4 p-6 rounded-2xl"
                            style={{
                                background: "linear-gradient(160deg, #111116 0%, #0c0c11 100%)",
                                border: "1px solid rgba(255,255,255,0.06)"
                            }}>
                            {/* Top accent */}
                            <div style={{ height: 1, background: "linear-gradient(90deg, rgba(212,175,55,0.4), transparent)" }} />
                            <span className="text-[9px] font-black tracking-[0.15em]"
                                style={{ color: "rgba(212,175,55,0.4)" }}>{p.num}</span>
                            <h3 className="font-black uppercase leading-tight"
                                style={{ fontSize: "clamp(14px,1.5vw,18px)", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
                                {p.title}
                            </h3>
                            <p className="text-[12px] leading-relaxed flex-1"
                                style={{ color: "var(--text-secondary)", lineHeight: 1.85 }}>
                                {p.body}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ── Timeline ──────────────────────────────────────────────────────────────────
function Timeline() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(sectionRef.current?.querySelectorAll(".tl-head") ?? [],
                { yPercent: 110, opacity: 0 },
                {
                    yPercent: 0, opacity: 1, stagger: 0.08, duration: 1.1, ease: "expo.out",
                    scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" }
                }
            );
            gsap.fromTo(sectionRef.current?.querySelectorAll(".tl-item") ?? [],
                { opacity: 0, x: -24 },
                {
                    opacity: 1, x: 0, stagger: 0.12, duration: 0.8, ease: "power2.out",
                    scrollTrigger: { trigger: sectionRef.current, start: "top 72%", toggleActions: "play none none none" }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-28 px-6 lg:px-12"
            style={{ background: "var(--bg-primary)", borderTop: "1px solid rgba(212,175,55,0.06)" }}>

            <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 50% 60% at 90% 30%, rgba(212,175,55,0.03) 0%, transparent 65%)" }} />

            <div className="max-w-[1100px] mx-auto">
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="text-[8px] uppercase tracking-[0.7em]" style={{ color: "var(--accent-gold)" }}>
                            How We Got Here
                        </span>
                        <div style={{ width: 32, height: 1, background: "rgba(212,175,55,0.35)" }} />
                    </div>
                    <div>
                        {["The", "Journey."].map((w, i) => (
                            <div key={w} style={{ overflow: "hidden" }}>
                                <span className="tl-head block font-black uppercase"
                                    style={{
                                        fontSize: "clamp(36px,5.5vw,80px)", letterSpacing: "-0.045em", lineHeight: 0.88,
                                        color: i === 1 ? "var(--accent-gold)" : "var(--text-primary)"
                                    }}>
                                    {w}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Timeline list */}
                <div className="relative flex flex-col gap-0">
                    {/* Vertical line */}
                    <div className="absolute left-[72px] top-0 bottom-0 w-px hidden lg:block"
                        style={{ background: "linear-gradient(to bottom, rgba(212,175,55,0.25), rgba(212,175,55,0.04))" }} />

                    {TIMELINE.map((t, i) => (
                        <div key={i} className="tl-item opacity-0 flex flex-col lg:flex-row gap-4 lg:gap-12 py-8"
                            style={{ borderBottom: i < TIMELINE.length - 1 ? "1px solid rgba(212,175,55,0.06)" : "none" }}>
                            {/* Year */}
                            <div className="flex-shrink-0 w-full lg:w-[144px] flex lg:flex-col items-center lg:items-start gap-3 lg:gap-1">
                                <span className="font-black text-[10px] tracking-[0.3em] uppercase"
                                    style={{ color: "var(--accent-gold)" }}>
                                    {t.year}
                                </span>
                                {/* Dot on the line */}
                                <div className="hidden lg:block w-2.5 h-2.5 rounded-full border mt-1 ml-[66.5px]"
                                    style={{
                                        background: "var(--bg-primary)",
                                        borderColor: "rgba(212,175,55,0.5)",
                                        boxShadow: "0 0 8px rgba(212,175,55,0.2)"
                                    }} />
                            </div>
                            {/* Content */}
                            <div className="flex flex-col gap-2">
                                <h4 className="font-black uppercase"
                                    style={{ fontSize: "clamp(16px,2vw,22px)", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
                                    {t.event}
                                </h4>
                                <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.85, maxWidth: 540 }}>
                                    {t.detail}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ── Marquee Strip ─────────────────────────────────────────────────────────────
function MarqueeStrip() {
    const rowRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const tw = gsap.to(rowRef.current, { xPercent: -50, duration: 20, repeat: -1, ease: "linear" });
        return () => { tw.kill(); };
    }, []);
    const items = ["WEAR YOUR IDENTITY", "EST. 2024", "BANGALORE", "EXTRAIT DE PARFUM", "35% OIL", "GEN Z · FOR REAL"];
    const row = items.map((n, i) => (
        <span key={i} className="flex items-center gap-8 shrink-0">
            <span className="font-black uppercase tracking-tight whitespace-nowrap"
                style={{ fontSize: "clamp(20px,3vw,40px)", color: "rgba(245,245,245,0.04)" }}>{n}</span>
            <span style={{ color: "rgba(212,175,55,0.12)", fontSize: 12 }}>◆</span>
        </span>
    ));
    return (
        <div className="overflow-hidden py-6"
            style={{ background: "#050508", borderTop: "1px solid rgba(212,175,55,0.05)", borderBottom: "1px solid rgba(212,175,55,0.05)" }}>
            <div ref={rowRef} className="inline-flex items-center gap-8" style={{ willChange: "transform" }}>
                {row}{row}
            </div>
        </div>
    );
}

// ── Collection Teaser ─────────────────────────────────────────────────────────
function CollectionTeaser() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(sectionRef.current?.querySelectorAll(".ct-item") ?? [],
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0, stagger: 0.1, duration: 0.85, ease: "power2.out",
                    scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const scents = [
        { name: "IMPERIAL SMOKE", sub: "Dark · Smoky · Oriental", tag: "For Him", href: "/products/imperial-smoke", rgb: "212,175,55" },
        { name: "IT BOY", sub: "Fresh · Bold · Addictive", tag: "For Him", href: "/products/it-boy", rgb: "200,169,110" },
        { name: "REBEL GIRL", sub: "Soft · Bold · Unforgettable", tag: "For Her", href: "/products/rebel-girl", rgb: "212,105,126" },
        { name: "BLIND DATE", sub: "Fresh · Warm · Irresistible", tag: "Unisex", href: "/products/blind-date", rgb: "168,159,200" },
    ];

    return (
        <section ref={sectionRef} className="relative py-28 px-6 lg:px-12 overflow-hidden"
            style={{ background: "#060609", borderTop: "1px solid rgba(212,175,55,0.06)" }}>

            <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212,175,55,0.04) 0%, transparent 65%)" }} />

            <div className="max-w-[1100px] mx-auto">
                <div className="mb-14 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-[8px] uppercase tracking-[0.7em]" style={{ color: "var(--accent-gold)" }}>
                                Four Identities
                            </span>
                            <div style={{ width: 32, height: 1, background: "rgba(212,175,55,0.35)" }} />
                        </div>
                        <div>
                            {["The", "Collection."].map((w, i) => (
                                <div key={w} style={{ overflow: "hidden" }}>
                                    <span className="ct-item block font-black uppercase opacity-0"
                                        style={{
                                            fontSize: "clamp(36px,5.5vw,80px)", letterSpacing: "-0.045em", lineHeight: 0.88,
                                            color: i === 1 ? "var(--accent-gold)" : "var(--text-primary)"
                                        }}>
                                        {w}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <TransitionLink href="/collections" label="View All"
                        className="ct-item opacity-0 self-start lg:self-auto inline-flex items-center gap-2 px-6 py-3 rounded-pill text-[10px] font-black uppercase tracking-widest cursor-hover transition-all duration-300"
                        style={{ border: "1px solid rgba(212,175,55,0.3)", color: "var(--accent-gold)" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(212,175,55,0.08)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                        Shop All <ArrowRight size={11} />
                    </TransitionLink>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {scents.map((s) => (
                        <TransitionLink key={s.name} href={s.href} label={s.name}
                            className="ct-item opacity-0 group block rounded-2xl p-5 cursor-hover transition-all duration-300"
                            style={{
                                background: "linear-gradient(160deg,#111116 0%,#0c0c11 100%)",
                                border: "1px solid rgba(255,255,255,0.06)"
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `rgba(${s.rgb},0.25)`; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}>
                            <div style={{ height: 1, background: `linear-gradient(90deg, rgba(${s.rgb},0.5), transparent)`, marginBottom: 14 }} />
                            <p className="font-black uppercase leading-tight mb-1"
                                style={{ fontSize: "clamp(11px,1.2vw,14px)", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
                                {s.name}
                            </p>
                            <p className="text-[7px] uppercase tracking-[0.2em] mb-3"
                                style={{ color: "var(--text-secondary)" }}>
                                {s.sub}
                            </p>
                            <span className="text-[7px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full"
                                style={{ border: `1px solid rgba(${s.rgb},0.3)`, color: `rgba(${s.rgb},0.8)` }}>
                                {s.tag}
                            </span>
                        </TransitionLink>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ── CTA Banner ────────────────────────────────────────────────────────────────
function CTABanner() {
    const sectionRef = useRef<HTMLElement>(null);
    const headRef = useRef<HTMLHeadingElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(headRef.current,
                { clipPath: "inset(0 0 100% 0)", opacity: 0 },
                {
                    clipPath: "inset(0 0 0% 0)", opacity: 1, duration: 1.3, ease: "power4.out",
                    scrollTrigger: { trigger: sectionRef.current, start: "top 82%", toggleActions: "play none none none" }
                }
            );
            gsap.fromTo(ctaRef.current,
                { opacity: 0, y: 24 },
                {
                    opacity: 1, y: 0, duration: 0.9, ease: "expo.out", delay: 0.35,
                    scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-28 px-6 lg:px-12 text-center overflow-hidden"
            style={{ background: "var(--bg-primary)", borderTop: "1px solid rgba(212,175,55,0.06)" }}>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
                style={{
                    width: 700, height: 400,
                    background: "radial-gradient(ellipse at center, rgba(212,175,55,0.05) 0%, transparent 70%)"
                }} />

            <p className="text-[8px] uppercase tracking-[0.7em] mb-5" style={{ color: "var(--accent-gold)" }}>
                Find Your Signature
            </p>

            <h2
                ref={headRef}
                className="font-black uppercase mx-auto mb-8"
                style={{
                    fontFamily: "var(--font-bodoni), 'Georgia', serif",
                    fontSize: "clamp(36px,6.5vw,96px)",
                    letterSpacing: "-0.04em", lineHeight: 0.9,
                    color: "var(--text-primary)",
                    clipPath: "inset(0 0 100% 0)", opacity: 0,
                    maxWidth: 800
                }}>
                Which Identity<br />
                <span style={{ color: "var(--accent-gold)" }}>Is Yours?</span>
            </h2>

            <p className="text-sm max-w-sm mx-auto mb-10" style={{ color: "var(--text-secondary)", lineHeight: 1.85 }}>
                Four scents. Four personalities. One house.
                Discover your signature today.
            </p>

            <div ref={ctaRef} className="flex flex-wrap justify-center gap-3" style={{ opacity: 0 }}>
                <TransitionLink href="/collections" label="Shop All Scents"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-pill font-black uppercase tracking-widest text-sm cursor-hover transition-all duration-300"
                    style={{ background: "var(--accent-gold)", color: "#0A0A0A", boxShadow: "0 0 36px rgba(212,175,55,0.22)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.filter = "brightness(1.12)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = "brightness(1)"; }}>
                    Shop All Scents <ArrowRight size={13} />
                </TransitionLink>
                <TransitionLink href="/contact" label="Get in Touch"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-pill text-sm font-bold uppercase tracking-widest cursor-hover transition-all duration-300"
                    style={{ border: "1px solid rgba(212,175,55,0.3)", color: "var(--text-secondary)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.6)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.3)"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}>
                    Get in Touch
                </TransitionLink>
            </div>
        </section>
    );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function AboutClient() {
    return (
        <div className="relative min-h-screen" style={{ background: "var(--bg-primary)" }}>
            <ScrollProgress />
            <CinematicNav canAnimate={true} />
            <Hero />
            <OriginStory />
            <StatsBar />
            <Pillars />
            <MarqueeStrip />
            <Timeline />
            <CollectionTeaser />
            <CTABanner />
            <SiteFooter />
        </div>
    );
}
