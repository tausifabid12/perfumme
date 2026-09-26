import { NextRequest, NextResponse } from "next/server";
import { sendPasswordReset } from "@/lib/shopify/customer-api";
import { getBuyerIp } from "@/lib/shopify/auth-cookie";

export async function POST(req: NextRequest) {
    const { email: rawEmail } = await req.json();
    const email = String(rawEmail ?? "").trim();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
    // Always return ok — don't reveal whether email exists
    await sendPasswordReset(email, getBuyerIp(req)).catch(() => { });
    return NextResponse.json({ ok: true });
}
