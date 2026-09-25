"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";

// Mobile-only: turns the long 1300vh cinematic scroll into a few swipe-driven
// steps. Each swipe auto-scrolls to the next stop, so the frame animation and
// CinematicTypography triggers still play exactly as on desktop — the user just
// doesn't have to drag through them.
//
// Stops are fractions of the cinematic scroll max (12 × innerHeight), matching
// the ScrollTrigger ranges in CinematicTypography:
//   0     → IMPERIAL SMOKE (product 1)
//   0.52  → REBEL GIRL (product 2, fully revealed inside its 0.31–0.64 range)
//   0.9   → IT BOY (product 3, triggers at 0.81)
//   end   → top of HomeSections
const STOPS = [0, 0.52, 0.9];
const STEP_DURATION = 1.6;
const SWIPE_THRESHOLD = 25;
const EPS = 4;

export default function MobileCinematicSnap({
    endRef,
}: {
    endRef: RefObject<HTMLElement | null>;
}) {
    useEffect(() => {
        if (window.innerWidth >= 768) return;

        let animating = false;
        let cooldownUntil = 0;
        let tween: gsap.core.Tween | null = null;

        const getEnd = () => {
            const el = endRef.current;
            if (!el) return window.innerHeight * 13;
            return el.getBoundingClientRect().top + window.scrollY;
        };
        const getStops = () => {
            const max = window.innerHeight * 12;
            return [...STOPS.map(p => p * max), getEnd()];
        };

        const goTo = (y: number) => {
            animating = true;
            tween?.kill();
            const proxy = { y: window.scrollY };
            tween = gsap.to(proxy, {
                y,
                duration: STEP_DURATION,
                ease: "power2.inOut",
                onUpdate: () => window.scrollTo(0, proxy.y),
                onComplete: () => {
                    animating = false;
                    cooldownUntil = performance.now() + 400;
                },
            });
        };

        // dir: 1 = forward (scroll down), -1 = back (scroll up)
        const step = (dir: 1 | -1) => {
            const y = window.scrollY;
            const stops = getStops();
            const target = dir === 1
                ? stops.find(s => s > y + EPS)
                : [...stops].reverse().find(s => s < y - EPS);
            if (target !== undefined) goTo(target);
        };

        // Should this gesture be handled by us instead of native scroll?
        const shouldIntercept = (dir: number) => {
            const y = window.scrollY;
            const end = getEnd();
            if (y < end - EPS) return true;          // inside the cinematic zone
            return dir < 0 && y <= end + EPS;         // at top of HomeSections, going back up
        };

        // ── Touch ──────────────────────────────────────────────────────
        let startY = 0;
        let handled = false;
        let touching = false;

        const onTouchStart = (e: TouchEvent) => {
            startY = e.touches[0].clientY;
            handled = false;
            touching = true;
        };

        const onTouchMove = (e: TouchEvent) => {
            const dy = startY - e.touches[0].clientY; // > 0 = swipe up = scroll down
            const dir = Math.sign(dy);
            if (animating) {
                e.preventDefault();
                return;
            }
            if (!shouldIntercept(dir)) return;
            e.preventDefault();
            if (!handled && Math.abs(dy) > SWIPE_THRESHOLD) {
                handled = true;
                step(dy > 0 ? 1 : -1);
            }
        };

        const onTouchEnd = () => {
            touching = false;
        };

        // ── Wheel (narrow windows / trackpads) ─────────────────────────
        const onWheel = (e: WheelEvent) => {
            const dir = Math.sign(e.deltaY);
            if (!animating && !shouldIntercept(dir)) return;
            e.preventDefault();
            e.stopPropagation(); // keep Lenis from also smoothing this wheel
            if (animating || performance.now() < cooldownUntil) return;
            if (Math.abs(e.deltaY) > 10) step(dir > 0 ? 1 : -1);
        };

        // ── Safety net: momentum scroll or scroll restoration can leave us
        //    between stops — settle on the nearest one once scrolling stops.
        let settleTimer: ReturnType<typeof setTimeout> | undefined;
        const onScroll = () => {
            if (animating) return;
            clearTimeout(settleTimer);
            settleTimer = setTimeout(() => {
                if (animating || touching) return;
                const y = window.scrollY;
                if (y >= getEnd() - EPS) return;
                const stops = getStops();
                const nearest = stops.reduce((a, b) => (Math.abs(b - y) < Math.abs(a - y) ? b : a));
                if (Math.abs(nearest - y) > EPS) goTo(nearest);
            }, 150);
        };

        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("touchend", onTouchEnd, { passive: true });
        window.addEventListener("touchcancel", onTouchEnd, { passive: true });
        window.addEventListener("wheel", onWheel, { passive: false, capture: true });
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            tween?.kill();
            clearTimeout(settleTimer);
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
            window.removeEventListener("touchcancel", onTouchEnd);
            window.removeEventListener("wheel", onWheel, { capture: true });
            window.removeEventListener("scroll", onScroll);
        };
    }, [endRef]);

    return null;
}
