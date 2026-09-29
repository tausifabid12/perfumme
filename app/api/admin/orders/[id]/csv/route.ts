/**
 * GET /api/admin/orders/:id/csv — everything about one order as a CSV
 * (one row per line item; order, customer, payment and shipping columns repeat).
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { csvResponse, toCsv } from "@/lib/admin/csv";
import { eshipzMissingConfig, isCancelled, shipmentsForOrder } from "@/lib/admin/eshipz";
import { formatDate } from "@/lib/admin/format";
import { getPhonePeStatuses, primaryAttempt } from "@/lib/admin/phonepe";
import { getOrder, orderAwbs, phonePeOrderIds, shipmentReference } from "@/lib/admin/shopify-admin";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;

    const order = await getOrder(id).catch(() => null);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // Payment + shipping are best-effort: the CSV still downloads if a provider is down
    const phonePeIds = phonePeOrderIds(order.transactions);
    const [phonePe, shipments] = await Promise.all([
        getPhonePeStatuses(phonePeIds).catch(() => new Map()),
        eshipzMissingConfig().length
            ? Promise.resolve([])
            : shipmentsForOrder(shipmentReference(order.name), orderAwbs(order)).catch(() => []),
    ]);
    const pp = phonePeIds[0] ? phonePe.get(phonePeIds[0]) : undefined;
    const ppData = pp?.ok ? pp.data : undefined;
    const attempt = ppData ? primaryAttempt(ppData) : undefined;
    const shipment = shipments.find((s) => !isCancelled(s)) ?? shipments[0];

    const m = (set: { shopMoney: { amount: string } } | null) => set?.shopMoney.amount ?? "";
    const a = order.shippingAddress;

    const orderCols = [
        order.name,
        formatDate(order.createdAt),
        order.cancelledAt ? "Cancelled" : order.displayFinancialStatus,
        order.displayFulfillmentStatus,
        order.customer?.displayName ?? a?.name ?? "",
        order.customer?.email ?? order.email ?? "",
        a?.phone ?? order.phone ?? order.customer?.phone ?? "",
        [a?.address1, a?.address2].filter(Boolean).join(", "),
        a?.city,
        a?.province,
        a?.zip,
        a?.country,
        m(order.subtotalPriceSet),
        m(order.totalDiscountsSet),
        order.discountCodes.join(" "),
        m(order.totalShippingPriceSet),
        m(order.totalTaxSet),
        m(order.totalPriceSet),
        m(order.totalRefundedSet),
        order.totalPriceSet?.shopMoney.currencyCode,
        order.paymentGatewayNames.join(" | "),
        phonePeIds[0] ?? "",
        ppData?.state ?? "",
        ppData?.orderId ?? "",
        attempt?.transactionId ?? "",
        attempt?.rail?.utr ?? "",
        attempt?.paymentMode ?? "",
        shipment?.awb ?? order.fulfillments.flatMap((f) => f.trackingInfo.map((t) => t.number)).filter(Boolean).join(" "),
        shipment?.tracking_status ?? "",
        shipment?.service_type ?? "",
        order.note ?? "",
        order.tags.join(" "),
    ];

    const header = [
        "Order", "Date", "Payment status", "Fulfillment status",
        "Customer", "Email", "Phone", "Address", "City", "State", "Pincode", "Country",
        "Subtotal", "Discount", "Discount codes", "Shipping", "Tax", "Total", "Refunded", "Currency",
        "Gateway", "PhonePe merchant order id", "PhonePe status", "PhonePe order id", "PhonePe transaction id", "UTR", "Payment mode",
        "AWB", "Shipment status", "Blue Dart service",
        "Note", "Tags",
        "Item", "SKU", "Quantity", "Unit price", "Line total",
    ];

    const rows = order.lineItems.nodes.map((li) => [
        ...orderCols,
        li.name,
        li.sku ?? "",
        li.quantity,
        m(li.originalUnitPriceSet),
        m(li.discountedTotalSet),
    ]);

    return csvResponse(toCsv(header, rows), `order-${order.name.replace("#", "")}.csv`);
}
