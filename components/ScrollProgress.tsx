"use client";

import { useEffect } from "react";

export default function ScrollProgress() {
    useEffect(() => {
        const handle = () => {
            const max =
                document.documentElement.scrollHeight -
                window.innerHeight;

            const progress = (window.scrollY / max) * 100;

            const bar = document.getElementById("progress-bar");
            if (bar) bar.style.width = `${progress}%`;
        };

        window.addEventListener("scroll", handle, { passive: true });

        return () => window.removeEventListener("scroll", handle);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-1 z-[999] bg-white/10">
            <div id="progress-bar" className="h-full bg-white w-0" />
        </div>
    );
}