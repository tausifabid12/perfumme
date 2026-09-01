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
