"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { Star, X, ShoppingBag, Check, Loader2 } from "lucide-react";
import type { ProductData } from "@/types/product";
import { useCart } from "@/components/providers/CartProvider";

export default function BuyWidget({
  data,
  visible,
  shopifyVariantId,
  shopifyPrice,
}: {
  data: ProductData;
  visible: boolean;
  shopifyVariantId?: string;
  shopifyPrice?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [activeVariant, setActiveVariant] = useState(0);
  const [qty, setQty] = useState(1);
  const [dismissed, setDismissed] = useState(false);
  const [added, setAdded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { addToCart, adding } = useCart();

  useEffect(() => {
    if (!panelRef.current) return;
    gsap.to(panelRef.current, {
      height: expanded ? "auto" : 0,
      opacity: expanded ? 1 : 0,
      duration: expanded ? 0.4 : 0.3,
      ease: expanded ? "power3.out" : "power3.inOut",
    });
  }, [expanded]);

  const handleAddToCart = useCallback(async () => {
    if (!shopifyVariantId) return;
    await addToCart(shopifyVariantId, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, [shopifyVariantId, addToCart, qty]);

  if (dismissed) return null;

  return (
    <div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className="fixed bottom-6 left-6 z-[100]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0)"
          : "translateY(24px)",
        transition:
          "opacity 0.5s ease, transform 0.5s ease",
        width: expanded ? 280 : "auto",
        minWidth: 220,
        background: "rgba(17,17,17,0.92)",
        backdropFilter: "blur(20px)",
        border:
          "1px solid rgba(212,175,55,0.2)",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow:
          "0 12px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.06)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setDismissed(true);
        }}
        className="absolute top-2 right-2 z-10 flex items-center justify-center rounded-full cursor-hover"
        style={{
          width: 18,
          height: 18,
          background: "rgba(255,255,255,0.06)",
          border:
            "1px solid rgba(255,255,255,0.08)",
          color: "rgba(245,245,245,0.4)",
          fontSize: 11,
          lineHeight: 1,
        }}
      >
        <X size={10} />
      </button>

      <div
        style={{
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: expanded ? "default" : "pointer",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 6,
            }}
          >
            <span
              style={{
                fontSize: 18,
                fontWeight: 900,
                color: "#D4AF37",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              {shopifyPrice ?? `${data.product.currency}${data.product.price}`}
            </span>
            <span
              style={{
                fontSize: 9,
                color:
                  "rgba(245,245,245,0.35)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              /{data.product.priceUnit}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              marginTop: 3,
            }}
          >
            <Star
              size={9}
              fill="#D4AF37"
              stroke="#D4AF37"
            />
            <span
              style={{
                fontSize: 9,
                color:
                  "rgba(245,245,245,0.35)",
                fontWeight: 600,
              }}
            >
              {data.product.rating}
            </span>
            <span
              style={{
                fontSize: 9,
                color:
                  "rgba(245,245,245,0.25)",
              }}
            >
              · {data.product.reviewCount}
            </span>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={adding || !shopifyVariantId}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            fontSize: 10,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            background: added ? "#4ade80" : shopifyVariantId ? "#D4AF37" : "rgba(212,175,55,0.3)",
            border: "none",
            color: added ? "#0A0A0A" : shopifyVariantId ? "#0A0A0A" : "rgba(212,175,55,0.6)",
            cursor: shopifyVariantId ? "pointer" : "default",
            whiteSpace: "nowrap",
            transition: "filter 0.2s ease, background 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
          onMouseEnter={(e) => {
            if (shopifyVariantId && !added) e.currentTarget.style.filter = "brightness(1.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "brightness(1)";
          }}
        >
          {adding ? <Loader2 size={9} style={{ animation: "spin 1s linear infinite" }} /> :
            added ? <><Check size={9} /> Added</> :
              <><ShoppingBag size={9} /> Buy</>}
        </button>
      </div>

      <div
        ref={panelRef}
        style={{
          height: 0,
          opacity: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 1,
            background:
              "rgba(255,255,255,0.05)",
            margin: "0 14px",
          }}
        />
        <div
          style={{
            padding: "12px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 8,
                textTransform: "uppercase",
                letterSpacing: "0.25em",
                color:
                  "rgba(245,245,245,0.3)",
                marginBottom: 6,
              }}
            >
              Scent
            </div>
            <div
              style={{
                display: "flex",
                gap: 5,
                flexWrap: "wrap",
              }}
            >
              {data.variants.map((v, i) => (
                <button
                  key={v.sku || v.name}
                  onClick={() =>
                    setActiveVariant(i)
                  }
                  style={{
                    padding: "4px 9px",
                    borderRadius: 999,
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    border: `1px solid ${activeVariant === i ? "#D4AF37" : "rgba(212,175,55,0.15)"}`,
                    background:
                      activeVariant === i
                        ? "rgba(212,175,55,0.1)"
                        : "transparent",
                    color:
                      activeVariant === i
                        ? "#D4AF37"
                        : "rgba(245,245,245,0.45)",
                    cursor: "pointer",
                    transition:
                      "all 0.2s ease",
                  }}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: 8,
                textTransform: "uppercase",
                letterSpacing: "0.25em",
                color:
                  "rgba(245,245,245,0.3)",
                marginBottom: 6,
              }}
            >
              Quantity
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border:
                  "1px solid rgba(212,175,55,0.15)",
                borderRadius: 8,
                width: "fit-content",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() =>
                  setQty((q) =>
                    Math.max(1, q - 1)
                  )
                }
                style={{
                  width: 30,
                  height: 30,
                  background:
                    "rgba(212,175,55,0.05)",
                  border: "none",
                  color: "#D4AF37",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                −
              </button>
              <span
                style={{
                  width: 32,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "center",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#f5f5f5",
                  borderLeft:
                    "1px solid rgba(212,175,55,0.12)",
                  borderRight:
                    "1px solid rgba(212,175,55,0.12)",
                }}
              >
                {qty}
              </span>
              <button
                onClick={() =>
                  setQty((q) =>
                    Math.min(24, q + 1)
                  )
                }
                style={{
                  width: 30,
                  height: 30,
                  background:
                    "rgba(212,175,55,0.05)",
                  border: "none",
                  color: "#D4AF37",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                +
              </button>
            </div>
          </div>

          <button
            style={{
              width: "100%",
              padding: "9px 0",
              borderRadius: 10,
              fontSize: 10,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              background: added ? "rgba(74,222,128,0.08)" : "transparent",
              border: `1px solid ${added ? "rgba(74,222,128,0.35)" : "rgba(212,175,55,0.25)"}`,
              color: added ? "#4ade80" : "#D4AF37",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
            onClick={handleAddToCart}
            disabled={adding}
            onMouseEnter={(e) => {
              if (!added) {
                e.currentTarget.style.background = "rgba(212,175,55,0.08)";
                e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!added) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)";
              }
            }}
          >
            {adding ? (
              <Loader2 size={10} style={{ animation: "spin 1s linear infinite" }} />
            ) : added ? (
              <><Check size={10} /> Added</>
            ) : (
              <><ShoppingBag size={10} /> Add to Cart</>
            )}
          </button>

          <div
            style={{
              textAlign: "center",
              fontSize: 9,
              color:
                "rgba(245,245,245,0.25)",
              letterSpacing: "0.05em",
            }}
          >
            {data.buyWidget?.shippingText ||
              "FREE shipping · arrives in 2-3 days"}
          </div>
        </div>
      </div>
    </div>
  );
}
