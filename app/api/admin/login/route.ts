import { NextRequest, NextResponse } from "next/server";
import { checkCredentials, clearLoginFailures, loginBlockedFor, recordLoginFailure } from "@/lib/admin/auth";
import { ADMIN_COOKIE, signSession } from "@/lib/admin/session";
import { getBuyerIp } from "@/lib/shopify/auth-cookie";

/** Reject cross-site form posts (CSRF) — the login form is same-origin only. */
function sameOrigin(req: NextRequest): boolean {
    const origin = req.headers.get("origin");
    if (!origin) return true; // non-browser clients; cookie is SameSite=strict anyway
    try {
        return new URL(origin).host === req.headers.get("host");
    } catch {
        return false;
    }
}

export async function POST(req: NextRequest) {
    if (!sameOrigin(req)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ip = getBuyerIp(req) ?? "unknown";
    const retryAfter = loginBlockedFor(ip);
    if (retryAfter) {
        return NextResponse.json(
            { error: `Too many attempts. Try again in ${Math.ceil(retryAfter / 60)} min.` },
            { status: 429, headers: { "Retry-After": String(retryAfter) } }
        );
    }

    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? "").slice(0, 200);
    const password = String(body.password ?? "").slice(0, 200);

    if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    if (!checkCredentials(email, password)) {
        recordLoginFailure(ip);
        // Flat delay makes guessing slower and hides timing differences
        await new Promise((r) => setTimeout(r, 600));
        return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    }

    clearLoginFailures(ip);
    const { token, expires } = await signSession(email.trim().toLowerCase());
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires,
    });
    return res;
}
