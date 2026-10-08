"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TransitionLink from "@/components/TransitionLink";
import {
    cinematicMaxScroll,
    getCinematicVariant,
    isMobileViewport,
    onDisplayedProgress,
    type ProductKey,
} from "@/lib/cinematic";

gsap.registerPlugin(ScrollTrigger);

interface Product {
    key: ProductKey;
    lines: [string, string];
    tag: string;
    sub: [string, string];
    // Desktop placement — alternates so consecutive products never share a corner.
    side: "left" | "right";
}

const PRODUCTS: Product[] = [
    {
        key: "blind-date",
        lines: ["BLIND", "DATE"],
        tag: "Unisex",
        sub: ["Fresh. Warm. Irresistible.", "Made for close encounters."],
        side: "left",
    },
    {
        key: "rebel-girl",
        lines: ["REBEL", "GIRL"],
        tag: "For Her",
        sub: ["Wild confidence.", "Wrapped in elegance."],
        side: "right",
    },
    {
        key: "it-boy",
        lines: ["IT", "BOY"],
        tag: "For Him",
        sub: ["Fresh. Bold. Addictive.", "The signature scent for GenZ Boys."],
        side: "left",
    },
    {
        key: "imperial-smoke",
        lines: ["IMPERIAL", "SMOKE"],
        tag: "For Him",
        sub: ["Crafted in shadow.", "Remembered forever."],
        side: "right",
    },
];

// Scrubbed timelines run 0 → 1 across their scroll window.
const IN_END = 0.28;
const OUT_START = 0.82;

export default function CinematicTypography({ canAnimate = false }: { canAnimate?: boolean }) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const mouseX = useRef(0);
    const mouseY = useRef(0);
    useEffect(() => {
        if (!canAnimate) return;
        const overlayEl = overlayRef.current!;
        const variant = getCinematicVariant();
        const isMobile = isMobileViewport();
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const blur = (px: number) => `blur(${reduceMotion ? 0 : px}px)`;
        const at = (pct: number) => `${cinematicMaxScroll() * pct}px top`;

        const sectionOf = (key: ProductKey) =>
            overlayEl.querySelector<HTMLElement>(`[data-product="${key}"]`)!;

        // Parts of a section. Animations run on .ct-inner; the outer .ct-sec
        // only receives the desktop mouse parallax so the two never fight.
        const partsOf = (key: ProductKey) => {
            const sec = sectionOf(key);
            const product = PRODUCTS.find(p => p.key === key)!;
            return {
                sec,
                inner: sec.querySelector<HTMLElement>(".ct-inner")!,
                label: sec.querySelector<HTMLElement>("[data-label]")!,
                lines: sec.querySelectorAll<HTMLElement>("[data-line]"),
                chars: sec.querySelectorAll<HTMLElement>("[data-char]"),
                subs: sec.querySelectorAll<HTMLElement>("[data-sub]"),
                // Words slide in from the edge the block is anchored to.
                fromX: isMobile || product.side === "left" ? -60 : 60,
            };
        };

        const setInteractive = (sec: HTMLElement, on: boolean) => {
            sec.style.pointerEvents = on ? "auto" : "none";
        };

        // Bottle order differs between the web and mobile frame sequences, so
        // the "02 / 04" counters are filled in once we know which one plays.
        variant.order.forEach((key, i) => {
            const el = sectionOf(key).querySelector<HTMLElement>("[data-index]");
            if (el) el.textContent = `0${i + 1}`;
        });

        const [firstKey, , , lastKey] = variant.order;

        // Scrubbed product timelines, each mapped onto a [start, end] window
        // of displayed-frame progress.
        type Scrubbed = {
            window: readonly [number, number];
            anim: gsap.core.Animation;
            onProgress: (t: number) => void;
        };
        const scrubbed: Scrubbed[] = [];
        let unsubscribe = () => {};
        const middleKeys = variant.order.slice(1, 3);

        const ctx = gsap.context(() => {
            // ── PRODUCT 1 — revealed on load, scrubbed out as the bottle
            //    zooms past the camera.
            const first = partsOf(firstKey);
            gsap.set(first.sec, { autoAlpha: 1 });
            setInteractive(first.sec, true);
            gsap.fromTo(first.label,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", delay: 0.1 });
            gsap.fromTo(first.chars,
                { opacity: 0, filter: blur(40), y: 10 },
                {
                    opacity: 1, filter: blur(0), y: 0,
                    duration: 1.4, ease: "power3.out",
                    stagger: { each: 0.05, from: "start" },
                    delay: 0.2,
                });
            gsap.fromTo(first.subs,
                { opacity: 0, y: 18, filter: blur(6) },
                { opacity: 1, y: 0, filter: blur(0), duration: 1.0, ease: "power2.out", stagger: 0.15, delay: 1.1 });

            const firstOut = gsap.to(first.inner, {
                opacity: 0, y: -28, filter: blur(10),
                ease: "power2.in", paused: true,
            });
            scrubbed.push({
                window: variant.introOut,
                anim: firstOut,
                onProgress: t => setInteractive(first.sec, t < 0.9),
            });

            // ── PRODUCTS 2 & 3 — scrubbed in → hold → out, bracketing the
            //    frames where each bottle is sharp.
            middleKeys.forEach(key => {
                const [start, end] = variant.middle[key]!;
                const p = partsOf(key);

                gsap.set(p.sec, { autoAlpha: 0 });
                gsap.set(p.label, { opacity: 0, x: p.fromX * 0.4 });
                gsap.set(p.lines[0], { opacity: 0, x: p.fromX, rotation: p.fromX < 0 ? -3 : 3, filter: blur(14) });
                gsap.set(p.lines[1], { opacity: 0, x: p.fromX, rotation: p.fromX < 0 ? -3 : 3, filter: blur(14) });
                gsap.set(p.subs, { opacity: 0, y: 18, filter: blur(6) });

                const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
                tl.to(p.sec, { autoAlpha: 1, duration: 0.06, ease: "none" }, 0)
                    .to(p.label, { opacity: 1, x: 0, duration: 0.14 }, 0.02)
                    .to(p.lines[0], { opacity: 1, x: 0, rotation: 0, filter: blur(0), duration: 0.16 }, 0.04)
                    .to(p.lines[1], { opacity: 1, x: 0, rotation: 0, filter: blur(0), duration: 0.16 }, 0.09)
                    .to(p.subs, { opacity: 1, y: 0, filter: blur(0), duration: 0.12, stagger: 0.02, ease: "power2.out" }, 0.14)
                    .to(p.inner, { opacity: 0, y: -22, filter: blur(8), duration: 1 - OUT_START, ease: "power1.in" }, OUT_START)
                    .set(p.sec, { autoAlpha: 0 }, 1);

                scrubbed.push({
                    window: [start, end],
                    anim: tl,
                    onProgress: t => setInteractive(p.sec, t > IN_END * 0.5 && t < OUT_START + 0.08),
                });
            });

            // ── PRODUCT 4 — plays in and stays until the overlay hides at
            //    the end of the cinematic zone.
            const last = partsOf(lastKey);
            gsap.set(last.sec, { autoAlpha: 0 });
            gsap.set(last.label, { opacity: 0, y: 12 });
            gsap.set(last.lines, { opacity: 0, y: 55, filter: blur(18) });
            gsap.set(last.subs, { opacity: 0, y: 14 });

            const lastTl = gsap.timeline({ paused: true });
            lastTl
                .to(last.sec, { autoAlpha: 1, duration: 0.3, ease: "power2.out" }, 0)
                .to(last.label, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.05)
                .to(last.lines[0], { opacity: 1, y: 0, filter: blur(0), duration: 0.8, ease: "expo.out" }, 0.1)
                .to(last.lines[1], { opacity: 1, y: 0, filter: blur(0), duration: 0.8, ease: "expo.out" }, 0.22)
                .to(last.subs, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.08 }, 0.45);

            let lastShown = false;
            const toggleLast = (p: number) => {
                const show = p >= variant.finalAt;
                if (show === lastShown) return;
                lastShown = show;
                setInteractive(last.sec, show);
                if (show) lastTl.play(); else lastTl.reverse();
            };

            // ── Drive all product copy from the frame that is actually on
            //    screen (not raw scroll), so text can't run ahead of a bottle
            //    that is still loading or easing into place.
            const scrubTo = new Map(scrubbed.map(s => [s, gsap.quickTo(s.anim, "progress", { duration: 0.45, ease: "power2.out" })]));
            unsubscribe = onDisplayedProgress(p => {
                scrubbed.forEach(s => {
                    const [a, b] = s.window;
                    const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
                    scrubTo.get(s)!(t);
                    s.onProgress(t);
                });
                toggleLast(p);
            });

            // ── Hide the whole overlay once the user scrolls past the
            //    cinematic zone into HomeSections (same point page.tsx reveals them).
            ScrollTrigger.create({
                trigger: document.body,
                start: () => at(0.998),
                onEnter: () => { overlayEl.style.display = "none"; },
                onLeaveBack: () => { overlayEl.style.display = ""; },
            });
        }, overlayEl);

        // ── Floating parallax (desktop pointer only) ───────────────────
        let raf = 0;
        const onMouse = (e: MouseEvent) => {
            mouseX.current = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY.current = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        if (!isMobile && !reduceMotion) {
            window.addEventListener("mousemove", onMouse, { passive: true });
            const secs = Array.from(overlayEl.querySelectorAll<HTMLElement>(".ct-sec"));
            const breathe = (t: number) => {
                raf = requestAnimationFrame(breathe);
                const s = t * 0.001;
                secs.forEach((sec, i) => {
                    if (sec.style.visibility === "hidden") return;
                    sec.style.transform =
                        `translate3d(${mouseX.current * 7 + Math.sin(s * 0.45 + i) * 3}px,` +
                        `${mouseY.current * 5 + Math.cos(s * 0.38 + i) * 3}px,0)`;
                });
            };
            raf = requestAnimationFrame(breathe);
        }

        return () => {
            window.removeEventListener("mousemove", onMouse);
            cancelAnimationFrame(raf);
            unsubscribe();
            ctx.revert();
            overlayEl.style.display = "";
        };
    }, [canAnimate]);

    const SplitChars = ({ text }: { text: string }) => (
        <span aria-hidden className="inline-block">
            {text.split("").map((ch, i) => (
                <span key={i} data-char className="inline-block">{ch}</span>
            ))}
        </span>
    );

    return (
        <>
            <style>{`
                .ct-overlay {
                    position: fixed; inset: 0; z-index: 10; pointer-events: none;
                }

                /* ─── SECTIONS ─────────────────────────────────────────── */
                .ct-sec {
                    position: absolute;
                    bottom: 8%;
                    max-width: 90vw;
                    pointer-events: none;
                    visibility: hidden;
                    will-change: transform;
                }
                .ct-sec.ct-left  { left: 5%; text-align: left; }
                .ct-sec.ct-right { right: 5%; text-align: right; }
                .ct-inner { will-change: transform, opacity, filter; }

                /* ─── LABEL ─────────────────────────────────────────────── */
                .ct-label {
                    font-family: var(--font-inter), system-ui, sans-serif;
                    font-weight: 400;
                    font-size: 9px;
                    letter-spacing: 0.45em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.55);
                    margin: 0 0 0.9rem;
                }
                .ct-label b { color: #D4AF37; font-weight: 600; }

                /* ─── HEADLINE ──────────────────────────────────────────── */
                .ct-h2 {
                    font-family: var(--font-inter), system-ui, sans-serif;
                    font-weight: 800;
                    line-height: 0.9;
                    color: #fff;
                    margin: 0;
                    letter-spacing: -0.01em;
                    white-space: nowrap;
                    text-shadow: 0 2px 30px rgba(0,0,0,0.45);
                    font-size: clamp(38px, 10vw, 60px);
                }
                .ct-h2 [data-line] { display: block; }
                .ct-h2 [data-line]:nth-child(2) {
                    font-style: italic;
                    font-weight: 700;
                    color: #F3E2B3;
                }

                /* ─── SUBTEXT ───────────────────────────────────────────── */
                .ct-sub {
                    font-family: var(--font-inter), system-ui, sans-serif;
                    font-weight: 300;
                    font-size: 10px;
                    letter-spacing: 0.28em;
                    text-transform: uppercase;
                    line-height: 1.9;
                    color: rgba(255,255,255,0.68);
                    margin: 0;
                }

                /* ─── RULE ──────────────────────────────────────────────── */
                .ct-rule {
                    width: 36px; height: 1px;
                    margin: 0.9rem 0;
                    background: linear-gradient(to right, rgba(212,175,55,0.85), transparent);
                }
                .ct-right .ct-rule {
                    margin-left: auto;
                    background: linear-gradient(to left, rgba(212,175,55,0.85), transparent);
                }

                .ct-btn-row { display: flex; margin-top: 1.2rem; }
                .ct-right .ct-btn-row { justify-content: flex-end; }

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
                .ct-btn:focus-visible { outline: 2px solid #F3E2B3; outline-offset: 4px; }

                /* ─── TABLET ≥ 768px ────────────────────────────────────── */
                @media (min-width: 768px) {
                    .ct-sub    { font-size: 11px; }
                    .ct-h2     { font-size: clamp(48px, 6vw, 92px); }
                    .ct-sec    { max-width: 40vw; }
                    .ct-btn    { font-size: 11px; letter-spacing: 0.28em; }
                    .ct-rule   { width: 44px; }
                }

                /* ─── DESKTOP ≥ 1280px ──────────────────────────────────── */
                @media (min-width: 1280px) {
                    .ct-label  { font-size: 10px; }
                    .ct-sub    { font-size: 12px; }
                    .ct-h2     { font-size: clamp(64px, 6vw, 112px); }
                    .ct-sec    { max-width: 36vw; }
                    .ct-btn    { height: 50px; padding: 0 2rem; }
                }

                /* ─── ULTRAWIDE ≥ 2000px ────────────────────────────────── */
                @media (min-width: 2000px) {
                    .ct-label  { font-size: 12px; letter-spacing: 0.5em; }
                    .ct-sub    { font-size: 15px; }
                    .ct-h2     { font-size: clamp(110px, 5.6vw, 170px); }
                    .ct-sec    { bottom: 10%; max-width: 34vw; }
                    .ct-btn    { height: 58px; padding: 0 2.4rem; font-size: 13px; gap: 12px; }
                    .ct-rule   { width: 56px; }
                }

                /* ─── MOBILE < 768px ────────────────────────────────────── */
                @media (max-width: 767px) {
                    /* Portrait frames keep the bottle centred in the upper
                       two-thirds, so every product's copy shares the
                       bottom-left slot — one at a time, never overlapping. */
                    .ct-sec,
                    .ct-sec.ct-right {
                        left: 6%;
                        right: auto;
                        bottom: calc(4.5% + env(safe-area-inset-bottom, 0px));
                        max-width: 88vw;
                        text-align: left;
                    }
                    .ct-right .ct-rule {
                        margin-left: 0;
                        background: linear-gradient(to right, rgba(212,175,55,0.85), transparent);
                    }
                    .ct-right .ct-btn-row { justify-content: flex-start; }
                    .ct-h2 { font-size: clamp(34px, 10.5vw, 52px); }

                    /* Dark fade behind the copy so it reads over bright frames
                       (Rebel Girl's glow). Part of the overlay, so it leaves
                       with the text when HomeSections appear. */
                    .ct-overlay::before {
                        content: "";
                        position: absolute;
                        left: 0; right: 0; bottom: 0;
                        height: 58%;
                        background: linear-gradient(to top,
                            rgba(0,0,0,0.85) 0%,
                            rgba(0,0,0,0.6) 35%,
                            rgba(0,0,0,0.25) 65%,
                            transparent 100%);
                        pointer-events: none;
                    }

                    .ct-sub {
                        font-size: 11px;
                        font-weight: 500;
                        letter-spacing: 0.22em;
                        color: rgba(255,255,255,0.92);
                        text-shadow: 0 1px 2px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.75);
                    }

                    /* The label sits over the bright bottle base — give it a
                       dark frosted pill so it reads on any frame. */
                    .ct-label {
                        display: inline-flex;
                        align-items: center;
                        padding: 6px 12px 6px 13px;
                        border-radius: 999px;
                        background: rgba(0,0,0,0.6);
                        border: 1px solid rgba(212,175,55,0.35);
                        -webkit-backdrop-filter: blur(8px);
                        backdrop-filter: blur(8px);
                        font-size: 10px;
                        font-weight: 600;
                        letter-spacing: 0.3em;
                        color: rgba(255,255,255,0.95);
                        text-shadow: 0 1px 2px rgba(0,0,0,0.8);
                        margin-bottom: 0.8rem;
                    }
                    .ct-label b { font-weight: 800; }
                }
            `}</style>

            <div ref={overlayRef} className="ct-overlay mt-20">
                {PRODUCTS.map(p => {
                    const name = `${p.lines[0]} ${p.lines[1]}`;
                    return (
                        <section
                            key={p.key}
                            data-product={p.key}
                            className={`ct-sec ct-${p.side}`}
                        >
                            <div className="ct-inner">
                                <p data-label className="ct-label">
                                    <b data-index />&nbsp;/&nbsp;04&nbsp;&nbsp;·&nbsp;&nbsp;
                                    {p.tag}
                                </p>

                                <h2 className="ct-h2" aria-label={name}>
                                    {p.lines.map(line => (
                                        <span key={line} data-line>
                                            {/* Split for every product — whichever opens the
                                                sequence gets the letter-by-letter reveal. */}
                                            <SplitChars text={line} />
                                        </span>
                                    ))}
                                </h2>

                                <div data-sub className="ct-rule" />

                                <p data-sub className="ct-sub">
                                    {p.sub[0]}<br />{p.sub[1]}
                                </p>

                                <div data-sub className="ct-btn-row">
                                    <TransitionLink href={`/products/${p.key}`} label={name} className="ct-btn">
                                        Discover
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                                            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </TransitionLink>
                                </div>
                            </div>
                        </section>
                    );
                })}
            </div>
        </>
    );
}
