"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export type OtpVerified = { phone: string; loggedIn: boolean; isNew?: boolean };

const GOLD = "#D4AF37";
const CODE_LEN = 6;

/**
 * WhatsApp OTP sign-in: number → 6-digit code (Pinggo) → verify.
 * Verifying also signs the customer into their Shopify account (created on
 * first use) — see /api/otp/verify. Used by the checkout popup and /login.
 */
export default function WhatsAppOtpForm({
    onVerified,
    title = "Sign in with WhatsApp",
    intro = "Enter your WhatsApp number and we'll send you a one-time code. No password needed.",
    verifyLabel = "Verify & continue",
    headingId,
}: {
    onVerified: (r: OtpVerified) => void | Promise<void>;
    title?: string;
    intro?: string;
    verifyLabel?: string;
    headingId?: string;
}) {
    const [step, setStep] = useState<"phone" | "code">("phone");
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [cooldown, setCooldown] = useState(0);
    const [codeFocused, setCodeFocused] = useState(false);
    const codeRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setTimeout(() => setCooldown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

    useEffect(() => {
        if (step === "code") setTimeout(() => codeRef.current?.focus(), 50);
    }, [step]);

    const digits = phone.replace(/\D/g, "");
    const prettyPhone = `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;

    const sendCode = async () => {
        setError("");
        if (!/^[6-9]\d{9}$/.test(digits)) { setError("Enter a valid 10-digit mobile number."); return; }
        setLoading(true);
        try {
            const res = await fetch("/api/otp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ phone: digits }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                if (data.retryAfter) setCooldown(data.retryAfter);
                setError(data.error ?? "Couldn't send the code.");
                return;
            }
            setStep("code"); setCode(""); setCooldown(30);
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const verify = async (value = code) => {
        setError("");
        if (!/^\d{6}$/.test(value)) { setError("Enter the 6-digit code."); return; }
        setLoading(true);
        try {
            const res = await fetch("/api/otp/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ code: value }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                const left = typeof data.attemptsLeft === "number" && data.attemptsLeft > 0
                    ? ` ${data.attemptsLeft} attempt${data.attemptsLeft === 1 ? "" : "s"} left.` : "";
                setError((data.error ?? "Verification failed.") + left);
                setCode("");
                setLoading(false);
                codeRef.current?.focus();
                return;
            }
            // Usually navigates away (checkout / account); keep the spinner meanwhile
            await onVerified({ phone: data.phone, loggedIn: !!data.loggedIn, isNew: data.isNew });
            setLoading(false);
        } catch {
            setError("Network error. Please try again.");
            setLoading(false);
        }
    };

    const onCodeChange = (v: string) => {
        const next = v.replace(/\D/g, "").slice(0, CODE_LEN);
        setCode(next);
        if (error) setError("");
        // Auto-submit once all digits are in (typed, pasted or autofilled)
        if (next.length === CODE_LEN && !loading) verify(next);
    };

    const phoneBlocked = step === "phone" && cooldown > 0;
    const disabled = loading || phoneBlocked;

    return (
        <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-5"
                style={{ background: "rgba(37,211,102,0.07)", border: "1px solid rgba(37,211,102,0.22)" }}>
                <FaWhatsapp size={13} color="#25D366" />
                <span className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: "#25D366" }}>
                    {step === "phone" ? "Secure sign-in" : "Step 2 of 2"}
                </span>
            </div>

            {/* Heading */}
            <h2 id={headingId} className="font-black mb-2"
                style={{ fontSize: 26, lineHeight: 1.05, letterSpacing: "-0.04em", color: "#F5F5F5" }}>
                {step === "phone" ? title : "Enter your code"}
            </h2>
            <p className="text-[13px] leading-relaxed mb-7" style={{ color: "rgba(245,245,245,0.5)" }}>
                {step === "phone" ? intro : (
                    <>
                        Sent on WhatsApp to <span className="font-bold" style={{ color: "#F5F5F5" }}>{prettyPhone}</span>
                        {" · "}
                        <button type="button" disabled={loading}
                            onClick={() => { setStep("phone"); setError(""); setCode(""); }}
                            className="font-bold cursor-pointer underline-offset-4 hover:underline"
                            style={{ color: GOLD, background: "none", border: "none", padding: 0 }}>
                            Change
                        </button>
                    </>
                )}
            </p>

            <form onSubmit={e => { e.preventDefault(); if (step === "phone") sendCode(); else verify(); }}
                className="flex flex-col gap-4">

                {step === "phone" ? (
                    <label className="flex flex-col gap-2">
                        <span className="text-[9px] font-extrabold uppercase tracking-[0.22em]"
                            style={{ color: "rgba(245,245,245,0.4)" }}>
                            WhatsApp number
                        </span>
                        <div className="flex items-stretch rounded-xl overflow-hidden transition-colors duration-200 focus-within:border-[rgba(212,175,55,0.55)]"
                            style={{ height: 54, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)" }}>
                            <span className="flex items-center px-4 text-[15px] font-bold select-none"
                                style={{ color: GOLD, borderRight: "1px solid rgba(255,255,255,0.08)" }}>
                                +91
                            </span>
                            <input
                                autoFocus
                                type="tel" inputMode="numeric" autoComplete="tel-national"
                                placeholder="98765 43210"
                                value={phone}
                                maxLength={14}
                                onChange={e => { setPhone(e.target.value.replace(/[^\d\s-]/g, "")); if (error) setError(""); }}
                                className="flex-1 min-w-0 bg-transparent px-4 text-[16px] font-semibold tracking-wide outline-none placeholder:font-normal placeholder:text-[rgba(245,245,245,0.25)]"
                                style={{ color: "#F5F5F5" }}
                            />
                        </div>
                    </label>
                ) : (
                    /* 6 boxes driven by one transparent input (keeps paste + SMS/WhatsApp autofill working) */
                    <div className="relative" onClick={() => codeRef.current?.focus()}>
                        <div className="grid grid-cols-6 gap-2" aria-hidden>
                            {Array.from({ length: CODE_LEN }, (_, i) => {
                                const active = codeFocused && !loading && i === Math.min(code.length, CODE_LEN - 1);
                                const filled = i < code.length;
                                return (
                                    <div key={i}
                                        className="flex items-center justify-center rounded-xl text-[22px] font-black transition-all duration-150"
                                        style={{
                                            height: 58,
                                            color: "#F5F5F5",
                                            background: filled ? "rgba(212,175,55,0.06)" : "rgba(255,255,255,0.03)",
                                            border: `1px solid ${error ? "rgba(248,113,113,0.5)" : active ? GOLD : filled ? "rgba(212,175,55,0.3)" : "rgba(255,255,255,0.1)"}`,
                                            boxShadow: active ? "0 0 0 3px rgba(212,175,55,0.12)" : "none",
                                        }}>
                                        {code[i] ?? (active ? <span className="w-[2px] h-6 animate-pulse" style={{ background: GOLD }} /> : "")}
                                    </div>
                                );
                            })}
                        </div>
                        <input
                            ref={codeRef}
                            type="text" inputMode="numeric" autoComplete="one-time-code"
                            aria-label="6-digit code"
                            value={code}
                            maxLength={CODE_LEN}
                            disabled={loading}
                            onChange={e => onCodeChange(e.target.value)}
                            onFocus={() => setCodeFocused(true)}
                            onBlur={() => setCodeFocused(false)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            style={{ caretColor: "transparent" }}
                        />
                    </div>
                )}

                {error && (
                    <p role="alert" className="text-[12px] leading-snug rounded-lg px-3.5 py-2.5"
                        style={{ color: "#f87171", background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.2)" }}>
                        {error}
                    </p>
                )}

                <button type="submit" disabled={disabled}
                    className="flex items-center justify-center gap-2 w-full rounded-full font-black uppercase text-[10px] transition-all duration-300 hover:brightness-110"
                    style={{
                        height: 52, letterSpacing: "0.28em",
                        background: disabled ? "rgba(212,175,55,0.15)" : GOLD,
                        color: disabled ? "rgba(212,175,55,0.6)" : "#0A0A0A",
                        boxShadow: disabled ? "none" : "0 8px 32px rgba(212,175,55,0.25)",
                        cursor: disabled ? "not-allowed" : "pointer",
                    }}>
                    {loading ? (
                        <>
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                            {step === "phone" ? "Sending code" : "Signing you in"}
                        </>
                    ) : step === "phone" ? (
                        cooldown > 0 ? `Try again in ${cooldown}s` : <>Send code <ArrowRight size={12} /></>
                    ) : (
                        <>{verifyLabel} <ShieldCheck size={13} /></>
                    )}
                </button>

                {step === "code" && (
                    <p className="text-center text-[12px]" style={{ color: "rgba(245,245,245,0.4)" }}>
                        Didn&apos;t get it?{" "}
                        {cooldown > 0 ? (
                            <span>Resend in <span className="font-bold tabular-nums" style={{ color: "rgba(245,245,245,0.7)" }}>{cooldown}s</span></span>
                        ) : (
                            <button type="button" onClick={sendCode} disabled={loading}
                                className="font-bold cursor-pointer underline-offset-4 hover:underline"
                                style={{ color: GOLD, background: "none", border: "none", padding: 0 }}>
                                Resend code
                            </button>
                        )}
                    </p>
                )}
            </form>

            {/* Reassurance */}
            <div className="flex items-start gap-2.5 mt-6 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <Lock size={12} className="mt-0.5 flex-shrink-0" style={{ color: "rgba(212,175,55,0.6)" }} />
                <p className="text-[11px] leading-relaxed" style={{ color: "rgba(245,245,245,0.35)" }}>
                    New here? Your account is created automatically. We only use your number for sign-in and order updates.
                </p>
            </div>
        </div>
    );
}
