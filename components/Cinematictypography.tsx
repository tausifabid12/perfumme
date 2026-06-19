"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TransitionLink from "@/components/TransitionLink";

gsap.registerPlugin(ScrollTrigger);

export default function CinematicTypography({ canAnimate = false }: { canAnimate?: boolean }) {
    const smokeRef = useRef<HTMLDivElement>(null);
    const rebelRef = useRef<HTMLDivElement>(null);
    const itboyRef = useRef<HTMLDivElement>(null);
    const mouseX = useRef(0);
    const mouseY = useRef(0);
    //@ts-ignore
    const rafRef = useRef<number>();

    useEffect(() => {
        if (!canAnimate) return;
        // Fonts loaded globally via next/font in layout.tsx — no runtime injection needed

        const isMobile = window.innerWidth < 768;

        const onMouse = (e: MouseEvent) => {
            mouseX.current = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY.current = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener("mousemove", onMouse, { passive: true });

        const getScrollPx = (pct: number) => {
            // GodModeExperience = 1300vh. Cinematic scroll max = 1200vh (1300 - 100 viewport).
            const cinematicScrollMax = window.innerHeight * 12; // 1200vh
            return cinematicScrollMax * pct;
        };

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        // SECTION 1 â€” IMPERIAL SMOKE
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        const smokeEl = smokeRef.current!;

        const chars = smokeEl.querySelectorAll<HTMLElement>("[data-char]");
        gsap.set(chars, { opacity: 0, filter: "blur(40px)", y: 10 });
        gsap.to(chars, {
            opacity: 1, filter: "blur(0px)", y: 0,
            duration: 1.4, ease: "power3.out",
            stagger: { each: 0.05, from: "start" },
            delay: 0.2,
        });

        gsap.fromTo(
            smokeEl.querySelectorAll("[data-smoke-sub]"),
            { opacity: 0, y: 18, filter: "blur(6px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.0, ease: "power2.out", stagger: 0.15, delay: 1.1 }
        );

        ScrollTrigger.create({
            trigger: document.body,
            start: () => `${getScrollPx(0.035)}px top`,
            end: () => `${getScrollPx(0.075)}px top`,
            scrub: 1.5,
            animation: gsap.to(smokeEl, {
                opacity: 0, y: -28, filter: "blur(10px)",
                ease: "power2.in", paused: true,
            }),
            onUpdate: self => {
                smokeEl.style.pointerEvents = self.progress > 0.9 ? "none" : "auto";
            },
        });

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        // SECTION 2 â€” REBEL GIRL
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        const rebelEl = rebelRef.current!;
        gsap.set(rebelEl, { opacity: 0, pointerEvents: "none" });
        gsap.set("[data-rebel-label]", { opacity: 0, x: 24 });
        gsap.set("[data-rebel-word='0']", { opacity: 0, x: -70, rotation: -3, filter: "blur(14px)" });
        gsap.set("[data-rebel-word='1']", { opacity: 0, x: 70, rotation: 3, filter: "blur(14px)" });
        gsap.set(rebelEl.querySelectorAll("[data-rebel-sub]"), { opacity: 0, y: 18, filter: "blur(6px)" });

        const rebelTl = gsap.timeline({ paused: true });
        rebelTl
            .to(rebelEl, { opacity: 1, duration: 0.15 }, 0)
            .to("[data-rebel-label]", { opacity: 1, x: 0, duration: 0.25, ease: "power2.out" }, 0.03)
            .to("[data-rebel-word='0']", { opacity: 1, x: 0, rotation: 0, filter: "blur(0px)", duration: 0.4, ease: "power3.out" }, 0.05)
            .to("[data-rebel-word='1']", { opacity: 1, x: 0, rotation: 0, filter: "blur(0px)", duration: 0.4, ease: "power3.out" }, 0.12)
            .to(rebelEl.querySelectorAll("[data-rebel-sub]"), { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.3, ease: "power2.out", stagger: 0.05 }, 0.22)
            .to({}, { duration: 0.25 }, 0.6)
            .to(rebelEl, { opacity: 0, y: -22, filter: "blur(8px)", duration: 0.25, ease: "power1.in" }, 0.85);

        ScrollTrigger.create({
            trigger: document.body,
            start: () => `${getScrollPx(0.17)}px top`,
            end: () => `${getScrollPx(0.42)}px top`,
            scrub: 1.2,
            animation: rebelTl,
            onUpdate: self => {
                rebelEl.style.pointerEvents = (self.progress > 0.05 && self.progress < 0.92) ? "auto" : "none";
            },
        });

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        // SECTION 3 â€” IT BOY
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        const itEl = itboyRef.current!;
        const itWord = itEl.querySelector<HTMLElement>("[data-it-word]")!;
        const boyWord = itEl.querySelector<HTMLElement>("[data-boy-word]")!;
        const itSubs = itEl.querySelectorAll<HTMLElement>("[data-it-sub]");

        gsap.set(itEl, { opacity: 0, pointerEvents: "none" });
        gsap.set(itWord, { opacity: 0, y: 55, filter: "blur(18px)" });
        gsap.set(boyWord, { opacity: 0, y: 55, filter: "blur(18px)" });
        gsap.set(itSubs, { opacity: 0, y: 14 });

        const itInTl = gsap.timeline({ paused: true });
        itInTl
            .to(itEl, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0)
            .to(itWord, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "expo.out" }, 0.1)
            .to(boyWord, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "expo.out" }, 0.22)
            .to(itSubs, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.08 }, 0.45);

        ScrollTrigger.create({
            trigger: document.body,
            start: () => `${getScrollPx(0.88)}px top`,
            scrub: false,
            onEnter: () => { itEl.style.pointerEvents = "auto"; itInTl.play(); },
            onLeaveBack: () => { itEl.style.pointerEvents = "none"; itInTl.reverse(); },
        });

        // ── Hide the entire fixed overlay once the user scrolls past the
        //    cinematic zone (800vh GodModeExperience) into the normal page.
        //    This is the ONLY thing that clears the IT BOY text — no early fade.
        const overlayEl = smokeEl.closest<HTMLElement>(".ct-overlay");
        if (overlayEl) {
            ScrollTrigger.create({
                trigger: document.body,
                start: () => `${getScrollPx(0.998)}px top`,
                onEnter: () => {
                    overlayEl.style.visibility = "hidden";
                    overlayEl.style.pointerEvents = "none";
                },
                onLeaveBack: () => {
                    overlayEl.style.visibility = "";
                    overlayEl.style.pointerEvents = "";
                },
            });
        }

        // â”€â”€ Floating breathe (desktop only â€” skip on touch) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        if (!isMobile) {
            const breathe = (t: number) => {
                rafRef.current = requestAnimationFrame(breathe);
                const s = t * 0.001;

                gsap.set(smokeEl, {
                    x: mouseX.current * 7 + Math.sin(s * 0.45) * 3,
                    y: mouseY.current * 5 + Math.sin(s * 0.38) * 4,
                    overwrite: false,
                });

                if (parseFloat(rebelEl.style.opacity || "0") > 0.05) {
                    gsap.set(rebelEl, {
                        x: mouseX.current * 7 + Math.sin(s * 0.5 + 1.2) * 3,
                        y: mouseY.current * 5 + Math.cos(s * 0.4 + 1.2) * 3,
                        overwrite: false,
                    });
                }

                if (parseFloat(itEl.style.opacity || "0") > 0.05) {
                    gsap.set(itEl, {
                        x: mouseX.current * 3,
                        y: mouseY.current * 2,
                        overwrite: false,
                    });
                }
            };
            rafRef.current = requestAnimationFrame(breathe);
        }

        return () => {
            window.removeEventListener("mousemove", onMouse);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [canAnimate]);

    const SplitChars = ({ text }: { text: string }) => (
        <span aria-label={text} className="inline-block">
            {text.split("").map((ch, i) => (
                <span key={i} data-char className="inline-block"
                    style={{ whiteSpace: ch === " " ? "pre" : "normal" }}>
                    {ch === " " ? "\u00A0" : ch}
                </span>
            ))}
        </span>
    );

    return (
        <>
            <style>{`

                .ct-overlay {
                    position: fixed; inset: 0; z-index: 10; pointer-events: none;
                }

                /* â”€â”€â”€ LABEL / NUMBER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
                .ct-label {
                    font-family: var(--font-inter), system-ui, sans-serif;
                    font-weight: 300;
                    font-size: 9px;
                    letter-spacing: 0.55em;
                    text-transform: uppercase;
                    margin: 0 0 0.6rem;
                }

                /* â”€â”€â”€ HEADLINE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
                .ct-h2 {
                    font-family: var(--font-bodoni), 'Georgia', serif;
                    font-weight: 800;
                    line-height: 0.9;
                    color: #fff;
                    margin: 0;
                    letter-spacing: -0.01em;
                    /* Mobile default */
                    font-size: clamp(38px, 10vw, 60px);
                }

                /* â”€â”€â”€ SUBTEXT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
                .ct-sub {
                    font-family: var(--font-inter), system-ui, sans-serif;
                    font-weight: 300;
                    font-size: 10px;
                    letter-spacing: 0.28em;
                    text-transform: uppercase;
                    line-height: 1.9;
                    margin: 0;
                }

                /* â”€â”€â”€ RULE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
                .ct-rule {
                    width: 36px; height: 1px;
                    margin: 0.8rem 0;
                }

                /* â”€â”€â”€ SECTION WRAPPERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
                /* SMOKE â€” bottom-left */
                .ct-smoke {
                    position: absolute;
                    bottom: 6%;
                    left: 5%;
                    max-width: 90vw;
                    pointer-events: auto;
                    will-change: transform, opacity, filter;
                }

                /* REBEL â€” top-right */
                .ct-rebel {
                    position: absolute;
                    top: 6%;
                    right: 5%;
                    max-width: 90vw;
                    text-align: right;
                    pointer-events: none;
                    opacity: 0;
                    will-change: transform, opacity, filter;
                }

                /* ITBOY wrapper */
                .ct-itboy {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    opacity: 0;
                    will-change: transform, opacity;
                }

                /* IT â€” bottom-left */
                .ct-it {
                    position: absolute;
                    bottom: 5%;
                    left: 4%;
                }

                /* BOY â€” bottom-right */
                .ct-boy {
                    position: absolute;
                    bottom: 5%;
                    right: 4%;
                    text-align: right;
                }

                /* IT / BOY giant word */
                .ct-giant {
                    font-family: var(--font-bodoni), 'Georgia', serif;
                    font-weight: 800;
                    line-height: 0.85;
                    color: #fff;
                    letter-spacing: 0.02em;
                    text-shadow: 0 0 80px rgba(212,175,55,0.25);
                    user-select: none;
                    /* Mobile */
                    font-size: clamp(52px, 14vw, 80px);
                }
                .ct-giant-italic {
                    font-style: italic;
                    font-weight: 700;
                }

                /* --- BUTTON -------------------------------------------- */
                .ct-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    height: 48px;
                    padding: 0 1.8rem;
                    border-radius: 999px;
                    border: 1.5px solid #D4AF37;
                    background: #D4AF37;
                    color: #0A0A0A;
                    font-family: var(--font-inter), system-ui, sans-serif;
                    font-weight: 800;
                    font-size: 10px;
                    letter-spacing: 0.3em;
                    text-transform: uppercase;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    transition: background 0.3s, border-color 0.3s, color 0.3s, box-shadow 0.3s, transform 0.2s;
                    pointer-events: auto;
                    min-width: 148px;
                    touch-action: manipulation;
                    box-shadow:
                        0 0 0 4px rgba(212,175,55,0.15),
                        0 0 28px rgba(212,175,55,0.5),
                        0 4px 16px rgba(0,0,0,0.6);
                }
                .ct-btn svg { flex-shrink: 0; transition: transform 0.25s ease; color: #0A0A0A; }
                .ct-btn:hover svg { transform: translateX(4px); color: #D4AF37; }

                /* White shimmer on hover */
                .ct-btn::after {
                    content: '';
                    position: absolute;
                    top: 0; left: -110%;
                    width: 55%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
                    transition: left 0.5s ease;
                }
                .ct-btn:hover::after { left: 160%; }

                .ct-btn:hover {
                    background: rgba(0,0,0,0.55);
                    border-color: #D4AF37;
                    color: #D4AF37;
                    box-shadow:
                        0 0 0 4px rgba(212,175,55,0.12),
                        0 0 36px rgba(212,175,55,0.4),
                        0 4px 24px rgba(0,0,0,0.6);
                    transform: scale(1.04);
                }
                .ct-btn:active { transform: scale(0.97); }

                /* dark outlined variant */
                .ct-btn-gold {
                    background: rgba(0,0,0,0.55);
                    border-color: #D4AF37;
                    color: #D4AF37;
                    box-shadow: 0 0 20px rgba(212,175,55,0.25), 0 4px 16px rgba(0,0,0,0.5);
                }
                .ct-btn-gold svg { color: #D4AF37; }
                .ct-btn-gold:hover {
                    background: #D4AF37;
                    color: #0A0A0A;
                    box-shadow: 0 0 36px rgba(212,175,55,0.45), 0 4px 20px rgba(0,0,0,0.5);
                }
                .ct-btn-gold:hover svg { color: #0A0A0A; }

                /* â”€â”€â”€ TABLET â‰¥ 768px â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
                @media (min-width: 768px) {
                    .ct-label  { font-size: 9px; }
                    .ct-sub    { font-size: 11px; }
                    .ct-h2     { font-size: clamp(44px, 5.5vw, 84px); }
                    .ct-giant  { font-size: clamp(72px, 11vw, 140px); }
                    .ct-smoke  { max-width: 42vw; bottom: 8%; }
                    .ct-rebel  { max-width: 40vw; }
                    .ct-btn    { height: 48px; padding: 0 1.8rem; font-size: 11px; letter-spacing: 0.28em; }
                    .ct-rule   { width: 44px; }
                }

                /* â”€â”€â”€ DESKTOP â‰¥ 1280px â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
                @media (min-width: 1280px) {
                    .ct-label  { font-size: 10px; }
                    .ct-sub    { font-size: 12px; }
                    .ct-h2     { font-size: clamp(60px, 5.5vw, 100px); }
                    .ct-giant  { font-size: clamp(100px, 11vw, 168px); }
                    .ct-smoke  { max-width: 38vw; }
                    .ct-rebel  { max-width: 36vw; }
                    .ct-btn    { height: 50px; padding: 0 2rem; font-size: 11px; letter-spacing: 0.28em; }
                }

                /* â”€â”€â”€ ULTRAWIDE â‰¥ 2000px â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
                @media (min-width: 2000px) {
                    .ct-label  { font-size: 12px; letter-spacing: 0.6em; }
                    .ct-sub    { font-size: 15px; }
                    .ct-h2     { font-size: clamp(100px, 5.2vw, 160px); }
                    .ct-giant  { font-size: clamp(160px, 10vw, 260px); }
                    .ct-smoke  { max-width: 36vw; bottom: 10%; }
                    .ct-rebel  { max-width: 34vw; }
                    .ct-btn    { height: 58px; padding: 0 2.4rem; font-size: 13px; gap: 12px; }
                    .ct-rule   { width: 56px; }
                }

                /* rebel button row â€” right on desktop, left on mobile */
                .ct-rebel-btn-row { justify-content: flex-end; }

                /* rebel gold rule â€” right on desktop */
                .ct-rebel-rule { margin-left: auto; margin-right: 0; }

                /* â”€â”€â”€ MOBILE < 768px â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
                @media (max-width: 767px) {
                    /*
                     * Both sections stack at bottom-left.
                     * Smoke = lower slot, Rebel = upper slot above it.
                     * Sections are shown one at a time via scroll so they
                     * never visually overlap â€” positioning just needs to be
                     * sensible for each section's own moment on screen.
                     */

                    /* Smoke â€” left, bottom, no wrapping */
                    .ct-smoke {
                        left: 5%;
                        right: auto;
                        bottom: 6%;
                        max-width: 82vw;
                        text-align: left;
                    }
                    .ct-smoke .ct-h2 {
                        white-space: nowrap;
                        font-size: clamp(30px, 9vw, 50px);
                    }

                    /* Rebel â€” left, bottom (shows AFTER smoke scrolls away) */
                    .ct-rebel {
                        top: auto;
                        bottom: 6%;
                        right: auto;
                        left: 5%;
                        max-width: 82vw;
                        text-align: left;
                    }
                    .ct-rebel-btn-row { justify-content: flex-start; }
                    .ct-rebel-rule { margin-left: 0; margin-right: auto; }

                    /* IT BOY */
                    .ct-it  { left: 4%; }
                    .ct-boy { right: 4%; }
                    .ct-giant { font-size: clamp(44px, 12vw, 68px); }
                }
            `}</style>

            <div className="ct-overlay">

                {/* â•â•â• SECTION 1 â€” IMPERIAL SMOKE â•â•â• */}
                <div ref={smokeRef} className="ct-smoke">
                    <p className="ct-label" style={{ color: "rgba(255,255,255,0.35)" }}>NÂ° 001</p>

                    <h2 className="ct-h2">
                        <div><SplitChars text="IMPERIAL" /></div>
                        <div><SplitChars text="SMOKE" /></div>
                    </h2>

                    <div data-smoke-sub className="ct-rule"
                        style={{ background: "linear-gradient(to right,rgba(212,175,55,0.8),transparent)" }} />

                    <p data-smoke-sub className="ct-sub" style={{ color: "rgba(255,255,255,0.52)" }}>
                        Crafted in shadow.<br />Remembered forever.
                    </p>

                    <TransitionLink href="/collections" label="Discover Collection" data-smoke-sub className="ct-btn" style={{ marginTop: "1.2rem" }}>
                        Discover
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </TransitionLink>
                </div>

                {/* â•â•â• SECTION 2 â€” REBEL GIRL â•â•â• */}
                <div ref={rebelRef} className="ct-rebel">
                    <p data-rebel-label className="ct-label" style={{ color: "rgba(255,255,255,0.35)" }}>NÂ° 002</p>

                    <h2 className="ct-h2">
                        <div data-rebel-word="0" style={{ display: "block" }}>REBEL</div>
                        <div data-rebel-word="1" style={{ display: "block" }}>GIRL</div>
                    </h2>

                    <div data-rebel-sub className="ct-rule ct-rebel-rule"
                        style={{
                            background: "linear-gradient(to left,rgba(212,175,55,0.8),transparent)",
                        }} />

                    <p data-rebel-sub className="ct-sub" style={{ color: "rgba(255,255,255,0.52)" }}>
                        Wild confidence.<br />Wrapped in elegance.
                    </p>

                    <div data-rebel-sub data-rebel-sub-btn className="ct-rebel-btn-row"
                        style={{ display: "flex", marginTop: "1.2rem" }}>
                        <TransitionLink href="/collections" label="Discover Collection" className="ct-btn">
                            Discover
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </TransitionLink>
                    </div>
                </div>

                {/* â•â•â• SECTION 3 â€” IT BOY â•â•â• */}
                <div ref={itboyRef} className="ct-itboy">

                    {/* IT â€” bottom-left */}
                    <div className="ct-it">
                        <p data-it-sub className="ct-label" style={{ color: "rgba(255,255,255,0.35)", marginBottom: "0.4rem" }}>
                            NÂ° 003
                        </p>

                        <div data-it-word className="ct-giant">IT</div>

                        <p data-it-sub className="ct-sub"
                            style={{ color: "rgba(255,255,255,0.52)", marginTop: "0.6rem" }}>
                            The Final Statement.
                        </p>

                        <TransitionLink href="/collections" label="Discover Collection" data-it-sub className="ct-btn" style={{ marginTop: "1rem" }}>
                            Discover
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </TransitionLink>
                    </div>

                    {/* BOY â€” bottom-right */}
                    <div className="ct-boy">
                        <p data-it-sub className="ct-label"
                            style={{ color: "rgba(255,255,255,0.52)", marginBottom: "0.4rem" }}>
                            The Final Chapter
                        </p>

                        <div data-boy-word className="ct-giant ct-giant-italic">BOY</div>
                    </div>

                </div>

            </div>
        </>
    );
}
