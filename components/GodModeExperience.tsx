"use client";

import { useEffect, useRef } from "react";
import { cinematicMaxScroll, getCinematicVariant, setDisplayedProgress } from "@/lib/cinematic";

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
        const { dir, frames: TOTAL_FRAMES, stops } = getCinematicVariant();

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
        stops.forEach(p => {
            const c = Math.round(p * (TOTAL_FRAMES - 1));
            for (let d = 0; d <= 6; d++) { add(c - d); add(c + d); }
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
        const loadNext = () => {
            if (cancelled || next >= order.length) return;
            const i = order[next++];
            const img = new Image();
            img.decoding = "async";
            img.onload = () => {
                if (i === 0) fireReady();
                loadNext();
            };
            img.onerror = loadNext;
            img.src = `${dir}/frame_${String(i + 1).padStart(4, "0")}.webp`;
            images.current[i] = img;
        };
        for (let k = 0; k < CONCURRENCY; k++) loadNext();

        const onScroll = () => {
            const max = cinematicMaxScroll();
            const clamped = Math.min(window.scrollY, max);
            targetFrame.current = (clamped / max) * (TOTAL_FRAMES - 1);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        // Restored scroll position on refresh — start on the right frame.
        onScroll();
        currentFrame.current = targetFrame.current;

        const drawFrame = (img: HTMLImageElement) => {
            const cw = window.innerWidth;
            const ch = window.innerHeight;
            ctx.clearRect(0, 0, cw, ch);
            const scale = Math.max(cw / img.width, ch / img.height);
            const sw = img.width * scale;
            const sh = img.height * scale;
            const dx = (cw - sw) / 2;
            const dy = (ch - sh) / 2;
            ctx.drawImage(img, dx, dy, sw, sh);
        };

        const loop = () => {
            raf.current = requestAnimationFrame(loop);
            currentFrame.current += (targetFrame.current - currentFrame.current) * 0.12;
            const want = Math.max(0, Math.min(Math.round(currentFrame.current), TOTAL_FRAMES - 1));
            // Nearest loaded frame on either side — always draw something, or a
            // resize (mobile address bar) clears the canvas and leaves it black.
            let i = -1;
            for (let d = 0; d < TOTAL_FRAMES; d++) {
                if (isLoaded(want - d)) { i = want - d; break; }
                if (isLoaded(want + d)) { i = want + d; break; }
            }
            if (i < 0) return;
            drawFrame(images.current[i]);
            setDisplayedProgress(i / (TOTAL_FRAMES - 1));
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
