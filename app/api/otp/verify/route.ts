/**
 * POST /api/otp/verify  { code }
 * Checks the WhatsApp code. On success:
 *   • sets wa_verified (lets checkout continue even if login below fails)
 *   • logs the customer into Shopify by phone — finds or creates their account
 *     and signs in with the password we manage (lib/phone-login.ts) — and sets
 *     the customer token cookie.
 * → { ok, phone, loggedIn, isNew }
 */

import { NextRequest, NextResponse } from "next/server";
import { checkOtp } from "@/lib/whatsapp-otp";
import { loginWithPhone } from "@/lib/phone-login";
import { getBuyerIp, setTokenCookie } from "@/lib/shopify/auth-cookie";

export async function POST(req: NextRequest) {
    const { code } = await req.json().catch(() => ({}));

    // Collects cookie changes; copied onto whichever response we return.
    const jar = NextResponse.json({});
    const result = checkOtp(req, jar, String(code ?? "").trim());

    let out: NextResponse;
    if (!result.ok) {
        out = NextResponse.json({ error: result.error, attemptsLeft: result.attemptsLeft }, { status: 400 });
    } else {
        try {
            const { accessToken, expiresAt, isNew } = await loginWithPhone(result.phone, getBuyerIp(req));
            out = NextResponse.json({ ok: true, phone: result.phone, loggedIn: true, isNew });
            setTokenCookie(out, accessToken, expiresAt);
        } catch (err) {
            console.error("Phone login failed:", err);
            out = NextResponse.json({ ok: true, phone: result.phone, loggedIn: false });
        }
    }

    jar.cookies.getAll().forEach(c => out.cookies.set(c));
    return out;
}
