"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import CinematicNav from "@/components/Cinematicnav";
import { useCart } from "@/components/providers/CartProvider";
import WhatsAppOtpForm, { type OtpVerified } from "@/components/WhatsAppOtpForm";

// ── constants ──────────────────────────────────────────────────────────────────
const GOLD = "#D4AF37";
const GOLD_DIM = "rgba(212,175,55,0.55)";
const GOLD_FAINT = "rgba(212,175,55,0.12)";
const BORDER = "rgba(255,255,255,0.08)";
const BORDER_GOLD = "rgba(212,175,55,0.28)";

// ── Error box ──────────────────────────────────────────────────────────────────
function ErrorBox({ msg }: { msg: string }) {
    return (
        <div style={{
            fontSize: 12, color: "#f87171",
            background: "rgba(248,113,113,0.07)",
            padding: "10px 14px", borderRadius: 8,
            border: "1px solid rgba(248,113,113,0.2)",
            lineHeight: 1.5,
        }}>
            {msg}
        </div>
    );
}

// ── Main form component ────────────────────────────────────────────────────────
function LoginForm() {
    const { goToCheckout } = useCart();
    const params = useSearchParams();
    const fromParam = params.get("from") ?? "/account";
    const isCheckoutFlow = fromParam === "checkout";
    // Only same-site paths — "?from=https://evil.com" or "//evil.com" must not redirect off-site
    const isSafePath = fromParam.startsWith("/") && !fromParam.startsWith("//") && !fromParam.startsWith("/\\");
    const redirectTo = isCheckoutFlow || !isSafePath ? "/account" : fromParam;

    const [error, setError] = useState("");

    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);

    /** Resume checkout or go to redirect target after the OTP sign-in */
    const handleVerified = async ({ loggedIn }: OtpVerified) => {
        const hasCart = !!localStorage.getItem("senz8_cart_id");
        if (isCheckoutFlow && hasCart) {
            // Token cookie is set (or, if sign-in failed, the number is still
            // verified → guest checkout). Link the cart and go to Shopify.
            await goToCheckout();
            return;
        }
        if (!loggedIn) {
            setError("Your number is verified, but we couldn't sign you in right now. Please try again in a moment.");
            return;
        }
        // Full page load (not router.push): components in the root layout, like
        // the cart drawer, only check login status on mount — a client-side
        // navigation would leave them thinking the user is still logged out.
        window.location.href = redirectTo;
    };

    // Entry animation
    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.fromTo(leftRef.current, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 1 }, 0.1)
            .fromTo(rightRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.85 }, 0.2);
    }, []);

    return (
        <div style={{
            minHeight: "100dvh", background: "#060609",
            display: "flex", flexDirection: "column",
        }}>
            {/* Ambient glow */}
            <div aria-hidden style={{
                position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
                background: "radial-gradient(ellipse 80% 60% at 20% 50%, rgba(212,175,55,0.05) 0%, transparent 60%)",
            }} />
            <div aria-hidden style={{
                position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
                background: "radial-gradient(ellipse 50% 50% at 80% 80%, rgba(212,175,55,0.04) 0%, transparent 55%)",
            }} />

            {/* Nav */}
            <CinematicNav canAnimate={true} />

            {/* Body — split layout */}
            <div style={{
                flex: 1, display: "flex",
                paddingTop: 68, // nav height
                minHeight: "100dvh",
                position: "relative", zIndex: 1,
            }}>
                {/* ── Left panel — brand/visual ── */}
                <div
                    ref={leftRef}
                    className="hidden lg:flex"
                    style={{
                        width: "45%", flexDirection: "column",
                        justifyContent: "center", alignItems: "flex-start",
                        padding: "60px 64px",
                        borderRight: `1px solid ${BORDER_GOLD}`,
                        position: "relative", overflow: "hidden",
                        opacity: 0,
                    }}
                >
                    {/* Decorative circles */}
                    <div aria-hidden style={{
                        position: "absolute", top: "10%", left: "-80px",
                        width: 320, height: 320, borderRadius: "50%",
                        border: `1px solid ${GOLD_FAINT}`,
                        pointerEvents: "none",
                    }} />
                    <div aria-hidden style={{
                        position: "absolute", bottom: "15%", right: "-60px",
                        width: 200, height: 200, borderRadius: "50%",
                        border: `1px solid rgba(212,175,55,0.06)`,
                        pointerEvents: "none",
                    }} />
                    <div aria-hidden style={{
                        position: "absolute", top: "35%", left: "30%",
                        width: 400, height: 400, borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 65%)",
                        pointerEvents: "none",
                    }} />

                    {/* Gold accent line */}
                    <div style={{ width: 40, height: 1, background: GOLD, marginBottom: 28 }} />

                    <h1 style={{
                        fontSize: "clamp(40px,4.5vw,64px)",
                        fontWeight: 900, letterSpacing: "-0.045em",
                        lineHeight: 0.92, color: "#F5F5F5",
                        marginBottom: 24,
                    }}>
                        Good to<br />
                        <span style={{ color: GOLD }}>see you</span>
                    </h1>

                    <p style={{
                        fontSize: 14, color: "rgba(245,245,245,0.5)",
                        lineHeight: 1.75, maxWidth: 340, marginBottom: 48,
                    }}>
                        Sign in or create your account with just your WhatsApp number. No password to remember.
                    </p>

                    {/* Simple dot list */}
                    {[
                        "View and track your orders",
                        "Manage your delivery address",
                        "Quick checkout next time",
                    ].map((item) => (
                        <div key={item} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                            <div style={{
                                width: 20, height: 20, borderRadius: "50%",
                                background: GOLD_FAINT, border: `1px solid ${BORDER_GOLD}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0,
                            }}>
                                <div style={{ width: 5, height: 5, borderRadius: "50%", background: GOLD }} />
                            </div>
                            <span style={{ fontSize: 13, color: "rgba(245,245,245,0.55)" }}>{item}</span>
                        </div>
                    ))}

                    {/* Bottom quote */}
                    <div style={{
                        position: "absolute", bottom: 40, left: 64,
                        right: 64,
                    }}>
                        <div style={{ height: 1, background: `linear-gradient(90deg, ${GOLD_DIM}, transparent)`, marginBottom: 16 }} />
                        <p style={{ fontSize: 10, color: "rgba(245,245,245,0.25)", letterSpacing: "0.3em", textTransform: "uppercase" }}>
                            Fine Fragrance · Est. 2026
                        </p>
                    </div>
                </div>

                {/* ── Right panel — form ── */}
                <div
                    ref={rightRef}
                    style={{
                        flex: 1, display: "flex",
                        alignItems: "center", justifyContent: "center",
                        padding: "48px 24px",
                        opacity: 0,
                    }}
                >
                    <div style={{ width: "100%", maxWidth: 420 }}>


                        {/* Card */}
                        <div style={{
                            background: "linear-gradient(155deg, #111116 0%, #0c0c10 100%)",
                            border: `1px solid ${BORDER}`,
                            borderRadius: 20, padding: "36px 32px",
                            boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(212,175,55,0.05)",
                            position: "relative", overflow: "hidden",
                        }}>
                            {/* Top gold edge */}
                            <div style={{
                                position: "absolute", top: 0, left: 0, right: 0, height: 1,
                                background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
                            }} />

                            <WhatsAppOtpForm
                                title={isCheckoutFlow ? "Verify to check out" : "Sign in with WhatsApp"}
                                intro={isCheckoutFlow
                                    ? "Enter your WhatsApp number and we'll send a one-time code to complete your order."
                                    : "Enter your WhatsApp number and we'll send you a one-time code. No password needed."}
                                verifyLabel={isCheckoutFlow ? "Verify & checkout" : "Verify & sign in"}
                                onVerified={handleVerified}
                            />
                            {error && <div style={{ marginTop: 16 }}><ErrorBox msg={error} /></div>}
                        </div>

                        {/* Footer links */}
                        <div style={{ textAlign: "center", marginTop: 20 }}>
                            <Link href="/collections"
                                style={{
                                    fontSize: 11, color: "rgba(245,245,245,0.3)",
                                    textDecoration: "none", letterSpacing: "0.06em",
                                    display: "inline-flex", alignItems: "center", gap: 5,
                                    transition: "color 0.2s",
                                }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,245,245,0.6)"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,245,245,0.3)"; }}
                            >
                                Continue browsing without signing in <ArrowRight size={10} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Default export wraps LoginForm in Suspense (useSearchParams requirement) ──
export default function LoginClient() {
    return (
        <Suspense fallback={
            <div style={{
                minHeight: "100dvh", background: "#060609",
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                <div style={{
                    width: 36, height: 36,
                    border: "2px solid rgba(212,175,55,0.2)",
                    borderTopColor: GOLD,
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                }} />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
