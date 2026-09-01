import { NextRequest, NextResponse } from "next/server";
import { customerRegister, customerLogin } from "@/lib/shopify/customer-api";

export async function POST(req: NextRequest) {
    const { firstName, lastName, email, password } = await req.json();

    if (!firstName || !lastName || !email || !password) {
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password.length < 5) {
        return NextResponse.json({ error: "Password must be at least 5 characters" }, { status: 400 });
    }

    const result = await customerRegister({ firstName, lastName, email, password, acceptsMarketing: false });

    if (result.customerUserErrors.length || !result.customer) {
        const msg = result.customerUserErrors[0]?.message ?? "Registration failed";
        return NextResponse.json({ error: msg }, { status: 400 });
    }

    // Auto-login after register
    const loginResult = await customerLogin(email, password);
    if (!loginResult.customerAccessToken) {
        // Registered but couldn't auto-login — redirect to login
        return NextResponse.json({ ok: true, redirect: "/login" });
    }

    const { accessToken, expiresAt } = loginResult.customerAccessToken;
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
