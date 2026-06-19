"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { X } from "lucide-react";
import type { ProductData } from "@/types/product";
import TransitionLink from "@/components/TransitionLink";

// Map nav item labels to real routes
const NAV_ROUTES: Record<string, string> = {
  "Shop All Scents": "/collections",
  "About LUXE": "/contact",
  "Fragrance Guide": "/collections",
  "Store Locator": "/contact",
  "Contact": "/contact",
};

const SOCIAL_URLS: Record<string, string> = {
  youtube: "https://youtube.com",
  instagram: "https://instagram.com",
  twitter: "https://twitter.com",
  tiktok: "https://tiktok.com",
};

function SocialPlatformIcon({ platform, size = 20 }: { platform: string; size?: number }) {
  if (platform === "youtube") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  );
  if (platform === "instagram") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
  if (platform === "twitter") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
  return null;
}

export default function Navbar({ data }: { data: ProductData }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.3);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      gsap.fromTo(
        menuItemsRef.current.filter(Boolean),
        { opacity: 0, y: 60, rotateX: -50 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.7, ease: "expo.out", stagger: 0.07, delay: 0.15 }
      );
    }
  }, [menuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500"
        style={{
          background: scrolled ? "rgba(10,10,10,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(212,175,55,0.12)" : "none",
        }}>
        <div className="flex items-center justify-between px-6 lg:px-10" style={{ height: 64 }}>
          <TransitionLink href="/" label="Home"
            className="font-display text-2xl font-black tracking-tight cursor-hover"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.04em" }}>
            {data.brand.name}
          </TransitionLink>
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col items-end justify-center gap-[5px] w-10 h-10 group cursor-hover"
            aria-label="Menu">
            <span className="block h-[2px] transition-all duration-400 group-hover:w-4"
              style={{ background: "var(--text-primary)", width: 24 }} />
            <span className="block h-[2px] transition-all duration-400 group-hover:w-6"
              style={{ background: "var(--text-primary)", width: 16 }} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: "rgba(10,10,10,0.97)" }}>
          <button onClick={() => setMenuOpen(false)}
            className="absolute top-5 right-6 w-10 h-10 flex items-center justify-center cursor-hover">
            <X size={24} style={{ color: "var(--text-primary)" }} />
          </button>
          <div className="flex flex-col items-center gap-10" style={{ perspective: 800 }}>
            {data.nav.items.map((item, i) => (
              <TransitionLink
                key={item}
                ref={(el: HTMLAnchorElement | null) => { menuItemsRef.current[i] = el; }}
                href={NAV_ROUTES[item] ?? "/collections"}
                label={item}
                onClick={() => setMenuOpen(false)}
                className="font-display text-5xl md:text-6xl font-black uppercase transition-colors duration-300 cursor-hover"
                style={{ color: "var(--text-primary)", opacity: 0, letterSpacing: "-0.04em", lineHeight: 1 }}>
                {item}
              </TransitionLink>
            ))}
          </div>
          <div className="absolute bottom-10 flex gap-6">
            {data.social.platforms.map((platform) => (
              <a key={platform} href={SOCIAL_URLS[platform] ?? "#"} target="_blank" rel="noopener noreferrer"
                className="cursor-hover" style={{ color: "var(--text-secondary)" }}>
                <SocialPlatformIcon platform={platform} size={20} />
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
