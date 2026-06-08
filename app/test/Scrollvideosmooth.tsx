'use client';

import { useRef, useEffect, useState } from 'react';

export default function ScrollVideoMinimal() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollYRef = useRef(0);
    const [duration, setDuration] = useState(0);

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    // Smooth scroll using RAF for better performance
    useEffect(() => {
        let rafId: number;
        let scrollVelocity = 0;
        let lastScrollY = 0;

        const updateVideoOnScroll = (currentScrollY: number) => {
            if (!videoRef.current || duration === 0) return;

            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrollPercent = documentHeight ? currentScrollY / documentHeight : 0;

            // Clamp between 0 and 1
            const clampedPercent = Math.max(0, Math.min(1, scrollPercent));

            // Direct seek with no delay
            videoRef.current.currentTime = clampedPercent * duration;
        };

        const handleScroll = () => {
            scrollYRef.current = window.scrollY;
        };

        const animate = () => {
            updateVideoOnScroll(scrollYRef.current);
            rafId = requestAnimationFrame(animate);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        rafId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(rafId);
        };
    }, [duration]);

    return (
        <div ref={containerRef} className="w-full">
            {/* Full viewport sticky video */}
            <div className="sticky top-0 w-full h-screen overflow-hidden z-0">
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

            {/* Long scrollable area to control video */}
            <div className="relative w-full bg-black" style={{ height: '300vh' }} />
        </div>
    );
}