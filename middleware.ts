import { NextRequest, NextResponse } from "next/server";

// Routes that require the customer to be logged in
const PROTECTED = ["/account"];
// Routes that logged-in users shouldn't see (redirect to account)
const AUTH_ONLY = ["/login"];

export function middleware(req: NextRequest) {
    const token = req.cookies.get("shopify_customer_token")?.value;
    const { pathname } = req.nextUrl;

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
    matcher: ["/account/:path*", "/login"],
};
