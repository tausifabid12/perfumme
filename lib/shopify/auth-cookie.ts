import type { NextRequest, NextResponse } from "next/server";

export const TOKEN_COOKIE = "shopify_customer_token";

/** Store the Shopify customer access token in an httpOnly cookie. */
export function setTokenCookie(res: NextResponse, accessToken: string, expiresAt: string) {
    res.cookies.set(TOKEN_COOKIE, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(expiresAt),
        path: "/",
    });
}

/** The visitor's IP (first hop of x-forwarded-for on Vercel), for Shopify's buyer-IP header. */
export function getBuyerIp(req: NextRequest): string | undefined {
    return (
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        undefined
    );
}
