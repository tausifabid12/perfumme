'use client';

import { useRef, useEffect, useState } from 'react';

interface SmoothScrollConfig {
    useFrameInterpolation?: boolean; // Smooth frame seeking
    useDecimation?: boolean; // Skip frames for perf
    dampingFactor?: number; // Scroll smoothing (0-1)
}

export default function ScrollVideoSmoothed({
    useFrameInterpolation = true,
    useDecimation = false,
    dampingFactor = 0.85,
}: SmoothScrollConfig = {}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollYRef = useRef(0);
    const targetTimeRef = useRef(0);
    const currentTimeRef = useRef(0);
    const [duration, setDuration] = useState(0);
    const lastUpdateRef = useRef(0);

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            const dur = videoRef.current.duration;
            setDuration(dur);
            currentTimeRef.current = 0;
            targetTimeRef.current = 0;
        }
    };

    // Main smooth update loop
    useEffect(() => {
        let rafId: number;

        const handleScroll = () => {
            scrollYRef.current = window.scrollY;
        };

        const animate = () => {
            if (!videoRef.current || duration === 0) {
                rafId = requestAnimationFrame(animate);
                return;
            }

            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrollPercent = documentHeight ? scrollYRef.current / documentHeight : 0;

            // Clamp scroll percent between 0 and 1
            const clampedPercent = Math.max(0, Math.min(1, scrollPercent));
            const targetTime = clampedPercent * duration;

            // Frame interpolation: smoothly move towards target time
            if (useFrameInterpolation) {
                targetTimeRef.current = targetTime;

                // Ease towards target time
                const diff = targetTimeRef.current - currentTimeRef.current;
                const smoothDiff = diff * (1 - dampingFactor);
                currentTimeRef.current += smoothDiff;

                // Set video time with interpolation
                videoRef.current.currentTime = currentTimeRef.current;
            } else {
                // Direct seek (snappier but potentially jumpy)
                videoRef.current.currentTime = targetTime;
            }

            rafId = requestAnimationFrame(animate);
        };

        // Passive scroll listener for better performance
        window.addEventListener('scroll', handleScroll, { passive: true });
        rafId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(rafId);
        };
    }, [duration, useFrameInterpolation, dampingFactor]);

    return (
        <div ref={containerRef} className="w-full">
            {/* Sticky video container */}
            <div className="sticky top-0 w-full h-screen overflow-hidden z-0 bg-black">
                <video
                    ref={videoRef}
                    onLoadedMetadata={handleLoadedMetadata}
                    className="w-full h-full object-cover"
                    src="/video.mp4"
                    preload="metadata"
                    playsInline
                    muted
                    disablePictureInPicture
                    controlsList="nodownload"
                />
            </div>

            {/* Scrollable area - 300vh gives smooth control over full video */}
            <div className="relative w-full bg-black" style={{ height: '300vh' }} />
        </div>
    );
}