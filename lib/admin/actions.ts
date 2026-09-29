"use server";

/**
 * Admin mutations (Server Actions). Server Actions are public POST endpoints,
 * so every one of them re-checks the admin session first.
 */

import { refresh } from "next/cache";
import { getAdminSession } from "./auth";
import {
    availableServices,
    blueDartTrackingUrl,
    cancelShipments,
    checkPincode,
    cleanPhone,
    createManifest,
    createShipment,
    eshipzMissingConfig,
    getPod,
    ndrReattempt,
    ndrReturn,
    schedulePickup,
    type EshipzAddress,
    type ServiceOption,
} from "./eshipz";
import {
    cancelOrder,
    fulfillWithTracking,
    fulfillWithoutTracking,
    getOrder,
    markOrderPaid,
    setOrderArchived,
    updateOrderNoteTags,
    type CancelReason,
    shipmentReference,
    type OrderDetail,
} from "./shopify-admin";

export type ActionResult<T = object> = ({ ok: true } & T) | { ok: false; error: string };

async function guard(): Promise<string | null> {
    return (await getAdminSession()) ? null : "Your session expired — please sign in again.";
}

const fail = (err: unknown): { ok: false; error: string } => ({
    ok: false,
    error: err instanceof Error ? err.message : "Something went wrong.",
});

const EZ_ID = /^[A-Za-z0-9_-]{3,40}$/;
const AWB = /^[A-Za-z0-9-]{5,30}$/;

// ── Helpers ──────────────────────────────────────────────────────────────────

function shipToFromOrder(order: OrderDetail): EshipzAddress {
    const a = order.shippingAddress;
    if (!a) throw new Error("This order has no shipping address.");
    const street = [a.address1, a.address2].filter(Boolean).join(", ");
    return {
        contact_name: a.name ?? order.customer?.displayName ?? "Customer",
        company_name: a.company ?? "",
        // Blue Dart truncates long lines — split across street1/street2
        street1: (a.address1 ?? street).slice(0, 90),
        street2: (a.address2 ?? "").slice(0, 90),
        city: a.city ?? "",
        state: a.provinceCode ?? a.province ?? "",
        postal_code: (a.zip ?? "").replace(/\s/g, ""),
        country: "IN",
        type: "residential",
        phone: cleanPhone(a.phone ?? order.phone ?? order.customer?.phone),
        email: order.email ?? order.customer?.email ?? process.env.SHIP_FROM_EMAIL ?? "",
    };
}

function invoiceDate(iso: string): string {
    const d = new Date(iso);
    const p = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", day: "2-digit", month: "2-digit", year: "numeric" });
    return p.format(d); // DD/MM/YYYY
}

export interface ParcelInput {
    weightKg: number;
    length: number;
    width: number;
    height: number;
}

function validateParcel(p: ParcelInput): string | null {
    if (!(p.weightKg > 0 && p.weightKg <= 50)) return "Weight must be between 0 and 50 kg.";
    for (const v of [p.length, p.width, p.height]) if (!(v > 0 && v <= 200)) return "Box dimensions must be 1–200 cm.";
    return null;
}

// ── Actions ──────────────────────────────────────────────────────────────────

/** Pincode serviceability + Blue Dart services (with rates when eShipz returns them). */
export async function checkServicesAction(
    orderId: string,
    parcel: ParcelInput
): Promise<ActionResult<{ pincode: boolean | null; services: ServiceOption[] }>> {
    const denied = await guard();
    if (denied) return { ok: false, error: denied };
    const invalid = validateParcel(parcel);
    if (invalid) return { ok: false, error: invalid };

    try {
        const order = await getOrder(orderId);
        if (!order) return { ok: false, error: "Order not found." };
        const shipTo = shipToFromOrder(order);
        const [pincode, services] = await Promise.all([
            checkPincode(shipTo.postal_code).catch(() => null),
            availableServices({
                shipTo,
                weightKg: parcel.weightKg,
                box: parcel,
                value: Number(order.totalPriceSet?.shopMoney.amount ?? 0),
            }).catch(() => [] as ServiceOption[]),
        ]);
        return { ok: true, pincode, services };
    } catch (err) {
        return fail(err);
    }
}

export async function bookShipmentAction(
    orderId: string,
    input: ParcelInput & { serviceType: string; markFulfilled: boolean; notifyCustomer: boolean }
): Promise<ActionResult<{ awb: string; labelUrl: string | null; warning?: string }>> {
    const denied = await guard();
    if (denied) return { ok: false, error: denied };
    const missing = eshipzMissingConfig();
    if (missing.length) return { ok: false, error: `eShipz is not configured: add ${missing.join(", ")}.` };
    const invalid = validateParcel(input);
    if (invalid) return { ok: false, error: invalid };
    if (!/^[A-Za-z0-9_:.\- ]{2,60}$/.test(input.serviceType)) return { ok: false, error: "Pick a service type." };

    let order: OrderDetail | null;
    try {
        order = await getOrder(orderId);
    } catch (err) {
        return fail(err);
    }
    if (!order) return { ok: false, error: "Order not found." };
    if (order.cancelledAt) return { ok: false, error: "This order is cancelled." };

    let shipment;
    try {
        const shipTo = shipToFromOrder(order);
        if (shipTo.phone.length !== 10) return { ok: false, error: "The shipping address needs a valid 10-digit phone number." };
        if (!/^\d{6}$/.test(shipTo.postal_code)) return { ok: false, error: "The shipping address needs a valid 6-digit pincode." };

        const items = order.lineItems.nodes
            .filter((li) => li.requiresShipping !== false && li.quantity > 0)
            .map((li) => ({
                description: li.name.slice(0, 100),
                sku: li.sku ?? "",
                quantity: li.quantity,
                price: Number(li.originalUnitPriceSet?.shopMoney.amount ?? 0),
            }));

        shipment = await createShipment({
            reference: shipmentReference(order.name),
            invoiceNumber: shipmentReference(order.name),
            invoiceDate: invoiceDate(order.createdAt),
            serviceType: input.serviceType,
            contents: "Perfume",
            shipTo,
            weightKg: input.weightKg,
            box: { length: input.length, width: input.width, height: input.height },
            items,
            invoiceValue: Number(order.totalPriceSet?.shopMoney.amount ?? 0),
        });
    } catch (err) {
        return fail(err);
    }

    // The shipment exists now — a Shopify failure must not hide the AWB
    let warning: string | undefined;
    if (input.markFulfilled) {
        try {
            await fulfillWithTracking(
                orderId,
                { company: "Bluedart", number: shipment.awb, url: shipment.trackingLink ?? blueDartTrackingUrl(shipment.awb) },
                input.notifyCustomer
            );
        } catch (err) {
            warning = `Shipment booked, but Shopify wasn't updated: ${err instanceof Error ? err.message : "unknown error"}. Use “Sync to Shopify”.`;
        }
    }

    refresh();
    return { ok: true, awb: shipment.awb, labelUrl: shipment.labelUrl, warning };
}

export async function syncToShopifyAction(orderId: string, awb: string, notifyCustomer: boolean): Promise<ActionResult> {
    const denied = await guard();
    if (denied) return { ok: false, error: denied };
    if (!AWB.test(awb)) return { ok: false, error: "Invalid AWB." };
    try {
        await fulfillWithTracking(orderId, { company: "Bluedart", number: awb, url: blueDartTrackingUrl(awb) }, notifyCustomer);
        refresh();
        return { ok: true };
    } catch (err) {
        return fail(err);
    }
}

export async function cancelShipmentAction(eshipzOrderId: string): Promise<ActionResult> {
    const denied = await guard();
    if (denied) return { ok: false, error: denied };
    if (!EZ_ID.test(eshipzOrderId)) return { ok: false, error: "Invalid shipment id." };
    try {
        await cancelShipments([eshipzOrderId]);
        refresh();
        return { ok: true };
    } catch (err) {
        return fail(err);
    }
}

/** pickAt: "YYYY-MM-DDTHH:mm" in IST (from a datetime-local input). */
export async function schedulePickupAction(eshipzOrderIds: string[], pickAt: string): Promise<ActionResult> {
    const denied = await guard();
    if (denied) return { ok: false, error: denied };
    if (!eshipzOrderIds.length || eshipzOrderIds.length > 100 || !eshipzOrderIds.every((id) => EZ_ID.test(id))) {
        return { ok: false, error: "Select up to 100 shipments." };
    }
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(pickAt)) return { ok: false, error: "Pick a date and time." };
    if (new Date(`${pickAt}:00+05:30`).getTime() < Date.now() - 5 * 60_000) {
        return { ok: false, error: "Pickup time must be in the future." };
    }
    try {
        await schedulePickup(eshipzOrderIds, `${pickAt}:00`);
        refresh();
        return { ok: true };
    } catch (err) {
        return fail(err);
    }
}

export async function createManifestAction(
    eshipzOrderIds: string[]
): Promise<ActionResult<{ manifestId: string; userManifestId: string }>> {
    const denied = await guard();
    if (denied) return { ok: false, error: denied };
    if (!eshipzOrderIds.length || eshipzOrderIds.length > 200 || !eshipzOrderIds.every((id) => EZ_ID.test(id))) {
        return { ok: false, error: "Select up to 200 shipments." };
    }
    try {
        return { ok: true, ...(await createManifest(eshipzOrderIds)) };
    } catch (err) {
        return fail(err);
    }
}

export async function ndrAction(
    awb: string,
    action: "reattempt" | "return",
    opts: { date?: string; comments?: string }
): Promise<ActionResult> {
    const denied = await guard();
    if (denied) return { ok: false, error: denied };
    if (!AWB.test(awb)) return { ok: false, error: "Invalid AWB." };
    const comments = (opts.comments ?? "").slice(0, 250);
    try {
        if (action === "reattempt") {
            if (!opts.date || !/^\d{4}-\d{2}-\d{2}$/.test(opts.date)) return { ok: false, error: "Pick a re-attempt date." };
            const date = new Date(`${opts.date}T10:00:00+05:30`);
            if (date.getTime() < Date.now() - 86400_000) return { ok: false, error: "Re-attempt date must be today or later." };
            await ndrReattempt(awb, date, comments || "Re-attempt requested by merchant");
        } else {
            await ndrReturn(awb, comments || "Return to origin requested by merchant");
        }
        refresh();
        return { ok: true };
    } catch (err) {
        return fail(err);
    }
}

export async function podAction(awb: string): Promise<ActionResult<{ url: string }>> {
    const denied = await guard();
    if (denied) return { ok: false, error: denied };
    if (!AWB.test(awb)) return { ok: false, error: "Invalid AWB." };
    try {
        const url = await getPod(awb);
        return url ? { ok: true, url } : { ok: false, error: "Proof of delivery isn't available yet." };
    } catch (err) {
        return fail(err);
    }
}

// ── Order status ─────────────────────────────────────────────────────────────

const ORDER_ID = /^\d{1,20}$/;
const CANCEL_REASONS: CancelReason[] = ["CUSTOMER", "PAYMENT_DECLINED", "FRAUD", "INVENTORY", "STAFF_ERROR", "OTHER"];

export async function cancelOrderAction(
    orderId: string,
    opts: { reason: CancelReason; refund: boolean; restock: boolean; notifyCustomer: boolean; staffNote: string }
): Promise<ActionResult> {
    const denied = await guard();
    if (denied) return { ok: false, error: denied };
    if (!ORDER_ID.test(orderId)) return { ok: false, error: "Invalid order." };
    if (!CANCEL_REASONS.includes(opts.reason)) return { ok: false, error: "Pick a cancellation reason." };
    try {
        await cancelOrder(orderId, {
            reason: opts.reason,
            refund: !!opts.refund,
            restock: !!opts.restock,
            notifyCustomer: !!opts.notifyCustomer,
            staffNote: String(opts.staffNote ?? "").slice(0, 255),
        });
        // Shopify cancels in a background job — give it a moment before re-reading
        await new Promise((r) => setTimeout(r, 1500));
        refresh();
        return { ok: true };
    } catch (err) {
        return fail(err);
    }
}

export async function archiveOrderAction(orderId: string, archived: boolean): Promise<ActionResult> {
    const denied = await guard();
    if (denied) return { ok: false, error: denied };
    if (!ORDER_ID.test(orderId)) return { ok: false, error: "Invalid order." };
    try {
        await setOrderArchived(orderId, !!archived);
        refresh();
        return { ok: true };
    } catch (err) {
        return fail(err);
    }
}

export async function markPaidAction(orderId: string): Promise<ActionResult> {
    const denied = await guard();
    if (denied) return { ok: false, error: denied };
    if (!ORDER_ID.test(orderId)) return { ok: false, error: "Invalid order." };
    try {
        await markOrderPaid(orderId);
        refresh();
        return { ok: true };
    } catch (err) {
        return fail(err);
    }
}

export async function fulfillManuallyAction(orderId: string, notifyCustomer: boolean): Promise<ActionResult> {
    const denied = await guard();
    if (denied) return { ok: false, error: denied };
    if (!ORDER_ID.test(orderId)) return { ok: false, error: "Invalid order." };
    try {
        await fulfillWithoutTracking(orderId, !!notifyCustomer);
        refresh();
        return { ok: true };
    } catch (err) {
        return fail(err);
    }
}

export async function updateNoteTagsAction(orderId: string, note: string, tags: string): Promise<ActionResult> {
    const denied = await guard();
    if (denied) return { ok: false, error: denied };
    if (!ORDER_ID.test(orderId)) return { ok: false, error: "Invalid order." };
    const tagList = [...new Set(String(tags ?? "").split(",").map((t) => t.trim()).filter(Boolean))].slice(0, 50);
    if (tagList.some((t) => t.length > 40)) return { ok: false, error: "Each tag must be 40 characters or less." };
    try {
        await updateOrderNoteTags(orderId, String(note ?? "").slice(0, 5000), tagList);
        refresh();
        return { ok: true };
    } catch (err) {
        return fail(err);
    }
}
