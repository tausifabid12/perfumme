import { NextRequest, NextResponse } from "next/server";
import { getCustomer } from "@/lib/shopify/customer-api";
import { TOKEN_COOKIE } from "@/lib/shopify/auth-cookie";

export async function GET(req: NextRequest) {
    const token = req.cookies.get(TOKEN_COOKIE)?.value;
    if (!token) return NextResponse.json({ customer: null });

    const customer = await getCustomer(token);
    const res = NextResponse.json({ customer: customer ?? null });
    // Token expired/rejected (not just a failed request): drop the cookie,
    // otherwise the middleware keeps bouncing this user off /login.
    if (customer === null) res.cookies.delete(TOKEN_COOKIE);
    return res;
}
