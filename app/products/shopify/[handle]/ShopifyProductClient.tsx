"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ArrowRight, Star, ShoppingBag, Zap, Check, Loader2 } from "lucide-react";
import CustomCursor from "@/lib/animations/custom-cursor";
import ScrollProgress from "@/lib/animations/scroll-progress";
import TransitionLink from "@/components/TransitionLink";
import { useCart } from "@/components/providers/CartProvider";
import type { ShopifyProduct, ShopifyProductVariant } from "@/lib/shopify/types";
import SiteFooter from "@/components/SiteFooter";

gsap.registerPlugin(ScrollTrigger);

interface Props {
    product: ShopifyProduct;
    defaultVariantId: string;
    price: string;
    longevity: string;
    concentration: string;
    topNotes: string;
    heartNotes: string;
    baseNotes: string;
}

// ─── Pill for note labels ─────────────────────────────────────────────────────
function NotePill({ label, tier }: { label: string; tier: "top" | "heart" | "base" }) {
    const colours = {
        top: { bg: "rgba(212,175,55,0.1)", border: "rgba(212,175,55,0.3)", text: "#D4AF37" },
        heart: { bg: "rgba(154,154,154,0.08)", border: "rgba(154,154,154,0.25)", text: "#9A9A9A" },
        base: { bg: "rgba(245,245,245,0.05)", border: "rgba(245,245,245,0.15)", text: "rgba(245,245,245,0.5)" },
    }[tier];
    return (
        <span className="inline-block px-3 py-1 text-[8px] font-bold uppercase tracking-[0.3em] rounded-pill"
            style={{ background: colours.bg, border: `1px solid ${colours.border}`, color: colours.text }}>
            {label}
        </span>
    );
}

export default function ShopifyProductClient({
    product, defaultVariantId, price,
    longevity, concentration, topNotes, heartNotes, baseNotes,
}: Props) {
    const { addToCart, adding, checkoutUrl } = useCart();
    const [selectedVariant, setSelectedVariant] = useState<ShopifyProductVariant>(
        product.variants.nodes[0]
    );
    const [qty, setQty] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [activeImg, setActiveImg] = useState(0);

    const heroRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    const images = product.images.nodes;
    const allNoteGroups = [
        { tier: "top" as const, title: "Top Notes", labels: topNotes.split(",").map(s => s.trim()).filter(Boolean) },
        { tier: "heart" as const, title: "Heart Notes", labels: heartNotes.split(",").map(s => s.trim()).filter(Boolean) },
        { tier: "base" as const, title: "Base Notes", labels: baseNotes.split(",").map(s => s.trim()).filter(Boolean) },
    ];
    const notes = allNoteGroups.filter(n => n.labels.length > 0);

    // ── Entry animation ───────────────────────────────────────────────────────
    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.fromTo(imgRef.current, { opacity: 0, scale: 0.8, filter: "blur(20px)" },
            { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.4 }, 0.2)
            .fromTo(titleRef.current?.querySelectorAll(".tw") ?? [],
                { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.08, duration: 1.1 }, 0.45)
            .fromTo(descRef.current, { opacity: 0, y: 18, filter: "blur(6px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 }, 0.85)
            .fromTo(ctaRef.current, { opacity: 0, y: 16 },
                { opacity: 1, y: 0, duration: 0.8 }, 1.05);

        // floating glow
        gsap.to(glowRef.current, { scale: 1.4, opacity: 0.7, duration: 2.8, ease: "sine.inOut", repeat: -1, yoyo: true });
        return () => { tl.kill(); };
    }, []);

    // ── Add to cart ───────────────────────────────────────────────────────────
    const handleAddToCart = useCallback(async () => {
        await addToCart(selectedVariant.id, qty);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2500);
    }, [addToCart, selectedVariant.id, qty]);

    const handleBuyNow = useCallback(async () => {
        await addToCart(selectedVariant.id, qty);
        // Redirect to Shopify checkout after cart is created
        if (checkoutUrl) {
            window.location.href = checkoutUrl;
        }
    }, [addToCart, selectedVariant.id, qty, checkoutUrl]);

    return (
        <div className="relative min-h-screen" style={{ background: "var(--bg-primary)" }}>
            <CustomCursor />
            <ScrollProgress />

            {/* ── Nav ─────────────────────────────────────────────────────────── */}
            <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 lg:px-12"
                style={{ height: 68, background: "rgba(7,7,10,0.85)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(212,175,55,0.08)" }}>
                <TransitionLink href="/collections" label="The Collection"
                    className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] cursor-hover transition-colors duration-300"
                    style={{ color: "var(--text-secondary)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}>
                    <ArrowLeft size={13} /> Collection
                </TransitionLink>
                <TransitionLink href="/" label="Home" className="flex items-end gap-1.5 group select-none cursor-hover">
                    <span className="text-sm font-bold tracking-[0.45em] uppercase transition-opacity duration-500 group-hover:opacity-50"
                        style={{ color: "var(--text-primary)", fontFamily: "'Bodoni Moda','Georgia',serif" }}>senz8</span>
                    <span className="w-[5px] h-[5px] bg-amber-400 rounded-full mb-[4px] animate-pulse" />
                </TransitionLink>
                <div className="w-32" /> {/* balance */}
            </nav>

            {/* ── Hero ────────────────────────────────────────────────────────── */}
            <div ref={heroRef} className="flex flex-col lg:flex-row min-h-screen pt-[68px]">

                {/* Left — image gallery */}
                <div className="lg:sticky lg:top-[68px] lg:h-[calc(100dvh-68px)] flex-shrink-0 lg:w-[52%] flex flex-col items-center justify-center relative overflow-hidden bg-[#0a0a0f] p-8 lg:p-16">
                    {/* ambient glow */}
                    <div ref={glowRef} className="absolute pointer-events-none"
                        style={{
                            width: 500, height: 500,
                            background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 65%)",
                            willChange: "transform, opacity"
                        }} />

                    {/* main image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img ref={imgRef} src={images[activeImg]?.url ?? product.featuredImage?.url ?? ""}
                        alt={product.title}
                        className="relative z-10 w-auto object-contain"
                        style={{
                            maxHeight: "65vh",
                            filter: "drop-shadow(0 40px 100px rgba(0,0,0,0.85)) drop-shadow(0 0 50px rgba(212,175,55,0.07))",
                            opacity: 0
                        }} />

                    {/* thumbnails */}
                    {images.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
                            {images.slice(0, 6).map((img, i) => (
                                <button key={i} onClick={() => {
                                    setActiveImg(i);
                                    gsap.fromTo(imgRef.current,
                                        { opacity: 0.3, scale: 0.96, filter: "blur(6px)" },
                                        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.5, ease: "expo.out" });
                                }}
                                    className="cursor-hover transition-all duration-300"
                                    style={{
                                        width: 48, height: 48, borderRadius: 10, overflow: "hidden",
                                        border: `1.5px solid ${activeImg === i ? "#D4AF37" : "rgba(255,255,255,0.1)"}`,
                                        opacity: activeImg === i ? 1 : 0.45,
                                    }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right — product info */}
                <div className="flex-1 flex flex-col px-8 lg:px-14 py-12 lg:py-16 gap-8">

                    {/* breadcrumb */}
                    <div className="flex items-center gap-2">
                        <span className="text-[8px] uppercase tracking-[0.5em]" style={{ color: "rgba(212,175,55,0.6)" }}>
                            {product.vendor || "SENZ8"}
                        </span>
                        <span style={{ color: "rgba(245,245,245,0.2)", fontSize: 10 }}>·</span>
                        <span className="text-[8px] uppercase tracking-[0.5em]" style={{ color: "var(--text-secondary)" }}>
                            {product.productType || "Extrait de Parfum"}
                        </span>
                    </div>

                    {/* title */}
                    <div ref={titleRef}>
                        {product.title.split(" ").map((word, i) => (
                            <div key={i} style={{ overflow: "hidden" }}>
                                <span className="tw block font-black uppercase"
                                    style={{
                                        fontSize: "clamp(38px,6vw,80px)", letterSpacing: "-0.04em", lineHeight: 0.9,
                                        color: i === 0 ? "var(--text-primary)" : "var(--accent-gold)"
                                    }}>
                                    {word}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* rating */}
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((n) => (
                            <Star key={n} size={12} fill="#D4AF37" stroke="#D4AF37" />
                        ))}
                        <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>New arrival</span>
                    </div>

                    {/* description */}
                    <p ref={descRef} className="text-sm lg:text-base leading-relaxed max-w-lg opacity-0"
                        style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
                        {product.description}
                    </p>

                    {/* stats row */}
                    {(longevity || concentration) && (
                        <div className="flex items-center gap-6">
                            {concentration && (
                                <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.1)" }}>
                                    <p className="font-black" style={{ fontSize: 20, color: "var(--accent-gold)", letterSpacing: "-0.04em", lineHeight: 1 }}>
                                        {concentration}
                                    </p>
                                    <p className="text-[7px] uppercase tracking-[0.2em] mt-1" style={{ color: "var(--text-secondary)" }}>Concentration</p>
                                </div>
                            )}
                            {longevity && (
                                <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.1)" }}>
                                    <p className="font-black" style={{ fontSize: 20, color: "var(--accent-gold)", letterSpacing: "-0.04em", lineHeight: 1 }}>
                                        {longevity}
                                    </p>
                                    <p className="text-[7px] uppercase tracking-[0.2em] mt-1" style={{ color: "var(--text-secondary)" }}>Longevity</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* fragrance notes */}
                    {notes.length > 0 && (
                        <div className="flex flex-col gap-4">
                            <p className="text-[9px] uppercase tracking-[0.5em]" style={{ color: "var(--text-secondary)" }}>
                                Fragrance Notes
                            </p>
                            {notes.map(({ tier, title, labels }) => (
                                <div key={tier}>
                                    <p className="text-[8px] uppercase tracking-[0.35em] mb-2" style={{ color: "var(--accent-gold)", opacity: 0.7 }}>{title}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {labels.map((l) => <NotePill key={l} label={l} tier={tier} />)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* variant selector */}
                    {product.variants.nodes.length > 1 && (
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.5em] mb-3" style={{ color: "var(--text-secondary)" }}>Size</p>
                            <div className="flex flex-wrap gap-2">
                                {product.variants.nodes.map((v) => (
                                    <button key={v.id}
                                        onClick={() => setSelectedVariant(v)}
                                        className="px-4 py-2 rounded-pill text-[9px] font-bold uppercase tracking-widest cursor-hover transition-all duration-300"
                                        style={{
                                            background: selectedVariant.id === v.id ? "var(--accent-gold)" : "rgba(255,255,255,0.03)",
                                            color: selectedVariant.id === v.id ? "#0A0A0A" : "var(--text-secondary)",
                                            border: `1px solid ${selectedVariant.id === v.id ? "var(--accent-gold)" : "rgba(255,255,255,0.1)"}`,
                                            opacity: v.availableForSale ? 1 : 0.4,
                                        }}>
                                        {v.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* price + qty + CTAs */}
                    <div ref={ctaRef} className="flex flex-col gap-5 opacity-0">

                        {/* price */}
                        <div className="flex items-baseline gap-3">
                            <span className="font-black" style={{ fontSize: "clamp(28px,4vw,44px)", color: "var(--accent-gold)", letterSpacing: "-0.04em", lineHeight: 1 }}>
                                {price}
                            </span>
                            <span className="text-[9px] uppercase tracking-[0.2em]" style={{ color: "var(--text-secondary)" }}>/ 50ML</span>
                            {!selectedVariant?.availableForSale && (
                                <span className="px-3 py-1 text-[8px] font-bold uppercase tracking-[0.3em] rounded-pill"
                                    style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.25)", color: "#ff5050" }}>
                                    Sold Out
                                </span>
                            )}
                        </div>

                        {/* qty */}
                        <div className="flex items-center gap-3">
                            <p className="text-[9px] uppercase tracking-[0.4em]" style={{ color: "var(--text-secondary)" }}>Qty</p>
                            <div className="flex items-center" style={{ border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, overflow: "hidden" }}>
                                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                                    className="cursor-hover transition-colors duration-200 flex items-center justify-center"
                                    style={{ width: 36, height: 36, background: "rgba(212,175,55,0.05)", color: "#D4AF37", fontSize: 16, fontWeight: 700, border: "none" }}>−</button>
                                <span className="flex items-center justify-center font-bold"
                                    style={{ width: 40, height: 36, color: "var(--text-primary)", fontSize: 14, borderLeft: "1px solid rgba(212,175,55,0.12)", borderRight: "1px solid rgba(212,175,55,0.12)" }}>
                                    {qty}
                                </span>
                                <button onClick={() => setQty(q => Math.min(24, q + 1))}
                                    className="cursor-hover transition-colors duration-200 flex items-center justify-center"
                                    style={{ width: 36, height: 36, background: "rgba(212,175,55,0.05)", color: "#D4AF37", fontSize: 16, fontWeight: 700, border: "none" }}>+</button>
                            </div>
                        </div>

                        {/* CTA buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button onClick={handleAddToCart}
                                disabled={adding || !selectedVariant?.availableForSale}
                                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-pill font-black uppercase tracking-widest text-[10px] cursor-hover transition-all duration-300"
                                style={{
                                    background: addedToCart ? "rgba(74,222,128,0.1)" : "transparent",
                                    border: `1.5px solid ${addedToCart ? "#4ade80" : "rgba(212,175,55,0.4)"}`,
                                    color: addedToCart ? "#4ade80" : "var(--accent-gold)",
                                    opacity: !selectedVariant?.availableForSale ? 0.4 : 1,
                                }}>
                                {adding ? <Loader2 size={12} className="animate-spin" /> :
                                    addedToCart ? <><Check size={12} /> Added to Cart</> :
                                        <><ShoppingBag size={12} /> Add to Cart</>}
                            </button>

                            <button onClick={handleBuyNow}
                                disabled={adding || !selectedVariant?.availableForSale}
                                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-pill font-black uppercase tracking-widest text-[10px] cursor-hover transition-all duration-300"
                                style={{
                                    background: "var(--accent-gold)",
                                    color: "#0A0A0A",
                                    opacity: !selectedVariant?.availableForSale ? 0.4 : 1,
                                }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = "brightness(1.12)"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = "brightness(1)"; }}>
                                <Zap size={12} /> Buy Now
                            </button>
                        </div>

                        {/* shipping note */}
                        <p className="text-[9px] uppercase tracking-[0.3em]" style={{ color: "rgba(245,245,245,0.25)" }}>
                            FREE shipping · arrives in 2–3 days
                        </p>
                    </div>

                    {/* tags */}
                    {product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                            {product.tags.map((t) => (
                                <span key={t} className="px-2.5 py-1 text-[7px] uppercase tracking-[0.2em]"
                                    style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 999, color: "rgba(245,245,245,0.3)" }}>
                                    {t}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* back link */}
                    <div className="pt-4">
                        <TransitionLink href="/collections" label="The Collection"
                            className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] cursor-hover transition-colors duration-300"
                            style={{ color: "rgba(245,245,245,0.25)" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--accent-gold)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(245,245,245,0.25)"; }}>
                            <ArrowLeft size={11} /> Back to Collection <ArrowRight size={11} />
                        </TransitionLink>
                    </div>
                </div>
            </div>

            <SiteFooter />
        </div>
    );
}
