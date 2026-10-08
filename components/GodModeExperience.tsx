"use client";

import { useEffect, useRef } from "react";
import { cinematicMaxScroll, getCinematicVariant, setDisplayedProgress, supportsAvif } from "@/lib/cinematic";

// Parallel frame requests. Small enough that the priority order below is
// actually honoured on slow mobile connections.
const CONCURRENCY = 6;

export default function GodModeExperience({ onReady }: { onReady?: () => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const readyFired = useRef(false);

    const fireReady = () => {
        if (readyFired.current) return;
        readyFired.current = true;
        onReady?.();
    };

    const images = useRef<HTMLImageElement[]>([]);
    const currentFrame = useRef(0);
    const targetFrame = useRef(0);
    const raf = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        // Portrait sequence on phones, 16:9 on everything else.
        const { dir, frames: TOTAL_FRAMES, stops, reversed, avif } = getCinematicVariant();
        // Repaint only when the frame, blend amount or canvas size changes.
        let dirty = true;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const w = window.innerWidth;
            const h = window.innerHeight;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.imageSmoothingQuality = "high";
            dirty = true;
        };
        resize();
        window.addEventListener("resize", resize);

        // Load order: first frame → each bottle's sharp frame (and its
        // neighbours) → a coarse pass across the whole sequence → the gaps.
        // A fast swipe then always lands near a loaded frame instead of
        // falling back to a blurry transition frame.
        const order: number[] = [];
        const seen = new Set<number>();
        const add = (i: number) => {
            if (i < 0 || i >= TOTAL_FRAMES || seen.has(i)) return;
            seen.add(i);
            order.push(i);
        };
        add(0);
        const radius = Math.max(2, Math.round(TOTAL_FRAMES * 0.02));
        stops.forEach(p => {
            const c = Math.round(p * (TOTAL_FRAMES - 1));
            for (let d = 0; d <= radius; d++) { add(c - d); add(c + d); }
        });
        for (const step of [16, 8, 4, 2, 1]) {
            for (let i = 0; i < TOTAL_FRAMES; i += step) add(i);
        }

        const isLoaded = (i: number) => {
            const img = images.current[i];
            return !!img && img.complete && img.naturalWidth > 0;
        };

        let cancelled = false;
        let next = 0;
        let ext = "webp";
        const loadNext = () => {
            if (cancelled || next >= order.length) return;
            const i = order[next++];
            const img = new Image();
            img.decoding = "async";
            img.onload = () => {
                if (i === 0) fireReady();
                dirty = true;
                loadNext();
            };
            img.onerror = loadNext;
            // Slot i is the i-th frame *shown*; reversed sequences read files back to front.
            const file = reversed ? TOTAL_FRAMES - i : i + 1;
            img.src = `${dir}/frame_${String(file).padStart(4, "0")}.${ext}`;
            images.current[i] = img;
        };
        const startLoading = (useAvif: boolean) => {
            if (cancelled) return;
            ext = useAvif ? "avif" : "webp";
            for (let k = 0; k < CONCURRENCY; k++) loadNext();
        };
        if (avif) supportsAvif().then(startLoading);
        else startLoading(false);

        let lastScrollAt = 0;
        const onScroll = () => {
            const max = cinematicMaxScroll();
            const clamped = Math.min(window.scrollY, max);
            targetFrame.current = (clamped / max) * (TOTAL_FRAMES - 1);
            lastScrollAt = performance.now();
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        // Restored scroll position on refresh — start on the right frame.
        onScroll();
        currentFrame.current = targetFrame.current;

        const drawImageCover = (img: HTMLImageElement, alpha: number) => {
            const cw = window.innerWidth;
            const ch = window.innerHeight;
            const scale = Math.max(cw / img.width, ch / img.height);
            const sw = img.width * scale;
            const sh = img.height * scale;
            ctx.globalAlpha = alpha;
            ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
            ctx.globalAlpha = 1;
        };

        let lastA = -1;
        let lastT = -1;

        const loop = () => {
            raf.current = requestAnimationFrame(loop);
            // Blending neighbours only reads as motion while scrolling. Once the
            // page is at rest, settle on the nearest real frame — a held 50/50
            // blend of a moving bottle shows as a ghosted double image.
            const idle = performance.now() - lastScrollAt > 120;
            const goal = idle ? Math.round(targetFrame.current) : targetFrame.current;
            const delta = goal - currentFrame.current;
            currentFrame.current = Math.abs(delta) < 0.002
                ? goal
                : currentFrame.current + delta * 0.12;

            const f = Math.max(0, Math.min(currentFrame.current, TOTAL_FRAMES - 1));
            let a = Math.floor(f);
            // Blend amount toward the next frame. Cross-fading neighbours keeps
            // a low-fps sequence (10 fps web) looking smooth while scrubbing.
            let t = f - a;
            if (!isLoaded(a) || (t > 0.01 && !isLoaded(a + 1))) {
                // Nearest loaded frame on either side — always draw something,
                // or a resize (mobile address bar) leaves the canvas black.
                const want = Math.round(f);
                a = -1;
                for (let d = 0; d < TOTAL_FRAMES; d++) {
                    if (isLoaded(want - d)) { a = want - d; break; }
                    if (isLoaded(want + d)) { a = want + d; break; }
                }
                if (a < 0) return;
                t = 0;
            }
            // Quantise the blend so tiny easing steps don't force repaints.
            t = Math.round(t * 32) / 32;
            if (t >= 1) { a += 1; t = 0; }

            if (!dirty && a === lastA && t === lastT) return;
            dirty = false;
            lastA = a;
            lastT = t;

            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            drawImageCover(images.current[a], 1);
            if (t > 0) drawImageCover(images.current[a + 1], t);
            setDisplayedProgress((a + t) / (TOTAL_FRAMES - 1));
        };
        loop();

        return () => {
            cancelled = true;
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(raf.current);
        };
    }, []);

    return (
        <div className="relative h-[1300vh] bg-black">
            <div className="sticky top-0 h-screen overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none" />
            </div>
        </div>
    );
}
