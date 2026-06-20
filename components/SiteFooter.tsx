"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import TransitionLink from "@/components/TransitionLink";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const SCENTS = [
    { name: "Imperial Smoke", href: "/products/imperial-smoke" },
    { name: "IT Boy", href: "/products/it-boy" },
    { name: "Rebel Girl", href: "/products/rebel-girl" },
    { name: "Blind Date", href: "/products/blind-date" },
];

const LEGAL = [
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms" },
];

const SOCIALS = [
    {
        name: "Instagram",
        href: "https://instagram.com",
        icon: (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
        ),
    },
    {
        name: "YouTube",
        href: "https://youtube.com",
        icon: (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58z" />
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
            </svg>
        ),
    },
    {
        name: "Facebook",
        href: "https://facebook.com",
        icon: (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
        ),
    },
    // {
    //     name: "TikTok",
    //     href: "https://tiktok.com",
    //     icon: (
    //         <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    //             <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.15 8.15 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
    //         </svg>
    //     ),
    // },
    {
        name: "X / Twitter",
        href: "https://twitter.com",
        icon: (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
    },
];

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
                <p className="text-[8px] uppercase tracking-[0.7em] mb-5" style={{ color: "var(--accent-gold)" }}>
                    Find Your Signature
                </p>

                <h2
                    ref={headRef}
                    className="font-black uppercase mb-8"
                    style={{
                        fontSize: "clamp(38px,7vw,100px)", letterSpacing: "-0.04em",
                        lineHeight: 0.9, color: "var(--text-primary)",
                        clipPath: "inset(0 0 100% 0)", opacity: 0,
                    }}
                >
                    #WEARYOURSCENT
                </h2>

                <p className="text-sm max-w-sm mx-auto mb-10" style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
                    Every spray is a chapter. Start your story today.
                </p>

                <div ref={ctaRef} className="flex flex-wrap justify-center gap-3" style={{ opacity: 0 }}>
                    <TransitionLink href="/collections" label="Shop All Scents"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-pill font-black uppercase tracking-widest text-sm cursor-hover transition-all duration-300"
                        style={{ background: "var(--accent-gold)", color: "#0A0A0A", boxShadow: "0 0 36px rgba(212,175,55,0.22)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = "brightness(1.12)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = "brightness(1)"; }}>
                        Shop All Scents <ArrowRight size={13} />
                    </TransitionLink>
                    <TransitionLink href="/" label="Home"
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-pill text-sm font-bold uppercase tracking-widest cursor-hover transition-all duration-300"
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
            <div ref={gridRef} className="max-w-[1100px] mx-auto px-6 lg:px-12 py-14 grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">

                {/* Scents */}
                <div className="flex flex-col gap-3">
                    <span className="text-[8px] uppercase tracking-[0.5em] font-bold mb-1" style={{ color: "var(--accent-gold)" }}>
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

                {/* Community — social icons + links */}
                <div className="flex flex-col gap-4">
                    <span className="text-[8px] uppercase tracking-[0.5em] font-bold mb-1" style={{ color: "var(--accent-gold)" }}>
                        Community
                    </span>
                    {/* Social icon grid */}
                    {/* <div className="flex flex-wrap gap-2.5">
                        {SOCIALS.map((s) => (
                            <Link
                                key={s.name}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={s.name}
                                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-hover"
                                style={{
                                    border: "1px solid rgba(212,175,55,0.18)",
                                    color: "rgba(245,245,245,0.35)",
                                    background: "rgba(255,255,255,0.025)",
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.55)";
                                    (e.currentTarget as HTMLElement).style.color = "var(--accent-gold)";
                                    (e.currentTarget as HTMLElement).style.background = "rgba(212,175,55,0.07)";
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.18)";
                                    (e.currentTarget as HTMLElement).style.color = "rgba(245,245,245,0.35)";
                                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)";
                                }}
                            >
                                {s.icon}
                            </Link>
                        ))}
                    </div> */}
                    {/* Platform names as small links */}
                    <div className="flex flex-col gap-2 mt-1">
                        {SOCIALS.map((s) => (
                            <Link
                                key={s.name}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm transition-colors duration-300 cursor-hover"
                                style={{ color: "var(--text-secondary)" }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
                            >
                                {s.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Legal / Info */}
                <div className="flex flex-col gap-3">
                    <span className="text-[8px] uppercase tracking-[0.5em] font-bold mb-1" style={{ color: "var(--accent-gold)" }}>
                        Info
                    </span>
                    {LEGAL.map((l) => (
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
                    <span className="text-[8px] uppercase tracking-[0.5em] font-bold" style={{ color: "var(--accent-gold)" }}>
                        Stay in the loop
                    </span>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        Exclusive drops, early access and scent stories.
                    </p>
                    <div className="flex items-center gap-2 pb-2" style={{ borderBottom: "1px solid rgba(212,175,55,0.2)" }}>
                        <input
                            type="email"
                            placeholder="Your email"
                            className="bg-transparent text-sm outline-none flex-1 placeholder:opacity-30"
                            style={{ color: "var(--text-primary)" }}
                        />
                        <button className="cursor-hover transition-opacity duration-300 hover:opacity-70" aria-label="Subscribe">
                            <ArrowRight size={15} style={{ color: "var(--accent-gold)" }} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Divider ── */}
            <div className="mx-6 lg:mx-12" style={{ height: 1, background: "rgba(212,175,55,0.07)" }} />

            {/* ── Bottom bar ── */}
            <div className="max-w-[1100px] mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs" style={{ color: "rgba(245,245,245,0.2)" }}>
                    © 2025 SENZ8 · Parfum Maison · All Rights Reserved
                </span>
                <div className="flex items-center gap-6">
                    {/* Social icon row — compact version */}
                    <div className="flex items-center gap-3">
                        {SOCIALS.map((s) => (
                            <Link
                                key={s.name}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={s.name}
                                className="transition-colors duration-300 cursor-hover"
                                style={{ color: "rgba(245,245,245,0.22)" }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--accent-gold)"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(245,245,245,0.22)"; }}
                            >
                                <span style={{ display: "block", width: 14, height: 14 }}>
                                    {s.icon}
                                </span>
                            </Link>
                        ))}
                    </div>
                    {/* Legal links */}
                    <div className="flex gap-5">
                        {LEGAL.map((l) => (
                            <TransitionLink
                                key={l.name}
                                href={l.href}
                                label={l.name}
                                className="text-xs transition-colors duration-300 cursor-hover"
                                style={{ color: "rgba(245,245,245,0.2)" }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(245,245,245,0.2)"; }}
                            >
                                {l.name}
                            </TransitionLink>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
