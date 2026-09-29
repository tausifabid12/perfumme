/**
 * eShipz client — Blue Dart shipping (server only).
 * ──────────────────────────────────────────────────
 * Docs: https://apidocs.eshipz.com  ·  Auth: static X-API-TOKEN header.
 * Rate limit: 300 requests / 2 min.
 *
 * Env:
 *   ESHIPZ_API_TOKEN          required — from eShipz (hello@eshipz.com)
 *   ESHIPZ_VENDOR_ID          optional — Blue Dart shipper account id. When blank it's
 *                             discovered from /api/v2/services (which returns vendor_id
 *                             for each courier account linked to the API token).
 *                             (app.eshipz.com → Integrations → Shipper accounts)
 *   ESHIPZ_SERVICE_PREPAID    default "eTailPrePaidAir" (all orders are prepaid — no COD)
 *   ESHIPZ_BASE_URL           default "https://app.eshipz.com"
 *   ESHIPZ_DEFAULT_WEIGHT_KG  default 0.5 — used when products have no weight
 *   ESHIPZ_DEFAULT_BOX_CM     default "20x15x10" (L x W x H)
 *   SHIP_FROM_NAME, SHIP_FROM_COMPANY, SHIP_FROM_PHONE, SHIP_FROM_EMAIL,
 *   SHIP_FROM_STREET1, SHIP_FROM_STREET2, SHIP_FROM_CITY, SHIP_FROM_STATE,
 *   SHIP_FROM_PINCODE, SHIP_FROM_GSTIN   — pickup (and RTO) address
 */

const BASE = (process.env.ESHIPZ_BASE_URL || "https://app.eshipz.com").replace(/\/$/, "");
export const SLUG = "bluedart";

export const eshipzConfig = {
    vendorId: process.env.ESHIPZ_VENDOR_ID ?? "",
    servicePrepaid: process.env.ESHIPZ_SERVICE_PREPAID || "eTailPrePaidAir",
    defaultWeightKg: Number(process.env.ESHIPZ_DEFAULT_WEIGHT_KG ?? 0.5) || 0.5,
    defaultBox: (() => {
        const [l, w, h] = (process.env.ESHIPZ_DEFAULT_BOX_CM || "20x15x10").split(/x/i).map(Number);
        return { length: l || 20, width: w || 15, height: h || 10 };
    })(),
};

/** Which settings are missing, so the UI can explain exactly what to add. */
export function eshipzMissingConfig(): string[] {
    const required = [
        "ESHIPZ_API_TOKEN",
        "SHIP_FROM_NAME",
        "SHIP_FROM_PHONE",
        "SHIP_FROM_EMAIL",
        "SHIP_FROM_STREET1",
        "SHIP_FROM_CITY",
        "SHIP_FROM_STATE",
        "SHIP_FROM_PINCODE",
    ];
    return required.filter((k) => !process.env[k]);
}

export class EshipzError extends Error {}

async function eshipzFetch<T>(path: string, init: { method?: "GET" | "POST"; body?: unknown } = {}): Promise<T> {
    const token = process.env.ESHIPZ_API_TOKEN;
    if (!token) throw new EshipzError("eShipz is not connected (ESHIPZ_API_TOKEN missing).");

    const res = await fetch(`${BASE}${path}`, {
        method: init.method ?? "GET",
        headers: { "Content-Type": "application/json", "X-API-TOKEN": token },
        body: init.body === undefined ? undefined : JSON.stringify(init.body),
        cache: "no-store",
    });

    const text = await res.text();
    let json: unknown = null;
    try {
        json = text ? JSON.parse(text) : null;
    } catch {
        /* non-JSON body */
    }

    if (!res.ok) {
        if (res.status === 429) throw new EshipzError("eShipz rate limit reached — wait a minute and retry.");
        if (res.status === 401 || res.status === 403) throw new EshipzError("eShipz rejected the API token.");
        throw new EshipzError(extractMessage(json) ?? `eShipz error ${res.status}`);
    }
    return json as T;
}

/** eShipz errors come in a few shapes; pull out something human readable. */
function extractMessage(json: unknown): string | null {
    if (!json || typeof json !== "object") return null;
    const j = json as Record<string, unknown>;
    const meta = j.meta as { message?: string; details?: unknown[] } | undefined;
    const details = meta?.details?.map((d) => (typeof d === "string" ? d : JSON.stringify(d))).join("; ");
    return (
        [meta?.message !== "OK" ? meta?.message : null, details].filter(Boolean).join(" — ") ||
        (j.message as string) ||
        (j.remarks as string) ||
        (j.error as string) ||
        null
    );
}

// ── Addresses ────────────────────────────────────────────────────────────────

export interface EshipzAddress {
    contact_name: string;
    company_name: string;
    street1: string;
    street2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    type: "residential" | "business";
    phone: string;
    email: string;
    tax_id?: string;
}

/** Indian mobile numbers: carriers want the plain 10 digits. */
export const cleanPhone = (phone: string | null | undefined) => (phone ?? "").replace(/\D/g, "").slice(-10);

export function shipFromAddress(): EshipzAddress {
    const e = process.env;
    return {
        contact_name: e.SHIP_FROM_NAME ?? "",
        company_name: e.SHIP_FROM_COMPANY ?? "",
        street1: e.SHIP_FROM_STREET1 ?? "",
        street2: e.SHIP_FROM_STREET2 ?? "",
        city: e.SHIP_FROM_CITY ?? "",
        state: e.SHIP_FROM_STATE ?? "",
        postal_code: e.SHIP_FROM_PINCODE ?? "",
        country: "IN",
        type: "business",
        phone: cleanPhone(e.SHIP_FROM_PHONE),
        email: e.SHIP_FROM_EMAIL ?? "",
        tax_id: e.SHIP_FROM_GSTIN ?? "",
    };
}

// ── Shipments ────────────────────────────────────────────────────────────────

export interface CreateShipmentInput {
    reference: string; // customer_reference — ties the shipment to the Shopify order
    invoiceNumber: string;
    invoiceDate: string; // DD/MM/YYYY
    serviceType: string;
    contents: string;
    shipTo: EshipzAddress;
    weightKg: number;
    box: { length: number; width: number; height: number };
    items: { description: string; sku: string; quantity: number; price: number }[];
    invoiceValue: number;
}

export interface CreatedShipment {
    orderId: string; // eShipz id, e.g. EZ83935484
    awb: string;
    labelUrl: string | null;
    trackingLink: string | null;
    status: string;
}

export async function createShipment(input: CreateShipmentInput): Promise<CreatedShipment> {
    const from = shipFromAddress();
    const body = {
        billing: { paid_by: "shipper" },
        vendor_id: await getVendorId(),
        description: "BlueDart",
        slug: SLUG,
        purpose: "commercial",
        order_source: "shopify",
        parcel_contents: input.contents,
        is_document: false,
        service_type: input.serviceType,
        charged_weight: { unit: "KG", value: input.weightKg },
        customer_reference: input.reference,
        invoice_number: input.invoiceNumber,
        invoice_date: input.invoiceDate,
        // Store is prepaid-only
        is_cod: false,
        collect_on_delivery: { amount: 0, currency: "INR" },
        shipment: {
            ship_from: from,
            ship_to: input.shipTo,
            return_to: from,
            eWaybillNumber: "",
            is_reverse: false,
            is_to_pay: false,
            parcels: [
                {
                    description: input.contents,
                    box_type: "custom",
                    quantity: 1,
                    weight: { value: input.weightKg, unit: "kg" },
                    dimension: { ...input.box, unit: "cm" },
                    items: input.items.map((it) => ({
                        description: it.description,
                        origin_country: "IN",
                        sku: it.sku,
                        hs_code: "",
                        variant: "",
                        quantity: it.quantity,
                        price: { amount: it.price, currency: "INR" },
                    })),
                },
            ],
        },
        gst_invoices: [],
    };

    const res = await eshipzFetch<{
        data?: {
            order_id?: string;
            status?: string;
            tracking_link?: string;
            tracking_numbers?: string[];
            files?: { label?: { label_meta?: { awb?: string; url?: string } } };
        };
        meta?: { code?: number; message?: string; details?: unknown[] };
    }>("/api/v1/create-shipments", { method: "POST", body });

    const data = res.data;
    const awb = data?.tracking_numbers?.[0] ?? data?.files?.label?.label_meta?.awb;
    if (!data?.order_id || !awb) {
        throw new EshipzError(extractMessage(res) ?? "Blue Dart did not return an AWB for this shipment.");
    }
    return {
        orderId: data.order_id,
        awb,
        labelUrl: data.files?.label?.label_meta?.url ?? null,
        trackingLink: data.tracking_link || null,
        status: data.status ?? "created",
    };
}

export interface EshipzShipment {
    order_id: string;
    awb: string;
    active?: boolean;
    slug?: string;
    vendor_display_name?: string;
    service_type?: string;
    customer_referenc?: string; // (sic) — eShipz spells it this way
    creation_date?: string;
    tracking_status?: string;
    order_status?: string;
    tracking_link?: string;
    label_meta?: { awb?: string; url?: string };
    pickup_meta?: { pickup_request?: boolean; data?: unknown[] };
    charge_weight?: { unit?: string; value?: number };
    invoice_details?: { amount?: number };
    order_details?: { receiver_address?: { contact_name?: string; city?: string; postal_code?: string } };
}

export async function listShipments(opts: {
    page?: number;
    limit?: number;
    minDate?: string;
    maxDate?: string;
    awb?: string;
    orderId?: string;
}): Promise<EshipzShipment[]> {
    const params = new URLSearchParams({ page: String(opts.page ?? 1), limit: String(opts.limit ?? 25) });
    if (opts.minDate) params.set("min_date", opts.minDate);
    if (opts.maxDate) params.set("max_date", opts.maxDate);
    if (opts.awb) params.set("awb", opts.awb);
    if (opts.orderId) params.set("order_id", opts.orderId);
    const res = await eshipzFetch<EshipzShipment[] | { data?: EshipzShipment[] }>(`/api/v1/get-shipments?${params}`);
    return Array.isArray(res) ? res : res?.data ?? [];
}

/** All shipments booked for one Shopify order (newest first). */
export async function shipmentsForOrder(reference: string, awbs: string[]): Promise<EshipzShipment[]> {
    const lists = await Promise.all([
        listShipments({ orderId: reference, limit: 20 }),
        ...awbs.map((awb) => listShipments({ awb, limit: 5 })),
    ]);
    const byId = new Map<string, EshipzShipment>();
    for (const s of lists.flat()) {
        // order_id filter may match loosely — keep only this order's shipments
        const ref = s.customer_referenc;
        if (ref && ref !== reference && !awbs.includes(s.awb)) continue;
        byId.set(s.order_id, s);
    }
    return [...byId.values()].sort(
        (a, b) => new Date(b.creation_date ?? 0).getTime() - new Date(a.creation_date ?? 0).getTime()
    );
}

export async function cancelShipments(eshipzOrderIds: string[]): Promise<void> {
    await eshipzFetch("/api/v1/cancel", { method: "POST", body: { order_id: eshipzOrderIds } });
}

/** pickAt: local IST time "YYYY-MM-DDTHH:mm:ss" */
export async function schedulePickup(eshipzOrderIds: string[], pickAt: string): Promise<void> {
    await eshipzFetch("/api/v1/pickup", {
        method: "POST",
        body: { vendor_id: await getVendorId(), pick_datetime: pickAt, order_id: eshipzOrderIds, slug: SLUG },
    });
}

export async function createManifest(eshipzOrderIds: string[]): Promise<{ manifestId: string; userManifestId: string }> {
    const res = await eshipzFetch<{ manifest_id?: string; user_manifest_id?: string }>("/manifest/manifest_orders", {
        method: "POST",
        body: { order_ids: eshipzOrderIds },
    });
    if (!res?.manifest_id) throw new EshipzError(extractMessage(res) ?? "Manifest was not created.");
    return { manifestId: res.manifest_id, userManifestId: res.user_manifest_id ?? res.manifest_id };
}

/** The manifest PDF endpoint needs the token, so we proxy it (see /api/admin/eshipz/manifest). */
export async function fetchManifestPdf(manifestId: string): Promise<Response> {
    return fetch(`${BASE}/manifest/create-manifest?manifest_id=${encodeURIComponent(manifestId)}`, {
        headers: { "x-api-token": process.env.ESHIPZ_API_TOKEN ?? "" },
        cache: "no-store",
    });
}

// ── Tracking ─────────────────────────────────────────────────────────────────

export interface TrackingCheckpoint {
    city?: string;
    date: string;
    remark?: string;
    tag?: string;
    subtag?: string;
}

export interface Tracking {
    tag?: string; // Delivered, InTransit, OutForDelivery, Exception, InfoReceived, …
    tracking_number: string;
    expected_delivery_date?: string | null;
    delivery_date?: string | null;
    pod_link?: string | null;
    checkpoints: TrackingCheckpoint[];
}

export async function getTracking(awb: string): Promise<Tracking | null> {
    const res = await eshipzFetch<Tracking[] | Tracking>("/api/v2/trackings", { method: "POST", body: { track_id: awb } });
    const t = Array.isArray(res) ? res[0] : res;
    return t ? { ...t, checkpoints: t.checkpoints ?? [] } : null;
}

export async function getPod(awb: string): Promise<string | null> {
    const res = await eshipzFetch<{ data?: { url?: string } }>("/api/v1/getPOD", { method: "POST", body: { awb } });
    return res?.data?.url ?? null;
}

// ── Serviceability & services ────────────────────────────────────────────────

/** Whether Blue Dart delivers prepaid parcels to this pincode (null = unknown). */
export async function checkPincode(destination: string): Promise<boolean | null> {
    const res = await eshipzFetch<{ data?: { prepaid_delivery?: boolean } }>(
        "/api/v1/pincode-serviceability",
        { method: "POST", body: { origin_zip: process.env.SHIP_FROM_PINCODE ?? "", destination_zip: destination } }
    );
    if (!res?.data) return null;
    return !!res.data.prepaid_delivery;
}

export interface ServiceOption {
    serviceType: string;
    available: boolean;
    error?: string | null;
    charge?: number | null;
    transitTime?: string | null;
}

type ServicesRate = {
    vendor_id?: string;
    slug?: string;
    code?: number;
    description?: string;
    technicality?: {
        service_type?: string;
        error_message?: string | null;
        total_charge?: { amount?: number | string | null };
        transit_time?: string | null;
    }[];
};

async function servicesRequest(opts: {
    shipTo: EshipzAddress;
    weightKg: number;
    box: { length: number; width: number; height: number };
    value: number;
}): Promise<ServicesRate[]> {
    const from = shipFromAddress();
    const res = await eshipzFetch<{ data?: { rates?: ServicesRate[] } }>("/api/v2/services", {
        method: "POST",
        body: {
            is_document: false,
            shipment: {
                is_reverse: false,
                purpose: "commercial",
                is_cod: false,
                collect_on_delivery: { amount: 0, currency: "INR" },
                ship_from: from,
                ship_to: opts.shipTo,
                return_to: from,
                parcels: [
                    {
                        description: "Perfume",
                        box_type: "custom",
                        weight: { value: opts.weightKg, unit: "kg" },
                        dimension: { ...opts.box, unit: "cm" },
                        items: [
                            {
                                description: "Perfume",
                                origin_country: "IN",
                                quantity: 1,
                                price: { amount: opts.value, currency: "INR" },
                                weight: { unit: "kg", value: opts.weightKg },
                            },
                        ],
                    },
                ],
            },
        },
    });
    return res?.data?.rates ?? [];
}

/** Our Blue Dart account among the carrier accounts eShipz returns. */
function pickBlueDartRate(rates: ServicesRate[]): ServicesRate | undefined {
    if (eshipzConfig.vendorId) return rates.find((r) => r.vendor_id === eshipzConfig.vendorId);
    const blueDart = rates.filter((r) => r.slug === SLUG && r.vendor_id);
    return blueDart.find((r) => r.code === 200) ?? blueDart[0];
}

let discoveredVendorId: string | null = null;

/**
 * Blue Dart vendor_id: ESHIPZ_VENDOR_ID if set, otherwise looked up once from
 * eShipz (a service check on our own pickup lane) and cached in memory.
 */
export async function getVendorId(): Promise<string> {
    if (eshipzConfig.vendorId) return eshipzConfig.vendorId;
    if (discoveredVendorId) return discoveredVendorId;

    const rates = await servicesRequest({
        shipTo: { ...shipFromAddress(), type: "residential" },
        weightKg: eshipzConfig.defaultWeightKg,
        box: eshipzConfig.defaultBox,
        value: 1000,
    });
    const rate = pickBlueDartRate(rates);
    if (!rate?.vendor_id) {
        throw new EshipzError(
            "No Blue Dart account is linked to this eShipz API token. Connect Blue Dart in the eShipz dashboard (or set ESHIPZ_VENDOR_ID)."
        );
    }
    discoveredVendorId = rate.vendor_id;
    return rate.vendor_id;
}

/** Blue Dart service types available for this lane, from our Blue Dart account. */
export async function availableServices(opts: {
    shipTo: EshipzAddress;
    weightKg: number;
    box: { length: number; width: number; height: number };
    value: number;
}): Promise<ServiceOption[]> {
    const rate = pickBlueDartRate(await servicesRequest(opts));
    if (rate?.vendor_id && !eshipzConfig.vendorId) discoveredVendorId ??= rate.vendor_id;
    return (rate?.technicality ?? [])
        .filter((t) => t.service_type)
        .map((t) => ({
            serviceType: t.service_type!,
            available: !t.error_message,
            error: t.error_message,
            charge: t.total_charge?.amount != null && t.total_charge.amount !== "" ? Number(t.total_charge.amount) : null,
            transitTime: t.transit_time ?? null,
        }));
}

// ── NDR (failed delivery) ────────────────────────────────────────────────────

export async function ndrReattempt(awb: string, date: Date, comments: string): Promise<void> {
    await eshipzFetch("/alt-instruction/api/v1/ndr-request", {
        method: "POST",
        body: [{ waybill: awb, slug: SLUG, action: "RE-ATTEMPT", comments, action_data: { deferred_date: date.getTime() } }],
    });
}

export async function ndrReturn(awb: string, comments: string): Promise<void> {
    await eshipzFetch("/alt-instruction/api/v1/ndr-request", {
        method: "POST",
        body: [{ waybill: awb, slug: SLUG, action: "RETURN", comments }],
    });
}

// ── Status helpers ───────────────────────────────────────────────────────────

export const blueDartTrackingUrl = (awb: string) =>
    `https://www.bluedart.com/web/guest/trackdartresultthirdparty?trackFor=0&trackNo=${encodeURIComponent(awb)}`;

export function isCancelled(s: Pick<EshipzShipment, "active" | "order_status" | "tracking_status">): boolean {
    return s.active === false || /cancel/i.test(`${s.order_status ?? ""} ${s.tracking_status ?? ""}`);
}

export function isException(tag: string | null | undefined): boolean {
    return /exception|attemptfail|undeliver|ndr/i.test(tag ?? "");
}
