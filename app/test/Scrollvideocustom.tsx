'use client';

import { useRef, useEffect, useState } from 'react';

interface ScrollVideoCustomConfig {
    // Video progression: how fast video plays relative to scroll
    // 0.5 = 2% scroll moves video 1% (slow, cinematic)
    // 1.0 = 1% scroll moves video 1% (normal speed)
    // 0.33 = 3% scroll moves video 1% (very slow)
    videoMultiplier?: number;

    // Scroll smoothness duration in seconds
    // 0.8 = snappy, responsive
    // 1.5 = balanced (default)
    // 2.5 = very smooth, cinematic
    lenisDuration?: number;

    // Scroll area height multiplier (based on video duration)
    // 15 = 15vh per second (less space, faster control)
    // 20 = 20vh per second (default, balanced)
    // 30 = 30vh per second (more space, finer control)
    scrollAreaMultiplier?: number;
}

export default function ScrollVideoCustom({
    videoMultiplier = 0.5,
    lenisDuration = 1.5,
    scrollAreaMultiplier = 20,
}: ScrollVideoCustomConfig = {}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollYRef = useRef(0);
    const [duration, setDuration] = useState(0);
    const [scrollHeight, setScrollHeight] = useState('400vh');
    const lenisRef = useRef<any>(null);

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            const dur = videoRef.current.duration;
            setDuration(dur);

            // Calculate scroll area based on config
            const calculatedHeight = dur * scrollAreaMultiplier;
            const clamped = Math.max(250, Math.min(1200, calculatedHeight));

            setScrollHeight(`${clamped}vh`);

            console.log(`🎬 Video Duration: ${dur.toFixed(1)}s`);
            console.log(`📏 Scroll Area: ${clamped}vh`);
            console.log(
                `⚙️ Video Multiplier: ${videoMultiplier} (${(videoMultiplier * 100).toFixed(0)}% speed)`
            );
            console.log(`🌊 Lenis Duration: ${lenisDuration}s`);
        }
    };

    // Initialize Lenis
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1/dist/lenis.umd.js';
        script.async = true;

        script.onload = () => {
            const Lenis = (window as any).Lenis;

            lenisRef.current = new Lenis({
                duration: lenisDuration,
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                direction: 'vertical',
                gestureDirection: 'vertical',
                smooth: true,
                smoothTouch: false,
                touchMultiplier: 2,
            });

            lenisRef.current.on('scroll', (e: any) => {
                scrollYRef.current = e.scroll;
            });

            let rafId: number;

            const raf = (time: number) => {
                lenisRef.current?.raf(time);
                rafId = requestAnimationFrame(raf);
            };

            rafId = requestAnimationFrame(raf);

            return () => {
                cancelAnimationFrame(rafId);
                lenisRef.current?.destroy();
            };
        };

        document.head.appendChild(script);

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, [lenisDuration]);

    // Update video based on scroll
    useEffect(() => {
        let rafId: number;

        const animate = () => {
            if (!videoRef.current || duration === 0) {
                rafId = requestAnimationFrame(animate);
                return;
            }

            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            let scrollPercent = documentHeight ? scrollYRef.current / documentHeight : 0;

            // Apply custom multiplier
            scrollPercent = scrollPercent * videoMultiplier;

            const clampedPercent = Math.max(0, Math.min(1, scrollPercent));
            videoRef.current.currentTime = clampedPercent * duration;

            rafId = requestAnimationFrame(animate);
        };

        rafId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(rafId);
        };
    }, [duration, videoMultiplier]);

    return (
        <div ref={containerRef} className="w-full overflow-hidden bg-black">
            {/* Debug info (remove in production) */}
            <div className="fixed top-4 left-4 z-50 bg-black/70 text-white text-xs p-3 rounded font-mono hidden lg:block">
                <div>Video: {duration.toFixed(1)}s</div>
                <div>Scroll: {scrollHeight}</div>
                <div>Speed: {videoMultiplier}x</div>
                <div>Lenis: {lenisDuration}s</div>
            </div>

            {/* Full height fixed video */}
            <div className="fixed top-0 left-0 w-full h-screen overflow-hidden z-0">
                <video
                    ref={videoRef}
                    onLoadedMetadata={handleLoadedMetadata}
                    className="w-full h-full object-cover"
                    src="/video.mp4"
                    preload="auto"
                    playsInline
                    muted
                />
            </div>

            {/* Scrollable area */}
            <div
                className="relative z-10"
                style={{
                    height: scrollHeight,
                    backgroundColor: 'transparent',
                }}
            />
        </div>
    );
}