'use client';

import { useRef, useEffect, useState } from 'react';

interface VideoSegment {
    start: number;
    end: number;
    multiplier: number;
    type: string;
}

export default function ScrollVideoSmoothed() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollYRef = useRef(0);
    const targetTimeRef = useRef(0);
    const currentTimeRef = useRef(0);
    const [duration, setDuration] = useState(0);
    const [scrollHeight, setScrollHeight] = useState('700vh');
    const [isLoading, setIsLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const lenisRef = useRef<any>(null);
    const rafIdRef = useRef<number | null>(null);

    // Adaptive segments based on video analysis
    const segments: VideoSegment[] = [
        { start: 0, end: 5, multiplier: 0.75, type: 'action' },
        { start: 5, end: 10, multiplier: 0.75, type: 'action' },
        { start: 10, end: 15, multiplier: 0.75, type: 'action' },
        { start: 15, end: 20, multiplier: 0.33, type: 'detailed' },
    ];

    // Track loading progress
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleProgress = () => {
            if (video.buffered.length > 0) {
                const bufferedEnd = video.buffered.end(video.buffered.length - 1);
                const progress = (bufferedEnd / video.duration) * 100;
                setLoadProgress(Math.min(progress, 99)); // Keep at 99% until fully loaded
            }
        };

        const handleCanPlayThrough = () => {
            // Entire video is loaded
            setLoadProgress(100);
            setTimeout(() => {
                setIsLoading(false);
                setIsReady(true);
            }, 300); // Smooth fade out
        };

        video.addEventListener('progress', handleProgress);
        video.addEventListener('canplaythrough', handleCanPlayThrough);

        return () => {
            video.removeEventListener('progress', handleProgress);
            video.removeEventListener('canplaythrough', handleCanPlayThrough);
        };
    }, []);

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            const dur = videoRef.current.duration;
            setDuration(dur);

            // Calculate scroll area
            let totalScrollNeeded = 0;
            segments.forEach((seg) => {
                const segmentDuration = seg.end - seg.start;
                const multiplier = 1 / seg.multiplier;
                totalScrollNeeded += segmentDuration * multiplier * 20;
            });

            const clamped = Math.max(400, Math.min(1200, totalScrollNeeded));
            setScrollHeight(`${clamped}vh`);
        }
    };

    // Initialize Lenis
    useEffect(() => {
        if (!isReady) return;

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1/dist/lenis.umd.js';
        script.async = true;

        script.onload = () => {
            const Lenis = (window as any).Lenis;

            lenisRef.current = new Lenis({
                duration: 1.8, // Slightly smoother for ultra-smoothness
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
    }, [isReady]);

    // Ultra-smooth video update with frame interpolation
    useEffect(() => {
        if (!isReady || !videoRef.current || duration === 0) return;

        let rafId: number;
        let lastUpdateTime = 0;
        const frameDuration = 1000 / 60; // Target 60fps

        const animate = (currentTime: number) => {
            // Throttle updates to avoid excessive recalculations
            if (currentTime - lastUpdateTime < frameDuration * 0.8) {
                rafId = requestAnimationFrame(animate);
                return;
            }

            lastUpdateTime = currentTime;

            if (!videoRef.current || duration === 0) {
                rafId = requestAnimationFrame(animate);
                return;
            }

            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrollPercent = documentHeight ? scrollYRef.current / documentHeight : 0;

            // Calculate video time based on segments
            let videoTime = 0;
            let remainingScroll = scrollPercent;

            for (const segment of segments) {
                const segmentDuration = segment.end - segment.start;
                const segmentScrollSpace = (segmentDuration * (1 / segment.multiplier)) / (duration * (1 / 0.5));

                if (remainingScroll <= segmentScrollSpace) {
                    const segmentScrollPercent = segmentScrollSpace > 0 ? remainingScroll / segmentScrollSpace : 0;
                    const targetTime = segment.start + segmentScrollPercent * segmentDuration;
                    targetTimeRef.current = Math.max(segment.start, Math.min(segment.end, targetTime));
                    break;
                }

                remainingScroll -= segmentScrollSpace;
                videoTime = segment.end;
            }

            // Smooth frame interpolation
            const diff = targetTimeRef.current - currentTimeRef.current;
            const smoothFactor = 0.25; // Higher = smoother but more lag, Lower = snappier
            currentTimeRef.current += diff * smoothFactor;

            const clampedTime = Math.max(0, Math.min(duration, currentTimeRef.current));
            videoRef.current.currentTime = clampedTime;

            rafId = requestAnimationFrame(animate);
        };

        rafId = requestAnimationFrame(animate);
        rafIdRef.current = rafId;

        return () => {
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, [isReady, duration, segments]);

    return (
        <div ref={containerRef} className="w-full">
            {/* Loading Screen */}
            <div
                className={`fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            >
                <div className="text-center">
                    {/* Animated Loading Icon */}
                    <div className="mb-6">
                        <div className="relative w-16 h-16 mx-auto">
                            <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
                            <div
                                className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"
                                style={{ animationDuration: '1s' }}
                            />
                        </div>
                    </div>

                    {/* Loading Text */}
                    <h2 className="text-white text-xl font-light tracking-wide mb-4">
                        Loading Experience
                    </h2>
                    <p className="text-gray-400 text-sm font-light mb-6">
                        Buffering video for smooth playback...
                    </p>

                    {/* Progress Bar */}
                    <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white transition-all duration-300 ease-out"
                            style={{ width: `${loadProgress}%` }}
                        />
                    </div>

                    {/* Percentage */}
                    <p className="text-white/50 text-xs mt-4 font-mono">
                        {Math.round(loadProgress)}%
                    </p>
                </div>
            </div>

            {/* Info Banner While Loading */}
            <div
                className={`fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black via-black to-transparent px-6 py-8 text-center transition-all duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'
                    }`}
            >
                <p className="text-white/60 text-sm font-light">
                    ✓ Video ready • Scroll to play
                </p>
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
                className="relative z-10 pointer-events-none"
                style={{
                    height: scrollHeight,
                    backgroundColor: 'transparent',
                }}
            />
        </div>
    );
}