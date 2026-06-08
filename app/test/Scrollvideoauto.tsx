'use client';

import { useRef, useEffect, useState } from 'react';

export default function ScrollVideoAuto() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollYRef = useRef(0);
    const [duration, setDuration] = useState(0);
    const [scrollHeight, setScrollHeight] = useState('500vh');
    const lenisRef = useRef<any>(null);

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            const dur = videoRef.current.duration;
            setDuration(dur);

            // AUTO-CALCULATE optimal scroll area based on video duration
            // Formula: 20vh per second of video (gives fine control)
            // For 20 sec video = 400vh
            // For 60 sec video = 1200vh
            let calculatedHeight = dur * 20;

            // Cap between min and max
            calculatedHeight = Math.max(300, Math.min(1200, calculatedHeight));

            setScrollHeight(`${calculatedHeight}vh`);

            console.log(
                `📹 Video: ${dur.toFixed(1)}s → Scroll area: ${calculatedHeight}vh`
            );
        }
    };

    // Initialize Lenis smooth scroll
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1/dist/lenis.umd.js';
        script.async = true;

        script.onload = () => {
            const Lenis = (window as any).Lenis;

            lenisRef.current = new Lenis({
                duration: 1.5, // Smooth scroll
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
    }, []);

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

            // 2% scroll = 1% video (smooth, slow progression)
            scrollPercent = scrollPercent * 0.5;

            const clampedPercent = Math.max(0, Math.min(1, scrollPercent));
            videoRef.current.currentTime = clampedPercent * duration;

            rafId = requestAnimationFrame(animate);
        };

        rafId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(rafId);
        };
    }, [duration]);

    return (
        <div ref={containerRef} className="w-full overflow-hidden bg-black">
            {/* Full height fixed video - always visible, fully covering screen */}
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

            {/* Scrollable area - dynamically sized based on video duration */}
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