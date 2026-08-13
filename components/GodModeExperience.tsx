"use client";

import { useEffect, useRef } from "react";

const TOTAL_FRAMES = 302; // 10s video @ ~30fps

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

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const w = window.innerWidth;
            const h = window.innerHeight;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        window.addEventListener("resize", resize);

        let loadedCount = 0;
        for (let i = 0; i < TOTAL_FRAMES; i++) {
            const img = new Image();
            img.src = `/frames3/frame_${String(i + 1).padStart(4, "0")}.jpg`;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === 1) fireReady();
            };
            images.current[i] = img;
        }

        const CINEMATIC_MAX = () => window.innerHeight * 12;

        const onScroll = () => {
            const clamped = Math.min(window.scrollY, CINEMATIC_MAX());
            targetFrame.current = (clamped / CINEMATIC_MAX()) * (TOTAL_FRAMES - 1);
        };
        window.addEventListener("scroll", onScroll, { passive: true });

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
            const safeIndex = Math.max(0, Math.min(Math.round(currentFrame.current), TOTAL_FRAMES - 1));
            const img = images.current[safeIndex];
            if (img?.complete && img.naturalWidth > 0) {
                drawFrame(img);
            }
        };
        loop();

        return () => {
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
