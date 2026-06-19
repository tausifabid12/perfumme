"use client";

import { useEffect, useRef } from "react";
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import gsap from "gsap";
import { useCart } from "@/components/providers/CartProvider";
import TransitionLink from "@/components/TransitionLink";

export default function CartDrawer() {
    const { lines, subtotal, totalQuantity, checkoutUrl, cartOpen, setCartOpen, removeFromCart, updateQty, adding } = useCart();

    const drawerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Animate open/close
    useEffect(() => {
        if (!drawerRef.current || !overlayRef.current) return;

        if (cartOpen) {
            document.body.style.overflow = "hidden";
            gsap.set(drawerRef.current, { display: "flex" });
            gsap.fromTo(overlayRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.4, ease: "power2.out" }
            );
            gsap.fromTo(drawerRef.current,
                { x: "100%" },
                { x: "0%", duration: 0.55, ease: "expo.out" }
            );
            gsap.fromTo(contentRef.current?.children ?? [],
                { opacity: 0, y: 16 },
                { opacity: 1, y: 0, stagger: 0.04, duration: 0.5, ease: "power3.out", delay: 0.2 }
            );
        } else {
            document.body.style.overflow = "";
            gsap.to(overlayRef.current, { opacity: 0, duration: 0.35, ease: "power2.in" });
            gsap.to(drawerRef.current, {
                x: "100%", duration: 0.45, ease: "expo.in",
                onComplete: () => { gsap.set(drawerRef.current, { display: "none" }); }
            });
        }
    }, [cartOpen]);

    const handleCheckout = () => {
        if (checkoutUrl) window.location.href = checkoutUrl;
    };

    return (
        <>
            {/* Overlay */}
            <div
                ref={overlayRef}
                onClick={() => setCartOpen(false)}
                className="fixed inset-0 z-[300]"
                style={{
                    background: "rgba(0,0,0,0.65)",
                    backdropFilter: "blur(4px)",
                    opacity: 0,
                    pointerEvents: cartOpen ? "auto" : "none",
                }}
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                className="fixed top-0 right-0 h-full z-[301] flex flex-col"
                style={{
                    width: "min(420px, 100vw)",
                    background: "linear-gradient(160deg, #111116 0%, #0a0a0f 100%)",
                    borderLeft: "1px solid rgba(212,175,55,0.12)",
                    display: "none",
                    transform: "translateX(100%)",
                    boxShadow: "-24px 0 80px rgba(0,0,0,0.6)",
                }}
            >
                {/* Gold top edge */}
                <div className="absolute top-0 left-0 right-0 h-[1px]"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)" }} />

                <div ref={contentRef} className="flex flex-col h-full overflow-hidden">

                    {/* ── Header ── */}
                    <div className="flex items-center justify-between px-6 py-5"
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="flex items-center gap-3">
                            <ShoppingBag size={16} style={{ color: "var(--accent-gold)" }} />
                            <span className="text-[11px] font-black uppercase tracking-[0.4em]"
                                style={{ color: "var(--text-primary)" }}>
                                Your Cart
                            </span>
                            {totalQuantity > 0 && (
                                <span className="flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-black"
                                    style={{ background: "var(--accent-gold)", color: "#0a0a0a" }}>
                                    {totalQuantity}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => setCartOpen(false)}
                            className="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-all duration-200"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(245,245,245,0.5)" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = "rgba(245,245,245,0.5)"; }}
                        >
                            <X size={14} />
                        </button>
                    </div>

                    {/* ── Items ── */}
                    <div className="flex-1 overflow-y-auto px-6 py-4" style={{ scrollbarWidth: "none" }}>
                        {lines.length === 0 ? (
                            /* Empty state */
                            <div className="flex flex-col items-center justify-center h-full gap-5 py-16">
                                <div className="flex items-center justify-center w-16 h-16 rounded-full"
                                    style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.12)" }}>
                                    <ShoppingBag size={24} style={{ color: "rgba(212,175,55,0.4)" }} />
                                </div>
                                <div className="text-center">
                                    <p className="text-[13px] font-bold mb-1" style={{ color: "var(--text-primary)" }}>Your cart is empty</p>
                                    <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>Add a scent to get started</p>
                                </div>
                                <TransitionLink
                                    href="/collections"
                                    label="Browse Collection"
                                    onClick={() => setCartOpen(false)}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all duration-300"
                                    style={{ border: "1px solid rgba(212,175,55,0.3)", color: "var(--accent-gold)" }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(212,175,55,0.08)"; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                                >
                                    Browse Collection <ArrowRight size={10} />
                                </TransitionLink>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {lines.map((line) => (
                                    <CartLineItem
                                        key={line.id}
                                        line={line}
                                        onRemove={() => removeFromCart(line.id)}
                                        onUpdateQty={(qty) => updateQty(line.id, qty)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Footer — only if cart has items ── */}
                    {lines.length > 0 && (
                        <div className="px-6 py-5 flex flex-col gap-4"
                            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>

                            {/* Subtotal */}
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase tracking-[0.35em]"
                                    style={{ color: "var(--text-secondary)" }}>Subtotal</span>
                                <span className="font-black text-lg leading-none"
                                    style={{ color: "var(--accent-gold)", letterSpacing: "-0.03em" }}>
                                    {subtotal}
                                </span>
                            </div>

                            <p className="text-[9px] text-center uppercase tracking-[0.25em]"
                                style={{ color: "rgba(245,245,245,0.2)" }}>
                                Shipping & taxes calculated at checkout
                            </p>

                            {/* Checkout CTA */}
                            <button
                                onClick={handleCheckout}
                                disabled={!checkoutUrl || adding}
                                className="flex items-center justify-center gap-2 w-full py-4 rounded-pill font-black uppercase tracking-widest text-[10px] transition-all duration-300 cursor-pointer"
                                style={{
                                    background: "var(--accent-gold)",
                                    color: "#0a0a0a",
                                    opacity: (!checkoutUrl || adding) ? 0.5 : 1,
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.filter = "brightness(1.12)"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = "brightness(1)"; }}
                            >
                                Checkout <ArrowRight size={12} />
                            </button>

                            {/* Continue shopping */}
                            <button
                                onClick={() => setCartOpen(false)}
                                className="text-[9px] uppercase tracking-[0.35em] text-center transition-colors duration-200 cursor-pointer"
                                style={{ color: "rgba(245,245,245,0.25)", background: "none", border: "none" }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(245,245,245,0.6)"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(245,245,245,0.25)"; }}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

// ─── Single line item ────────────────────────────────────────────────────────────
function CartLineItem({
    line,
    onRemove,
    onUpdateQty,
}: {
    line: import("@/components/providers/CartProvider").CartLine;
    onRemove: () => void;
    onUpdateQty: (qty: number) => void;
}) {
    const { merchandise, quantity, cost } = line;
    const price = parseFloat(merchandise.price.amount);
    const currency = merchandise.price.currencyCode;
    const fmtPrice = (n: number) => currency === "BDT"
        ? `৳${Math.round(n).toLocaleString("en-BD")}`
        : new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);

    return (
        <div className="flex gap-4 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            {/* Product image */}
            <div className="flex-shrink-0 flex items-center justify-center rounded-xl overflow-hidden"
                style={{ width: 72, height: 72, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.1)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {merchandise.product.featuredImage ? (
                    <img
                        src={merchandise.product.featuredImage.url}
                        alt={merchandise.product.title}
                        className="w-full h-full object-contain p-1"
                        style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}
                    />
                ) : (
                    <ShoppingBag size={20} style={{ color: "rgba(212,175,55,0.3)" }} />
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                    <p className="text-[11px] font-black uppercase leading-tight truncate"
                        style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                        {merchandise.product.title}
                    </p>
                    {merchandise.title !== "Default Title" && (
                        <p className="text-[9px] mt-0.5 uppercase tracking-[0.2em]"
                            style={{ color: "var(--text-secondary)" }}>
                            {merchandise.title}
                        </p>
                    )}
                </div>

                {/* Qty + price row */}
                <div className="flex items-center justify-between mt-2">
                    {/* Qty stepper */}
                    <div className="flex items-center rounded-lg overflow-hidden"
                        style={{ border: "1px solid rgba(212,175,55,0.15)" }}>
                        <button
                            onClick={() => onUpdateQty(quantity - 1)}
                            className="flex items-center justify-center cursor-pointer transition-colors duration-200"
                            style={{ width: 28, height: 28, background: "rgba(212,175,55,0.05)", border: "none", color: "#D4AF37" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(212,175,55,0.12)"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(212,175,55,0.05)"; }}
                        >
                            {quantity === 1 ? <Trash2 size={10} /> : <Minus size={10} />}
                        </button>
                        <span className="flex items-center justify-center text-[11px] font-bold"
                            style={{
                                width: 32, height: 28, color: "var(--text-primary)",
                                borderLeft: "1px solid rgba(212,175,55,0.12)",
                                borderRight: "1px solid rgba(212,175,55,0.12)",
                            }}>
                            {quantity}
                        </span>
                        <button
                            onClick={() => onUpdateQty(quantity + 1)}
                            className="flex items-center justify-center cursor-pointer transition-colors duration-200"
                            style={{ width: 28, height: 28, background: "rgba(212,175,55,0.05)", border: "none", color: "#D4AF37" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(212,175,55,0.12)"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(212,175,55,0.05)"; }}
                        >
                            <Plus size={10} />
                        </button>
                    </div>

                    {/* Line total */}
                    <div className="text-right">
                        <p className="font-black leading-none text-[13px]"
                            style={{ color: "var(--accent-gold)", letterSpacing: "-0.03em" }}>
                            {fmtPrice(price * quantity)}
                        </p>
                        {quantity > 1 && (
                            <p className="text-[8px] mt-0.5 uppercase tracking-[0.1em]"
                                style={{ color: "rgba(245,245,245,0.25)" }}>
                                {fmtPrice(price)} each
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
