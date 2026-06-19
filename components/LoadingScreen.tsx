"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

interface Props {
    onComplete: () => void;
    onRegister: (trigger: () => void) => void;
}

export default function LoadingScreen({ onComplete, onRegister }: Props) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const leftPanelRef = useRef<HTMLDivElement>(null);
    const rightPanelRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const sublineRef = useRef<HTMLDivElement>(null);
    const progressLineRef = useRef<HTMLDivElement>(null);
    const fillRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);
    const line1Ref = useRef<HTMLDivElement>(null);
    const line2Ref = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    const [pct, setPct] = useState(0);
    const readyRef = useRef(false);
    const doneRef = useRef(false);
    const pctRef = useRef(0);

    useEffect(() => { pctRef.current = pct; }, [pct]);

    // ── Dismiss animation ────────────────────────────────────────────
    const dismiss = useCallback(() => {
        if (doneRef.current) return;
        doneRef.current = true;

        gsap.to(fillRef.current, {
            width: "100%", duration: 0.25, ease: "power2.out",
            onComplete: () => {
                const tl = gsap.timeline({ onComplete });

                // Glow pulse before wipe
                tl.to(glowRef.current, {
                    scale: 2.2, opacity: 0.9,
                    duration: 0.35, ease: "power2.out",
                }, 0);

                // Fade out counter + subline
                tl.to([sublineRef.current, progressLineRef.current], {
                    opacity: 0, y: -8, duration: 0.3, ease: "power2.in",
                }, 0);

                // Logo letters scatter upward with stagger
                tl.to(logoRef.current?.querySelectorAll(".ll") ?? [], {
                    y: -60, opacity: 0, stagger: 0.04,
                    duration: 0.5, ease: "power3.in",
                }, 0.05);

                // Horizontal accent lines retract
                tl.to([line1Ref.current, line2Ref.current], {
                    scaleX: 0, duration: 0.4, ease: "expo.in",
                }, 0);

                // Split-panel wipe — left slides left, right slides right
                tl.to(leftPanelRef.current, {
                    xPercent: -100, duration: 0.85, ease: "expo.inOut",
                }, 0.25);
                tl.to(rightPanelRef.current, {
                    xPercent: 100, duration: 0.85, ease: "expo.inOut",
                }, 0.25);
            },
        });
    }, [onComplete]);

    // ── Register trigger with parent ─────────────────────────────────
    useEffect(() => {
        onRegister(() => {
            readyRef.current = true;
            if (pctRef.current >= 100) dismiss();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Entry animation ──────────────────────────────────────────────
    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

            // Horizontal accent lines expand from center
            tl.fromTo([line1Ref.current, line2Ref.current],
                { scaleX: 0, opacity: 0 },
                { scaleX: 1, opacity: 1, transformOrigin: "center", duration: 0.9, stagger: 0.08 },
                0.1
            );

            // Logo letters rise from below, clipped by overflow:hidden parent
            tl.fromTo(logoRef.current?.querySelectorAll(".ll") ?? [],
                { yPercent: 120, opacity: 0 },
                { yPercent: 0, opacity: 1, stagger: 0.055, duration: 0.95 },
                0.25
            );

            // Progress bar slides in
            tl.fromTo(progressLineRef.current,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.5 },
                0.85
            );

            // Subline fades in
            tl.fromTo(sublineRef.current,
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.6 },
                0.95
            );
        }, wrapRef);
        return () => ctx.revert();
    }, []);

    // ── Progress tick ────────────────────────────────────────────────
    useEffect(() => {
        let raf: number;
        const tick = () => {
            setPct(prev => {
                const speed = prev < 70 ? 1.8 : prev < 97 ? 0.35 : 0;
                const next = Math.min(prev + speed, 97);
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

    // ── Failsafe ─────────────────────────────────────────────────────
    useEffect(() => {
        const t = setTimeout(() => dismiss(), 6000);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const display = Math.round(Math.min(pct, 100));

    const BRAND = "SENZ8";

    return (
        <div
            ref={wrapRef}
            className="fixed inset-0 z-[99999] overflow-hidden"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
            {/* ── Left panel ── */}
            <div
                ref={leftPanelRef}
                className="absolute inset-y-0 left-0 w-1/2"
                style={{ background: "#050507" }}
            />
            {/* ── Right panel ── */}
            <div
                ref={rightPanelRef}
                className="absolute inset-y-0 right-0 w-1/2"
                style={{ background: "#050507" }}
            />

            {/* Everything above panels */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">

                {/* Ambient radial glow — animates on dismiss */}
                <div
                    ref={glowRef}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                    style={{
                        width: 480,
                        height: 480,
                        background: "radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 68%)",
                        opacity: 0.6,
                    }}
                />

                {/* Grain texture */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.04]"
                    style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
                />

                {/* Corner brackets */}
                {(["tl", "tr", "bl", "br"] as const).map(pos => (
                    <div key={pos} className="absolute pointer-events-none"
                        style={{
                            width: 28, height: 28,
                            top: pos.startsWith("t") ? 28 : undefined,
                            bottom: pos.startsWith("b") ? 28 : undefined,
                            left: pos.endsWith("l") ? 28 : undefined,
                            right: pos.endsWith("r") ? 28 : undefined,
                            borderTop: pos.startsWith("t") ? "1px solid rgba(212,175,55,0.25)" : undefined,
                            borderBottom: pos.startsWith("b") ? "1px solid rgba(212,175,55,0.25)" : undefined,
                            borderLeft: pos.endsWith("l") ? "1px solid rgba(212,175,55,0.25)" : undefined,
                            borderRight: pos.endsWith("r") ? "1px solid rgba(212,175,55,0.25)" : undefined,
                        }} />
                ))}

                {/* ── Top horizontal accent line ── */}
                <div
                    ref={line1Ref}
                    className="absolute"
                    style={{
                        top: "calc(50% - clamp(80px, 12vw, 115px))",
                        left: "10%",
                        right: "10%",
                        height: 1,
                        opacity: 0,
                        background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.18) 20%, rgba(212,175,55,0.45) 50%, rgba(212,175,55,0.18) 80%, transparent)",
                    }}
                />

                {/* ── Bottom horizontal accent line ── */}
                <div
                    ref={line2Ref}
                    className="absolute"
                    style={{
                        top: "calc(50% + clamp(80px, 12vw, 115px))",
                        left: "10%",
                        right: "10%",
                        height: 1,
                        opacity: 0,
                        background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.18) 20%, rgba(212,175,55,0.45) 50%, rgba(212,175,55,0.18) 80%, transparent)",
                    }}
                />

                {/* ── Logo wordmark ── */}
                <div
                    ref={logoRef}
                    className="relative flex items-end overflow-hidden"
                    style={{ gap: "0.04em" }}
                >
                    {BRAND.split("").map((ch, i) => (
                        <span
                            key={i}
                            className="ll block font-black uppercase leading-none select-none"
                            style={{
                                fontFamily: "var(--font-bodoni), 'Georgia', serif",
                                fontSize: "clamp(64px, 12vw, 108px)",
                                letterSpacing: "-0.03em",
                                color: i === 4 ? "#D4AF37" : "#F5F5F5",
                                textShadow: i === 4
                                    ? "0 0 40px rgba(212,175,55,0.5), 0 0 80px rgba(212,175,55,0.2)"
                                    : "none",
                            }}
                        >
                            {ch}
                        </span>
                    ))}
                    {/* Gold pulse dot */}
                    <span
                        className="mb-2 ml-1.5 w-[8px] h-[8px] rounded-full animate-pulse flex-shrink-0"
                        style={{
                            background: "#D4AF37",
                            boxShadow: "0 0 16px rgba(212,175,55,0.9), 0 0 32px rgba(212,175,55,0.4)",
                        }}
                    />
                </div>

                {/* ── Progress bar ── */}
                <div
                    ref={progressLineRef}
                    className="flex flex-col items-center"
                    style={{ gap: 10, marginTop: "clamp(32px, 5vw, 52px)", opacity: 0 }}
                >
                    {/* Bar track */}
                    <div
                        className="relative overflow-hidden"
                        style={{
                            width: "clamp(200px, 28vw, 320px)",
                            height: 1,
                            background: "rgba(212,175,55,0.1)",
                        }}
                    >
                        {/* Fill */}
                        <div
                            ref={fillRef}
                            className="absolute inset-y-0 left-0"
                            style={{
                                width: `${display}%`,
                                background: "linear-gradient(90deg, rgba(212,175,55,0.5), #D4AF37)",
                                transition: "width 0.1s linear",
                                boxShadow: "0 0 12px rgba(212,175,55,0.6)",
                            }}
                        />
                        {/* Glowing head */}
                        <div
                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full pointer-events-none"
                            style={{
                                left: `${display}%`,
                                background: "#D4AF37",
                                boxShadow: "0 0 10px 3px rgba(212,175,55,0.8)",
                                transition: "left 0.1s linear",
                            }}
                        />
                    </div>

                    {/* Counter row */}
                    <div className="flex items-baseline" style={{ gap: 4 }}>
                        <span
                            ref={counterRef}
                            className="font-black tabular-nums"
                            style={{
                                fontSize: 11,
                                letterSpacing: "0.1em",
                                color: "#D4AF37",
                            }}
                        >
                            {String(display).padStart(3, "0")}
                        </span>
                        <span style={{ fontSize: 8, letterSpacing: "0.4em", color: "rgba(212,175,55,0.3)", textTransform: "uppercase" }}>
                            %
                        </span>
                    </div>
                </div>

                {/* ── Subline ── */}
                <div
                    ref={sublineRef}
                    style={{ marginTop: "clamp(16px, 3vw, 28px)", opacity: 0 }}
                >
                    <p
                        style={{
                            fontSize: 8,
                            letterSpacing: "0.7em",
                            textTransform: "uppercase",
                            color: "rgba(245,245,245,0.16)",
                            textAlign: "center",
                        }}
                    >
                        Parfum Maison &nbsp;·&nbsp; Est. 2024
                    </p>
                </div>

                {/* Bottom-right label */}
                <div
                    className="absolute bottom-7 right-7"
                    style={{
                        fontSize: 7,
                        letterSpacing: "0.5em",
                        textTransform: "uppercase",
                        color: "rgba(212,175,55,0.18)",
                    }}
                >
                    Loading Experience
                </div>

                {/* Top + bottom edge lines */}
                <div className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.25), transparent)" }} />
                <div className="absolute bottom-0 left-0 right-0 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.25), transparent)" }} />
            </div>
        </div>
    );
}
