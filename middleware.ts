import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySession } from "@/lib/admin/session";

// Routes that require the customer to be logged in
const PROTECTED = ["/account"];
// Routes that logged-in users shouldn't see (redirect to account)
const AUTH_ONLY = ["/login"];

async function adminGuard(req: NextRequest): Promise<NextResponse> {
    const { pathname } = req.nextUrl;
    const session = await verifySession(req.cookies.get(ADMIN_COOKIE)?.value);
    const onLogin = pathname === "/admin/login";

    let res: NextResponse;
    if (!session && !onLogin) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/login";
        url.search = "";
        res = NextResponse.redirect(url);
    } else if (session && onLogin) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin";
        url.search = "";
        res = NextResponse.redirect(url);
    } else {
        res = NextResponse.next();
    }

    // Keep the admin area out of search engines, frames and shared caches
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    res.headers.set("X-Frame-Options", "DENY");
    res.headers.set("Cache-Control", "no-store");
    res.headers.set("Referrer-Policy", "same-origin");
    return res;
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Pages also check the session themselves; this just redirects early.
    if (pathname === "/admin" || pathname.startsWith("/admin/")) return adminGuard(req);

    const token = req.cookies.get("shopify_customer_token")?.value;

    // Redirect unauthenticated users away from protected pages
    if (PROTECTED.some((p) => pathname.startsWith(p)) && !token) {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("from", pathname);
        return NextResponse.redirect(url);
    }

    // Redirect already-logged-in users away from /login
    if (AUTH_ONLY.some((p) => pathname.startsWith(p)) && token) {
        const url = req.nextUrl.clone();
        url.pathname = "/account";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/account/:path*", "/login", "/admin", "/admin/:path*"],
};
