"use client";

/**
 * PageTransition â€” Cinematic wipe system
 * â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 *
 * HOW IT WORKS (correctly):
 *
 * EXIT  â”€â”€ User clicks TransitionLink
 *   1. Two panels sweep in from left-edge simultaneously (staggered 80ms)
 *      using clipPath so it's a true wipe, not a slide.
 *   2. While panels are covering the screen, product name types/reveals.
 *   3. After panels are fully opaque â†’ router.push() fires.
 *      The NEW page renders underneath the opaque panels (invisible).
 *
 * ENTER â”€â”€ pathname changes (new page is rendered)
 *   4. Brief hold (0.15s) so the new page fully paints.
 *   5. Both panels wipe back out to the right edge (reverse direction).
 *   6. Page content is now fully visible.
 *
 * DESIGN:
 *   - Two offset panels: obsidian black + deep charcoal â€” creates depth
 *   - Gold ink-streak diagonal runs across during the wipe
 *   - Product name reveals char-by-char in the centre
 *   - Bodoni Moda serif for the label, matching homepage typography
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

// â”€â”€â”€ Context â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface TransitionCtx {
    navigate: (href: string, label?: string) => void;
}
const Ctx = createContext<TransitionCtx>({ navigate: () => { } });
export const useTransition = () => useContext(Ctx);

// â”€â”€â”€ Helper: split text into char spans for the reveal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SplitLabel({ text }: { text: string }) {
    return (
        <>
            {text.split("").map((ch, i) => (
                <span
                    key={i}
                    className="ct-char inline-block"
                    style={{ display: "inline-block", whiteSpace: ch === " " ? "pre" : "normal" }}
                >
                    {ch === " " ? "\u00A0" : ch}
                </span>
            ))}
        </>
    );
}

// â”€â”€â”€ Provider â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function PageTransitionProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    // panels
    const panel1Ref = useRef<HTMLDivElement>(null);
    const panel2Ref = useRef<HTMLDivElement>(null);
    // inner content
    const brandRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const streakRef = useRef<HTMLDivElement>(null);

    const isAnimating = useRef(false);
    const didNavigate = useRef(false);
    const [label, setLabel] = useState("");

    // â”€â”€ ENTER: panels wipe out when pathname changes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    useEffect(() => {
        // On first mount the panels are already off-screen (clipPath = inset 0 0 0 100%)
        // so nothing plays on first load.
        if (!didNavigate.current) return;
        didNavigate.current = false;

        const tl = gsap.timeline();

        // hold briefly â€” let new page paint under the panels
        tl.to({}, { duration: 0.18 })
            // fade out label content first
            .to([brandRef.current, labelRef.current, lineRef.current], {
                opacity: 0, duration: 0.22, ease: "power2.in",
            })
            // panel 2 (back) wipes out first
            .to(panel2Ref.current, {
                clipPath: "inset(0 100% 0 0)",
                duration: 0.7,
                ease: "expo.inOut",
            }, 0.3)
            // panel 1 (front) wipes out slightly after
            .to(panel1Ref.current, {
                clipPath: "inset(0 100% 0 0)",
                duration: 0.65,
                ease: "expo.inOut",
            }, 0.42)
            .set([panel1Ref.current, panel2Ref.current], {
                clipPath: "inset(0 100% 0 0)", // back to hidden
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    // â”€â”€ EXIT: panels wipe in, then navigate â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const navigate = useCallback((href: string, lbl = "") => {
        if (isAnimating.current) return;
        if (href === pathname) return;

        isAnimating.current = true;
        setLabel(lbl);

        // Reset panels to right-side hidden state
        gsap.set(panel1Ref.current, { clipPath: "inset(0 100% 0 0)" });
        gsap.set(panel2Ref.current, { clipPath: "inset(0 100% 0 0)" });
        gsap.set([brandRef.current, labelRef.current, lineRef.current], { opacity: 0 });
        gsap.set(streakRef.current, { x: "-100%", opacity: 0 });

        const tl = gsap.timeline({
            onComplete: () => {
                isAnimating.current = false;
                didNavigate.current = true;
                router.push(href);
            },
        });

        // 1. Panel 2 (back, slightly offset) sweeps in from right
        tl.to(panel2Ref.current, {
            clipPath: "inset(0 0% 0 0)",
            duration: 0.58,
            ease: "expo.inOut",
        }, 0)
            // 2. Panel 1 (front) sweeps in 80ms later
            .to(panel1Ref.current, {
                clipPath: "inset(0 0% 0 0)",
                duration: 0.52,
                ease: "expo.inOut",
            }, 0.08)
            // 3. Gold streak diagonal
            .fromTo(streakRef.current,
                { x: "-100%", opacity: 0 },
                {
                    x: "100%", opacity: 0,
                    keyframes: { opacity: [0, 0.6, 0.6, 0], x: ["-100%", "0%", "60%", "140%"] },
                    duration: 0.55, ease: "power2.inOut"
                },
                0.1)
            // 4. Brand label fades in
            .to(brandRef.current, {
                opacity: 1, duration: 0.25, ease: "power2.out",
            }, 0.42)
            // 5. Divider line draws
            .fromTo(lineRef.current,
                { scaleX: 0 },
                { scaleX: 1, duration: 0.4, ease: "expo.out", transformOrigin: "left" },
                0.5)
            // 6. Label chars stagger in
            .fromTo(".ct-char",
                { yPercent: 110, opacity: 0 },
                { yPercent: 0, opacity: 1, stagger: 0.035, duration: 0.5, ease: "expo.out" },
                0.52)
            // 7. Hold so it reads
            .to({}, { duration: 0.25 });

    }, [pathname, router]);

    return (
        <Ctx.Provider value={{ navigate }}>
            {children}

            {/* â”€â”€ Panel 2 â€” back layer, charcoal, slightly offset â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div
                ref={panel2Ref}
                className="fixed inset-0 pointer-events-none"
                style={{
                    zIndex: 9994,
                    clipPath: "inset(0 100% 0 0)",
                    background: "linear-gradient(135deg, #111118 0%, #0c0c12 100%)",
                    transform: "skewX(-1.5deg) scaleX(1.02)",
                    transformOrigin: "right",
                }}
            />

            {/* â”€â”€ Panel 1 â€” front layer, near-black â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div
                ref={panel1Ref}
                className="fixed inset-0 pointer-events-none"
                style={{
                    zIndex: 9995,
                    clipPath: "inset(0 100% 0 0)",
                    background: "linear-gradient(155deg, #07070c 0%, #09090e 50%, #0a080f 100%)",
                }}
            >
                {/* Subtle grain */}
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />

                {/* Ambient gold radial */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    background: "radial-gradient(ellipse 50% 35% at 50% 55%, rgba(212,175,55,0.07) 0%, transparent 70%)",
                }} />

                {/* Gold diagonal streak */}
                <div ref={streakRef} className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(105deg, transparent 25%, rgba(212,175,55,0.55) 50%, transparent 75%)",
                        opacity: 0,
                    }} />
                </div>

                {/* Corner brackets */}
                {[
                    { top: 28, left: 28, bt: "Top", bl: "Left" },
                    { top: 28, right: 28, bt: "Top", bl: "Right" },
                    { bottom: 28, left: 28, bt: "Bottom", bl: "Left" },
                    { bottom: 28, right: 28, bt: "Bottom", bl: "Right" },
                ].map((pos, i) => (
                    <div key={i} className="absolute pointer-events-none" style={{
                        ...Object.fromEntries(Object.entries(pos).filter(([k]) => k !== "bt" && k !== "bl")),
                        width: 20, height: 20,
                        [`border${pos.bt}`]: "1px solid rgba(212,175,55,0.35)",
                        [`border${pos.bl}`]: "1px solid rgba(212,175,55,0.35)",
                    }} />
                ))}

                {/* Centre content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-8">

                    {/* Brand */}
                    <div ref={brandRef} className="flex items-end gap-1.5" style={{ opacity: 0 }}>
                        <span style={{
                            fontFamily: "var(--font-bodoni), 'Georgia', serif",
                            fontSize: 11, fontWeight: 700,
                            letterSpacing: "0.52em", textTransform: "uppercase",
                            color: "rgba(245,245,245,0.35)",
                        }}>
                            senz8
                        </span>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#D4AF37", marginBottom: 2, display: "inline-block" }} />
                    </div>

                    {/* Gold rule */}
                    <div ref={lineRef} style={{
                        width: 48, height: 1,
                        background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)",
                        transformOrigin: "left",
                    }} />

                    {/* Destination label */}
                    <div ref={labelRef} style={{ overflow: "hidden", opacity: 1 }}>
                        <p className="font-black uppercase text-center"
                            style={{
                                fontSize: "clamp(26px, 5vw, 72px)",
                                letterSpacing: "-0.04em", lineHeight: 0.9,
                                color: "var(--text-primary)",
                            }}>
                            <SplitLabel text={label || "SENZ8"} />
                        </p>
                    </div>

                </div>
            </div>
        </Ctx.Provider>
    );
}
