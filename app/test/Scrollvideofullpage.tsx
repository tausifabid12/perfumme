'use client';

import { useRef, useEffect, useState } from 'react';

export default function ScrollVideoFullPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollYRef = useRef(0);
    const [duration, setDuration] = useState(0);

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

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

            const clampedPercent = Math.max(0, Math.min(1, scrollPercent));
            videoRef.current.currentTime = clampedPercent * duration;

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
        <div ref={containerRef} className="w-full overflow-hidden">
            {/* Full height sticky video - entire viewport */}
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

            {/* Scrollable content area - no visible background */}
            <div className="relative z-10" style={{ height: '300vh' }} />
        </div>
    );
}