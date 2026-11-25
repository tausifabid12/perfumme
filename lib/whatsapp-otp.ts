/**
 * WhatsApp OTP for checkout, sent through the Pinggo API.
 *
 * Stateless: the pending code lives in a signed httpOnly cookie (only an HMAC
 * of the code, never the code itself), and a successful check sets a second
 * signed cookie that /api/cart/checkout requires.
 *
 * Env:
 *   PINGGO_API_KEY        Bearer token (Settings → API & Webhook)
 *   PINGGO_USER_ID        Vendor / User ID
 *   PINGGO_VENDOR_PHONE   WhatsApp Business number, e.g. 918095946222
 *   PINGGO_OTP_TEMPLATE   Approved template name (Authentication category)
 *   OTP_SECRET            Optional signing secret (falls back to PINGGO_API_KEY)
 */

import { createHmac, randomInt, timingSafeEqual } from "crypto";
import type { NextRequest, NextResponse } from "next/server";

export const OTP_COOKIE = "wa_otp";
export const VERIFIED_COOKIE = "wa_verified";

const OTP_TTL_MS = 10 * 60 * 1000;          // code valid 10 min
const RESEND_COOLDOWN_MS = 30 * 1000;       // one send per 30 s
export const MAX_ATTEMPTS = 5;
const VERIFIED_TTL_MS = 7 * 24 * 60 * 60 * 1000; // stay verified 7 days

const secret = () => {
    const s = process.env.OTP_SECRET || process.env.PINGGO_API_KEY;
    if (!s) throw new Error("OTP_SECRET / PINGGO_API_KEY not set");
    return s;
};

const hmac = (data: string) => createHmac("sha256", secret()).update(data).digest("base64url");

const safeEqual = (a: string, b: string) => {
    const ab = Buffer.from(a), bb = Buffer.from(b);
    return ab.length === bb.length && timingSafeEqual(ab, bb);
};

const sign = (payload: object) => {
    const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
    return `${body}.${hmac(body)}`;
};

const unsign = <T>(token: string | undefined): T | null => {
    if (!token) return null;
    const [body, sig] = token.split(".");
    if (!body || !sig || !safeEqual(sig, hmac(body))) return null;
    try { return JSON.parse(Buffer.from(body, "base64url").toString()) as T; } catch { return null; }
};

/** "98765 43210", "+91 98765-43210", "0987…" → "919876543210" (India). null if invalid. */
export function normalizePhone(raw: unknown): string | null {
    let d = String(raw ?? "").replace(/\D/g, "");
    if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
    if (d.length === 10) d = "91" + d;
    return /^91[6-9]\d{9}$/.test(d) ? d : null;
}

const cookieOpts = (maxAgeMs: number) => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: Math.floor(maxAgeMs / 1000),
});

// ─── Pending OTP ─────────────────────────────────────────────────────────────
interface Pending { p: string; h: string; e: number; s: number; a: number }

const codeHash = (phone: string, code: string, exp: number) => hmac(`${phone}:${code}:${exp}`);

/** Seconds left before another code may be sent to this browser (0 = ok). */
export function resendWait(req: NextRequest): number {
    const pending = unsign<Pending>(req.cookies.get(OTP_COOKIE)?.value);
    if (!pending) return 0;
    return Math.max(0, Math.ceil((pending.s + RESEND_COOLDOWN_MS - Date.now()) / 1000));
}

export function newOtp(res: NextResponse, phone: string): string {
    const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
    const now = Date.now();
    const e = now + OTP_TTL_MS;
    res.cookies.set(OTP_COOKIE, sign({ p: phone, h: codeHash(phone, code, e), e, s: now, a: 0 }), cookieOpts(OTP_TTL_MS));
    return code;
}

export type CheckResult =
    | { ok: true; phone: string }
    | { ok: false; error: string; attemptsLeft?: number };

/** Checks the code and updates the cookies on `res` (attempt count, or verified). */
export function checkOtp(req: NextRequest, res: NextResponse, code: string): CheckResult {
    const pending = unsign<Pending>(req.cookies.get(OTP_COOKIE)?.value);
    if (!pending) return { ok: false, error: "No code was sent. Please request a new one." };
    if (Date.now() > pending.e) {
        res.cookies.delete(OTP_COOKIE);
        return { ok: false, error: "This code has expired. Please request a new one." };
    }
    if (pending.a >= MAX_ATTEMPTS) {
        res.cookies.delete(OTP_COOKIE);
        return { ok: false, error: "Too many wrong attempts. Please request a new code." };
    }

    if (!/^\d{6}$/.test(code) || !safeEqual(codeHash(pending.p, code, pending.e), pending.h)) {
        const a = pending.a + 1;
        res.cookies.set(OTP_COOKIE, sign({ ...pending, a }), cookieOpts(pending.e - Date.now()));
        return { ok: false, error: "Incorrect code.", attemptsLeft: MAX_ATTEMPTS - a };
    }

    res.cookies.delete(OTP_COOKIE);
    res.cookies.set(VERIFIED_COOKIE, sign({ p: pending.p, e: Date.now() + VERIFIED_TTL_MS }), cookieOpts(VERIFIED_TTL_MS));
    return { ok: true, phone: pending.p };
}

/** The verified WhatsApp number for this browser, or null. */
export function verifiedPhone(req: NextRequest): string | null {
    const v = unsign<{ p: string; e: number }>(req.cookies.get(VERIFIED_COOKIE)?.value);
    return v && Date.now() < v.e ? v.p : null;
}

// ─── Pinggo ──────────────────────────────────────────────────────────────────
export async function sendOtpWhatsApp(phone: string, code: string): Promise<void> {
    const { PINGGO_API_KEY, PINGGO_USER_ID, PINGGO_VENDOR_PHONE, PINGGO_OTP_TEMPLATE } = process.env;
    if (!PINGGO_API_KEY || !PINGGO_USER_ID || !PINGGO_VENDOR_PHONE || !PINGGO_OTP_TEMPLATE) {
        throw new Error("Pinggo env vars missing (PINGGO_API_KEY, PINGGO_USER_ID, PINGGO_VENDOR_PHONE, PINGGO_OTP_TEMPLATE)");
    }

    const res = await fetch("https://pinggo.in/api/user-api-service/send-message", {
        method: "POST",
        headers: { Authorization: `Bearer ${PINGGO_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: PINGGO_USER_ID,
            vendorPhoneNumber: PINGGO_VENDOR_PHONE,
            recipientPhoneNumbers: [phone],
            messageType: "template",
            templateName: PINGGO_OTP_TEMPLATE,
            // Authentication templates: body {{1}} is the code, and otpCode
            // fills the copy-code / autofill button.
            bodyVariables: { field_1: code },
            otpCode: code,
        }),
        cache: "no-store",
    });

    const data = await res.json().catch(() => null);
    if (!res.ok || data?.success === false) {
        throw new Error(`Pinggo send failed (${res.status}): ${data?.message ?? "unknown error"}`);
    }
}
