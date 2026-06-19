"use client";

/**
 * PageTransition — Silk wipe system
 * ─────────────────────────────────
 *
 * EXIT (user clicks TransitionLink)
 *   1. Thin gold bar at top shoots across left→right (80ms).
 *   2. A single frosted panel sweeps UP from the bottom edge via clipPath.
 *      It moves fast — 480ms expo.inOut — screen covered by ~0.5s.
 *   3. Destination label does a blur→sharp fade in the centre.
 *   4. router.push() fires the moment the panel fully covers the screen.
 *
 * ENTER (pathname changes, new page rendered under the panel)
 *   5. Brief 120ms hold so the new page fully paints.
 *   6. Label fades out (100ms).
 *   7. Panel sweeps UP and OUT — same direction, continuous motion,
 *      feels like one fluid gesture rather than a bounce-back.
 *   8. A second gold bar at bottom wipes right→left as it exits (bookend).
 *
 * WHY IT FEELS FAST:
 *   - Panel covers screen in < 500ms, navigation fires immediately after.
 *   - Enter reveal is only 520ms, starts after just 120ms hold.
 *   - The directional continuity (always up) makes the brain read it as
 *     "page turning" not "loading".
 *   - The progress bar at top gives a live "something is happening" signal.
 */

import {
    createContext,
    useContext,
    useRef,
    useEffect,
    useCallback,
    useState,
    type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";

interface TransitionCtx {
    navigate: (href: string, label?: string) => void;
}
const Ctx = createContext<TransitionCtx>({ navigate: () => { } });
export const useTransition = () => useContext(Ctx);

// ─────────────────────────────────────────────────────────────────────────────
export function PageTransitionProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const panelRef = useRef<HTMLDivElement>(null);
    const labelWrapRef = useRef<HTMLDivElement>(null);
    const labelTextRef = useRef<HTMLParagraphElement>(null);
    const topBarRef = useRef<HTMLDivElement>(null);
    const bottomBarRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const brandRef = useRef<HTMLDivElement>(null);

    const isAnimating = useRef(false);
    const didNavigate = useRef(false);
    const [label, setLabel] = useState("");

    // ── ENTER: reveal the new page after pathname changes ───────────────────
    useEffect(() => {
        if (!didNavigate.current) return;
        didNavigate.current = false;

        const tl = gsap.timeline();

        // Hold briefly — let the new page finish painting
        tl.to({}, { duration: 0.12 })

            // Brand + label blur-out
            .to([brandRef.current, labelTextRef.current], {
                opacity: 0,
                filter: "blur(14px)",
                y: -10,
                duration: 0.22,
                ease: "power2.in",
            }, 0.0)

            // Top bar retracts
            .to(topBarRef.current, {
                scaleX: 0,
                transformOrigin: "right",
                duration: 0.3,
                ease: "expo.in",
            }, 0.05)

            // Panel sweeps UP and off — continuous upward motion
            .to(panelRef.current, {
                clipPath: "inset(0 0 100% 0)",
                duration: 0.52,
                ease: "expo.inOut",
            }, 0.14)

            // Bottom bar flashes on as panel exits — bookend moment
            .fromTo(bottomBarRef.current,
                { opacity: 0, scaleX: 1, transformOrigin: "right" },
                { opacity: 1, duration: 0.2, ease: "power2.out", yoyo: true, repeat: 1 },
                0.18)

            // Final reset
            .set(panelRef.current, { clipPath: "inset(100% 0 0 0)" });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    // ── EXIT: cover screen then navigate ────────────────────────────────────
    const navigate = useCallback((href: string, lbl = "") => {
        if (isAnimating.current) return;
        if (href === pathname) return;

        isAnimating.current = true;
        setLabel(lbl);

        // Reset to ready state: panel parked below the screen
        gsap.set(panelRef.current, { clipPath: "inset(100% 0 0 0)" });
        gsap.set(topBarRef.current, { scaleX: 0, transformOrigin: "left", opacity: 1 });
        gsap.set(bottomBarRef.current, { scaleX: 0, opacity: 0 });
        gsap.set([brandRef.current, labelTextRef.current], {
            opacity: 0, filter: "blur(18px)", y: 12,
        });
        gsap.set(glowRef.current, { opacity: 0, scale: 0.7 });

        const tl = gsap.timeline({
            onComplete: () => {
                isAnimating.current = false;
                didNavigate.current = true;
                router.push(href);
            },
        });

        // 1. Top bar shoots left→right
        tl.to(topBarRef.current, {
            scaleX: 1,
            duration: 0.28,
            ease: "expo.out",
        }, 0)

            // 2. Panel sweeps UP from bottom
            .to(panelRef.current, {
                clipPath: "inset(0 0 0% 0)",
                duration: 0.48,
                ease: "expo.inOut",
            }, 0.06)

            // 3. Glow pulse in centre
            .to(glowRef.current, {
                opacity: 1, scale: 1,
                duration: 0.35, ease: "power2.out",
            }, 0.28)

            // 4. Brand label fades in sharp
            .to(brandRef.current, {
                opacity: 1, filter: "blur(0px)", y: 0,
                duration: 0.28, ease: "power3.out",
            }, 0.3)

            // 5. Destination name resolves from blur
            .to(labelTextRef.current, {
                opacity: 1, filter: "blur(0px)", y: 0,
                duration: 0.38, ease: "power3.out",
            }, 0.36)

            // 6. Brief hold — reads the label, feels intentional not stuck
            .to({}, { duration: 0.18 });

    }, [pathname, router]);

    return (
        <Ctx.Provider value={{ navigate }}>
            {children}

            {/* ── Panel ── */}
            <div
                ref={panelRef}
                className="fixed inset-0 pointer-events-none"
                style={{
                    zIndex: 9995,
                    clipPath: "inset(100% 0 0 0)",
                    background: "#07070b",
                    willChange: "clip-path",
                }}
            >
                {/* Grain */}
                <div
                    className="absolute inset-0 opacity-[0.045] pointer-events-none"
                    style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
                />

                {/* Ambient gold radial — makes it feel lit, not void */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(ellipse 55% 40% at 50% 54%, rgba(212,175,55,0.06) 0%, transparent 70%)",
                    }}
                />

                {/* Corner brackets */}
                {(["tl", "tr", "bl", "br"] as const).map(pos => (
                    <div key={pos} className="absolute pointer-events-none" style={{
                        width: 22, height: 22,
                        top: pos.startsWith("t") ? 24 : undefined,
                        bottom: pos.startsWith("b") ? 24 : undefined,
                        left: pos.endsWith("l") ? 24 : undefined,
                        right: pos.endsWith("r") ? 24 : undefined,
                        borderTop: pos.startsWith("t") ? "1px solid rgba(212,175,55,0.2)" : undefined,
                        borderBottom: pos.startsWith("b") ? "1px solid rgba(212,175,55,0.2)" : undefined,
                        borderLeft: pos.endsWith("l") ? "1px solid rgba(212,175,55,0.2)" : undefined,
                        borderRight: pos.endsWith("r") ? "1px solid rgba(212,175,55,0.2)" : undefined,
                    }} />
                ))}

                {/* Top progress bar — shoots across on entry */}
                <div
                    ref={topBarRef}
                    className="absolute top-0 left-0 right-0"
                    style={{
                        height: 1,
                        background:
                            "linear-gradient(90deg, transparent, rgba(212,175,55,0.9) 40%, #D4AF37 60%, transparent)",
                        transformOrigin: "left",
                        boxShadow: "0 0 12px 1px rgba(212,175,55,0.5)",
                        transform: "scaleX(0)",
                    }}
                />

                {/* Bottom exit bar */}
                <div
                    ref={bottomBarRef}
                    className="absolute bottom-0 left-0 right-0"
                    style={{
                        height: 1,
                        background:
                            "linear-gradient(90deg, transparent, rgba(212,175,55,0.6) 40%, rgba(212,175,55,0.9) 60%, transparent)",
                        transform: "scaleX(0)",
                        transformOrigin: "right",
                    }}
                />

                {/* Centre content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center select-none">

                    {/* Soft glow behind text */}
                    <div
                        ref={glowRef}
                        className="absolute pointer-events-none"
                        style={{
                            width: 360, height: 360,
                            borderRadius: "50%",
                            background:
                                "radial-gradient(circle, rgba(212,175,55,0.09) 0%, transparent 65%)",
                            opacity: 0,
                        }}
                    />

                    {/* Brand wordmark */}
                    <div
                        ref={brandRef}
                        className="flex items-end gap-1"
                        style={{ opacity: 0, filter: "blur(18px)", marginBottom: "0.9rem" }}
                    >
                        <span style={{
                            fontFamily: "var(--font-bodoni), 'Georgia', serif",
                            fontSize: 10, fontWeight: 700,
                            letterSpacing: "0.55em", textTransform: "uppercase",
                            color: "rgba(245,245,245,0.3)",
                        }}>
                            senz8
                        </span>
                        <span style={{
                            width: 4, height: 4, borderRadius: "50%",
                            background: "#D4AF37", marginBottom: 1,
                            display: "inline-block",
                            boxShadow: "0 0 8px rgba(212,175,55,0.8)",
                        }} />
                    </div>

                    {/* Thin gold rule */}
                    <div style={{
                        width: 36, height: 1, marginBottom: "1.1rem",
                        background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
                    }} />

                    {/* Destination name */}
                    <div ref={labelWrapRef} style={{ overflow: "hidden", textAlign: "center" }}>
                        <p
                            ref={labelTextRef}
                            style={{
                                fontFamily: "var(--font-bodoni), 'Georgia', serif",
                                fontWeight: 800,
                                fontSize: "clamp(28px, 5.5vw, 76px)",
                                letterSpacing: "-0.03em",
                                lineHeight: 0.88,
                                color: "#F5F5F5",
                                textTransform: "uppercase",
                                opacity: 0,
                                filter: "blur(18px)",
                                textShadow: "0 0 60px rgba(212,175,55,0.15)",
                                transform: "translateY(12px)",
                            }}
                        >
                            {label || "SENZ8"}
                        </p>
                    </div>

                </div>
            </div>
        </Ctx.Provider>
    );
}
