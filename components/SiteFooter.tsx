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
const COMPANY = [
    { name: "Our Story", href: "#" },
    { name: "Contact", href: "/contact" },
    { name: "Press", href: "#" },
];
const COMMUNITY = [
    { name: "Scent Society", href: "#" },
    { name: "Brand Ambassadors", href: "#" },
    { name: "Affiliate Program", href: "#" },
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
            gsap.fromTo(gridRef.current?.children ?? [],
                { opacity: 0, y: 18 },
                {
                    opacity: 1, y: 0, stagger: 0.08, duration: 0.7, ease: "power2.out", delay: 0.5,
                    scrollTrigger: { trigger: gridRef.current, start: "top 88%", toggleActions: "play none none none" }
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

            {/* Hero CTA block */}
            <div className="relative px-6 lg:px-12 pt-20 pb-16 text-center">
                <p className="text-[8px] uppercase tracking-[0.7em] mb-5" style={{ color: "var(--accent-gold)" }}>
                    Find Your Signature
                </p>

                <h2 ref={headRef} className="font-black uppercase mb-8"
                    style={{ fontSize: "clamp(38px,7vw,100px)", letterSpacing: "-0.04em", lineHeight: 0.9, color: "var(--text-primary)", clipPath: "inset(0 0 100% 0)", opacity: 0 }}>
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

            {/* Divider */}
            <div className="mx-6 lg:mx-12" style={{ height: 1, background: "rgba(212,175,55,0.07)" }} />

            {/* Links grid + newsletter */}
            <div ref={gridRef} className="max-w-[1100px] mx-auto px-6 lg:px-12 py-14 grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">

                {/* Scents */}
                <div className="flex flex-col gap-3">
                    <span className="text-[8px] uppercase tracking-[0.5em] font-bold mb-1" style={{ color: "var(--accent-gold)" }}>Scents</span>
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

                {/* Community */}
                <div className="flex flex-col gap-3">
                    <span className="text-[8px] uppercase tracking-[0.5em] font-bold mb-1" style={{ color: "var(--accent-gold)" }}>Community</span>
                    {COMMUNITY.map((l) => (
                        <a key={l.name} href={l.href}
                            className="text-sm transition-colors duration-300 cursor-hover"
                            style={{ color: "var(--text-secondary)" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}>
                            {l.name}
                        </a>
                    ))}
                </div>

                {/* Company */}
                <div className="flex flex-col gap-3">
                    <span className="text-[8px] uppercase tracking-[0.5em] font-bold mb-1" style={{ color: "var(--accent-gold)" }}>Company</span>
                    {COMPANY.map((l) => (
                        <a key={l.name} href={l.href}
                            className="text-sm transition-colors duration-300 cursor-hover"
                            style={{ color: "var(--text-secondary)" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}>
                            {l.name}
                        </a>
                    ))}
                </div>

                {/* Newsletter */}
                <div className="flex flex-col gap-4 col-span-2 lg:col-span-1">
                    <span className="text-[8px] uppercase tracking-[0.5em] font-bold" style={{ color: "var(--accent-gold)" }}>Stay in the loop</span>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        Exclusive drops, early access and scent stories.
                    </p>
                    <div className="flex items-center gap-2 pb-2" style={{ borderBottom: "1px solid rgba(212,175,55,0.2)" }}>
                        <input type="email" placeholder="Your email"
                            className="bg-transparent text-sm outline-none flex-1 placeholder:opacity-30"
                            style={{ color: "var(--text-primary)" }} />
                        <button className="cursor-hover transition-opacity duration-300 hover:opacity-70" aria-label="Subscribe">
                            <ArrowRight size={15} style={{ color: "var(--accent-gold)" }} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="mx-6 lg:mx-12" style={{ height: 1, background: "rgba(212,175,55,0.07)" }} />

            {/* Bottom bar */}
            <div className="max-w-[1100px] mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs" style={{ color: "rgba(245,245,245,0.2)" }}>
                    © 2025 SENZ8 · Parfum Maison · All Rights Reserved
                </span>
                <div className="flex items-center gap-6">
                    {/* Social */}
                    <div className="flex items-center gap-4">
                        <Link href="https://instagram.com" target="_blank"
                            className="transition-colors duration-300 cursor-hover"
                            style={{ color: "rgba(245,245,245,0.25)" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--accent-gold)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(245,245,245,0.25)"; }}>
                            {/* Instagram */}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                        </Link>
                        <Link href="https://youtube.com" target="_blank"
                            className="transition-colors duration-300 cursor-hover"
                            style={{ color: "rgba(245,245,245,0.25)" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--accent-gold)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(245,245,245,0.25)"; }}>
                            {/* YouTube */}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                            </svg>
                        </Link>
                        <Link href="https://tiktok.com" target="_blank"
                            className="transition-colors duration-300 cursor-hover"
                            style={{ color: "rgba(245,245,245,0.25)" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--accent-gold)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(245,245,245,0.25)"; }}>
                            {/* TikTok */}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.15 8.15 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
                            </svg>
                        </Link>
                    </div>
                    <div className="flex gap-5">
                        {[
                            { label: "Privacy Policy", href: "/privacy-policy" },
                            { label: "Terms", href: "/terms" },
                        ].map(({ label, href }) => (
                            <a key={label} href={href}
                                className="text-xs transition-colors duration-300 cursor-hover"
                                style={{ color: "rgba(245,245,245,0.2)" }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(245,245,245,0.2)"; }}>
                                {label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
