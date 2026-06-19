"use client";

import { useRef, useEffect, useState, useCallback, type ReactElement } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Star, ShoppingBag, Check, Loader2 } from "lucide-react";
import CustomCursor from "@/lib/animations/custom-cursor";
import ScrollProgress from "@/lib/animations/scroll-progress";
import ScrollSkewProvider from "@/lib/animations/scroll-skew-provider";
import TransitionLink from "@/components/TransitionLink";
import { useCart } from "@/components/providers/CartProvider";
import type { CollectionProduct } from "./page";
import CinematicNav from "@/components/Cinematicnav";
import SiteFooter from "@/components/SiteFooter";

gsap.registerPlugin(ScrollTrigger);

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Accent palettes  (fall-through to gold for unknown slugs)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const DEFAULT_PAL = { primary: "#D4AF37", rgb: "212,175,55", glow: "rgba(212,175,55,0.25)" };
const PALETTE: Record<string, typeof DEFAULT_PAL> = {
    "imperial-smoke": { primary: "#D4AF37", rgb: "212,175,55", glow: "rgba(212,175,55,0.25)" },
    "it-boy": { primary: "#C8A96E", rgb: "200,169,110", glow: "rgba(200,169,110,0.25)" },
    "rebel-girl": { primary: "#D4697E", rgb: "212,105,126", glow: "rgba(212,105,126,0.28)" },
    "blind-date": { primary: "#A89FC8", rgb: "168,159,200", glow: "rgba(168,159,200,0.28)" },
};
const P = (slug: string) => PALETTE[slug] ?? DEFAULT_PAL;

// filter tags derived from the unified CollectionProduct.tag field
const FILTERS = ["All", "For Him", "For Her", "Unisex"];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Add-to-cart button  (handles Shopify cart mutation + loading / success state)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function AddToCartBtn({
    product, accent,
}: { product: CollectionProduct; accent: typeof DEFAULT_PAL }) {
    const { addToCart, adding } = useCart();
    const [done, setDone] = useState(false);

    const handleClick = useCallback(async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!product.shopifyVariantId) return;
        await addToCart(product.shopifyVariantId);
        setDone(true);
        setTimeout(() => setDone(false), 2000);
    }, [product.shopifyVariantId, addToCart]);

    if (!product.shopifyVariantId) return null; // local products: no Shopify variant

    return (
        <button
            onClick={handleClick}
            disabled={adding}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-pill text-[9px] font-black uppercase tracking-widest transition-all duration-300 cursor-hover"
            style={{
                background: done ? "#1a3a1a" : `rgba(${accent.rgb},0.1)`,
                border: `1px solid ${done ? "#2d6a2d" : `rgba(${accent.rgb},0.3)`}`,
                color: done ? "#4ade80" : accent.primary,
            }}
        >
            {adding ? (
                <Loader2 size={10} className="animate-spin" />
            ) : done ? (
                <><Check size={10} /> Added</>
            ) : (
                <><ShoppingBag size={10} /> Add to Cart</>
            )}
        </button>
    );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Nav
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Nav({ total }: { total: number }) {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);
    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] transition-all duration-700"
            style={{
                background: scrolled ? "rgba(7,7,10,0.94)" : "transparent",
                backdropFilter: scrolled ? "blur(28px)" : "none",
                borderBottom: scrolled ? "1px solid rgba(212,175,55,0.1)" : "none",
            }}>
            <div className="flex items-center justify-between px-6 lg:px-12" style={{ height: 68 }}>
                <TransitionLink href="/" label="Home" className="flex items-end gap-1.5 group select-none cursor-hover">
                    <span className="text-sm font-bold tracking-[0.45em] uppercase transition-opacity duration-500 group-hover:opacity-50"
                        style={{ color: "var(--text-primary)", fontFamily: "var(--font-bodoni), 'Georgia', serif" }}>senz8</span>
                    <span className="w-[5px] h-[5px] bg-amber-400 rounded-full mb-[4px] animate-pulse" />
                </TransitionLink>
                <div className="hidden md:flex items-center gap-10">
                    {([["Collections", "/collections"], ["Maison", "#"], ["Stories", "#"]] as [string, string][]).map(([name, href]) => (
                        <TransitionLink key={name} href={href} label={name}
                            className="text-[10px] uppercase tracking-[0.35em] transition-colors duration-300 cursor-hover"
                            style={{ color: name === "Collections" ? "var(--accent-gold)" : "var(--text-secondary)" }}>
                            {name}
                        </TransitionLink>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[9px] uppercase tracking-[0.4em]" style={{ color: "var(--text-secondary)" }}>
                        {total} Signatures
                    </span>
                    <TransitionLink href="/collections" label="Shop All"
                        className="hidden md:flex items-center gap-2 px-5 py-2 rounded-pill text-[10px] font-bold uppercase tracking-widest cursor-hover transition-all duration-300"
                        style={{ border: "1px solid rgba(212,175,55,0.35)", color: "var(--accent-gold)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(212,175,55,0.08)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                        Shop All <ArrowRight size={11} />
                    </TransitionLink>
                </div>
            </div>
        </nav>
    );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Page header
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function PageHeader({ total }: { total: number }) {
    const headRef = useRef<HTMLDivElement>(null);
    const metaRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.fromTo(headRef.current?.querySelectorAll(".hw") ?? [],
            { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.07, duration: 1.1 }, 0.25)
            .fromTo(metaRef.current?.children ?? [],
                { opacity: 0, y: 12 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.8 }, 0.75);
    }, []);
    return (
        <div className="relative pt-28 pb-10 lg:pt-36 lg:pb-14 px-6 lg:px-12 overflow-hidden"
            style={{ background: "var(--bg-primary)", borderBottom: "1px solid rgba(212,175,55,0.07)" }}>
            <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.25), transparent)" }} />
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 70% 60% at 50% -10%, rgba(212,175,55,0.04) 0%, transparent 70%)" }} />
            <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <span className="text-[8px] uppercase tracking-[0.7em]" style={{ color: "var(--accent-gold)" }}>The Collection</span>
                            <div style={{ width: 36, height: 1, background: "rgba(212,175,55,0.35)" }} />
                            <span className="text-[8px] uppercase tracking-[0.5em]" style={{ color: "var(--text-secondary)" }}>Extrait de Parfum</span>
                        </div>
                        <div ref={headRef}>
                            {["The", "Collection."].map((w, i) => (
                                <div key={i} style={{ overflow: "hidden" }}>
                                    <span className="hw block font-black uppercase"
                                        style={{ fontSize: "clamp(42px, 7vw, 108px)", letterSpacing: "-0.045em", lineHeight: 0.88, color: i === 1 ? "var(--accent-gold)" : "var(--text-primary)" }}>
                                        {w}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div ref={metaRef} className="flex flex-row lg:flex-col items-center lg:items-end gap-4">
                        <div className="flex items-baseline gap-2">
                            <span className="font-black" style={{ fontSize: 44, color: "rgba(212,175,55,0.13)", letterSpacing: "-0.05em", lineHeight: 1 }}>
                                {String(total).padStart(2, "0")}
                            </span>
                            <div>
                                <p className="text-[8px] uppercase tracking-[0.4em]" style={{ color: "var(--text-secondary)" }}>Signatures</p>
                                <p className="text-[8px] uppercase tracking-[0.4em]" style={{ color: "var(--text-secondary)" }}>in House</p>
                            </div>
                        </div>
                        <p className="text-sm max-w-xs lg:text-right leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                            Wear your identity before you speak a word.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Filter bar + Marquee
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function FilterBar({ active, onChange, total }: { active: string; onChange: (f: string) => void; total: number }) {
    return (
        <div className="sticky top-[68px] z-[90] px-6 lg:px-12 py-3.5 flex items-center justify-between gap-4 flex-wrap"
            style={{ background: "rgba(7,7,10,0.9)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(212,175,55,0.07)" }}>
            <div className="flex items-center gap-2 flex-wrap">
                {FILTERS.map((f) => (
                    <button key={f} onClick={() => onChange(f)}
                        className="px-4 py-1.5 rounded-pill text-[9px] font-bold uppercase tracking-widest cursor-hover transition-all duration-300"
                        style={{
                            background: active === f ? "var(--accent-gold)" : "rgba(255,255,255,0.03)",
                            color: active === f ? "#0A0A0A" : "var(--text-secondary)",
                            border: `1px solid ${active === f ? "var(--accent-gold)" : "rgba(255,255,255,0.08)"}`,
                        }}>{f}
                    </button>
                ))}
            </div>
            <span className="text-[9px] uppercase tracking-[0.4em] hidden sm:block" style={{ color: "var(--text-secondary)" }}>
                {total} result{total !== 1 ? "s" : ""}
            </span>
        </div>
    );
}

function Marquee({ items }: { items: string[] }) {
    const rowRef = useRef<HTMLDivElement>(null);
    const tw = useRef<gsap.core.Tween | null>(null);
    useEffect(() => {
        tw.current = gsap.to(rowRef.current, { xPercent: -50, duration: 26, repeat: -1, ease: "linear" });
        let last = window.scrollY, t: ReturnType<typeof setTimeout>;
        const fn = () => {
            const spd = gsap.utils.clamp(0.6, 5, 1 + Math.abs(window.scrollY - last) * 0.08);
            tw.current?.timeScale(spd); last = window.scrollY;
            clearTimeout(t); t = setTimeout(() => {
                gsap.to({ ts: spd }, {
                    ts: 1, duration: 0.9, ease: "power2.out",
                    onUpdate: function () { tw.current?.timeScale(gsap.getProperty(this.targets()[0], "ts") as number || 1); }
                });
            }, 150);
        };
        window.addEventListener("scroll", fn, { passive: true });
        return () => { window.removeEventListener("scroll", fn); clearTimeout(t); tw.current?.kill(); };
    }, []);
    const row = items.map((n, i) => (
        <span key={i} className="flex items-center gap-5 lg:gap-9 shrink-0">
            <span className="text-display-marquee uppercase whitespace-nowrap scroll-skew" style={{ color: "rgba(245,245,245,0.05)" }}>{n}</span>
            <span style={{ color: "rgba(212,175,55,0.1)", fontSize: 14 }}>â—†</span>
        </span>
    ));
    return (
        <div className="overflow-hidden py-5" style={{ background: "#060609", borderTop: "1px solid rgba(212,175,55,0.05)", borderBottom: "1px solid rgba(212,175,55,0.05)" }}>
            <div ref={rowRef} className="inline-flex items-center gap-5 lg:gap-9" style={{ willChange: "transform" }}>{row}{row}</div>
        </div>
    );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Product card  â€” whole card navigates; only Add to Cart stops propagation
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ProductCard({ product, index }: { product: CollectionProduct; index: number }) {
    const p = P(product.slug);
    const cardRef = useRef<HTMLDivElement>(null);
    const bottleRef = useRef<HTMLImageElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const shineRef = useRef<HTMLDivElement>(null);
    const [hov, setHov] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(cardRef.current,
                { opacity: 0, y: 48, scale: 0.95 },
                {
                    opacity: 1, y: 0, scale: 1, duration: 0.95, ease: "expo.out",
                    delay: (index % 3) * 0.08,
                    scrollTrigger: { trigger: cardRef.current, start: "top 90%", toggleActions: "play none none none" }
                });
        });
        return () => ctx.revert();
    }, [index]);

    const onEnter = () => {
        setHov(true);
        gsap.to(bottleRef.current, { y: -10, scale: 1.05, duration: 0.6, ease: "power3.out" });
        gsap.to(glowRef.current, { opacity: 1, scale: 1.25, duration: 0.5 });
        gsap.fromTo(shineRef.current,
            { x: "-110%", opacity: 0 },
            { x: "110%", opacity: 0, keyframes: { opacity: [0, 0.3, 0.3, 0] }, duration: 0.65, ease: "power2.inOut" });
    };
    const onLeave = () => {
        setHov(false);
        gsap.to(bottleRef.current, { y: 0, scale: 1, duration: 0.5, ease: "power2.out" });
        gsap.to(glowRef.current, { opacity: 0, scale: 1, duration: 0.45 });
    };

    return (
        <div ref={cardRef} style={{ opacity: 0 }}>
            {/* Entire card is a link â€” AddToCartBtn stops propagation internally */}
            <TransitionLink href={product.href} label={product.name} className="block cursor-hover">
                <div
                    onMouseEnter={onEnter}
                    onMouseLeave={onLeave}
                    className="relative flex flex-col overflow-hidden"
                    style={{
                        background: "linear-gradient(160deg,#141419 0%,#0f0f14 100%)",
                        border: `1px solid ${hov ? p.primary + "40" : "rgba(255,255,255,0.07)"}`,
                        borderRadius: 20,
                        transition: "border-color 0.45s ease",
                    }}
                >
                    {/* Accent top edge */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] z-10 pointer-events-none transition-opacity duration-500"
                        style={{ background: `linear-gradient(90deg,transparent,${p.primary},transparent)`, opacity: hov ? 0.65 : 0.12 }} />

                    {/* â”€â”€ IMAGE ZONE â”€â”€ */}
                    <div
                        className="relative overflow-hidden flex items-center justify-center"
                        style={{ height: 280, background: `radial-gradient(ellipse 80% 70% at 50% 60%, rgba(${p.rgb},0.07) 0%, transparent 70%)` }}
                    >
                        {/* tag â€” top-left */}
                        <span className="absolute top-4 left-4 z-20 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.28em]"
                            style={{ background: `rgba(${p.rgb},0.1)`, border: `1px solid rgba(${p.rgb},0.28)`, color: p.primary, borderRadius: 6 }}>
                            {product.tag}
                        </span>

                        {/* glow orb */}
                        <div ref={glowRef} className="absolute pointer-events-none"
                            style={{ width: 190, height: 190, background: `radial-gradient(circle,${p.glow} 0%,transparent 65%)`, opacity: 0, willChange: "transform,opacity" }} />

                        {/* shine sweep */}
                        <div ref={shineRef} className="absolute inset-0 pointer-events-none z-20"
                            style={{ background: `linear-gradient(105deg,transparent 30%,rgba(${p.rgb},0.38) 50%,transparent 70%)`, opacity: 0 }} />

                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img ref={bottleRef} src={product.image} alt={product.name}
                            className="relative z-10 object-contain"
                            style={{
                                height: 230, width: "auto",
                                filter: `drop-shadow(0 24px 48px rgba(0,0,0,0.8)) drop-shadow(0 0 28px ${p.glow})`,
                                willChange: "transform"
                            }} />

                        {/* fade to card body */}
                        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-10"
                            style={{ background: "linear-gradient(to bottom,transparent,#0f0f14)" }} />
                    </div>

                    {/* â”€â”€ INFO ZONE â”€â”€ */}
                    <div className="flex flex-col px-5 pt-4 pb-5 gap-3">

                        {/* divider */}
                        <div style={{ height: 1, background: `linear-gradient(90deg,rgba(${p.rgb},0.2),rgba(255,255,255,0.04),transparent)` }} />

                        {/* name + subtitle */}
                        <div>
                            <h3 className="font-black uppercase leading-none mb-0.5"
                                style={{ fontSize: "clamp(16px,1.9vw,21px)", letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
                                {product.name}
                            </h3>
                            <p className="text-[8px] uppercase tracking-[0.28em]" style={{ color: "var(--text-secondary)" }}>
                                {product.subtitle || "Extrait de Parfum"}
                            </p>
                        </div>

                        {/* note pills */}
                        {(product.note0 || product.note2) && (
                            <div className="flex flex-wrap gap-1.5">
                                {[product.note0, product.note2].filter(Boolean).map((n) => (
                                    <span key={n} className="px-2 py-0.5 text-[7px] uppercase tracking-[0.18em] font-semibold"
                                        style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 999, color: "rgba(245,245,245,0.35)" }}>
                                        {n}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* stats + rating */}
                        <div className="flex items-center gap-4">
                            <div>
                                <p className="font-black leading-none" style={{ fontSize: 12, color: p.primary, letterSpacing: "-0.03em" }}>{product.stat0.number}</p>
                                <p className="text-[6.5px] uppercase tracking-[0.14em] mt-0.5" style={{ color: "var(--text-secondary)" }}>{product.stat0.label}</p>
                            </div>
                            <div>
                                <p className="font-black leading-none" style={{ fontSize: 12, color: p.primary, letterSpacing: "-0.03em" }}>{product.stat1.number}</p>
                                <p className="text-[6.5px] uppercase tracking-[0.14em] mt-0.5" style={{ color: "var(--text-secondary)" }}>{product.stat1.label}</p>
                            </div>
                            {product.rating && (
                                <div className="flex items-center gap-1 ml-auto">
                                    <Star size={8} fill={p.primary} stroke={p.primary} />
                                    <span className="text-[9px] font-bold" style={{ color: "var(--text-primary)" }}>{product.rating}</span>
                                    {product.reviewCount && (
                                        <span className="text-[8px]" style={{ color: "rgba(245,245,245,0.28)" }}>({product.reviewCount})</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* â”€â”€ PRICE + CTAs row â”€â”€ */}
                        <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />
                        <div className="flex items-center justify-between gap-3">
                            {/* Price */}
                            <div>
                                <p className="font-black leading-none" style={{ fontSize: 18, color: p.primary, letterSpacing: "-0.04em" }}>
                                    {product.price}
                                </p>
                                <p className="text-[7px] uppercase tracking-[0.12em] mt-0.5" style={{ color: "var(--text-secondary)" }}>
                                    {product.priceUnit}
                                </p>
                            </div>

                            {/* Discover badge â€” visual only, navigation handled by outer link */}
                            <div
                                className="flex items-center gap-1.5 px-4 py-2 rounded-pill text-[8px] font-black uppercase tracking-widest transition-all duration-300"
                                style={{
                                    background: hov ? p.primary : "transparent",
                                    color: hov ? "#0A0A0A" : p.primary,
                                    border: `1px solid ${hov ? p.primary : `rgba(${p.rgb},0.3)`}`,
                                    whiteSpace: "nowrap",
                                }}>
                                Discover <ArrowRight size={9} />
                            </div>
                        </div>

                        {/* Add to Cart â€” stops click propagation so card link doesn't fire */}
                        {product.shopifyVariantId && (
                            <AddToCartBtn product={product} accent={p} />
                        )}
                    </div>
                </div>
            </TransitionLink>
        </div>
    );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Featured card (wide 2-col)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function FeaturedCard({ product, index }: { product: CollectionProduct; index: number }) {
    const p = P(product.slug);
    const cardRef = useRef<HTMLDivElement>(null);
    const bottleRef = useRef<HTMLImageElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const shineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(cardRef.current, { opacity: 0, y: 36 },
                {
                    opacity: 1, y: 0, duration: 1.1, ease: "expo.out",
                    scrollTrigger: { trigger: cardRef.current, start: "top 87%", toggleActions: "play none none none" }
                });
            gsap.fromTo(bgRef.current, { scale: 1.12 },
                {
                    scale: 1, ease: "none",
                    scrollTrigger: { trigger: cardRef.current, start: "top bottom", end: "bottom top", scrub: true }
                });
        });
        return () => ctx.revert();
    }, [index]);

    const onEnter = () => {
        gsap.to(bottleRef.current, { y: -14, scale: 1.06, duration: 0.7, ease: "power3.out" });
        gsap.fromTo(shineRef.current,
            { x: "-110%", opacity: 0 },
            { x: "110%", opacity: 0, keyframes: { opacity: [0, 0.22, 0.22, 0] }, duration: 0.9, ease: "power2.inOut" });
    };
    const onLeave = () => gsap.to(bottleRef.current, { y: 0, scale: 1, duration: 0.6, ease: "power2.out" });

    return (
        <div ref={cardRef} className="h-full" style={{ opacity: 0 }}>
            <div onMouseEnter={onEnter} onMouseLeave={onLeave}
                className="relative overflow-hidden flex flex-col h-full"
                style={{ borderRadius: 20, minHeight: 380 }}>

                {/* BG image */}
                <div ref={bgRef} className="absolute inset-0"
                    style={{
                        backgroundImage: `url(${product.image})`, backgroundSize: "cover", backgroundPosition: "center",
                        filter: "brightness(0.18) saturate(0.5)", willChange: "transform"
                    }} />
                <div className="absolute inset-0"
                    style={{ background: `linear-gradient(115deg,rgba(7,7,10,0.96) 0%,rgba(7,7,10,0.75) 50%,rgba(${p.rgb},0.05) 100%)` }} />
                <div ref={shineRef} className="absolute inset-0 pointer-events-none z-10"
                    style={{ background: `linear-gradient(105deg,transparent 28%,rgba(${p.rgb},0.3) 50%,transparent 72%)`, opacity: 0 }} />
                <div className="absolute top-0 left-0 right-0 h-[1px]"
                    style={{ background: `linear-gradient(90deg,${p.primary},transparent 60%)` }} />

                {/* Content */}
                <TransitionLink href={product.href} label={product.name}
                    className="relative z-20 flex items-center flex-1 w-full px-8 lg:px-12 py-10 gap-8 cursor-hover">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-5">
                            <span className="px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.28em]"
                                style={{ background: `rgba(${p.rgb},0.12)`, border: `1px solid rgba(${p.rgb},0.3)`, color: p.primary, borderRadius: 6 }}>
                                {product.tag}
                            </span>
                            <span className="px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.28em]"
                                style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)", color: "#D4AF37", borderRadius: 6 }}>
                                Featured
                            </span>
                        </div>
                        <h2 className="font-black uppercase mb-3"
                            style={{ fontSize: "clamp(28px,4vw,58px)", letterSpacing: "-0.04em", lineHeight: 0.9, color: "var(--text-primary)" }}>
                            {product.name}
                        </h2>
                        <p className="text-sm leading-relaxed mb-5 max-w-md line-clamp-2" style={{ color: "rgba(245,245,245,0.45)" }}>
                            {product.description}
                        </p>
                        <div className="flex items-center gap-6 mb-6">
                            {[product.stat0, product.stat1].map((s, i) => (
                                <div key={i}>
                                    <p className="font-black leading-none" style={{ fontSize: 16, color: p.primary, letterSpacing: "-0.04em" }}>{s.number}</p>
                                    <p className="text-[7px] uppercase tracking-[0.14em] mt-0.5" style={{ color: "var(--text-secondary)" }}>{s.label}</p>
                                </div>
                            ))}
                        </div>
                        {/* Price + Discover row */}
                        <div className="flex items-center gap-4">
                            <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-pill text-[9px] font-black uppercase tracking-widest"
                                style={{ background: p.primary, color: "#0A0A0A" }}>
                                Discover <ArrowRight size={11} />
                            </span>
                            <div>
                                <p className="font-black leading-none" style={{ fontSize: 16, color: `rgba(${p.rgb},0.8)`, letterSpacing: "-0.03em" }}>{product.price}</p>
                                <p className="text-[7px] uppercase tracking-[0.1em] mt-0.5" style={{ color: "var(--text-secondary)" }}>{product.priceUnit}</p>
                            </div>
                        </div>
                    </div>
                    {/* Bottle */}
                    <div className="hidden sm:flex flex-shrink-0 items-center justify-center relative">
                        <div style={{
                            position: "absolute", width: 220, height: 220,
                            background: `radial-gradient(circle,${p.glow} 0%,transparent 65%)`
                        }} />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img ref={bottleRef} src={product.image} alt={product.name}
                            className="relative z-10"
                            style={{
                                height: "clamp(170px,25vh,270px)", width: "auto",
                                filter: `drop-shadow(0 28px 60px rgba(0,0,0,0.85)) drop-shadow(0 0 32px ${p.glow})`,
                                willChange: "transform"
                            }} />
                    </div>
                </TransitionLink>

                {/* Add to Cart â€” sits below the link zone */}
                {product.shopifyVariantId && (
                    <div className="relative z-20 px-8 lg:px-12 pb-8">
                        <AddToCartBtn product={product} accent={p} />
                    </div>
                )}
            </div>
        </div>
    );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Product grid  (3 cards â†’ featured+1 â†’ repeat)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ProductGrid({ products }: { products: CollectionProduct[] }) {
    if (products.length === 0) {
        return (
            <div className="py-32 text-center">
                <p className="text-[11px] uppercase tracking-[0.5em]" style={{ color: "var(--text-secondary)" }}>
                    No products match this filter
                </p>
            </div>
        );
    }

    const rows: ReactElement[] = [];
    let i = 0, gi = 0;

    while (i < products.length) {
        const std = products.slice(i, i + 3); i += std.length;
        rows.push(
            <div key={`s${i}`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {std.map((e) => <ProductCard key={e.slug} product={e} index={gi++} />)}
            </div>
        );
        if (i < products.length) {
            const feat = products[i++];
            const side = i < products.length ? products[i++] : null;
            const fi = gi++; const si = gi++;
            rows.push(
                <div key={`f${fi}`} className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-2"><FeaturedCard product={feat} index={fi} /></div>
                    {side && <div className="md:col-span-1"><ProductCard product={side} index={si} /></div>}
                </div>
            );
        }
    }

    return <div className="flex flex-col gap-5">{rows}</div>;
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Root export
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function CollectionsClient({ products }: { products: CollectionProduct[] }) {
    const [activeFilter, setActiveFilter] = useState("All");

    useEffect(() => {
        ScrollTrigger.refresh();
        return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    }, []);

    useEffect(() => {
        const id = setTimeout(() => ScrollTrigger.refresh(), 100);
        return () => clearTimeout(id);
    }, [activeFilter]);

    const filtered = activeFilter === "All"
        ? products
        : products.filter((p) => p.tag === activeFilter);

    const marqueeItems = products.flatMap((p) => [p.name, "EXTRAIT DE PARFUM"]);

    return (
        <div className="relative" style={{ background: "var(--bg-primary)" }}>
            <CustomCursor />
            <ScrollProgress />
            <ScrollSkewProvider />
            <CinematicNav />
            <PageHeader total={products.length} />
            <Marquee items={marqueeItems} />
            <FilterBar active={activeFilter} onChange={setActiveFilter} total={filtered.length} />
            <div className="px-5 lg:px-10 py-10 lg:py-14 max-w-[1440px] mx-auto">
                <ProductGrid products={filtered} />
            </div>
            <SiteFooter />
        </div>
    );
}