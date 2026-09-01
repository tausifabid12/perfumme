import { NextRequest, NextResponse } from "next/server";
import { getCustomer } from "@/lib/shopify/customer-api";

export async function GET(req: NextRequest) {
    const token = req.cookies.get("shopify_customer_token")?.value;
    if (!token) return NextResponse.json({ customer: null });

    const customer = await getCustomer(token);
    return NextResponse.json({ customer });
}
