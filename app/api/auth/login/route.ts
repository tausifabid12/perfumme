import { NextRequest, NextResponse } from "next/server";
import { customerLogin } from "@/lib/shopify/customer-api";
import { getBuyerIp, setTokenCookie } from "@/lib/shopify/auth-cookie";

export async function POST(req: NextRequest) {
    const { email: rawEmail, password } = await req.json();
    // Mobile autofill often adds a trailing space → "Unidentified customer"
    const email = String(rawEmail ?? "").trim();

    if (!email || !password) {
        return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    try {
        const result = await customerLogin(email, password, getBuyerIp(req));

        if (result.customerUserErrors.length || !result.customerAccessToken) {
            const msg = result.customerUserErrors[0]?.message ?? "Invalid credentials";
            return NextResponse.json({ error: msg }, { status: 401 });
        }

        const { accessToken, expiresAt } = result.customerAccessToken;
        const res = NextResponse.json({ ok: true });
        setTokenCookie(res, accessToken, expiresAt);
        return res;
    } catch (err) {
        console.error("login failed:", err);
        return NextResponse.json({ error: "Login is unavailable right now. Please try again." }, { status: 500 });
    }
}
