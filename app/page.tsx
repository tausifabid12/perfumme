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
import MobileHeroExperience from "@/components/MobileHeroExperience";

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": "https://www.senz8.in/#organization",
            "name": "Senz8 Aroma Private Limited",
            "url": "https://www.senz8.in",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.senz8.in/logo.png",
                "width": 200,
                "height": 200,
            },
            "contactPoint": {
                "@type": "ContactPoint",
                "email": "contact@senz8.in",
                "contactType": "customer service",
                "areaServed": "IN",
                "availableLanguage": "English",
            },
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "No. 427 Srinivasa Nilaya, 6th Cross, Domlur",
                "addressLocality": "Bangalore",
                "addressRegion": "Karnataka",
                "postalCode": "560071",
                "addressCountry": "IN",
            },
            "sameAs": [
                "https://www.instagram.com/senz8aroma",
            ],
        },
        {
            "@type": "WebSite",
            "@id": "https://www.senz8.in/#website",
            "url": "https://www.senz8.in",
            "name": "SENZ8 Aroma",
            "description": "Luxury Extrait de Parfum — crafted in shadow, remembered forever.",
            "publisher": { "@id": "https://www.senz8.in/#organization" },
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": "https://www.senz8.in/collections?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
            },
        },
    ],
};

export default function Page() {
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const triggerCompleteRef = useRef<(() => void) | null>(null);
    const belowFoldRef = useRef<HTMLDivElement>(null);

    // Detect mobile on mount (SSR-safe)
    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

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
            {/* JSON-LD structured data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {loading && (
                <LoadingScreen
                    onComplete={handleLoadComplete}
                    onRegister={registerTrigger}
                />
            )}

            <CinematicNav canAnimate={!loading} />

            {/* ── MOBILE experience ── fixed card deck, then normal scroll ── */}
            {isMobile ? (
                <>
                    {/* Fixed overlay — sits above everything until user swipes through all 4 cards */}
                    <MobileHeroExperience onReady={handleVideoReady} />
                    {/* Normal page content — always in DOM, visible once hero dismisses */}
                    <HomeSections />
                    <SiteFooter />
                </>
            ) : (
                /* ── DESKTOP experience ── full cinematic scroll ── */
                <>
                    <ScrollVelocity />
                    {/* WebGL particle field — fixed behind everything */}
                    <GodModeScene />
                    {/* 1300vh cinematic scroll zone */}
                    <GodModeExperience onReady={handleVideoReady} />
                    {/* Fixed overlay — uses fixed 1200vh math */}
                    <CinematicTypography canAnimate={!loading} />
                    {/* Revealed at end of cinematic scroll */}
                    <div
                        ref={belowFoldRef}
                        style={{ visibility: "hidden", pointerEvents: "none" }}
                    >
                        <HomeSections />
                        <SiteFooter />
                    </div>
                </>
            )}
        </main>
    );
}
