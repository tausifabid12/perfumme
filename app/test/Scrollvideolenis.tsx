'use client';

import { useRef, useEffect, useState } from 'react';

export default function ScrollVideoLenis() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollYRef = useRef(0);
    const [duration, setDuration] = useState(0);
    const lenisRef = useRef<any>(null);

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    // Initialize Lenis smooth scroll
    useEffect(() => {
        // Dynamically load Lenis from CDN
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1/dist/lenis.umd.js';
        script.async = true;

        script.onload = () => {
            const Lenis = (window as any).Lenis;

            lenisRef.current = new Lenis({
                duration: 2.0, // Smooth scroll duration (increase for slower feel)
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easing
                direction: 'vertical',
                gestureDirection: 'vertical',
                smooth: true,
                smoothTouch: false,
                touchMultiplier: 2,
            });

            // Connect Lenis to scroll
            lenisRef.current.on('scroll', (e: any) => {
                scrollYRef.current = e.scroll;
            });

            // Animation loop
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

    // Update video based on scroll (slower progression)
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

            // SLOWER PROGRESSION: 2% scroll = 1% video
            // So multiply by 0.5 to make video progress half as fast
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
        <div ref={containerRef} className="w-full overflow-hidden">
            {/* Full height fixed video - always visible */}
            <div className="fixed top-0 left-0 w-full h-screen overflow-hidden z-0">
                <video
                    ref={videoRef}
                    onLoadedMetadata={handleLoadedMetadata}
                    className="w-full h-full object-cover"
                    src="/video.mp4"
                    preload="metadata"
                    playsInline
                    muted
                />
            </div>

            {/* Scrollable area - now extended to accommodate slower progression */}
            <div className="relative z-10" style={{ height: '500vh' }} />
        </div>
    );
}