export type Tone = "green" | "amber" | "red" | "blue" | "neutral" | "violet";

const TZ = "Asia/Kolkata";

export function formatMoney(amount: string | number | null | undefined, currency = "INR"): string {
    const n = Number(amount ?? 0);
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: n % 1 === 0 ? 0 : 2,
    }).format(n);
}

export const paiseToRupees = (paise: number | undefined) => (paise ?? 0) / 100;

export function formatDate(value: string | number | Date, withTime = true): string {
    return new Date(value).toLocaleString("en-IN", {
        timeZone: TZ,
        day: "numeric",
        month: "short",
        year: "numeric",
        ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
    });
}

export function timeAgo(value: string | number | Date): string {
    const diff = (Date.now() - new Date(value).getTime()) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
    return formatDate(value, false);
}

export function humanize(value: string | null | undefined): string {
    if (!value) return "—";
    return value
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase());
}

export function financialTone(status: string | null | undefined): Tone {
    switch (status) {
        case "PAID":
            return "green";
        case "PENDING":
        case "AUTHORIZED":
        case "PARTIALLY_PAID":
            return "amber";
        case "REFUNDED":
        case "PARTIALLY_REFUNDED":
            return "violet";
        case "VOIDED":
        case "EXPIRED":
            return "red";
        default:
            return "neutral";
    }
}

export function fulfillmentTone(status: string | null | undefined): Tone {
    switch (status) {
        case "FULFILLED":
            return "green";
        case "UNFULFILLED":
        case "ON_HOLD":
            return "amber";
        case "PARTIALLY_FULFILLED":
        case "IN_PROGRESS":
        case "SCHEDULED":
        case "PENDING_FULFILLMENT":
            return "blue";
        case "RESTOCKED":
            return "red";
        default:
            return "neutral";
    }
}

export function phonePeTone(state: string | null | undefined): Tone {
    switch (state) {
        case "COMPLETED":
            return "green";
        case "PENDING":
            return "amber";
        case "FAILED":
            return "red";
        default:
            return "neutral";
    }
}

export function txTone(status: string | null | undefined): Tone {
    switch (status) {
        case "SUCCESS":
            return "green";
        case "PENDING":
        case "AWAITING_RESPONSE":
            return "amber";
        case "FAILURE":
        case "ERROR":
            return "red";
        default:
            return "neutral";
    }
}

/** Shopify event messages are small HTML fragments. */
export const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();

/** eShipz / Blue Dart tracking tags (Delivered, InTransit, OutForDelivery, Exception, …). */
export function trackingTone(tag: string | null | undefined): Tone {
    const t = (tag ?? "").toLowerCase();
    if (t.includes("cancel")) return "neutral";
    if (t.includes("rto") || t.includes("return")) return "violet";
    if (t === "delivered") return "green";
    if (/exception|attemptfail|undeliver|failed|lost|damage/.test(t)) return "red";
    if (/outfordelivery|intransit|pickedup|picked/.test(t)) return "blue";
    if (/inforeceived|pending|created|booked|manifest/.test(t)) return "amber";
    return "neutral";
}

/** "OutForDelivery" → "Out for delivery" */
export const tagLabel = (tag: string | null | undefined) =>
    tag ? humanize(tag.replace(/([a-z])([A-Z])/g, "$1_$2")) : "—";
