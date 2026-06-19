/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import useMagnetic from "@/lib/animations/use-magnetic";
import TransitionLink from "@/components/TransitionLink";
import type { ProductData } from "@/types/product";

gsap.registerPlugin(ScrollTrigger);

// Scent name → route map
const SCENT_ROUTES: Record<string, string> = {
  "IMPERIAL SMOKE": "/products/imperial-smoke",
  "Imperial Smoke": "/products/imperial-smoke",
  "IT BOY": "/products/it-boy",
  "It Boy": "/products/it-boy",
  "REBEL GIRL": "/products/rebel-girl",
  "Rebel Girl": "/products/rebel-girl",
  "BLIND DATE": "/products/blind-date",
  "Blind Date": "/products/blind-date",
};

const SOCIAL_URLS: Record<string, string> = {
  youtube: "https://youtube.com",
  instagram: "https://instagram.com",
  twitter: "https://twitter.com",
  tiktok: "https://tiktok.com",
};

const COMPANY_ROUTES: Record<string, string> = {
  "Our Story": "#",
  "Contact": "/contact",
  "Press": "#",
};

const LEGAL_ROUTES: Record<string, string> = {
  "Privacy Policy": "/privacy-policy",
  "Terms of Service": "/terms",
};

function SocialPlatformIcon({ platform, size = 18 }: { platform: string; size?: number }) {
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

export default function Footer({ data }: { data: ProductData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const canRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const footerBtnMagnetic = useMagnetic(0.2);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(canRef.current,
        { y: 120, opacity: 0, scale: 0.8 },
        {
          y: 0, opacity: 1, scale: 1, duration: 1.4, ease: "expo.out", delay: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", toggleActions: "play none none none" }
        }
      );
      gsap.fromTo(headlineRef.current,
        { clipPath: "inset(0 0 100% 0)", opacity: 0 },
        {
          clipPath: "inset(0 0 0% 0)", opacity: 1, duration: 1.4, ease: "power4.out", delay: 0.4,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" }
        }
      );
      gsap.fromTo(ctaRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1, duration: 1, ease: "back.out(2)", delay: 0.9,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" }
        }
      );
      gsap.to(canRef.current, { y: -16, duration: 2.5, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 1.5 });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={sectionRef} className="relative pt-24 pb-12 overflow-hidden" style={{ background: "#080808" }}>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: 600, height: 300, background: "radial-gradient(ellipse at center, rgba(212,175,55,0.05) 0%, transparent 70%)" }} />

      {/* Floating bottle */}
      <div className="flex justify-center mb-12">
        <img ref={canRef} src={data.product.footerImage} alt={data.brand.name}
          className="h-[38vh] lg:h-[48vh] w-auto object-contain"
          style={{
            filter: "drop-shadow(0 30px 80px rgba(0,0,0,0.7)) drop-shadow(0 0 60px rgba(212,175,55,0.06))",
            willChange: "transform", opacity: 0
          }} />
      </div>

      {/* Hashtag headline */}
      <div ref={headlineRef} className="px-6 lg:px-10 mb-10 overflow-hidden text-center"
        style={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}>
        <h2 className="font-black uppercase"
          style={{ fontSize: "clamp(42px, 9vw, 130px)", letterSpacing: "-0.04em", lineHeight: 0.9, color: "var(--text-primary)" }}>
          {data.footer.hashtag}
        </h2>
      </div>

      {/* CTA */}
      <div ref={ctaRef} className="flex justify-center mb-16" style={{ opacity: 0 }}>
        <TransitionLink ref={footerBtnMagnetic} href="/collections" label="The Collection"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-pill font-black uppercase tracking-widest text-sm cursor-hover"
          style={{ background: "var(--accent-gold)", color: "#0A0A0A", boxShadow: "0 0 40px rgba(212,175,55,0.18)" }}>
          {data.footer.cta} <ArrowRight size={14} />
        </TransitionLink>
      </div>

      {/* Social icons */}
      <div className="flex justify-center gap-5 mb-16">
        {data.social.platforms.map((platform) => (
          <a key={platform} href={SOCIAL_URLS[platform] ?? "#"} target="_blank" rel="noopener noreferrer"
            className="w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 hover:bg-white/10 cursor-hover"
            style={{ border: "1px solid rgba(212,175,55,0.2)", color: "var(--text-primary)" }}>
            <SocialPlatformIcon platform={platform} size={18} />
          </a>
        ))}
      </div>

      {/* Links grid */}
      <div className="max-w-[1000px] mx-auto px-6 lg:px-10 mb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Scents */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-black" style={{ color: "var(--text-primary)" }}>
              {data.brand.name} Scents
            </span>
            {data.footer.links.scents.map((l) => (
              <TransitionLink key={l} href={SCENT_ROUTES[l] ?? "/collections"} label={l}
                className="text-sm transition-colors duration-300 hover:text-white cursor-hover"
                style={{ color: "var(--text-secondary)" }}>
                {l}
              </TransitionLink>
            ))}
          </div>

          {/* Community */}
          <div className="flex flex-col gap-3">
            {data.footer.links.community.map((l) => (
              <a key={l} href="#"
                className="text-sm transition-colors duration-300 hover:text-white cursor-hover"
                style={{ color: "var(--text-secondary)" }}>
                {l}
              </a>
            ))}
          </div>

          {/* Company */}
          <div className="flex flex-col gap-3">
            {data.footer.links.company.map((l) => (
              <TransitionLink key={l} href={COMPANY_ROUTES[l] ?? "#"} label={l}
                className="text-sm transition-colors duration-300 hover:text-white cursor-hover"
                style={{ color: "var(--text-secondary)" }}>
                {l}
              </TransitionLink>
            ))}
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4 col-span-2 lg:col-span-1">
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{data.footer.newsletter}</p>
            <div className="flex items-center gap-2 pb-2" style={{ borderBottom: "1px solid rgba(212,175,55,0.2)" }}>
              <input type="email" placeholder="Enter your email"
                className="bg-transparent text-sm outline-none flex-1 placeholder:opacity-30"
                style={{ color: "var(--text-primary)" }} />
              <ArrowRight size={16} style={{ color: "var(--accent-gold)" }} className="cursor-pointer cursor-hover" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1000px] mx-auto px-6 lg:px-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderTop: "1px solid rgba(212,175,55,0.08)" }}>
        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Copyright © 2025 {data.brand.name} — All Rights Reserved
        </span>
        <div className="flex gap-6">
          {(["Privacy Policy", "Terms of Service"] as const).map((l) => (
            <TransitionLink key={l} href={LEGAL_ROUTES[l] ?? "#"} label={l}
              className="text-xs transition-colors duration-300 hover:text-white cursor-hover"
              style={{ color: "var(--text-secondary)" }}>
              {l}
            </TransitionLink>
          ))}
        </div>
      </div>
    </footer>
  );
}
