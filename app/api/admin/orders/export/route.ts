/**
 * GET /api/admin/orders/export?q=&filter= — the orders list (same search/filter
 * as the dashboard) as a CSV, one row per order. Up to 1,000 orders.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { csvResponse, toCsv } from "@/lib/admin/csv";
import { buildOrderQuery } from "@/lib/admin/filters";
import { formatDate } from "@/lib/admin/format";
import { listOrders, phonePeOrderIds, type OrderListItem } from "@/lib/admin/shopify-admin";

export async function GET(req: NextRequest) {
    if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const q = req.nextUrl.searchParams.get("q") ?? "";
    const filter = req.nextUrl.searchParams.get("filter") ?? "all";
    const query = buildOrderQuery(filter, q);

    const orders: OrderListItem[] = [];
    let after: string | undefined;
    try {
        for (let page = 0; page < 4; page++) {
            const res = await listOrders({ query, after, pageSize: 250 });
            orders.push(...res.orders);
            if (!res.pageInfo.hasNextPage || !res.pageInfo.endCursor) break;
            after = res.pageInfo.endCursor;
        }
    } catch (err) {
        return NextResponse.json({ error: err instanceof Error ? err.message : "Export failed" }, { status: 502 });
    }

    const header = [
        "Order", "Date", "Customer", "City", "Items", "Total", "Currency",
        "Payment status", "Fulfillment status", "Gateway", "PhonePe merchant order id",
    ];
    const rows = orders.map((o) => [
        o.name,
        formatDate(o.createdAt),
        o.customer?.displayName ?? o.shippingAddress?.name ?? "",
        o.shippingAddress?.city ?? "",
        o.currentSubtotalLineItemsQuantity,
        o.totalPriceSet?.shopMoney.amount ?? "",
        o.totalPriceSet?.shopMoney.currencyCode ?? "",
        o.cancelledAt ? "CANCELLED" : o.displayFinancialStatus,
        o.displayFulfillmentStatus,
        o.paymentGatewayNames.join(" | "),
        phonePeOrderIds(o.transactions).join(" "),
    ]);

    const stamp = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    return csvResponse(toCsv(header, rows), `orders-${filter}-${stamp}.csv`);
}
