/**
 * POST /api/webhooks/eshipz — Blue Dart tracking updates pushed by eShipz (v2 payload).
 *
 * No database: each update is written straight into Shopify as a fulfillment
 * event, so the order timeline and the customer's order-status page stay current
 * (Shopify also emails "out for delivery" / "delivered" if those notifications are on).
 *
 * Setup in eShipz portal → Webhooks:
 *   URL:  https://www.senz8.in/api/webhooks/eshipz
 *   Auth: "Header based" → header  X-Webhook-Token: <ESHIPZ_WEBHOOK_SECRET>
 *         (or Basic auth with any username and ESHIPZ_WEBHOOK_SECRET as password)
 */

import { timingSafeEqual, createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
    createFulfillmentEvent,
    findFulfillmentByAwb,
    type FulfillmentEventStatus,
} from "@/lib/admin/shopify-admin";

function safeEqual(a: string, b: string): boolean {
    const h = (s: string) => createHash("sha256").update(s).digest();
    return timingSafeEqual(h(a), h(b));
}

function authorized(req: NextRequest): boolean {
    const secret = process.env.ESHIPZ_WEBHOOK_SECRET;
    if (!secret) return false;

    const header = req.headers.get("x-webhook-token");
    if (header) return safeEqual(header, secret);

    const auth = req.headers.get("authorization") ?? "";
    if (auth.startsWith("Basic ")) {
        const decoded = Buffer.from(auth.slice(6), "base64").toString();
        return safeEqual(decoded.slice(decoded.indexOf(":") + 1), secret);
    }
    if (auth.startsWith("Bearer ")) return safeEqual(auth.slice(7), secret);
    return false;
}

/** eShipz tracking tag → Shopify fulfillment event status. */
function toShopifyStatus(status: string, sub: string): FulfillmentEventStatus | null {
    const s = `${status} ${sub}`.toLowerCase();
    if (/rto|return/.test(s)) return "FAILURE";
    if (/delivered/.test(s) && !/undeliver/.test(s)) return "DELIVERED";
    if (/outfordelivery|out for delivery/.test(s)) return "OUT_FOR_DELIVERY";
    if (/attemptfail|undeliver|ndr/.test(s)) return "ATTEMPTED_DELIVERY";
    if (/exception|delay/.test(s)) return "DELAYED";
    if (/pickedup|picked up/.test(s)) return "CARRIER_PICKED_UP";
    if (/intransit|in transit/.test(s)) return "IN_TRANSIT";
    if (/inforeceived|manifest|created/.test(s)) return "CONFIRMED";
    return null;
}

export async function POST(req: NextRequest) {
    if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => null);
    const events = Array.isArray(body) ? body : body ? [body] : [];
    if (!events.length) return NextResponse.json({ error: "Empty payload" }, { status: 400 });

    const results: { awb: string; result: string }[] = [];
    for (const e of events.slice(0, 50)) {
        const awb = String(e?.tracking_number ?? "");
        const orderRef = String(e?.order_id ?? "");
        const status = toShopifyStatus(String(e?.tracking_status ?? ""), String(e?.tracking_sub_status ?? ""));

        if (!/^[A-Za-z0-9-]{5,30}$/.test(awb) || !/^#?\d{1,12}$/.test(orderRef)) {
            results.push({ awb, result: "ignored: not a store order" });
            continue;
        }
        if (!status) {
            results.push({ awb, result: "ignored: unmapped status" });
            continue;
        }

        try {
            const fulfillmentId = await findFulfillmentByAwb(orderRef, awb);
            if (!fulfillmentId) {
                results.push({ awb, result: "ignored: no Shopify fulfillment with this AWB" });
                continue;
            }
            const when = e?.tracking_checkpoint_datetime ? new Date(`${e.tracking_checkpoint_datetime}+05:30`) : null;
            await createFulfillmentEvent(
                fulfillmentId,
                status,
                String(e?.tracking_msg ?? e?.tracking_status ?? "").slice(0, 250),
                when && !isNaN(when.getTime()) ? when.toISOString() : undefined
            );
            results.push({ awb, result: `recorded ${status}` });
        } catch (err) {
            console.error("eShipz webhook → Shopify failed:", awb, err);
            // 500 so eShipz retries later
            return NextResponse.json({ error: "Could not update Shopify" }, { status: 500 });
        }
    }

    return NextResponse.json({ ok: true, results });
}
