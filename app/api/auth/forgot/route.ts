import { NextRequest, NextResponse } from "next/server";
import { sendPasswordReset } from "@/lib/shopify/customer-api";

export async function POST(req: NextRequest) {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
    // Always return ok — don't reveal whether email exists
    await sendPasswordReset(email).catch(() => { });
    return NextResponse.json({ ok: true });
}
