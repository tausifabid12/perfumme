"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import GodModeScene from "@/components/GodModeScene";
import GodModeExperience from "@/components/GodModeExperience";
import ScrollVelocity from "@/components/providers/ScrollVelocity";
import CinematicTypography from "@/components/Cinematictypography";
import CinematicNav from "@/components/Cinematicnav";
import HomeSections from "@/components/HomeSections";
import SiteFooter from "@/components/SiteFooter";
import LoadingScreen from "@/components/LoadingScreen";

export default function Page() {
    const [loading, setLoading] = useState(true);
    const triggerCompleteRef = useRef<(() => void) | null>(null);
    // Ref to the below-fold wrapper — we toggle visibility via CSS so it's
    // always in the DOM (stable scrollHeight) but invisible until needed
    const belowFoldRef = useRef<HTMLDivElement>(null);

    // ── Loading screen ────────────────────────────────────────────────
    const registerTrigger = useCallback((fn: () => void) => {
        triggerCompleteRef.current = fn;
    }, []);
    const handleVideoReady = useCallback(() => {
        triggerCompleteRef.current?.();
    }, []);
    const handleLoadComplete = useCallback(() => {
        setLoading(false);
    }, []);

    // ── Reveal HomeSections at the end of the cinematic zone ──────────
    // GodModeExperience = 800vh. Fixed cinematic maxScroll = 799vh.
    // IT BOY appears at 93% (743vh). We reveal HomeSections at 98.5% (787vh)
    // — the same point CinematicTypography hides its overlay.
    // Using visibility + pointer-events keeps scrollHeight stable.
    useEffect(() => {
        const el = belowFoldRef.current;
        if (!el) return;

        const CINEMATIC_MAX_SCROLL = () => window.innerHeight * 12; // 1200vh (1300vh - 100vh viewport)

        const check = () => {
            if (window.scrollY >= CINEMATIC_MAX_SCROLL() * 0.998) {
                el.style.visibility = "visible";
                el.style.pointerEvents = "auto";
            } else {
                el.style.visibility = "hidden";
                el.style.pointerEvents = "none";
            }
        };

        window.addEventListener("scroll", check, { passive: true });
        check(); // handle page refresh with saved scroll position
        return () => window.removeEventListener("scroll", check);
    }, []);

    return (
        <main className="bg-black">
            {loading && (
                <LoadingScreen
                    onComplete={handleLoadComplete}
                    onRegister={registerTrigger}
                />
            )}

            <CinematicNav />
            <ScrollVelocity />

            {/* WebGL particle field — fixed behind everything */}
            <GodModeScene />

            {/* 800vh cinematic scroll zone */}
            <GodModeExperience onReady={handleVideoReady} />

            {/* Fixed overlay — uses fixed 799vh math, unaffected by content below */}
            <CinematicTypography />

            {/* Always in DOM (stable scrollHeight) but hidden until cinematic ends.
                Revealed at 98.5% of cinematic scroll — same point overlay hides. */}
            <div
                ref={belowFoldRef}
                style={{ visibility: "hidden", pointerEvents: "none" }}
            >
                <HomeSections />
                <SiteFooter />
            </div>
        </main>
    );
}
