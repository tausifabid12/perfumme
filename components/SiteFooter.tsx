"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import TransitionLink from "@/components/TransitionLink";
import { BsInstagram } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const SCENTS = [
    { name: "Imperial Smoke", href: "/products/imperial-smoke" },
    { name: "IT Boy", href: "/products/it-boy" },
    { name: "Rebel Girl", href: "/products/rebel-girl" },
    { name: "Blind Date", href: "/products/blind-date" },
];

const INFO_LINKS = [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms" }
];

// ── Newsletter widget ─────────────────────────────────────────────────────────
function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        setErrorMsg("");
        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error ?? "Something went wrong.");
            }
            setStatus("done");
        } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
            setStatus("error");
        }
    }, [email]);

    if (status === "done") {
        return (
            <div className="flex items-center gap-2.5 py-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.4)" }}>
                    <Check size={11} style={{ color: "var(--accent-gold)" }} />
                </div>
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    You're in. We'll be in touch.
                </span>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex items-center gap-2 pb-2"
                style={{ borderBottom: "1px solid rgba(212,175,55,0.2)" }}>
                <input
                    type="email"
                    required
                    placeholder="Your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={status === "sending"}
                    className="bg-transparent text-sm outline-none flex-1 placeholder:opacity-30"
                    style={{ color: "var(--text-primary)" }}
                />
                <button
                    type="submit"
                    disabled={status === "sending"}
                    className="cursor-hover transition-opacity duration-300 hover:opacity-70 disabled:opacity-40"
                    aria-label="Subscribe">
                    {status === "sending"
                        ? <Loader2 size={14} className="animate-spin" style={{ color: "var(--accent-gold)" }} />
                        : <ArrowRight size={15} style={{ color: "var(--accent-gold)" }} />}
                </button>
            </div>
            {status === "error" && (
                <p className="text-[11px]" style={{ color: "#f87171" }}>{errorMsg}</p>
            )}
        </form>
    );
}

// ── Footer ────────────────────────────────────────────────────────────────────
export default function SiteFooter() {
    const sectionRef = useRef<HTMLElement>(null);
    const headRef = useRef<HTMLHeadingElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(headRef.current,
                { clipPath: "inset(0 0 100% 0)", opacity: 0 },
                {
                    clipPath: "inset(0 0 0% 0)", opacity: 1, duration: 1.3, ease: "power4.out",
                    scrollTrigger: { trigger: sectionRef.current, start: "top 82%", toggleActions: "play none none none" },
                }
            );
            gsap.fromTo(ctaRef.current,
                { opacity: 0, y: 24 },
                {
                    opacity: 1, y: 0, duration: 0.9, ease: "expo.out", delay: 0.35,
                    scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" },
                }
            );
            gsap.fromTo(gridRef.current?.children ?? [],
                { opacity: 0, y: 18 },
                {
                    opacity: 1, y: 0, stagger: 0.08, duration: 0.7, ease: "power2.out", delay: 0.5,
                    scrollTrigger: { trigger: gridRef.current, start: "top 88%", toggleActions: "play none none none" },
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <footer ref={sectionRef} className="relative overflow-hidden" style={{ background: "#080808" }}>

            {/* Top gold line */}
            <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.25), transparent)" }} />

            {/* Ambient glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
                style={{ width: 700, height: 350, background: "radial-gradient(ellipse at center, rgba(212,175,55,0.04) 0%, transparent 70%)" }} />

            {/* ── Hero CTA block ── */}
            <div className="relative px-6 lg:px-12 pt-20 pb-16 text-center">
                <p className="text-[10px] uppercase tracking-[0.6em] mb-5" style={{ color: "var(--accent-gold)" }}>
                    Find Your Signature
                </p>

                <h2
                    ref={headRef}
                    className="font-black uppercase mb-8"
                    style={{
                        fontSize: "clamp(22px,7.5vw,100px)", letterSpacing: "-0.04em",
                        lineHeight: 0.92, color: "var(--text-primary)",
                        clipPath: "inset(0 0 100% 0)", opacity: 0,
                        whiteSpace: "nowrap",
                    }}
                >
                    #WEARYOURIDENTITY
                </h2>

                <p className="text-sm max-w-sm mx-auto mb-10" style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
                    Every spray is a chapter. Start your story today.
                </p>

                <div ref={ctaRef} className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 px-4" style={{ opacity: 0 }}>
                    <TransitionLink href="/collections" label="Shop All Scents"
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-pill font-black uppercase tracking-widest text-sm cursor-hover transition-all duration-300 w-full sm:w-auto"
                        style={{ background: "var(--accent-gold)", color: "#0A0A0A", boxShadow: "0 0 36px rgba(212,175,55,0.22)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = "brightness(1.12)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = "brightness(1)"; }}>
                        Shop All Scents <ArrowRight size={13} />
                    </TransitionLink>
                    <TransitionLink href="/" label="Home"
                        className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-pill text-sm font-bold uppercase tracking-widest cursor-hover transition-all duration-300 w-full sm:w-auto"
                        style={{ border: "1px solid rgba(212,175,55,0.3)", color: "var(--text-secondary)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.6)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.3)"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}>
                        Back to Home
                    </TransitionLink>
                </div>
            </div>

            {/* ── Divider ── */}
            <div className="mx-6 lg:mx-12" style={{ height: 1, background: "rgba(212,175,55,0.07)" }} />

            {/* ── Links grid + newsletter ── */}
            <div ref={gridRef} className="max-w-[1100px] mx-auto px-6 lg:px-12 py-14 grid grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">

                {/* Scents */}
                <div className="flex flex-col gap-3">
                    <span className="text-[10px] uppercase tracking-[0.45em] font-bold mb-1" style={{ color: "var(--accent-gold)" }}>
                        Scents
                    </span>
                    {SCENTS.map((l) => (
                        <TransitionLink key={l.name} href={l.href} label={l.name}
                            className="text-sm transition-colors duration-300 cursor-hover"
                            style={{ color: "var(--text-secondary)" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}>
                            {l.name}
                        </TransitionLink>
                    ))}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-3">
                    <span className="text-[10px] uppercase tracking-[0.45em] font-bold mb-1" style={{ color: "var(--accent-gold)" }}>
                        Info
                    </span>
                    {INFO_LINKS.map((l) => (
                        <TransitionLink key={l.name} href={l.href} label={l.name}
                            className="text-sm transition-colors duration-300 cursor-hover"
                            style={{ color: "var(--text-secondary)" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}>
                            {l.name}
                        </TransitionLink>
                    ))}
                </div>

                {/* Newsletter */}
                <div className="flex flex-col gap-4 col-span-2 lg:col-span-1">
                    <span className="text-[10px] uppercase tracking-[0.45em] font-bold" style={{ color: "var(--accent-gold)" }}>
                        Stay in the Loop
                    </span>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                        Exclusive drops, early access and scent stories — straight to your inbox.
                    </p>
                    <NewsletterForm />
                </div>
            </div>

            {/* ── Divider ── */}
            <div className="mx-6 lg:mx-12" style={{ height: 1, background: "rgba(212,175,55,0.07)" }} />

            {/* ── Bottom bar ── */}
            <div className="max-w-[1100px] mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs" style={{ color: "rgba(245,245,245,0.2)" }}>
                    © 2026 SENZ8 · Parfum Maison · All Rights Reserved
                </span>
                <div className="flex items-center gap-5">
                    <TransitionLink href="/privacy-policy" label="Privacy"
                        className="text-xs transition-colors duration-300 cursor-hover"
                        style={{ color: "rgba(245,245,245,0.25)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(245,245,245,0.25)"; }}>
                        Privacy
                    </TransitionLink>
                    <TransitionLink href="/terms" label="Terms"
                        className="text-xs transition-colors duration-300 cursor-hover"
                        style={{ color: "rgba(245,245,245,0.25)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(245,245,245,0.25)"; }}>
                        Terms
                    </TransitionLink>
                    <TransitionLink href="/contact" label="Contact"
                        className="text-xs transition-colors duration-300 cursor-hover"
                        style={{ color: "rgba(245,245,245,0.25)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(245,245,245,0.25)"; }}>
                        Contact
                    </TransitionLink>

                    {/* Social links */}
                    <a
                        href="https://www.instagram.com/senzeight/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="transition-colors duration-300 cursor-hover"
                        style={{ color: "rgba(245,245,245,0.25)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--accent-gold)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(245,245,245,0.25)"; }}>
                        <BsInstagram size={15} />
                    </a>
                    <a
                        href="https://www.facebook.com/senzeight/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="transition-colors duration-300 cursor-hover"
                        style={{ color: "rgba(245,245,245,0.25)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--accent-gold)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(245,245,245,0.25)"; }}>
                        <FaFacebook size={15} />
                    </a>
                </div>
            </div>
        </footer>
    );
}
