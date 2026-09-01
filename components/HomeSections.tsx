"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import TransitionLink from "@/components/TransitionLink";
import HomeTestimonialsSection from "@/components/HomeTestimonialsSection";

gsap.registerPlugin(ScrollTrigger);

// ── Design tokens — shared across all home sections ───────────────────────────
// Keeping these in one place makes it trivial to keep sections in sync.
const SECTION_PX = "px-6 lg:px-12";                 // horizontal padding
const MAX_W = "max-w-[1400px] mx-auto";          // max-width container (matches testimonials)
const SECTION_PY = "py-24 lg:py-32";                 // vertical rhythm
const OVERLINE_STY = {                                  // consistent eyebrow label
    fontSize: 10, letterSpacing: "0.6em",
    textTransform: "uppercase" as const, fontWeight: 700,
    color: "var(--accent-gold)",
};
const HEADLINE_SZ = "clamp(44px,6vw,92px)";           // unified headline size
const HEADLINE_SY = {                                  // unified headline style
    letterSpacing: "-0.045em", lineHeight: 0.88,
};

// ── Overline row helper ───────────────────────────────────────────────────────
function Overline({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-3 mb-5">
            <div style={{ width: 36, height: 1, background: "rgba(212,175,55,0.4)" }} />
            <span style={OVERLINE_STY}>{label}</span>
        </div>
    );
}

// ── Marquee strip ─────────────────────────────────────────────────────────────
function MarqueeStrip() {
    const rowRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const tw = gsap.to(rowRef.current, { xPercent: -50, duration: 22, repeat: -1, ease: "linear" });
        return () => { tw.kill(); };
    }, []);
    const items = ["IMPERIAL SMOKE", "IT BOY", "REBEL GIRL", "BLIND DATE", "35% OIL", "EXTRAIT DE PARFUM", "12HR+ LONGEVITY"];
    const row = items.map((n, i) => (
        <span key={i} className="flex items-center gap-8 shrink-0">
            <span className="font-black uppercase tracking-tight whitespace-nowrap"
                style={{ fontSize: "clamp(22px,3.5vw,44px)", color: "rgba(245,245,245,0.04)" }}>{n}</span>
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

// ── Brand story ───────────────────────────────────────────────────────────────
function BrandStory() {
    const sectionRef = useRef<HTMLElement>(null);
    const headRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Headline words mask-reveal (same pattern as every other section)
            gsap.fromTo(
                headRef.current?.querySelectorAll(".bs-hw") ?? [],
                { yPercent: 110, opacity: 0 },
                {
                    yPercent: 0, opacity: 1, stagger: 0.07, duration: 1.1, ease: "expo.out",
                    scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" },
                }
            );
            // Body items fade up
            gsap.fromTo(
                sectionRef.current?.querySelectorAll(".bs-item") ?? [],
                { opacity: 0, y: 24 },
                {
                    opacity: 1, y: 0, stagger: 0.1, duration: 0.85, ease: "power2.out",
                    scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none" },
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const stats = [
        { n: "4", l: "Signature Scents" },
        { n: "35%", l: "Oil Concentration" },
        { n: "12HR+", l: "Longevity" },
        { n: "50ML", l: "Bottle Size" },
    ];

    return (
        <section
            ref={sectionRef}
            className={`relative ${SECTION_PY} ${SECTION_PX}`}
            style={{ background: "#060609", borderTop: "1px solid rgba(212,175,55,0.06)", borderBottom: "1px solid rgba(212,175,55,0.06)" }}
        >
            <div className={MAX_W}>
                <div className="flex flex-col lg:flex-row items-start lg:items-end gap-12 lg:gap-20">

                    {/* Left — headline + body */}
                    <div className="flex-1 min-w-0">
                        <Overline label="Our Philosophy" />
                        <div ref={headRef} className="mb-7">
                            {["Wear Your", "Identity."].map((line, li) => (
                                <div key={li} style={{ overflow: "hidden" }}>
                                    <span
                                        className="bs-hw block font-black uppercase"
                                        style={{
                                            ...HEADLINE_SY,
                                            fontSize: HEADLINE_SZ,
                                            color: li === 1 ? "var(--accent-gold)" : "var(--text-primary)",
                                        }}
                                    >
                                        {line}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p
                            className="bs-item text-sm lg:text-base leading-relaxed max-w-md"
                            style={{ color: "var(--text-secondary)", lineHeight: 1.9, opacity: 0 }}
                        >
                            Senz8 Aroma was built for a generation that refuses to be ordinary.
                            Every bottle is a statement. Every spray, a presence.
                            Crafted as an Extrait de Parfum — 35% oil concentration — for a scent that outlasts the moment.
                        </p>
                    </div>

                    {/* Right — stats grid */}
                    <div className="grid grid-cols-2 gap-x-12 gap-y-8 lg:gap-x-16 flex-shrink-0">
                        {stats.map((s) => (
                            <div key={s.n} className="bs-item" style={{ opacity: 0 }}>
                                <p
                                    className="font-black leading-none"
                                    style={{ fontSize: "clamp(32px,3.2vw,52px)", color: "var(--accent-gold)", letterSpacing: "-0.045em" }}
                                >
                                    {s.n}
                                </p>
                                <div style={{ width: 28, height: 1, background: "rgba(212,175,55,0.3)", margin: "6px 0" }} />
                                <p style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(245,245,245,0.5)" }}>
                                    {s.l}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ── Collection preview ────────────────────────────────────────────────────────
const PRODUCTS = [
    { name: "IMPERIAL SMOKE", sub: "Dark · Smoky · Oriental", tag: "For Him", href: "/products/imperial-smoke", img: "/images/imps-1.png", rgb: "212,175,55" },
    { name: "IT BOY", sub: "Fresh · Bold · Addictive", tag: "For Him", href: "/products/it-boy", img: "/images/it-boy-bottle.png", rgb: "200,169,110" },
    { name: "REBEL GIRL", sub: "Soft · Bold · Unforgettable", tag: "For Her", href: "/products/rebel-girl", img: "/images/rabel-girl-bottle.png", rgb: "212,105,126" },
    { name: "BLIND DATE", sub: "Fresh · Warm · Irresistible", tag: "Unisex", href: "/products/blind-date", img: "/images/blind-date-bottle.png", rgb: "168,159,200" },
];

function CollectionPreview() {
    const sectionRef = useRef<HTMLElement>(null);
    const headRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                headRef.current?.querySelectorAll(".hw") ?? [],
                { yPercent: 110, opacity: 0 },
                {
                    yPercent: 0, opacity: 1, stagger: 0.07, duration: 1.1, ease: "expo.out",
                    scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" },
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className={`relative ${SECTION_PY} ${SECTION_PX} overflow-hidden`}
            style={{ background: "var(--bg-primary)" }}
        >
            {/* Subtle radial accent */}
            <div className="absolute inset-0 pointer-events-none" style={{
                background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212,175,55,0.04) 0%, transparent 70%)",
            }} />

            <div className={`relative ${MAX_W}`}>
                {/* Header row */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 lg:mb-16">
                    <div>
                        <Overline label="The Collection" />
                        <div ref={headRef}>
                            {["Our", "Signatures."].map((w, i) => (
                                <div key={w} style={{ overflow: "hidden" }}>
                                    <span
                                        className="hw block font-black uppercase"
                                        style={{
                                            ...HEADLINE_SY,
                                            fontSize: HEADLINE_SZ,
                                            color: i === 1 ? "var(--accent-gold)" : "var(--text-primary)",
                                        }}
                                    >
                                        {w}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* View All — aligned to bottom of headline */}
                    <TransitionLink
                        href="/collections"
                        label="View All"
                        className="self-start lg:self-auto inline-flex items-center gap-2 px-6 py-3 rounded-pill text-[10px] font-black uppercase tracking-widest transition-all duration-300"
                        style={{ border: "1px solid rgba(212,175,55,0.3)", color: "var(--accent-gold)", letterSpacing: "0.25em" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(212,175,55,0.08)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                        View All <ArrowRight size={11} />
                    </TransitionLink>
                </div>

                {/* Product grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                    {PRODUCTS.map((p, i) => (
                        <ProductPreviewCard key={p.name} product={p} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function ProductPreviewCard({ product: p, index }: { product: typeof PRODUCTS[number]; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                cardRef.current,
                { opacity: 0, y: 40, scale: 0.95 },
                {
                    opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "expo.out", delay: index * 0.09,
                    scrollTrigger: { trigger: cardRef.current, start: "top 90%", toggleActions: "play none none none" },
                }
            );
        });
        return () => ctx.revert();
    }, [index]);

    const onEnter = () => {
        gsap.to(imgRef.current, { y: -8, scale: 1.06, duration: 0.55, ease: "power3.out" });
        gsap.to(glowRef.current, { opacity: 1, scale: 1.25, duration: 0.45 });
    };
    const onLeave = () => {
        gsap.to(imgRef.current, { y: 0, scale: 1, duration: 0.5, ease: "power2.out" });
        gsap.to(glowRef.current, { opacity: 0, scale: 1, duration: 0.4 });
    };

    return (
        <div ref={cardRef} style={{ opacity: 0 }}>
            <TransitionLink href={p.href} label={p.name} className="block">
                <div
                    onMouseEnter={onEnter}
                    onMouseLeave={onLeave}
                    className="relative flex flex-col overflow-hidden"
                    style={{
                        borderRadius: 18,
                        background: "linear-gradient(160deg,#141419 0%,#0f0f14 100%)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        transition: "border-color 0.3s",
                    }}
                >
                    {/* Top accent */}
                    <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                        style={{ background: `linear-gradient(90deg,transparent,rgba(${p.rgb},0.5),transparent)` }} />

                    {/* Image area */}
                    <div
                        className="relative flex items-center justify-center overflow-hidden"
                        style={{ height: 200, background: `radial-gradient(ellipse 80% 70% at 50% 60%, rgba(${p.rgb},0.07) 0%, transparent 70%)` }}
                    >
                        <div ref={glowRef} className="absolute pointer-events-none"
                            style={{ width: 160, height: 160, background: `radial-gradient(circle,rgba(${p.rgb},0.2) 0%,transparent 65%)`, opacity: 0 }} />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            ref={imgRef}
                            src={p.img}
                            alt={p.name}
                            className="relative z-10 object-contain"
                            style={{
                                height: 165, width: "auto",
                                filter: `drop-shadow(0 16px 32px rgba(0,0,0,0.85)) drop-shadow(0 0 20px rgba(${p.rgb},0.15))`,
                                willChange: "transform",
                            }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
                            style={{ background: "linear-gradient(to bottom,transparent,#0f0f14)" }} />
                    </div>

                    {/* Info */}
                    <div className="px-4 py-4">
                        <div style={{ height: 1, background: `linear-gradient(90deg,rgba(${p.rgb},0.22),transparent)`, marginBottom: 10 }} />
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                            <p
                                className="font-black uppercase leading-tight"
                                style={{ fontSize: "clamp(11px,2.5vw,14px)", letterSpacing: "-0.02em", color: "var(--text-primary)" }}
                            >
                                {p.name}
                            </p>
                            <span
                                className="text-[8px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-full flex-shrink-0 leading-tight"
                                style={{ border: `1px solid rgba(${p.rgb},0.4)`, color: `rgba(${p.rgb},0.95)` }}
                            >
                                {p.tag}
                            </span>
                        </div>
                        <p className="text-[9px] uppercase tracking-[0.15em]" style={{ color: "rgba(245,245,245,0.45)" }}>
                            {p.sub}
                        </p>
                    </div>
                </div>
            </TransitionLink>
        </div>
    );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function HomeSections() {
    return (
        <>
            <MarqueeStrip />
            <BrandStory />
            <CollectionPreview />
            <HomeTestimonialsSection />
        </>
    );
}
