/**
 * POST /api/otp/send  { phone }
 * Sends a 6-digit checkout code to the number on WhatsApp (Pinggo).
 */

import { NextRequest, NextResponse } from "next/server";
import { newOtp, normalizePhone, resendWait, sendOtpWhatsApp } from "@/lib/whatsapp-otp";

export async function POST(req: NextRequest) {
    const { phone: raw } = await req.json().catch(() => ({}));
    const phone = normalizePhone(raw);
    if (!phone) {
        return NextResponse.json({ error: "Enter a valid 10-digit Indian mobile number." }, { status: 400 });
    }

    const wait = resendWait(req);
    if (wait > 0) {
        return NextResponse.json({ error: `Please wait ${wait}s before requesting another code.`, retryAfter: wait }, { status: 429 });
    }

    const res = NextResponse.json({ ok: true, phone });
    try {
        const code = newOtp(res, phone);
        await sendOtpWhatsApp(phone, code);
        return res;
    } catch (err) {
        console.error("OTP send failed:", err);
        return NextResponse.json({ error: "Couldn't send the code on WhatsApp. Please try again." }, { status: 502 });
    }
}
