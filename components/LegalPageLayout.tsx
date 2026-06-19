"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft } from "lucide-react";
import CinematicNav from "@/components/Cinematicnav";
import SiteFooter from "@/components/SiteFooter";
import ScrollProgress from "@/lib/animations/scroll-progress";
import TransitionLink from "@/components/TransitionLink";

gsap.registerPlugin(ScrollTrigger);

export interface LegalSection {
    heading: string;
    body: React.ReactNode;
}

interface Props {
    badge: string;         // e.g. "Legal"
    title: string[];       // words split for animation, e.g. ["Privacy", "Policy."]
    subtitle: string;
    lastUpdated: string;
    sections: LegalSection[];
}

export default function LegalPageLayout({ badge, title, subtitle, lastUpdated, sections }: Props) {
    const heroRef = useRef<HTMLDivElement>(null);
    const wordRefs = useRef<HTMLSpanElement[]>([]);
    const subRef = useRef<HTMLParagraphElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const tocRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero entrance
            const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
            tl.fromTo(wordRefs.current,
                { yPercent: 110, opacity: 0 },
                { yPercent: 0, opacity: 1, stagger: 0.1, duration: 1.2 }, 0.3)
                .fromTo(lineRef.current,
                    { scaleX: 0 },
                    { scaleX: 1, transformOrigin: "left", duration: 1.1 }, 0.9)
                .fromTo(subRef.current,
                    { opacity: 0, y: 16, filter: "blur(6px)" },
                    { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 }, 1.1);

            // TOC slide in
            gsap.fromTo(tocRef.current,
                { opacity: 0, x: -24 },
                {
                    opacity: 1, x: 0, duration: 0.9, ease: "power2.out",
                    scrollTrigger: { trigger: contentRef.current, start: "top 80%", toggleActions: "play none none none" }
                }
            );

            // Sections stagger
            gsap.fromTo(contentRef.current?.querySelectorAll(".legal-section") ?? [],
                { opacity: 0, y: 28 },
                {
                    opacity: 1, y: 0, stagger: 0.08, duration: 0.75, ease: "power2.out",
                    scrollTrigger: { trigger: contentRef.current, start: "top 82%", toggleActions: "play none none none" }
                }
            );
        });
        return () => ctx.revert();
    }, []);

    return (
        <div className="relative min-h-screen" style={{ background: "var(--bg-primary)" }}>
            <ScrollProgress />
            <CinematicNav />

            {/* ── Hero ─────────────────────────────────────────────────────── */}
            <div ref={heroRef}
                className="relative min-h-[52vh] flex flex-col justify-end px-6 lg:px-12 pb-16 pt-32 overflow-hidden"
                style={{ background: "var(--bg-primary)" }}>

                {/* Ambient radial */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 pointer-events-none"
                    style={{
                        width: 700, height: 500,
                        background: "radial-gradient(ellipse, rgba(212,175,55,0.04) 0%, transparent 65%)"
                    }} />

                {/* Grid decoration */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.025]"
                    style={{
                        backgroundImage: "linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)",
                        backgroundSize: "80px 80px"
                    }} />

                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)" }} />

                <div className="relative max-w-[900px]">
                    {/* Back link */}
                    <TransitionLink href="/" label="Home"
                        className="inline-flex items-center gap-2 mb-8 text-[9px] uppercase tracking-[0.4em] cursor-hover transition-colors duration-300"
                        style={{ color: "rgba(245,245,245,0.3)" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--accent-gold)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(245,245,245,0.3)"; }}>
                        <ArrowLeft size={11} /> Back to Home
                    </TransitionLink>

                    {/* Eyebrow */}
                    <div className="flex items-center gap-3 mb-5">
                        <span className="text-[8px] uppercase tracking-[0.7em] font-bold" style={{ color: "var(--accent-gold)" }}>
                            {badge}
                        </span>
                        <div style={{ width: 32, height: 1, background: "rgba(212,175,55,0.4)" }} />
                        <span className="text-[8px] uppercase tracking-[0.4em]" style={{ color: "var(--text-secondary)" }}>
                            SENZ8 · Parfum Maison
                        </span>
                    </div>

                    {/* Headline */}
                    <div className="flex flex-wrap gap-x-4 mb-1">
                        {title.map((w, i) => (
                            <div key={w} style={{ overflow: "hidden" }}>
                                <span
                                    ref={el => { if (el) wordRefs.current[i] = el; }}
                                    className="block font-black uppercase"
                                    style={{
                                        fontFamily: "var(--font-bodoni), 'Georgia', serif",
                                        fontSize: "clamp(44px,7.5vw,110px)",
                                        letterSpacing: "-0.04em", lineHeight: 0.88,
                                        color: i === title.length - 1 ? "var(--accent-gold)" : "var(--text-primary)",
                                    }}>
                                    {w}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Rule */}
                    <div ref={lineRef} className="mt-7 mb-5"
                        style={{
                            height: 1, width: "100%", maxWidth: 440,
                            background: "linear-gradient(90deg, #D4AF37, rgba(212,175,55,0.15), transparent)",
                            transformOrigin: "left"
                        }} />

                    {/* Subtitle + date */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8">
                        <p ref={subRef} className="text-sm opacity-0"
                            style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
                            {subtitle}
                        </p>
                        <span className="text-[8px] uppercase tracking-[0.45em] flex-shrink-0"
                            style={{ color: "rgba(212,175,55,0.4)" }}>
                            Last updated: {lastUpdated}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Body ─────────────────────────────────────────────────────── */}
            <div className="px-6 lg:px-12 pt-14 pb-24 max-w-[1100px] mx-auto">

                {/* Divider */}
                <div className="mb-14"
                    style={{ height: 1, background: "linear-gradient(90deg, #D4AF37, rgba(212,175,55,0.1), transparent)" }} />

                <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12 lg:gap-20 items-start">

                    {/* ── Table of contents (sticky) ── */}
                    <div ref={tocRef} className="lg:sticky lg:top-24 opacity-0">
                        <p className="text-[8px] uppercase tracking-[0.55em] font-bold mb-5"
                            style={{ color: "var(--accent-gold)" }}>Contents</p>
                        <nav className="flex flex-col gap-1">
                            {sections.map((s, i) => (
                                <a key={i}
                                    href={`#section-${i}`}
                                    className="flex items-center gap-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-colors duration-250 cursor-hover group"
                                    style={{ color: "rgba(245,245,245,0.25)" }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(245,245,245,0.25)"; }}>
                                    <span className="text-[7px] font-black" style={{ color: "rgba(212,175,55,0.4)" }}>
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    {s.heading}
                                </a>
                            ))}
                        </nav>

                        {/* Contact nudge */}
                        <div className="mt-10 p-4 rounded-xl"
                            style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.1)" }}>
                            <p className="text-[8px] uppercase tracking-[0.35em] mb-2" style={{ color: "var(--accent-gold)", opacity: 0.7 }}>
                                Questions?
                            </p>
                            <p className="text-[11px] mb-3" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                                Our team is happy to help clarify anything.
                            </p>
                            <TransitionLink href="/contact" label="Contact Us"
                                className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.3em] font-bold cursor-hover transition-colors duration-250"
                                style={{ color: "var(--accent-gold)" }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.7"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}>
                                Contact Us →
                            </TransitionLink>
                        </div>
                    </div>

                    {/* ── Sections ── */}
                    <div ref={contentRef} className="flex flex-col gap-12">
                        {sections.map((s, i) => (
                            <div key={i} id={`section-${i}`} className="legal-section opacity-0 scroll-mt-28">
                                {/* Section number + heading */}
                                <div className="flex items-center gap-4 mb-5">
                                    <span className="text-[9px] font-black"
                                        style={{ color: "rgba(212,175,55,0.35)", letterSpacing: "0.1em" }}>
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <div style={{ flex: 1, height: 1, background: "rgba(212,175,55,0.1)" }} />
                                </div>
                                <h2 className="font-black uppercase mb-5"
                                    style={{
                                        fontSize: "clamp(18px,2vw,26px)", letterSpacing: "-0.02em",
                                        color: "var(--text-primary)"
                                    }}>
                                    {s.heading}
                                </h2>
                                <div className="text-sm leading-relaxed space-y-3"
                                    style={{ color: "var(--text-secondary)", lineHeight: 1.9 }}>
                                    {s.body}
                                </div>
                            </div>
                        ))}

                        {/* Bottom gold rule */}
                        <div style={{ height: 1, background: "linear-gradient(90deg, rgba(212,175,55,0.2), transparent)" }} />
                        <p className="text-[8px] uppercase tracking-[0.55em]" style={{ color: "rgba(212,175,55,0.25)" }}>
                            SENZ8 · Parfum Maison · Est. 2024
                        </p>
                    </div>
                </div>
            </div>

            <SiteFooter />
        </div>
    );
}
