"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";

function LoginForm() {
    const router = useRouter();
    const params = useSearchParams();
    const redirectTo = params.get("from") ?? "/account";
    const [tab, setTab] = useState<"login" | "register">("login");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Login fields
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Register fields
    const [regFirst, setRegFirst] = useState("");
    const [regLast, setRegLast] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");

    // Forgot password
    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");

    const panelRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const tl = gsap.timeline();
        tl.fromTo(panelRef.current,
            { opacity: 0, y: 32, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: "expo.out" }
        );
    }, []);

    // Animate form swap
    useEffect(() => {
        if (formRef.current) {
            gsap.fromTo(formRef.current,
                { opacity: 0, x: tab === "login" ? -18 : 18 },
                { opacity: 1, x: 0, duration: 0.42, ease: "power3.out" }
            );
        }
    }, [tab]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); setLoading(true);
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: loginEmail, password: loginPassword }),
        });
        const data = await res.json();
        setLoading(false);
        if (!res.ok) { setError(data.error); return; }
        router.push(redirectTo);
        router.refresh();
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); setLoading(true);
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName: regFirst, lastName: regLast, email: regEmail, password: regPassword }),
        });
        const data = await res.json();
        setLoading(false);
        if (!res.ok) { setError(data.error); return; }
        if (data.redirect) { router.push(data.redirect); return; }
        router.push(redirectTo);
        router.refresh();
    };

    const handleForgot = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); setLoading(true);
        await fetch("/api/auth/forgot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: forgotEmail }),
        });
        setLoading(false);
        setSuccess("If that email exists, a reset link has been sent.");
        setShowForgot(false);
    };

    const inputStyle: React.CSSProperties = {
        width: "100%", height: 48,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 10, padding: "0 16px",
        color: "#F5F5F5", fontSize: 13,
        outline: "none", transition: "border-color 0.25s",
    };

    return (
        <main className="page-auth" style={{ minHeight: "100dvh", background: "#060609", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
            {/* Background glow */}
            <div aria-hidden style={{
                position: "fixed", inset: 0, pointerEvents: "none",
                background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(212,175,55,0.07) 0%, transparent 65%)",
            }} />

            <div ref={panelRef} style={{ opacity: 0, width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>
                {/* Logo */}
                <Link href="/" style={{ display: "flex", justifyContent: "center", marginBottom: 36, textDecoration: "none" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo.png" alt="SENZ8" style={{ height: 52, width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)" }} />
                </Link>

                {/* Card */}
                <div style={{
                    background: "linear-gradient(155deg,#111116 0%,#0c0c10 100%)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 20, padding: "36px 32px",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
                    position: "relative", overflow: "hidden",
                }}>
                    {/* Top accent line */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.55),transparent)" }} />

                    {/* Tab switcher */}
                    {!showForgot && (
                        <div style={{ display: "flex", gap: 4, marginBottom: 32, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4 }}>
                            {(["login", "register"] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => { setTab(t); setError(""); }}
                                    style={{
                                        flex: 1, height: 38, borderRadius: 8, border: "none",
                                        fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase",
                                        cursor: "pointer", transition: "all 0.25s",
                                        background: tab === t ? "#D4AF37" : "transparent",
                                        color: tab === t ? "#0A0A0A" : "rgba(245,245,245,0.45)",
                                    }}
                                >
                                    {t === "login" ? "Sign In" : "Create Account"}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Forgot password view */}
                    {showForgot ? (
                        <form onSubmit={handleForgot} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div>
                                <p style={{ fontSize: 18, fontWeight: 800, color: "#F5F5F5", letterSpacing: "-0.02em", marginBottom: 6 }}>
                                    Reset Password
                                </p>
                                <p style={{ fontSize: 12, color: "rgba(245,245,245,0.45)", lineHeight: 1.6 }}>
                                    Enter your email and we&apos;ll send you a reset link.
                                </p>
                            </div>
                            <input
                                type="email" required placeholder="Email address"
                                value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)}
                                style={inputStyle}
                                onFocus={(e) => e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)"}
                                onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
                            />
                            {error && <p style={{ fontSize: 12, color: "#f87171" }}>{error}</p>}
                            {success && <p style={{ fontSize: 12, color: "#4ade80" }}>{success}</p>}
                            <SubmitBtn loading={loading} label="Send Reset Link" />
                            <button type="button" onClick={() => setShowForgot(false)}
                                style={{ background: "none", border: "none", color: "rgba(245,245,245,0.45)", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>
                                Back to Sign In
                            </button>
                        </form>
                    ) : (
                        <form ref={formRef} onSubmit={tab === "login" ? handleLogin : handleRegister}
                            style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                            {tab === "login" ? (
                                <>
                                    <Heading text="Welcome back." />
                                    <Field label="Email" type="email" value={loginEmail} onChange={setLoginEmail} style={inputStyle} />
                                    <Field label="Password" type="password" value={loginPassword} onChange={setLoginPassword} style={inputStyle} />
                                </>
                            ) : (
                                <>
                                    <Heading text="Create your account." />
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                        <Field label="First name" type="text" value={regFirst} onChange={setRegFirst} style={inputStyle} />
                                        <Field label="Last name" type="text" value={regLast} onChange={setRegLast} style={inputStyle} />
                                    </div>
                                    <Field label="Email" type="email" value={regEmail} onChange={setRegEmail} style={inputStyle} />
                                    <Field label="Password (min 5 chars)" type="password" value={regPassword} onChange={setRegPassword} style={inputStyle} />
                                </>
                            )}

                            {error && (
                                <p style={{ fontSize: 12, color: "#f87171", background: "rgba(248,113,113,0.08)", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(248,113,113,0.2)" }}>
                                    {error}
                                </p>
                            )}
                            {success && <p style={{ fontSize: 12, color: "#4ade80" }}>{success}</p>}

                            <SubmitBtn loading={loading} label={tab === "login" ? "Sign In" : "Create Account"} />

                            {tab === "login" && (
                                <button type="button" onClick={() => { setShowForgot(true); setError(""); }}
                                    style={{ background: "none", border: "none", color: "rgba(212,175,55,0.7)", fontSize: 11, cursor: "pointer", letterSpacing: "0.05em", textAlign: "center" }}>
                                    Forgot password?
                                </button>
                            )}
                        </form>
                    )}
                </div>

                {/* Back link */}
                <p style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "rgba(245,245,245,0.35)", letterSpacing: "0.05em" }}>
                    <Link href="/" style={{ color: "rgba(245,245,245,0.35)", textDecoration: "none" }}>← Back to store</Link>
                </p>
            </div>
        </main>
    );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Heading({ text }: { text: string }) {
    return (
        <p style={{ fontSize: 22, fontWeight: 900, color: "#F5F5F5", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 4 }}>
            {text}
        </p>
    );
}

function Field({
    label, type, value, onChange, style,
}: {
    label: string; type: string; value: string;
    onChange: (v: string) => void; style: React.CSSProperties;
}) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,245,245,0.45)" }}>
                {label}
            </label>
            <input
                type={type} required value={value} onChange={(e) => onChange(e.target.value)}
                style={style}
                onFocus={(e) => e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)"}
                onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
            />
        </div>
    );
}

function SubmitBtn({ loading, label }: { loading: boolean; label: string }) {
    return (
        <button
            type="submit"
            disabled={loading}
            style={{
                height: 50,
                borderRadius: 999,
                border: "1px solid rgba(212,175,55,0.6)",
                background: loading ? "rgba(212,175,55,0.06)" : "rgba(212,175,55,0.1)",
                color: loading ? "rgba(212,175,55,0.4)" : "#D4AF37",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: loading ? "none" : "0 0 24px rgba(212,175,55,0.18)",
                transition: "background 0.25s, box-shadow 0.25s, border-color 0.25s",
            }}
            onMouseEnter={(e) => {
                if (!loading) {
                    const el = e.currentTarget;
                    el.style.background = "rgba(212,175,55,0.18)";
                    el.style.boxShadow = "0 0 36px rgba(212,175,55,0.32)";
                    el.style.borderColor = "rgba(212,175,55,1)";
                }
            }}
            onMouseLeave={(e) => {
                if (!loading) {
                    const el = e.currentTarget;
                    el.style.background = "rgba(212,175,55,0.1)";
                    el.style.boxShadow = "0 0 24px rgba(212,175,55,0.18)";
                    el.style.borderColor = "rgba(212,175,55,0.6)";
                }
            }}
        >
            {loading ? (
                <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="20" strokeDashoffset="10" />
                    </svg>
                    Processing…
                </>
            ) : label}
        </button>
    );
}

// ── Default export wraps LoginForm in Suspense (required for useSearchParams) ─
export default function LoginClient() {
    return (
        <Suspense fallback={
            <main style={{ minHeight: "100dvh", background: "#060609", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 40, height: 40, border: "2px solid rgba(212,175,55,0.3)", borderTopColor: "#D4AF37", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            </main>
        }>
            <LoginForm />
        </Suspense>
    );
}
