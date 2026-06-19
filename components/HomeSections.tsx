"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import TransitionLink from "@/components/TransitionLink";
import HomeTestimonialsSection from "@/components/HomeTestimonialsSection";

gsap.registerPlugin(ScrollTrigger);

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
        <div className="overflow-hidden py-6" style={{ background: "#050508", borderTop: "1px solid rgba(212,175,55,0.05)", borderBottom: "1px solid rgba(212,175,55,0.05)" }}>
            <div ref={rowRef} className="inline-flex items-center gap-8" style={{ willChange: "transform" }}>{row}{row}</div>
        </div>
    );
}

// ── Collection preview ─────────────────────────────────────────────────────────
const PRODUCTS = [
    { name: "IMPERIAL SMOKE", sub: "Dark · Smoky · Oriental", tag: "For Him", href: "/products/imperial-smoke", img: "/images/imps-1.png", rgb: "212,175,55" },
    { name: "IT BOY", sub: "Fresh · Bold · Addictive", tag: "For Him", href: "/products/it-boy", img: "/images/itboy-1.png", rgb: "200,169,110" },
    { name: "REBEL GIRL", sub: "Soft · Bold · Unforgettable", tag: "For Her", href: "/products/rebel-girl", img: "/images/rebel-1.png", rgb: "212,105,126" },
    { name: "BLIND DATE", sub: "Fresh · Warm · Irresistible", tag: "Unisex", href: "/products/blind-date", img: "/images/blind-1.png", rgb: "168,159,200" },
];

function CollectionPreview() {
    const sectionRef = useRef<HTMLElement>(null);
    const headRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(headRef.current?.querySelectorAll(".hw") ?? [],
                { yPercent: 110, opacity: 0 },
                {
                    yPercent: 0, opacity: 1, stagger: 0.07, duration: 1.1, ease: "expo.out",
                    scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-24 lg:py-36 px-6 lg:px-12 overflow-hidden"
            style={{ background: "var(--bg-primary)" }}>

            {/* Background accent */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212,175,55,0.04) 0%, transparent 70%)" }} />

            {/* Header */}
            <div className="mb-14 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-[8px] uppercase tracking-[0.7em]" style={{ color: "var(--accent-gold)" }}>The Collection</span>
                        <div style={{ width: 32, height: 1, background: "rgba(212,175,55,0.35)" }} />
                    </div>
                    <div ref={headRef}>
                        {["Our", "Signatures."].map((w, i) => (
                            <div key={w} style={{ overflow: "hidden" }}>
                                <span className="hw block font-black uppercase"
                                    style={{
                                        fontSize: "clamp(40px,6.5vw,96px)", letterSpacing: "-0.045em", lineHeight: 0.88,
                                        color: i === 1 ? "var(--accent-gold)" : "var(--text-primary)"
                                    }}>
                                    {w}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <TransitionLink href="/collections" label="View All"
                    className="self-start lg:self-auto inline-flex items-center gap-2 px-6 py-3 rounded-pill text-[10px] font-black uppercase tracking-widest cursor-hover transition-all duration-300"
                    style={{ border: "1px solid rgba(212,175,55,0.3)", color: "var(--accent-gold)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(212,175,55,0.08)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                    View All <ArrowRight size={11} />
                </TransitionLink>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                {PRODUCTS.map((p, i) => (
                    <ProductPreviewCard key={p.name} product={p} index={i} />
                ))}
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
            gsap.fromTo(cardRef.current,
                { opacity: 0, y: 40, scale: 0.95 },
                {
                    opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "expo.out", delay: index * 0.09,
                    scrollTrigger: { trigger: cardRef.current, start: "top 90%", toggleActions: "play none none none" }
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
            <TransitionLink href={p.href} label={p.name} className="block cursor-hover">
                <div onMouseEnter={onEnter} onMouseLeave={onLeave}
                    className="relative flex flex-col overflow-hidden"
                    style={{ borderRadius: 18, background: "linear-gradient(160deg,#141419 0%,#0f0f14 100%)", border: "1px solid rgba(255,255,255,0.07)" }}>

                    {/* Top accent */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
                        style={{ background: `linear-gradient(90deg,transparent,rgba(${p.rgb},0.5),transparent)` }} />

                    {/* Image */}
                    <div className="relative flex items-center justify-center overflow-hidden"
                        style={{ height: 200, background: `radial-gradient(ellipse 80% 70% at 50% 60%, rgba(${p.rgb},0.07) 0%, transparent 70%)` }}>
                        <div ref={glowRef} className="absolute pointer-events-none"
                            style={{ width: 160, height: 160, background: `radial-gradient(circle,rgba(${p.rgb},0.2) 0%,transparent 65%)`, opacity: 0 }} />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img ref={imgRef} src={p.img} alt={p.name}
                            className="relative z-10 object-contain"
                            style={{
                                height: 165, width: "auto",
                                filter: `drop-shadow(0 16px 32px rgba(0,0,0,0.85)) drop-shadow(0 0 20px rgba(${p.rgb},0.15))`,
                                willChange: "transform"
                            }} />
                        <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
                            style={{ background: "linear-gradient(to bottom,transparent,#0f0f14)" }} />
                    </div>

                    {/* Info */}
                    <div className="px-4 py-4 flex flex-col gap-1.5">
                        <div style={{ height: 1, background: `linear-gradient(90deg,rgba(${p.rgb},0.2),transparent)` }} />
                        <div className="flex items-center justify-between mt-1.5">
                            <div>
                                <p className="font-black uppercase leading-none"
                                    style={{ fontSize: "clamp(12px,1.5vw,15px)", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
                                    {p.name}
                                </p>
                                <p className="text-[7px] uppercase tracking-[0.2em] mt-0.5" style={{ color: "var(--text-secondary)" }}>
                                    {p.sub}
                                </p>
                            </div>
                            <span className="text-[7px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full"
                                style={{ border: `1px solid rgba(${p.rgb},0.3)`, color: `rgba(${p.rgb},0.8)` }}>
                                {p.tag}
                            </span>
                        </div>
                    </div>
                </div>
            </TransitionLink>
        </div>
    );
}

// ── Brand story strip ─────────────────────────────────────────────────────────
function BrandStory() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(sectionRef.current?.querySelectorAll(".bs-item") ?? [],
                { opacity: 0, y: 28 },
                {
                    opacity: 1, y: 0, stagger: 0.12, duration: 0.85, ease: "power2.out",
                    scrollTrigger: { trigger: sectionRef.current, start: "top 82%", toggleActions: "play none none none" }
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
        <section ref={sectionRef} className="relative py-20 px-6 lg:px-12"
            style={{ background: "#060609", borderTop: "1px solid rgba(212,175,55,0.06)", borderBottom: "1px solid rgba(212,175,55,0.06)" }}>

            <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row items-start lg:items-center gap-14">

                {/* Text */}
                <div className="bs-item flex-1 opacity-0">
                    <span className="text-[8px] uppercase tracking-[0.6em] font-bold block mb-4" style={{ color: "var(--accent-gold)" }}>
                        Our Philosophy
                    </span>
                    <h2 className="font-black uppercase mb-5"
                        style={{ fontSize: "clamp(28px,3.5vw,52px)", letterSpacing: "-0.04em", lineHeight: 0.9, color: "var(--text-primary)" }}>
                        Wear Your<br />Identity.
                    </h2>
                    <p className="text-sm leading-relaxed max-w-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.9 }}>
                        SENZ8 is built for a generation that refuses to be ordinary.
                        Every bottle is a statement. Every spray is a presence.
                        Extrait de Parfum — 35% oil concentration for a scent that outlasts the moment.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-6 lg:gap-8 flex-shrink-0">
                    {stats.map((s) => (
                        <div key={s.n} className="bs-item opacity-0">
                            <p className="font-black leading-none" style={{ fontSize: "clamp(28px,3vw,48px)", color: "var(--accent-gold)", letterSpacing: "-0.04em" }}>
                                {s.n}
                            </p>
                            <p className="text-[8px] uppercase tracking-[0.3em] mt-1" style={{ color: "var(--text-secondary)" }}>
                                {s.l}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function HomeSections() {
    return (
        <>
            <MarqueeStrip />
            <CollectionPreview />
            <HomeTestimonialsSection />
            <BrandStory />
        </>
    );
}
