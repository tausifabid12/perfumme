'use client';

import { useRef, useEffect, useState } from 'react';

interface VideoSegment {
    start: number; // seconds
    end: number; // seconds
    multiplier: number; // scroll ratio for this segment
    type: string; // 'action' | 'normal' | 'detailed'
}

export default function ScrollVideoAdaptive() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollYRef = useRef(0);
    const [duration, setDuration] = useState(0);
    const [scrollHeight, setScrollHeight] = useState('600vh');
    const [currentSegment, setCurrentSegment] = useState(0);
    const lenisRef = useRef<any>(null);

    // Segmented scroll ratios based on video motion analysis
    // Adjust these based on your video's pacing
    const segments: VideoSegment[] = [
        { start: 0, end: 5, multiplier: 0.75, type: 'action' }, // Fast action - needs less scroll
        { start: 5, end: 10, multiplier: 0.75, type: 'action' }, // Fast action
        { start: 10, end: 15, multiplier: 0.75, type: 'action' }, // Fast action
        { start: 15, end: 20, multiplier: 0.33, type: 'detailed' }, // Slow detailed - needs more scroll
    ];

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            const dur = videoRef.current.duration;
            setDuration(dur);

            // Calculate scroll height based on segments
            let totalScrollNeeded = 0;
            segments.forEach((seg) => {
                const segmentDuration = seg.end - seg.start;
                // More detailed = more scroll needed
                const multiplier = 1 / seg.multiplier;
                totalScrollNeeded += segmentDuration * multiplier * 20; // 20vh base per second
            });

            const clamped = Math.max(400, Math.min(1200, totalScrollNeeded));
            setScrollHeight(`${clamped}vh`);

            console.log('🎬 Video loaded with adaptive segments:');
            segments.forEach((seg, i) => {
                console.log(`  Segment ${i + 1}: ${seg.start}s-${seg.end}s [${seg.type.toUpperCase()}] ratio: ${seg.multiplier}`);
            });
        }
    };

    // Get current segment based on video time
    const getCurrentSegmentMultiplier = (currentTime: number): number => {
        const segment = segments.find((seg) => currentTime >= seg.start && currentTime < seg.end);
        return segment ? segment.multiplier : 0.5;
    };

    // Initialize Lenis
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1/dist/lenis.umd.js';
        script.async = true;

        script.onload = () => {
            const Lenis = (window as any).Lenis;

            lenisRef.current = new Lenis({
                duration: 1.5,
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

    // Update video based on scroll with adaptive multiplier
    useEffect(() => {
        let rafId: number;
        let accumulatedTime = 0;

        const animate = () => {
            if (!videoRef.current || duration === 0) {
                rafId = requestAnimationFrame(animate);
                return;
            }

            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrollPercent = documentHeight ? scrollYRef.current / documentHeight : 0;

            // Calculate which segment we're in based on scroll
            let currentTime = 0;
            let remainingScroll = scrollPercent;

            for (const segment of segments) {
                const segmentDuration = segment.end - segment.start;
                // Each segment takes up scroll space based on its multiplier
                const segmentScrollSpace = (segmentDuration * (1 / segment.multiplier)) / (duration * (1 / 0.5));

                if (remainingScroll <= segmentScrollSpace) {
                    // We're in this segment
                    const segmentScrollPercent = remainingScroll / segmentScrollSpace;
                    currentTime = segment.start + segmentScrollPercent * segmentDuration;
                    setCurrentSegment(segments.indexOf(segment));
                    break;
                }

                remainingScroll -= segmentScrollSpace;
                currentTime = segment.end;
            }

            const clampedTime = Math.max(0, Math.min(duration, currentTime));
            videoRef.current.currentTime = clampedTime;

            rafId = requestAnimationFrame(animate);
        };

        rafId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(rafId);
        };
    }, [duration, segments]);

    return (
        <div ref={containerRef} className="w-full overflow-hidden bg-black">
            {/* Segment indicator */}
            <div className="fixed top-4 left-4 z-50 bg-black/70 text-white text-xs p-3 rounded font-mono hidden lg:block">
                <div className="mb-2 font-bold">Adaptive Scroll</div>
                {segments.map((seg, i) => (
                    <div
                        key={i}
                        className={`py-1 px-2 rounded mb-1 ${i === currentSegment
                            ? 'bg-blue-500/50 border border-blue-400'
                            : 'opacity-50'
                            }`}
                    >
                        {seg.start}-{seg.end}s: {seg.type} (×{seg.multiplier})
                    </div>
                ))}
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

            {/* Scrollable area - dynamically sized */}
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