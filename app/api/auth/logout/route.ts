import { NextRequest, NextResponse } from "next/server";
import { customerLogout } from "@/lib/shopify/customer-api";

export async function POST(req: NextRequest) {
    const token = req.cookies.get("shopify_customer_token")?.value;

    if (token) {
        await customerLogout(token).catch(() => { }); // best-effort
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.delete("shopify_customer_token");
    return res;
}

/**
 * GET /api/auth/logout — clears a stale/invalid token cookie and sends the
 * user to login. Used by /account when Shopify rejects the token: redirecting
 * straight to /login would loop, because the middleware bounces anyone with
 * the cookie from /login back to /account (ERR_TOO_MANY_REDIRECTS).
 */
export async function GET(req: NextRequest) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("from", "/account");

    const res = NextResponse.redirect(url);
    res.cookies.delete("shopify_customer_token");
    return res;
}
