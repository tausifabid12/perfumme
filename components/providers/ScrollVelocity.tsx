"use client";

import { useEffect } from "react";

export default function ScrollVelocity() {
    useEffect(() => {
        let last = 0;

        const onScroll = () => {
            const current = window.scrollY;
            const velocity = current - last;
            last = current;

            document.documentElement.style.setProperty(
                "--scroll-velocity",
                String(velocity)
            );
        };

        window.addEventListener("scroll", onScroll, { passive: true });

        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return null;
}