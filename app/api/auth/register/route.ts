import { NextRequest, NextResponse } from "next/server";
import { customerRegister, customerLogin } from "@/lib/shopify/customer-api";
import { getBuyerIp, setTokenCookie } from "@/lib/shopify/auth-cookie";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const firstName = String(body.firstName ?? "").trim();
    const lastName = String(body.lastName ?? "").trim();
    const email = String(body.email ?? "").trim();
    const { phone, password } = body;

    if (!firstName || !lastName || !email || !phone || !password) {
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Shopify expects E.164; a bare 10-digit number is assumed to be Indian
    const digits = String(phone).replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) {
        return NextResponse.json({ error: "Please enter a valid phone / WhatsApp number" }, { status: 400 });
    }
    const normalisedPhone = !String(phone).trim().startsWith("+") && digits.length === 10
        ? `+91${digits}`
        : `+${digits}`;

    if (password.length < 5) {
        return NextResponse.json({ error: "Password must be at least 5 characters" }, { status: 400 });
    }

    const buyerIp = getBuyerIp(req);

    try {
        const result = await customerRegister(
            { firstName, lastName, email, phone: normalisedPhone, password, acceptsMarketing: false },
            buyerIp
        );

        if (result.customerUserErrors.length || !result.customer) {
            const msg = result.customerUserErrors[0]?.message ?? "Registration failed";
            return NextResponse.json({ error: msg }, { status: 400 });
        }

        // Auto-login after register
        const loginResult = await customerLogin(email, password, buyerIp);
        if (!loginResult.customerAccessToken) {
            // Registered but couldn't auto-login — send to login
            return NextResponse.json({ ok: true, redirect: "/login" });
        }

        const { accessToken, expiresAt } = loginResult.customerAccessToken;
        const res = NextResponse.json({ ok: true });
        setTokenCookie(res, accessToken, expiresAt);
        return res;
    } catch (err) {
        console.error("register failed:", err);
        return NextResponse.json({ error: "Registration is unavailable right now. Please try again." }, { status: 500 });
    }
}
