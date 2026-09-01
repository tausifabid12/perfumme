import { NextRequest, NextResponse } from "next/server";
import { customerLogin } from "@/lib/shopify/customer-api";

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const result = await customerLogin(email, password);

    if (result.customerUserErrors.length || !result.customerAccessToken) {
        const msg = result.customerUserErrors[0]?.message ?? "Invalid credentials";
        return NextResponse.json({ error: msg }, { status: 401 });
    }

    const { accessToken, expiresAt } = result.customerAccessToken;

    const res = NextResponse.json({ ok: true });
    res.cookies.set("shopify_customer_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(expiresAt),
        path: "/",
    });

    return res;
}
