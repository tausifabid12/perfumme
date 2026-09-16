import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, ChevronDown, Plus, ShoppingBag, Check, Loader2 } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@/lib/hooks/useAuth";
import type { ProductData } from "@/types/product";

gsap.registerPlugin(ScrollTrigger);

const GOLD = "#D4AF37";
const GOLD_SOFT = "rgba(212,175,55,0.45)";
const GOLD_LINE = "rgba(212,175,55,0.18)";

const panelStyle: React.CSSProperties = {
  background: "rgba(8,8,10,0.85)",
  backdropFilter: "blur(24px)",
  border: `1px solid rgba(212,175,55,0.22)`,
  borderRadius: 16,
  boxShadow: "0 16px 48px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,175,55,0.08)",
};
const addToCartBtnStyle: React.CSSProperties = {
  padding: "9px 14px", borderRadius: 8, fontSize: 10, fontWeight: 800,
  textTransform: "uppercase", letterSpacing: "0.08em",
  background: "transparent", border: `1px solid ${GOLD_SOFT}`, color: GOLD, cursor: "pointer",
};
const buyNowBtnStyle: React.CSSProperties = {
  padding: "9px 14px", borderRadius: 8, fontSize: 10, fontWeight: 800,
  textTransform: "uppercase", letterSpacing: "0.08em",
  background: GOLD, border: "none", color: "#0A0A0A", cursor: "pointer",
};

// CornerBracket kept for future use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function CornerBracket({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const base: React.CSSProperties = { position: "absolute", width: 28, height: 28, pointerEvents: "none" };
  const map: Record<string, React.CSSProperties> = {
    tl: { top: 24, left: 24, borderTop: `1px solid ${GOLD_SOFT}`, borderLeft: `1px solid ${GOLD_SOFT}` },
    tr: { top: 24, right: 24, borderTop: `1px solid ${GOLD_SOFT}`, borderRight: `1px solid ${GOLD_SOFT}` },
    bl: { bottom: 24, left: 24, borderBottom: `1px solid ${GOLD_SOFT}`, borderLeft: `1px solid ${GOLD_SOFT}` },
    br: { bottom: 24, right: 24, borderBottom: `1px solid ${GOLD_SOFT}`, borderRight: `1px solid ${GOLD_SOFT}` },
  };
  return <div style={{ ...base, ...map[pos] }} />;
}

function NoteCallout({
  label, title, dot, style,
}: { label: string; title: string; dot: string; style?: React.CSSProperties }) {
  return (
    <div className="note-callout pointer-events-none absolute hidden lg:block" style={{ zIndex: 20, ...style }}>
      <div className="flex items-center gap-2">
        <span style={{ width: 6, height: 6, borderRadius: 999, background: dot, boxShadow: `0 0 12px ${dot}` }} />
        <span style={{ fontSize: 9, letterSpacing: "0.25em", color: GOLD, textTransform: "uppercase" }}>{label}</span>
      </div>
      <div style={{ width: 80, height: 1, background: `linear-gradient(90deg, ${GOLD_SOFT}, transparent)`, margin: "8px 0" }} />
      <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, lineHeight: 1.25, whiteSpace: "pre-line" }}>{title}</div>
    </div>
  );
}

export default function HeroSection({
  data, onAnimationComplete, shopifyVariantId, shopifyPrice,
}: { data: ProductData; onAnimationComplete?: () => void; shopifyVariantId?: string; shopifyPrice?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const bottleRef = useRef<HTMLImageElement>(null);
  const bottleWrapRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const calloutsRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [added, setAdded] = useState(false);
  const { addToCart, adding, checkoutUrl } = useCart();
  const { customer } = useAuth();

  const handleAddToCart = useCallback(async () => {
    if (!shopifyVariantId) return;
    await addToCart(shopifyVariantId, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, [shopifyVariantId, addToCart]);

  const handleBuyNow = useCallback(async () => {
    if (!shopifyVariantId) return;
    await addToCart(shopifyVariantId, 1);
    const url = checkoutUrl;
    if (!url) return;
    if (!customer) {
      sessionStorage.setItem("senz8_checkout_url", url);
      window.location.href = "/login?from=checkout";
      return;
    }
    window.location.href = url;
  }, [shopifyVariantId, addToCart, checkoutUrl, customer]);

  const onCompleteRef = useRef(onAnimationComplete);
  useEffect(() => { onCompleteRef.current = onAnimationComplete; }, [onAnimationComplete]);

  useEffect(() => {
    const words = titleRef.current?.querySelectorAll(".word-inner") || [];
    const callouts = calloutsRef.current?.querySelectorAll(".note-callout") || [];
    const railItems = railRef.current?.querySelectorAll(".rail-item") || [];

    const tl = gsap.timeline({ onComplete: () => onCompleteRef.current?.() });
    tl.fromTo(words, { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1.2, ease: "expo.out", stagger: 0.1 })
      .fromTo(descRef.current, { opacity: 0, y: 24, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }, "-=0.6")
      .fromTo(bottleRef.current, { opacity: 0, scale: 0.7, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 1.4, ease: "expo.out" }, "-=0.7")
      .fromTo(callouts, { opacity: 0, x: (i) => (i % 2 ? 40 : -40) },
        { opacity: 1, x: 0, duration: 0.9, ease: "expo.out", stagger: 0.12 }, "-=0.9")
      .fromTo(railItems, { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power3.out", stagger: 0.08 }, "-=0.8")
      .fromTo(widgetRef.current, { opacity: 0, y: 30, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "expo.out" }, "-=0.5");
    return () => { tl.kill(); };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        scale: 1.25, ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 }
      });
      gsap.to(bottleWrapRef.current, {
        scale: 1.4, yPercent: -15, ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1.5 }
      });
      [titleRef, descRef, widgetRef, calloutsRef, railRef].forEach((r, i) => {
        gsap.fromTo(r.current, { yPercent: 0, opacity: 1 },
          {
            yPercent: 30 + i * 4, opacity: 0, ease: "none", immediateRender: false,
            scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "50% top", scrub: true }
          });
      });
      gsap.to(overlayRef.current, {
        opacity: 0.85, ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true }
      });
      // gsap.to(bottleRef.current, { y: -14, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1 });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-[100dvh] overflow-hidden bg-black text-white">
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        <img src={data.product.heroBg} alt="" className="w-full h-full object-cover" />
      </div>
      <div ref={overlayRef} className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 65% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.92) 100%)" }} />

      {/* <CornerBracket pos="tl" /><CornerBracket pos="tr" />
      <CornerBracket pos="bl" /><CornerBracket pos="br" /> */}

      <div className="hidden lg:block absolute left-6 top-1/2"
        style={{ writingMode: "vertical-rl", transform: "translateY(-50%) rotate(180deg)" }}>
        <span style={{ fontSize: 10, letterSpacing: "0.4em", color: GOLD_SOFT, textTransform: "uppercase" }}>
          {data.brand.name} — {data.brand.tagline}
        </span>
      </div>

      {/* <div className="hidden lg:flex absolute top-6 left-1/2 -translate-x-1/2 items-center gap-3"
        style={{ fontSize: 10, letterSpacing: "0.3em", color: GOLD_SOFT, textTransform: "uppercase" }}>
        <span>EDITION 01</span>
        <span style={{ width: 40, height: 1, background: GOLD_LINE }} />
        <span style={{ color: GOLD }}>FRAME 001 / 004</span>
        <span style={{ width: 40, height: 1, background: GOLD_LINE }} />
        <span>FW · 2026</span>
      </div> */}

      {/* ── DESKTOP (lg+): 3-column grid ── */}
      <div className="relative z-10 h-full w-full hidden lg:grid grid-cols-[1.05fr_1.1fr_0.85fr] gap-6 px-16 pt-24 pb-10">

        {/* Left column — title + desc + notes */}
        <div className="flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-3 mb-6">
            <span style={{ width: 32, height: 1, background: GOLD }} />
            <span style={{ fontSize: 10, letterSpacing: "0.35em", color: GOLD, textTransform: "uppercase" }}>
              {data?.product?.tagline}
            </span>
          </div>

          <div ref={titleRef}>
            {data.hero.title.map((word) => (
              <div key={word} className="overflow-hidden">
                <h1 className="word-inner font-black leading-[0.85] tracking-tight text-white text-[5.8vw]">
                  {word}
                </h1>
              </div>
            ))}
          </div>

          <p ref={descRef} className="mt-8 max-w-md text-base text-white/65 leading-relaxed">
            {data.hero.description}
          </p>

          <div className="mt-8 flex items-center gap-6 flex-wrap">
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.25em", color: "rgba(212,175,55,0.75)" }}>NOSE</div>
              <div className="text-sm text-white mt-1">House of SENZ8</div>
            </div>
            <div style={{ width: 1, height: 32, background: GOLD_LINE }} />
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.25em", color: "rgba(212,175,55,0.75)" }}>TOP NOTE</div>
              <div className="text-sm text-white mt-1">
                {data.fragranceNotes.notes[0]?.title.replace(/\n/g, " · ")}
              </div>
            </div>
            <div style={{ width: 1, height: 32, background: GOLD_LINE }} />
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.25em", color: "rgba(212,175,55,0.75)" }}>BASE NOTE</div>
              <div className="text-sm text-white mt-1">
                {data.fragranceNotes.notes[2]?.title.replace(/\n/g, " · ")}
              </div>
            </div>
          </div>
        </div>

        {/* Centre column — bottle */}
        <div className="relative flex items-center justify-center">
          <div ref={calloutsRef} className="absolute inset-0" style={{ zIndex: 10 }}>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width: 520, height: 520, borderRadius: "50%", border: `1px dashed ${GOLD_LINE}` }} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: 380, height: 380, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)"
              }} />
            {data.fragranceNotes.notes.slice(0, 3).map((note, ni) => {
              const positions: React.CSSProperties[] = [
                { top: "14%", left: "-2%" },
                { top: "44%", right: "-4%" },
                { bottom: "12%", left: "4%" },
              ];
              const dots = [GOLD, "#c9c9c9", "#8a5a2b"];
              return (
                <NoteCallout
                  key={ni}
                  label={`${note.type} · 0${ni + 1}`}
                  title={note.title}
                  dot={dots[ni]}
                  style={positions[ni]}
                />
              );
            })}
          </div>

          <div ref={bottleWrapRef} className="relative will-change-transform" style={{ zIndex: 5 }}>
            <img ref={bottleRef} src={data.product.image} alt={data.product.fullName}
              className="h-[68vh] w-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)]" />
            <div className="absolute -top-4 -right-4"><Plus size={18} color={GOLD} strokeWidth={1.2} /></div>
          </div>
        </div>

        {/* Right column — specs + buy widget */}
        <div className="flex flex-col justify-between items-end">
          <div ref={railRef} className="w-full max-w-[260px] flex flex-col gap-3 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <span style={{ width: 6, height: 6, background: GOLD }} />
              <span style={{ fontSize: 9, letterSpacing: "0.3em", color: GOLD, textTransform: "uppercase" }}>Specifications</span>
            </div>
            {data.stats.map((stat, idx) => (
              <div key={stat.label} className="rail-item flex items-center justify-between py-2"
                style={{ borderBottom: `1px solid ${GOLD_LINE}` }}>
                <span style={{ fontSize: 10, color: GOLD_SOFT, letterSpacing: "0.2em" }}>
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span style={{ fontSize: 11, color: "#fff", letterSpacing: "0.15em" }}>
                  {stat.number} {stat.label}
                </span>
              </div>
            ))}
          </div>

          <div ref={widgetRef} className="w-full max-w-[340px]" style={panelStyle}>
            <div className="p-5 flex flex-col gap-4">
              {/* Price + rating row */}
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span style={{ color: GOLD, fontSize: 26, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1 }}>
                    {shopifyPrice ?? `${data.product.currency}${data.product.price}`}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: "0.06em" }}>/{data.product.priceUnit}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.15)" }}>
                  <Star size={10} fill={GOLD} color={GOLD} />
                  <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{data.product.rating}</span>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>· {data.product.reviewCount}</span>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "linear-gradient(90deg, rgba(212,175,55,0.25), transparent)" }} />

              {/* Buy Now — primary full-width */}
              <button
                onClick={handleBuyNow}
                disabled={adding || !shopifyVariantId}
                style={{
                  width: "100%", padding: "13px 0", borderRadius: 10,
                  fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.14em",
                  background: added ? "#4ade80" : shopifyVariantId ? GOLD : "rgba(212,175,55,0.3)",
                  border: "none",
                  color: "#0A0A0A",
                  cursor: shopifyVariantId ? "pointer" : "not-allowed",
                  opacity: shopifyVariantId ? 1 : 0.5,
                  transition: "filter 0.2s ease, transform 0.1s ease",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                }}
                onMouseEnter={(e) => { if (shopifyVariantId) e.currentTarget.style.filter = "brightness(1.12)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.filter = "brightness(1)"; }}
              >
                {adding ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> : "Buy Now →"}
              </button>

              {/* Add to Cart — secondary full-width */}
              <button
                onClick={handleAddToCart}
                disabled={adding || !shopifyVariantId}
                style={{
                  width: "100%", padding: "11px 0", borderRadius: 10,
                  fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em",
                  background: added ? "rgba(74,222,128,0.08)" : "rgba(212,175,55,0.05)",
                  border: `1px solid ${added ? "rgba(74,222,128,0.4)" : "rgba(212,175,55,0.28)"}`,
                  color: added ? "#4ade80" : GOLD,
                  cursor: shopifyVariantId ? "pointer" : "not-allowed",
                  opacity: shopifyVariantId ? 1 : 0.5,
                  transition: "all 0.2s ease",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                }}
                onMouseEnter={(e) => { if (shopifyVariantId && !added) { e.currentTarget.style.background = "rgba(212,175,55,0.1)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)"; } }}
                onMouseLeave={(e) => { if (!added) { e.currentTarget.style.background = "rgba(212,175,55,0.05)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.28)"; } }}
              >
                {adding ? <Loader2 size={10} style={{ animation: "spin 1s linear infinite" }} /> :
                  added ? <><Check size={10} /> Added to Cart</> :
                    <><ShoppingBag size={10} /> Add to Cart</>}
              </button>

              {/* Shipping badge */}
              <div className="flex items-center justify-center gap-1.5" style={{ fontSize: 10, letterSpacing: "0.12em", color: "rgba(212,175,55,0.65)", textTransform: "uppercase" }}>
                <span>✦</span>
                <span>Free shipping · arrives in 2–3 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABLET (md–lg): 2-column grid — text left, bottle right ── */}
      <div className="relative z-10 h-full w-full hidden md:grid lg:hidden grid-cols-[1fr_1fr] gap-4 px-8 pt-24 pb-4">
        {/* Left: text content */}
        <div className="flex flex-col justify-center min-w-0 z-10">
          <div className="flex items-center gap-3 mb-4">
            <span style={{ width: 24, height: 1, background: GOLD }} />
            <span style={{ fontSize: 9, letterSpacing: "0.3em", color: GOLD, textTransform: "uppercase" }}>
              {data?.product?.tagline}
            </span>
          </div>

          <div>
            {data.hero.title.map((word) => (
              <div key={word} className="overflow-hidden">
                <h1 className="font-black leading-[0.88] tracking-tight text-white text-[8vw]">
                  {word}
                </h1>
              </div>
            ))}
          </div>

          <p className="mt-5 max-w-xs text-sm text-white/65 leading-relaxed">
            {data.hero.description}
          </p>

          {/* Fragrance notes row */}
          <div className="mt-5 flex items-center gap-4 flex-wrap">
            <div>
              <div style={{ fontSize: 9, letterSpacing: "0.25em", color: "rgba(212,175,55,0.75)" }}>TOP NOTE</div>
              <div className="text-xs text-white mt-0.5">
                {data.fragranceNotes.notes[0]?.title.replace(/\n/g, " · ")}
              </div>
            </div>
            <div style={{ width: 1, height: 28, background: GOLD_LINE }} />
            <div>
              <div style={{ fontSize: 9, letterSpacing: "0.25em", color: "rgba(212,175,55,0.75)" }}>BASE NOTE</div>
              <div className="text-xs text-white mt-0.5">
                {data.fragranceNotes.notes[2]?.title.replace(/\n/g, " · ")}
              </div>
            </div>
          </div>

          {/* Buy widget */}
          <div className="mt-6" style={panelStyle}>
            <div className="p-4 flex flex-col gap-3">
              {/* Price + rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span style={{ color: GOLD, fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1 }}>
                    {shopifyPrice ?? `${data.product.currency}${data.product.price}`}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>/{data.product.priceUnit}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.15)" }}>
                  <Star size={9} fill={GOLD} color={GOLD} />
                  <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{data.product.rating}</span>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>· {data.product.reviewCount}</span>
                </div>
              </div>
              <div style={{ height: 1, background: "linear-gradient(90deg, rgba(212,175,55,0.25), transparent)" }} />
              {/* Buy Now primary */}
              <button onClick={handleBuyNow} disabled={adding || !shopifyVariantId}
                style={{
                  width: "100%", padding: "12px 0", borderRadius: 9,
                  fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.14em",
                  background: shopifyVariantId ? GOLD : "rgba(212,175,55,0.3)", border: "none",
                  color: "#0A0A0A", cursor: shopifyVariantId ? "pointer" : "not-allowed",
                  opacity: shopifyVariantId ? 1 : 0.5, transition: "filter 0.2s ease",
                }}>Buy Now →</button>
              {/* Add to Cart secondary */}
              <button onClick={handleAddToCart} disabled={adding || !shopifyVariantId}
                style={{
                  width: "100%", padding: "10px 0", borderRadius: 9,
                  fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em",
                  background: added ? "rgba(74,222,128,0.08)" : "rgba(212,175,55,0.05)",
                  border: `1px solid ${added ? "rgba(74,222,128,0.4)" : "rgba(212,175,55,0.28)"}`,
                  color: added ? "#4ade80" : GOLD,
                  cursor: shopifyVariantId ? "pointer" : "not-allowed",
                  opacity: shopifyVariantId ? 1 : 0.5, transition: "all 0.2s ease",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                {adding ? <Loader2 size={9} style={{ animation: "spin 1s linear infinite" }} /> :
                  added ? <><Check size={9} /> Added</> :
                    <><ShoppingBag size={9} /> Add to Cart</>}
              </button>
              <div className="text-center" style={{ fontSize: 9, letterSpacing: "0.12em", color: "rgba(212,175,55,0.6)", textTransform: "uppercase" }}>
                ✦ Free shipping · arrives in 2–3 days
              </div>
            </div>
          </div>
        </div>

        {/* Right: bottle — rendered behind a transparent overlay so text always stays on top */}
        <div className="relative flex items-center justify-center">
          {/* Decorative glow ring */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              width: 320, height: 320, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)"
            }} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ width: 360, height: 360, borderRadius: "50%", border: `1px dashed ${GOLD_LINE}` }} />
          <img
            src={data.product.image}
            alt={data.product.fullName}
            className="relative h-[55vh] w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
          />
        </div>
      </div>

      {/* ── MOBILE (<md): single column ── */}
      <div className="relative z-10 h-full w-full flex md:hidden flex-col px-5 pt-20 pb-20">
        {/* Bottle as background-ish layer, absolutely positioned so text flows on top */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
          <img
            src={data.product.image}
            alt={data.product.fullName}
            className="h-[55vh] w-auto object-contain opacity-60 drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
          />
          {/* Extra dark veil so text above remains legible */}
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.70) 100%)" }} />
        </div>

        {/* Text — always on top via z-10 */}
        <div className="relative z-10 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <span style={{ width: 24, height: 1, background: GOLD }} />
            <span style={{ fontSize: 9, letterSpacing: "0.3em", color: GOLD, textTransform: "uppercase" }}>
              {data?.product?.tagline}
            </span>
          </div>

          <div>
            {data.hero.title.map((word) => (
              <div key={word} className="overflow-hidden">
                <h1 className="font-black leading-[0.88] tracking-tight text-white text-[13vw]">
                  {word}
                </h1>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-white/65 leading-relaxed max-w-[75%]">
            {data.hero.description}
          </p>
        </div>

        {/* Buy widget pinned to bottom */}
        <div className="relative z-10 mt-auto" style={panelStyle}>
          <div className="p-4 flex flex-col gap-3">
            {/* Price + rating row */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                <span style={{ color: GOLD, fontSize: 20, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1 }}>
                  {shopifyPrice ?? `${data.product.currency}${data.product.price}`}
                </span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>/{data.product.priceUnit}</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.15)" }}>
                <Star size={9} fill={GOLD} color={GOLD} />
                <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{data.product.rating}</span>
              </div>
            </div>
            {/* Buy Now primary */}
            <button onClick={handleBuyNow} disabled={adding || !shopifyVariantId}
              style={{
                width: "100%", padding: "12px 0", borderRadius: 9,
                fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em",
                background: shopifyVariantId ? GOLD : "rgba(212,175,55,0.3)", border: "none",
                color: "#0A0A0A", cursor: shopifyVariantId ? "pointer" : "not-allowed",
                opacity: shopifyVariantId ? 1 : 0.5, transition: "filter 0.2s ease",
              }}>
              Buy Now →
            </button>
            {/* Add to Cart secondary */}
            <button onClick={handleAddToCart} disabled={adding || !shopifyVariantId}
              style={{
                width: "100%", padding: "10px 0", borderRadius: 9,
                fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em",
                background: added ? "rgba(74,222,128,0.08)" : "rgba(212,175,55,0.05)",
                border: `1px solid ${added ? "rgba(74,222,128,0.4)" : "rgba(212,175,55,0.28)"}`,
                color: added ? "#4ade80" : GOLD,
                cursor: shopifyVariantId ? "pointer" : "not-allowed",
                opacity: shopifyVariantId ? 1 : 0.5, transition: "all 0.2s ease",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
              {adding ? <Loader2 size={9} style={{ animation: "spin 1s linear infinite" }} /> :
                added ? <><Check size={9} /> Added</> :
                  <><ShoppingBag size={9} /> Add to Cart</>}
            </button>
            <div className="text-center" style={{ fontSize: 9, letterSpacing: "0.1em", color: "rgba(212,175,55,0.55)", textTransform: "uppercase" }}>
              ✦ Free shipping · 2–3 days
            </div>
          </div>
        </div>
      </div>

      {/* <div className="absolute bottom-16 left-0 right-0 z-10 overflow-hidden pointer-events-none"
        style={{ borderTop: `1px solid ${GOLD_LINE}`, borderBottom: `1px solid ${GOLD_LINE}`, background: "rgba(0,0,0,0.35)" }}>
        <div className="flex gap-8 py-2 marquee-track whitespace-nowrap"
          style={{ fontSize: 10, letterSpacing: "0.35em", color: GOLD_SOFT, textTransform: "uppercase" }}>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-8 shrink-0">
              {["Imperial Smoke", "Extrait de Parfum", "35% Oil", "12HR+ Longevity", "Oud · Rose · Amberwood", "Limited Batch", "SENZ8 Parfum Maison"].map((t) => (
                <span key={t}>✦ {t}</span>
              ))}
            </div>
          ))}
        </div>
      </div> */}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10">
        <span style={{ fontSize: 10, letterSpacing: "0.35em", color: "rgba(212,175,55,0.75)", textTransform: "uppercase" }}>
          {data.hero.scrollIndicator}
        </span>
        <ChevronDown size={14} color={GOLD_SOFT} className="animate-bounce" />
      </div>
    </section >
  );
}

