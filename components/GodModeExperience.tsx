"use client";

import { useEffect, useRef, useState } from "react";

const FPS = 30;
const DURATION = 18;
const TOTAL_FRAMES = FPS * DURATION;

const VIDEO_FADE_SCROLL = 300;
const CROSSFADE_BEFORE_END = 0.6;

export default function GodModeExperience({ onReady }: { onReady?: () => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoA = useRef<HTMLVideoElement>(null);
    const videoB = useRef<HTMLVideoElement>(null);
    const readyFired = useRef(false);   // ensure onReady fires at most once

    const fireReady = () => {
        if (readyFired.current) return;
        readyFired.current = true;
        onReady?.();
    };

    const images = useRef<HTMLImageElement[]>([]);
    const currentFrame = useRef(0);
    const targetFrame = useRef(0);
    //@ts-ignore
    const raf = useRef<number>();

    const [videoOpacity, setVideoOpacity] = useState(1);
    const [activeVideo, setActiveVideo] = useState<"a" | "b">("a");
    const activeRef = useRef<"a" | "b">("a");

    useEffect(() => {
        const vA = videoA.current!;
        const vB = videoB.current!;

        let rafId: number;
        let swapped = false;

        // Pre-warm video B: seek to 0, decode first frame, then pause
        // so it's ready to play instantly with no decode delay
        const prewarmB = () => {
            vB.currentTime = 0;
            vB.play().then(() => {
                // Let one frame render then pause — first frame is now decoded
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        vB.pause();
                    });
                });
            }).catch(() => { });
        };

        const checkAndSwap = () => {
            const active = activeRef.current === "a" ? vA : vB;
            const standby = activeRef.current === "a" ? vB : vA;

            if (
                !swapped &&
                !isNaN(active.duration) &&
                active.duration > 0 &&
                active.currentTime >= active.duration - CROSSFADE_BEFORE_END
            ) {
                swapped = true;

                // Play the standby video — first frame already decoded, no freeze
                standby.play().catch(() => { });

                const next: "a" | "b" = activeRef.current === "a" ? "b" : "a";
                activeRef.current = next;
                setActiveVideo(next);

                // Pre-warm the one that just became standby for the next swap
                setTimeout(() => {
                    const newStandby = next === "a" ? vB : vA;
                    newStandby.pause();
                    newStandby.currentTime = 0;
                    newStandby.play().then(() => {
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                newStandby.pause();
                                swapped = false; // ready for the next swap
                            });
                        });
                    }).catch(() => { });
                }, 300);
            }

            rafId = requestAnimationFrame(checkAndSwap);
        };

        // Start A, pre-warm B, begin monitoring loop
        vA.play().then(() => {
            fireReady();           // ← signal loading screen to dismiss
            prewarmB();
            rafId = requestAnimationFrame(checkAndSwap);
        }).catch(() => {
            fireReady();           // dismiss even on autoplay block
        });

        return () => cancelAnimationFrame(rafId);
    }, []);

    // ── Canvas scroll animation ──────────────────────────────────────
    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        for (let i = 0; i < TOTAL_FRAMES; i++) {
            const img = new Image();
            img.src = `/frames3/frame_${String(i + 1).padStart(4, "0")}.jpg`;
            images.current[i] = img;
        }

        const onScroll = () => {
            const scrollTop = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            targetFrame.current = (scrollTop / maxScroll) * (TOTAL_FRAMES - 1);
            setVideoOpacity(Math.max(0, 1 - scrollTop / VIDEO_FADE_SCROLL));
        };
        window.addEventListener("scroll", onScroll, { passive: true });

        const render = () => {
            raf.current = requestAnimationFrame(render);
            currentFrame.current += (targetFrame.current - currentFrame.current) * 0.12;
            const index = Math.floor(currentFrame.current);
            if (index === 0 && targetFrame.current < 1) return;
            const img = images.current[index];
            if (!img || !img.complete || img.naturalWidth === 0) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
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
        <div className="relative h-[1300vh] bg-black">
            <div className="sticky top-0 h-screen overflow-hidden">

                <video
                    ref={videoA}
                    src="/smoke1.mp4"
                    muted
                    playsInline
                    preload="auto"
                    onCanPlay={() => onReady?.()}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                        opacity: videoOpacity * (activeVideo === "a" ? 1 : 0),
                        transition: `opacity ${CROSSFADE_BEFORE_END}s ease-in-out`,
                        pointerEvents: "none",
                    }}
                />

                <video
                    ref={videoB}
                    src="/smoke1.mp4"
                    muted
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                        opacity: videoOpacity * (activeVideo === "b" ? 1 : 0),
                        transition: `opacity ${CROSSFADE_BEFORE_END}s ease-in-out`,
                        pointerEvents: "none",
                    }}
                />

                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                    style={{
                        opacity: 1 - videoOpacity,
                        transition: "opacity 0.1s linear",
                    }}
                />

                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
            </div>
        </div>
    );
}