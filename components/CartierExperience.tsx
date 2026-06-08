"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 600;

export default function CartierExperience() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    const titleRef = useRef<HTMLHeadingElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);

    const [loaded, setLoaded] = useState(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        const section = sectionRef.current;

        if (!canvas || !section) return;

        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        const frameIndex = { value: 0 };
        const images: HTMLImageElement[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            render();
        };

        const render = () => {
            const image = images[Math.floor(frameIndex.value)];

            if (!image) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const scale = Math.max(
                canvas.width / image.width,
                canvas.height / image.height
            );

            const x = (canvas.width - image.width * scale) / 2;
            const y = (canvas.height - image.height * scale) / 2;

            ctx.drawImage(
                image,
                x,
                y,
                image.width * scale,
                image.height * scale
            );
        };

        resize();
        window.addEventListener("resize", resize);

        let loadedCount = 0;

        const loadFrames = async () => {
            const promises = [];

            for (let i = 1; i <= TOTAL_FRAMES; i++) {
                promises.push(
                    new Promise<void>((resolve) => {
                        const image = new Image();

                        image.src = `/frames2/frame_${String(i).padStart(
                            4,
                            "0"
                        )}.jpg`;

                        image.onload = () => {
                            images[i - 1] = image;

                            loadedCount++;

                            setLoaded(
                                Math.round(
                                    (loadedCount / TOTAL_FRAMES) * 100
                                )
                            );

                            resolve();
                        };

                        image.onerror = () => {
                            console.error(
                                `Missing frame: frame_${String(i).padStart(
                                    4,
                                    "0"
                                )}.jpg`
                            );

                            resolve();
                        };
                    })
                );
            }

            await Promise.all(promises);

            setLoaded(100);

            render();

            gsap.to(frameIndex, {
                value: TOTAL_FRAMES - 1,
                snap: "value",
                ease: "none",

                onUpdate: render,

                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "+=5000",
                    scrub: 1,
                },
            });

            gsap.fromTo(
                titleRef.current,
                {
                    opacity: 0,
                    y: 100,
                },
                {
                    opacity: 1,
                    y: 0,
                    scrollTrigger: {
                        trigger: section,
                        start: "top 60%",
                        end: "+=600",
                        scrub: true,
                    },
                }
            );

            gsap.fromTo(
                textRef.current,
                {
                    opacity: 0,
                    y: 50,
                },
                {
                    opacity: 1,
                    y: 0,
                    scrollTrigger: {
                        trigger: section,
                        start: "top 50%",
                        end: "+=600",
                        scrub: true,
                    },
                }
            );

            ScrollTrigger.refresh();
        };

        loadFrames();

        return () => {
            window.removeEventListener("resize", resize);

            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <>
            {loaded < 100 && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black text-white">
                    Loading {loaded}%
                </div>
            )}

            <section
                ref={sectionRef}
                className="relative h-[1000vh] bg-black"
            >
                <div className="sticky top-0 h-screen overflow-hidden">
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 h-full w-full"
                    />

                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />

                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute left-[8%] top-[20%]">
                            <h1
                                ref={titleRef}
                                className="text-white text-7xl font-bold"
                            >
                                {/* The Future */}
                            </h1>
                        </div>

                        <div className="absolute left-[8%] top-[40%] max-w-xl">
                            <p
                                ref={textRef}
                                className="text-white/80 text-xl"
                            >
                                {/* Experience a cinematic scroll-driven story. */}
                            </p>
                        </div>
                    </div>

                    <div className="absolute right-20 top-40 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

                    <div className="absolute left-20 bottom-40 h-60 w-60 rounded-full bg-white/5 blur-3xl" />
                </div>
            </section>
        </>
    );
}