import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, ChevronDown, Plus, ShoppingBag, Check, Loader2 } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";

gsap.registerPlugin(ScrollTrigger);

export type ProductData = {
  brand: { name: string; tagline: string };
  product: {
    name: string;
    fullName: string;
    price: number;
    currency: string;
    priceUnit: string;
    rating: number;
    reviewCount: number;
    image: string;
    heroBg: string;
  };
  hero: { title: string[]; description: string; scrollIndicator: string };
};

const GOLD = "#D4AF37";
const GOLD_SOFT = "rgba(212,175,55,0.45)";
const GOLD_LINE = "rgba(212,175,55,0.18)";

const panelStyle: React.CSSProperties = {
  background: "rgba(10,10,10,0.72)",
  backdropFilter: "blur(20px)",
  border: `1px solid ${GOLD_LINE}`,
  borderRadius: 12,
  boxShadow: "0 8px 32px rgba(0,0,0,0.55)",
};
const stepperBtnStyle: React.CSSProperties = {
  width: 26, height: 26, borderRadius: 6,
  background: "rgba(212,175,55,0.08)",
  border: `1px solid ${GOLD_SOFT}`,
  color: GOLD, fontSize: 14, fontWeight: 700,
  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
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
    <div className="note-callout pointer-events-none absolute hidden lg:block" style={style}>
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
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart, adding, checkoutUrl } = useCart();

  const handleAddToCart = useCallback(async () => {
    if (!shopifyVariantId) return;
    await addToCart(shopifyVariantId, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, [shopifyVariantId, addToCart, qty]);

  const handleBuyNow = useCallback(async () => {
    if (!shopifyVariantId) return;
    await addToCart(shopifyVariantId, qty);
    // Redirect to Shopify checkout
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  }, [shopifyVariantId, addToCart, qty, checkoutUrl]);

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

  const railItems: [string, string][] = [
    ["01", "EXTRAIT DE PARFUM"],
    ["02", "35% OIL CONCENTRATION"],
    ["03", "12HR+ LONGEVITY"],
    ["04", "STRONG PROJECTION"],
    ["05", "50ML / 1.7 FL.OZ"],
  ];

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

      <div className="hidden lg:flex absolute top-6 left-1/2 -translate-x-1/2 items-center gap-3"
        style={{ fontSize: 10, letterSpacing: "0.3em", color: GOLD_SOFT, textTransform: "uppercase" }}>
        <span>EDITION 01</span>
        <span style={{ width: 40, height: 1, background: GOLD_LINE }} />
        <span style={{ color: GOLD }}>FRAME 001 / 004</span>
        <span style={{ width: 40, height: 1, background: GOLD_LINE }} />
        <span>FW · 2026</span>
      </div>

      <div className="relative z-10 h-full w-full grid grid-cols-1 lg:grid-cols-[1.05fr_1.1fr_0.85fr] gap-6 px-6 lg:px-16 pt-24 pb-10">

        <div className="flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-3 mb-6">
            <span style={{ width: 32, height: 1, background: GOLD }} />
            <span style={{ fontSize: 10, letterSpacing: "0.35em", color: GOLD, textTransform: "uppercase" }}>
              A Signature For Men
            </span>
          </div>

          <div ref={titleRef}>
            {data.hero.title.map((word) => (
              <div key={word} className="overflow-hidden">
                <h1 className="word-inner font-black leading-[0.85] tracking-tight text-white text-[16vw] lg:text-[5.8vw]">
                  {word}
                </h1>
              </div>
            ))}
          </div>


          <p ref={descRef} className="mt-8 max-w-md text-sm lg:text-base text-white/65 leading-relaxed">
            {data.hero.description}
          </p>

          <div className="mt-8 flex items-center gap-6 flex-wrap">
            <div>
              <div style={{ fontSize: 9, letterSpacing: "0.3em", color: GOLD_SOFT }}>NOSE</div>
              <div className="text-sm text-white mt-1">House of SENZ8</div>
            </div>
            <div style={{ width: 1, height: 32, background: GOLD_LINE }} />
            <div>
              <div style={{ fontSize: 9, letterSpacing: "0.3em", color: GOLD_SOFT }}>FAMILY</div>
              <div className="text-sm text-white mt-1">Smoky · Oriental</div>
            </div>
            <div style={{ width: 1, height: 32, background: GOLD_LINE }} />
            <div>
              <div style={{ fontSize: 9, letterSpacing: "0.3em", color: GOLD_SOFT }}>SILLAGE</div>
              <div className="text-sm text-white mt-1">Heavy</div>
            </div>
          </div>
        </div>

        <div className="relative hidden lg:flex items-center justify-center">
          <div ref={calloutsRef} className="absolute inset-0">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width: 520, height: 520, borderRadius: "50%", border: `1px dashed ${GOLD_LINE}` }} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: 380, height: 380, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)"
              }} />
            <NoteCallout label="Top Note · 01" title={"Oud Wood\nRaspberry"} dot={GOLD} style={{ top: "14%", left: "-2%" }} />
            <NoteCallout label="Heart Note · 02" title={"Rose\nIncense"} dot="#c9c9c9" style={{ top: "44%", right: "-4%" }} />
            <NoteCallout label="Base Note · 03" title={"Amberwood\nBenzoin"} dot="#8a5a2b" style={{ bottom: "12%", left: "4%" }} />
          </div>

          <div ref={bottleWrapRef} className="relative will-change-transform">
            <img ref={bottleRef} src={data.product.image} alt={data.product.fullName}
              className="h-[68vh] w-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)]" />
            <div className="absolute -top-4 -right-4"><Plus size={18} color={GOLD} strokeWidth={1.2} /></div>
          </div>
        </div>

        <div className="hidden lg:flex flex-col justify-between items-end">
          <div ref={railRef} className="w-full max-w-[260px] flex flex-col gap-3 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <span style={{ width: 6, height: 6, background: GOLD }} />
              <span style={{ fontSize: 9, letterSpacing: "0.3em", color: GOLD, textTransform: "uppercase" }}>Specifications</span>
            </div>
            {railItems.map(([n, label]) => (
              <div key={n} className="rail-item flex items-center justify-between py-2"
                style={{ borderBottom: `1px solid ${GOLD_LINE}` }}>
                <span style={{ fontSize: 10, color: GOLD_SOFT, letterSpacing: "0.2em" }}>{n}</span>
                <span style={{ fontSize: 11, color: "#fff", letterSpacing: "0.15em" }}>{label}</span>
              </div>
            ))}
          </div>

          <div ref={widgetRef} className="w-full max-w-[340px]" style={panelStyle}>
            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-end justify-between">
                <div className="flex items-baseline gap-1">
                  <span style={{ color: GOLD, fontSize: 22, fontWeight: 800 }}>
                    {shopifyPrice ?? `${data.product.currency}${data.product.price}`}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>/{data.product.priceUnit}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={12} fill={GOLD} color={GOLD} />
                  <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{data.product.rating}</span>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>({data.product.reviewCount})</span>
                </div>
              </div>
              <div style={{ height: 1, background: GOLD_LINE }} />
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={stepperBtnStyle}>−</button>
                  <span style={{ color: "#fff", fontSize: 13, fontWeight: 700, minWidth: 18, textAlign: "center" }}>{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(24, q + 1))} style={stepperBtnStyle}>+</button>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleAddToCart} disabled={adding || !shopifyVariantId}
                    style={{
                      ...addToCartBtnStyle,
                      background: added ? "rgba(74,222,128,0.1)" : "transparent",
                      borderColor: added ? "rgba(74,222,128,0.5)" : GOLD_SOFT,
                      color: added ? "#4ade80" : GOLD,
                      cursor: shopifyVariantId ? "pointer" : "not-allowed",
                      opacity: shopifyVariantId ? 1 : 0.5,
                      display: "flex", alignItems: "center", gap: 5,
                    }}>
                    {adding ? <Loader2 size={9} style={{ animation: "spin 1s linear infinite" }} /> :
                      added ? <><Check size={9} /> Added</> :
                        <><ShoppingBag size={9} /> Add to Cart</>}
                  </button>
                  <button onClick={handleBuyNow} disabled={adding || !shopifyVariantId}
                    style={{
                      ...buyNowBtnStyle,
                      cursor: shopifyVariantId ? "pointer" : "not-allowed",
                      opacity: shopifyVariantId ? 1 : 0.5,
                    }}>Buy Now</button>
                </div>
              </div>
              <div style={{ fontSize: 9, letterSpacing: "0.2em", color: GOLD_SOFT, textTransform: "uppercase" }}>
                ✦ Free shipping · arrives in 2–3 days
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden mt-auto" style={panelStyle}>
          <div className="p-3 flex items-center justify-between">
            <div>
              <div style={{ color: GOLD, fontSize: 18, fontWeight: 800 }}>
                {shopifyPrice ?? `${data.product.currency}${data.product.price}`}
              </div>
              <div className="flex items-center gap-1">
                <Star size={10} fill={GOLD} color={GOLD} />
                <span style={{ color: "#fff", fontSize: 10 }}>{data.product.rating}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={stepperBtnStyle}>−</button>
              <span style={{ color: "#fff", fontSize: 12 }}>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(24, q + 1))} style={stepperBtnStyle}>+</button>
              <button onClick={handleBuyNow} disabled={adding || !shopifyVariantId}
                style={{
                  ...buyNowBtnStyle,
                  cursor: shopifyVariantId ? "pointer" : "not-allowed",
                  opacity: shopifyVariantId ? 1 : 0.5,
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                {adding ? <Loader2 size={9} style={{ animation: "spin 1s linear infinite" }} /> : "Buy"}
              </button>
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
        <span style={{ fontSize: 9, letterSpacing: "0.4em", color: GOLD_SOFT, textTransform: "uppercase" }}>
          {data.hero.scrollIndicator}
        </span>
        <ChevronDown size={14} color={GOLD_SOFT} className="animate-bounce" />
      </div>
    </section>
  );
}
