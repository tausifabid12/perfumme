"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { ArrowRight, Eye, EyeOff, ShoppingBag } from "lucide-react";
import CinematicNav from "@/components/Cinematicnav";
import { useCart } from "@/components/providers/CartProvider";

// ── constants ──────────────────────────────────────────────────────────────────
const GOLD = "#D4AF37";
const GOLD_DIM = "rgba(212,175,55,0.55)";
const GOLD_FAINT = "rgba(212,175,55,0.12)";
const SURFACE = "rgba(255,255,255,0.03)";
const BORDER = "rgba(255,255,255,0.08)";
const BORDER_GOLD = "rgba(212,175,55,0.28)";

// ── Input field with show/hide for password ────────────────────────────────────
function Field({
    label, type, value, onChange, placeholder,
}: {
    label: string; type: string; value: string;
    onChange: (v: string) => void; placeholder?: string;
}) {
    const [show, setShow] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (show ? "text" : "password") : type;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{
                fontSize: 9, fontWeight: 800, letterSpacing: "0.22em",
                textTransform: "uppercase", color: "rgba(245,245,245,0.4)",
            }}>
                {label}
            </label>
            <div style={{ position: "relative" }}>
                <input
                    type={inputType}
                    required
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e.target.value)}
                    style={{
                        width: "100%", height: 48,
                        background: SURFACE,
                        border: `1px solid ${BORDER}`,
                        borderRadius: 10,
                        padding: isPassword ? "0 44px 0 16px" : "0 16px",
                        color: "#F5F5F5", fontSize: 13,
                        outline: "none",
                        transition: "border-color 0.2s, background 0.2s",
                        boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.borderColor = GOLD_DIM;
                        e.currentTarget.style.background = "rgba(212,175,55,0.04)";
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = BORDER;
                        e.currentTarget.style.background = SURFACE;
                    }}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow(s => !s)}
                        style={{
                            position: "absolute", right: 14, top: "50%",
                            transform: "translateY(-50%)",
                            background: "none", border: "none", cursor: "pointer",
                            color: "rgba(245,245,245,0.35)", padding: 0,
                            display: "flex", alignItems: "center",
                        }}
                        tabIndex={-1}
                    >
                        {show ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                )}
            </div>
        </div>
    );
}

// ── Primary submit button ──────────────────────────────────────────────────────
function SubmitBtn({ loading, label }: { loading: boolean; label: string }) {
    return (
        <button
            type="submit"
            disabled={loading}
            style={{
                width: "100%", height: 50, borderRadius: 999,
                background: loading ? GOLD_FAINT : GOLD,
                border: "none",
                color: loading ? GOLD_DIM : "#0A0A0A",
                fontSize: 10, fontWeight: 900, letterSpacing: "0.28em",
                textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: 4,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "filter 0.2s, background 0.2s",
                boxShadow: loading ? "none" : `0 8px 32px rgba(212,175,55,0.28)`,
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.filter = "brightness(1.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = "brightness(1)"; }}
        >
            {loading ? (
                <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                        style={{ animation: "spin 0.8s linear infinite" }}>
                        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"
                            strokeDasharray="20" strokeDashoffset="10" />
                    </svg>
                    Processing…
                </>
            ) : (
                <>{label} <ArrowRight size={12} /></>
            )}
        </button>
    );
}

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

    const [tab, setTab] = useState<"login" | "register">("login");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showForgot, setShowForgot] = useState(false);

    // Login fields
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Register fields
    const [regFirst, setRegFirst] = useState("");
    const [regLast, setRegLast] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPhone, setRegPhone] = useState("");
    const [regPassword, setRegPassword] = useState("");

    // Forgot password
    const [forgotEmail, setForgotEmail] = useState("");

    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    /** Resume checkout or go to redirect target after successful auth */
    const handlePostAuth = () => {
        if (isCheckoutFlow && localStorage.getItem("senz8_cart_id")) {
            // Now that the token cookie is set, link the customer to the cart
            // and continue to Shopify checkout signed in.
            goToCheckout();
            return;
        }
        // Full page load (not router.push): components in the root layout, like
        // the cart drawer, only check login status on mount — a client-side
        // navigation would leave them thinking the user is still logged out.
        window.location.href = redirectTo;
    };

    /** POST JSON and always resolve — a failed/non-JSON response becomes { ok: false, data.error } */
    const postJson = async (url: string, body: unknown) => {
        try {
            const res = await fetch(url, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json().catch(() => ({}));
            return { ok: res.ok, data };
        } catch {
            return { ok: false, data: { error: "Network error. Please check your connection and try again." } };
        }
    };

    // Entry animation
    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.fromTo(leftRef.current, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 1 }, 0.1)
            .fromTo(rightRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.85 }, 0.2);
    }, []);

    // Animate form swap on tab change
    useEffect(() => {
        if (formRef.current) {
            gsap.fromTo(formRef.current,
                { opacity: 0, x: tab === "login" ? -16 : 16 },
                { opacity: 1, x: 0, duration: 0.38, ease: "power3.out" }
            );
        }
    }, [tab]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); setError(""); setLoading(true);
        const { ok, data } = await postJson("/api/auth/login", { email: loginEmail, password: loginPassword });
        setLoading(false);
        if (!ok) { setError(data.error ?? "Login failed. Please try again."); return; }
        handlePostAuth();
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault(); setError(""); setLoading(true);
        const { ok, data } = await postJson("/api/auth/register", { firstName: regFirst, lastName: regLast, email: regEmail, phone: regPhone, password: regPassword });
        setLoading(false);
        if (!ok) { setError(data.error ?? "Registration failed. Please try again."); return; }
        if (data.redirect) {
            // Account created but auto-login failed — ask them to sign in
            setTab("login");
            setLoginEmail(regEmail);
            setSuccess("Account created. Please sign in.");
            return;
        }
        handlePostAuth();
    };

    const handleForgot = async (e: React.FormEvent) => {
        e.preventDefault(); setError(""); setLoading(true);
        await postJson("/api/auth/forgot", { email: forgotEmail });
        setLoading(false);
        setSuccess("If that email exists, a reset link has been sent.");
        setShowForgot(false);
    };

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
                        Sign in to your account or create a new one. It only takes a moment.
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

                        {/* Checkout context banner */}
                        {isCheckoutFlow && (
                            <div style={{
                                marginBottom: 28,
                                padding: "14px 16px",
                                borderRadius: 12,
                                background: "rgba(212,175,55,0.06)",
                                border: `1px solid ${BORDER_GOLD}`,
                                display: "flex", alignItems: "center", gap: 12,
                            }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: "50%",
                                    background: GOLD_FAINT, border: `1px solid ${BORDER_GOLD}`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    flexShrink: 0,
                                }}>
                                    <ShoppingBag size={14} color={GOLD} />
                                </div>
                                <div>
                                    <p style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: "0.04em", marginBottom: 2 }}>
                                        Almost there
                                    </p>
                                    <p style={{ fontSize: 11, color: "rgba(245,245,245,0.5)", lineHeight: 1.5 }}>
                                        Sign in to complete your order.
                                    </p>
                                </div>
                            </div>
                        )}

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

                            {/* Forgot password view */}
                            {showForgot ? (
                                <form onSubmit={handleForgot} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                                    <div>
                                        <p style={{ fontSize: 20, fontWeight: 900, color: "#F5F5F5", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 8 }}>
                                            Reset password
                                        </p>
                                        <p style={{ fontSize: 12, color: "rgba(245,245,245,0.4)", lineHeight: 1.6 }}>
                                            Enter your email and we&apos;ll send a reset link.
                                        </p>
                                    </div>
                                    <Field
                                        label="Email address" type="email"
                                        value={forgotEmail} onChange={setForgotEmail}
                                        placeholder="you@example.com"
                                    />
                                    {error && <ErrorBox msg={error} />}
                                    {success && <p style={{ fontSize: 12, color: "#4ade80" }}>{success}</p>}
                                    <SubmitBtn loading={loading} label="Send reset link" />
                                    <button type="button" onClick={() => { setShowForgot(false); setError(""); }}
                                        style={{
                                            background: "none", border: "none", cursor: "pointer",
                                            color: "rgba(245,245,245,0.35)", fontSize: 11,
                                            letterSpacing: "0.05em", textAlign: "center",
                                        }}>
                                        ← Back to sign in
                                    </button>
                                </form>
                            ) : (
                                <>
                                    {/* Tab switcher */}
                                    <div style={{
                                        display: "flex", gap: 3, marginBottom: 28,
                                        background: "rgba(255,255,255,0.03)",
                                        borderRadius: 10, padding: 3,
                                        border: `1px solid ${BORDER}`,
                                    }}>
                                        {(["login", "register"] as const).map((t) => (
                                            <button key={t}
                                                type="button"
                                                onClick={() => { setTab(t); setError(""); setSuccess(""); }}
                                                style={{
                                                    flex: 1, height: 36, borderRadius: 8, border: "none",
                                                    fontSize: 9, fontWeight: 900,
                                                    letterSpacing: "0.22em", textTransform: "uppercase",
                                                    cursor: "pointer",
                                                    transition: "all 0.25s",
                                                    background: tab === t ? GOLD : "transparent",
                                                    color: tab === t ? "#0A0A0A" : "rgba(245,245,245,0.35)",
                                                    boxShadow: tab === t ? `0 4px 16px rgba(212,175,55,0.25)` : "none",
                                                }}>
                                                {t === "login" ? "Sign In" : "Create Account"}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Form */}
                                    <form
                                        ref={formRef}
                                        onSubmit={tab === "login" ? handleLogin : handleRegister}
                                        style={{ display: "flex", flexDirection: "column", gap: 14 }}
                                    >
                                        {tab === "login" ? (
                                            <>
                                                <div style={{ marginBottom: 4 }}>
                                                    <p style={{ fontSize: 22, fontWeight: 900, color: "#F5F5F5", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 4 }}>
                                                        Welcome back.
                                                    </p>
                                                    <p style={{ fontSize: 12, color: "rgba(245,245,245,0.35)" }}>
                                                        Enter your email and password below.
                                                    </p>
                                                </div>
                                                <Field label="Email" type="email" value={loginEmail} onChange={setLoginEmail} placeholder="you@example.com" />
                                                <Field label="Password" type="password" value={loginPassword} onChange={setLoginPassword} placeholder="••••••••" />
                                            </>
                                        ) : (
                                            <>
                                                <div style={{ marginBottom: 4 }}>
                                                    <p style={{ fontSize: 22, fontWeight: 900, color: "#F5F5F5", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 4 }}>
                                                        Create account.
                                                    </p>
                                                    <p style={{ fontSize: 12, color: "rgba(245,245,245,0.35)" }}>
                                                        Fill in your details to get started.
                                                    </p>
                                                </div>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                                    <Field label="First name" type="text" value={regFirst} onChange={setRegFirst} placeholder="Aryan" />
                                                    <Field label="Last name" type="text" value={regLast} onChange={setRegLast} placeholder="Sharma" />
                                                </div>
                                                <Field label="Email" type="email" value={regEmail} onChange={setRegEmail} placeholder="you@example.com" />
                                                <Field label="Phone / WhatsApp number" type="tel" value={regPhone} onChange={setRegPhone} placeholder="+91 98765 43210" />
                                                <Field label="Password" type="password" value={regPassword} onChange={setRegPassword} placeholder="Min. 5 characters" />
                                            </>
                                        )}

                                        {error && <ErrorBox msg={error} />}
                                        {success && (
                                            <p style={{ fontSize: 12, color: "#4ade80", background: "rgba(74,222,128,0.07)", padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(74,222,128,0.2)" }}>
                                                {success}
                                            </p>
                                        )}

                                        <SubmitBtn loading={loading} label={tab === "login" ? "Sign In" : "Create Account"} />

                                        {tab === "login" && (
                                            <button type="button"
                                                onClick={() => { setShowForgot(true); setError(""); setSuccess(""); }}
                                                style={{
                                                    background: "none", border: "none",
                                                    color: "rgba(212,175,55,0.6)", fontSize: 11,
                                                    cursor: "pointer", letterSpacing: "0.05em",
                                                    textAlign: "center",
                                                    transition: "color 0.2s",
                                                }}
                                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = GOLD; }}
                                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(212,175,55,0.6)"; }}
                                            >
                                                Forgot password?
                                            </button>
                                        )}
                                    </form>
                                </>
                            )}
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
