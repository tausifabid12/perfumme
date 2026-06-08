'use client';

import { useRef, useEffect, useState } from 'react';

export default function ScrollVideoGallery() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollPercent, setScrollPercent] = useState(0);
    const [duration, setDuration] = useState(0);

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (!videoRef.current || !containerRef.current) return;

            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrollTop = window.scrollY;
            const scrollPercent = documentHeight ? scrollTop / documentHeight : 0;

            setScrollPercent(scrollPercent);

            // Smooth video scrubbing based on scroll
            if (duration > 0) {
                videoRef.current.currentTime = scrollPercent * duration;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [duration]);

    return (
        <div ref={containerRef} className="w-full bg-black text-white">
            {/* Hero Section with Sticky Video */}
            <div className="sticky top-0 h-screen flex items-center justify-center z-10">
                <div className="relative w-full h-full">
                    <video
                        ref={videoRef}
                        onLoadedMetadata={handleLoadedMetadata}
                        className="w-full h-full object-cover"
                        src="/bg-video.mp4"
                        preload="metadata"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

                    {/* Content Over Video */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                        <h1 className="text-6xl md:text-7xl font-light tracking-wide mb-4 opacity-0 animate-fade-in">
                            WATCHES AND WONDERS
                        </h1>
                        <p className="text-lg md:text-xl font-light tracking-widest text-gray-300 opacity-0 animate-fade-in animation-delay-200">
                            SCROLL TO EXPLORE
                        </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="absolute bottom-8 left-8 right-8 md:left-12 md:right-12">
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-white/30">
                                <div
                                    className="h-full bg-white transition-all duration-100"
                                    style={{ width: `${scrollPercent * 100}%` }}
                                />
                            </div>
                            <span className="text-sm font-light tracking-widest text-white/70 min-w-fit">
                                {Math.round(scrollPercent * 100)}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="bg-black">
                {/* Section 1 */}
                <section className="min-h-screen flex items-center px-4 md:px-12 py-24">
                    <div className="max-w-3xl">
                        <div className="mb-8">
                            <span className="text-xs tracking-[0.2em] text-gray-400 uppercase">
                                Collection 01
                            </span>
                            <h2 className="text-5xl md:text-6xl font-light tracking-wide mt-4 mb-6">
                                Timeless Elegance
                            </h2>
                        </div>
                        <p className="text-lg text-gray-400 font-light leading-relaxed">
                            Experience the pinnacle of watchmaking craftsmanship. Each timepiece is meticulously
                            designed to capture the essence of luxury and precision. Discover the artistry behind
                            every second.
                        </p>
                    </div>
                </section>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-12" />

                {/* Section 2 */}
                <section className="min-h-screen flex items-center px-4 md:px-12 py-24">
                    <div className="max-w-3xl">
                        <div className="mb-8">
                            <span className="text-xs tracking-[0.2em] text-gray-400 uppercase">
                                Collection 02
                            </span>
                            <h2 className="text-5xl md:text-6xl font-light tracking-wide mt-4 mb-6">
                                Heritage & Innovation
                            </h2>
                        </div>
                        <p className="text-lg text-gray-400 font-light leading-relaxed">
                            Blending tradition with contemporary design, our watches stand as monuments to horological
                            excellence. Every mechanism, every detail tells a story of dedication and mastery.
                        </p>
                    </div>
                </section>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-12" />

                {/* Section 3 */}
                <section className="min-h-screen flex items-center px-4 md:px-12 py-24">
                    <div className="max-w-3xl">
                        <div className="mb-8">
                            <span className="text-xs tracking-[0.2em] text-gray-400 uppercase">
                                Collection 03
                            </span>
                            <h2 className="text-5xl md:text-6xl font-light tracking-wide mt-4 mb-6">
                                The Art of Time
                            </h2>
                        </div>
                        <p className="text-lg text-gray-400 font-light leading-relaxed">
                            In a world of constant change, our watches remain steadfast companions. They measure
                            not just moments, but milestones. They are more than instruments—they are expressions
                            of your finest self.
                        </p>
                    </div>
                </section>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-12" />

                {/* Section 4 */}
                <section className="min-h-screen flex items-center px-4 md:px-12 py-24">
                    <div className="max-w-3xl">
                        <div className="mb-8">
                            <span className="text-xs tracking-[0.2em] text-gray-400 uppercase">
                                Final Moment
                            </span>
                            <h2 className="text-5xl md:text-6xl font-light tracking-wide mt-4 mb-6">
                                Your Story Awaits
                            </h2>
                        </div>
                        <p className="text-lg text-gray-400 font-light leading-relaxed">
                            Begin your journey into the world of exceptional watchmaking. Let each tick remind you
                            of the moments that matter most. This is more than a watch—it's your legacy.
                        </p>
                        <button className="mt-12 px-12 py-4 border border-white/50 text-white text-sm tracking-widest hover:bg-white/5 transition-colors duration-500">
                            DISCOVER MORE
                        </button>
                    </div>
                </section>

                {/* Final Spacing */}
                <div className="h-32" />
            </div>

            {/* Animations */}
            <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
        </div>
    );
}