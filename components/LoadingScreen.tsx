"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

interface Props {
    onComplete: () => void;
    onRegister: (trigger: () => void) => void;
}

export default function LoadingScreen({ onComplete, onRegister }: Props) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const fillRef = useRef<HTMLDivElement>(null);
    const tagRef = useRef<HTMLParagraphElement>(null);
    const curtainRef = useRef<HTMLDivElement>(null);
    const [pct, setPct] = useState(0);
    const readyRef = useRef(false);   // video is ready
    const doneRef = useRef(false);   // dismiss already fired
    const pctRef = useRef(0);       // latest pct without stale closure

    // Keep pctRef in sync
    useEffect(() => { pctRef.current = pct; }, [pct]);

    // ── Dismiss animation ────────────────────────────────────────────
    const dismiss = useCallback(() => {
        if (doneRef.current) return;
        doneRef.current = true;

        // Snap fill to 100 then wipe the curtain upward
        gsap.to(fillRef.current, {
            width: "100%", duration: 0.3, ease: "power2.out",
            onComplete: () => {
                gsap.timeline()
                    .to(logoRef.current, { opacity: 0, y: -24, duration: 0.45, ease: "power3.in" }, 0)
                    .to(tagRef.current, { opacity: 0, y: -12, duration: 0.35, ease: "power3.in" }, 0)
                    .to(barRef.current, { opacity: 0, duration: 0.3 }, 0.05)
                    .fromTo(curtainRef.current,
                        { yPercent: 0 },
                        {
                            yPercent: -100, duration: 0.9, ease: "expo.inOut",
                            onComplete: onComplete
                        }, 0.3);
            },
        });
    }, [onComplete]);

    // ── Register trigger with parent ─────────────────────────────────
    useEffect(() => {
        onRegister(() => {
            readyRef.current = true;
            // If progress bar has already reached 100, dismiss immediately
            // otherwise let the tick loop handle it
            if (pctRef.current >= 100) dismiss();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Entry animation ──────────────────────────────────────────────
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.timeline({ defaults: { ease: "expo.out" } })
                .fromTo(logoRef.current?.querySelectorAll(".logo-letter") ?? [],
                    { yPercent: 110, opacity: 0 },
                    { yPercent: 0, opacity: 1, stagger: 0.06, duration: 0.9 }, 0.2)
                .fromTo(barRef.current,
                    { scaleX: 0, opacity: 0 },
                    { scaleX: 1, opacity: 1, transformOrigin: "left", duration: 0.7 }, 0.7)
                .fromTo(tagRef.current,
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.6 }, 0.85);
        }, wrapRef);
        return () => ctx.revert();
    }, []);

    // ── Progress tick ────────────────────────────────────────────────
    useEffect(() => {
        let raf: number;

        const tick = () => {
            setPct(prev => {
                // Fast until 70, slow crawl 70–97, then stop and wait for video
                const speed = prev < 70 ? 1.8 : prev < 97 ? 0.35 : 0;
                const next = Math.min(prev + speed, 97);

                // If video is ready and we've hit a "good enough" point, push to 100
                if (readyRef.current && next >= 40) {
                    pctRef.current = 100;
                    dismiss();
                    return 100;
                }
                pctRef.current = next;
                return next;
            });
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Failsafe: if video never fires, dismiss after 6s
    useEffect(() => {
        const t = setTimeout(() => dismiss(), 6000);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const display = Math.round(Math.min(pct, 100));

    return (
        <div ref={wrapRef}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
            style={{ background: "#050507" }}>

            {/* Grain overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
                style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />

            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                    width: 600, height: 600,
                    background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 65%)"
                }} />

            {/* Grid decoration */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
                style={{
                    backgroundImage: "linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)",
                    backgroundSize: "80px 80px"
                }} />

            {/* Corner brackets */}
            {(["tl", "tr", "bl", "br"] as const).map(pos => (
                <div key={pos} className="absolute pointer-events-none"
                    style={{
                        width: 32, height: 32,
                        top: pos.startsWith("t") ? 32 : undefined,
                        bottom: pos.startsWith("b") ? 32 : undefined,
                        left: pos.endsWith("l") ? 32 : undefined,
                        right: pos.endsWith("r") ? 32 : undefined,
                        borderTop: pos.startsWith("t") ? "1px solid rgba(212,175,55,0.3)" : undefined,
                        borderBottom: pos.startsWith("b") ? "1px solid rgba(212,175,55,0.3)" : undefined,
                        borderLeft: pos.endsWith("l") ? "1px solid rgba(212,175,55,0.3)" : undefined,
                        borderRight: pos.endsWith("r") ? "1px solid rgba(212,175,55,0.3)" : undefined,
                    }} />
            ))}

            {/* ── Centre content ── */}
            <div className="relative flex flex-col items-center gap-10 select-none">

                {/* SENZ8 logo */}
                <div ref={logoRef} className="flex items-end gap-0.5">
                    {"SENZ8".split("").map((ch, i) => (
                        <span key={i} className="logo-letter block font-black uppercase overflow-hidden"
                            style={{
                                fontFamily: "var(--font-bodoni), 'Georgia', serif",
                                fontSize: "clamp(52px, 10vw, 88px)",
                                letterSpacing: "-0.04em",
                                lineHeight: 1,
                                color: i === 4 ? "var(--accent-gold)" : "var(--text-primary)",
                            }}>
                            {ch}
                        </span>
                    ))}
                    {/* Pulsing dot */}
                    <span className="mb-2 ml-1.5 w-[7px] h-[7px] rounded-full animate-pulse flex-shrink-0"
                        style={{ background: "var(--accent-gold)", boxShadow: "0 0 14px rgba(212,175,55,0.8)" }} />
                </div>

                {/* Progress bar + counter */}
                <div ref={barRef} className="flex flex-col items-center gap-3" style={{ opacity: 0 }}>
                    <div className="relative overflow-hidden"
                        style={{ width: "clamp(200px, 30vw, 340px)", height: 1, background: "rgba(212,175,55,0.12)" }}>
                        <div ref={fillRef} className="absolute inset-y-0 left-0"
                            style={{
                                width: `${display}%`,
                                background: "linear-gradient(90deg, rgba(212,175,55,0.7), #D4AF37)",
                                transition: "width 0.12s linear",
                                boxShadow: "0 0 10px rgba(212,175,55,0.5)",
                            }} />
                        {/* Glowing head dot */}
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full pointer-events-none"
                            style={{
                                left: `${display}%`, background: "#D4AF37",
                                boxShadow: "0 0 8px 2px rgba(212,175,55,0.7)",
                                transition: "left 0.12s linear"
                            }} />
                    </div>

                    <div className="flex items-baseline gap-1.5">
                        <span className="font-black tabular-nums"
                            style={{ fontSize: 13, letterSpacing: "0.06em", color: "var(--accent-gold)" }}>
                            {String(display).padStart(3, "0")}
                        </span>
                        <span className="text-[9px] uppercase tracking-[0.35em]"
                            style={{ color: "rgba(212,175,55,0.35)" }}>%</span>
                    </div>
                </div>

                {/* Tagline */}
                <p ref={tagRef} className="text-[8px] uppercase tracking-[0.75em]"
                    style={{ color: "rgba(245,245,245,0.18)", opacity: 0 }}>
                    Parfum Maison · Est. 2024
                </p>
            </div>

            {/* Top + bottom accent lines */}
            <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)" }} />
            <div className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)" }} />

            {/* Build label bottom-right */}
            <div className="absolute bottom-8 right-8 text-[8px] uppercase tracking-[0.5em]"
                style={{ color: "rgba(212,175,55,0.2)" }}>
                Loading Experience
            </div>

            {/* Exit curtain — slides up over everything */}
            <div ref={curtainRef} className="absolute inset-0 pointer-events-none"
                style={{ background: "#050507", zIndex: 10 }} />
        </div>
    );
}
