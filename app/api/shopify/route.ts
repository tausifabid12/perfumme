/**
 * POST /api/shopify
 * Proxy for Shopify Storefront GraphQL API.
 * Runs server-side so the private token is never exposed to the browser
 * and CORS is never an issue.
 */

import { NextRequest, NextResponse } from "next/server";

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "";
const PRIVATE_TOKEN = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN ?? "";
const PUBLIC_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN ?? "";
const ENDPOINT = `https://${DOMAIN}/api/2024-04/graphql.json`;

export async function POST(req: NextRequest) {
    if (!DOMAIN || (!PRIVATE_TOKEN && !PUBLIC_TOKEN)) {
        return NextResponse.json({ errors: [{ message: "Shopify not configured" }] }, { status: 500 });
    }

    const body = await req.json();

    // Use private token with its own header when available, else fall back to public
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    if (PRIVATE_TOKEN && PRIVATE_TOKEN.startsWith("shpst_")) {
        headers["Shopify-Storefront-Private-Token"] = PRIVATE_TOKEN;
    } else {
        headers["X-Shopify-Storefront-Access-Token"] = PUBLIC_TOKEN;
    }

    const res = await fetch(ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
    });

    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
}
