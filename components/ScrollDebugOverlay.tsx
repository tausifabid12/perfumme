// components/ScrollDebugOverlay.tsx
"use client";

import { useEffect, useRef } from "react";

export default function ScrollDebugOverlay() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onScroll = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const p = (window.scrollY / max) * 100;
            if (ref.current) {
                ref.current.textContent = `${p.toFixed(1)}%`;
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div
            ref={ref}
            className="fixed bottom-4 right-4 z-[9999] bg-black/70 text-white text-xs font-mono px-3 py-1.5 rounded-full border border-white/20 pointer-events-none tabular-nums"
        >
            0.0%
        </div>
    );
}