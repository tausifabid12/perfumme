"use client";

import { useEffect, useRef } from "react";

const FPS = 30;
const DURATION = 18;
const TOTAL_FRAMES = FPS * DURATION;

export default function GodModeExperience() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const images = useRef<HTMLImageElement[]>([]);
    const currentFrame = useRef(0);
    const targetFrame = useRef(0);
    //@ts-ignore
    const raf = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener("resize", resize);

        // -----------------------------
        // LOAD ALL FRAMES
        // -----------------------------
        for (let i = 0; i < TOTAL_FRAMES; i++) {
            const img = new Image();
            img.src = `/frames3/frame_${String(i + 1).padStart(4, "0")}.jpg`;
            images.current[i] = img;
        }

        // -----------------------------
        // SCROLL → FRAME MAPPING (FIXED)
        // -----------------------------
        const onScroll = () => {
            const scrollTop = window.scrollY;

            const maxScroll =
                document.documentElement.scrollHeight - window.innerHeight;

            const scrollProgress = scrollTop / maxScroll;

            targetFrame.current = scrollProgress * (TOTAL_FRAMES - 1);
        };

        window.addEventListener("scroll", onScroll, { passive: true });

        // -----------------------------
        // RENDER LOOP
        // -----------------------------
        const render = () => {
            raf.current = requestAnimationFrame(render);

            // smooth interpolation
            currentFrame.current +=
                (targetFrame.current - currentFrame.current) * 0.12;

            const index = Math.floor(currentFrame.current);

            const img = images.current[index];

            if (!img || !img.complete || img.naturalWidth === 0) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const scale = Math.max(
                canvas.width / img.width,
                canvas.height / img.height
            );

            const x = (canvas.width - img.width * scale) / 2;
            const y = (canvas.height - img.height * scale) / 2;

            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        };

        render();

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", resize);
            if (raf.current) cancelAnimationFrame(raf.current);
        };
    }, []);

    return (
        <div className="relative h-[800vh] bg-black">
            {/* sticky viewport */}
            <div className="sticky top-0 h-screen overflow-hidden">
                <canvas ref={canvasRef} className="w-full h-full" />

                {/* cinematic overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
            </div>
        </div>
    );
}