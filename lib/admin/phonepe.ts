/**
 * PhonePe PG (v2 / Standard Checkout) client — server only.
 * ─────────────────────────────────────────────────────────
 * Auth: OAuth client credentials (PHONEPE_CLIENT_ID / PHONEPE_CLIENT_SECRET),
 * token cached in memory until shortly before expiry.
 * Amounts from PhonePe are in paisa.
 *
 * Optional env:
 *   PHONEPE_CLIENT_VERSION  (default "1")
 *   PHONEPE_ENV             "production" (default) | "sandbox"
 */

const SANDBOX = process.env.PHONEPE_ENV === "sandbox";
const AUTH_URL = SANDBOX
    ? "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token"
    : "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";
const PG_BASE = SANDBOX
    ? "https://api-preprod.phonepe.com/apis/pg-sandbox"
    : "https://api.phonepe.com/apis/pg";

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
    if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;

    const clientId = process.env.PHONEPE_CLIENT_ID;
    const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
    if (!clientId || !clientSecret) throw new Error("PhonePe credentials are not configured.");

    const res = await fetch(AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: clientId,
            client_version: process.env.PHONEPE_CLIENT_VERSION ?? "1",
            client_secret: clientSecret,
            grant_type: "client_credentials",
        }),
        cache: "no-store",
    });
    if (!res.ok) throw new Error(`PhonePe auth failed (${res.status})`);

    const json = (await res.json()) as { access_token: string; expires_at?: number };
    const expiresAt = json.expires_at ? json.expires_at * 1000 : Date.now() + 55 * 60_000;
    cachedToken = { value: json.access_token, expiresAt: expiresAt - 60_000 };
    return json.access_token;
}

export interface PhonePeInstrument {
    type?: string;
    maskedAccountNumber?: string;
    maskedCardNumber?: string;
    accountType?: string;
    accountHolderName?: string;
    bankId?: string;
    cardNetwork?: string;
    ifsc?: string;
}

export interface PhonePeRail {
    type?: string;
    utr?: string;
    upiTransactionId?: string;
    vpa?: string;
    authorizationCode?: string;
    serviceTransactionId?: string;
}

export interface PhonePePaymentAttempt {
    transactionId: string;
    paymentMode: string;
    timestamp: number;
    amount: number;
    feeAmount?: number;
    state: "PENDING" | "COMPLETED" | "FAILED" | string;
    errorCode?: string;
    detailedErrorCode?: string;
    instrument?: PhonePeInstrument;
    rail?: PhonePeRail;
}

export interface PhonePeOrderStatus {
    merchantId?: string;
    merchantOrderId?: string;
    orderId: string;
    state: "PENDING" | "COMPLETED" | "FAILED" | string;
    amount: number;
    payableAmount?: number;
    feeAmount?: number;
    currency?: string;
    expireAt?: number;
    errorCode?: string;
    detailedErrorCode?: string;
    errorContext?: { description?: string; source?: string; stage?: string };
    paymentDetails?: PhonePePaymentAttempt[];
}

export type PhonePeResult =
    | { ok: true; merchantOrderId: string; data: PhonePeOrderStatus }
    | { ok: false; merchantOrderId: string; error: string; notFound?: boolean };

export async function getPhonePeOrderStatus(merchantOrderId: string): Promise<PhonePeResult> {
    const id = merchantOrderId.trim();
    if (!/^[A-Za-z0-9_\-]{1,63}$/.test(id)) {
        return { ok: false, merchantOrderId: id, error: "Invalid merchant order id" };
    }

    try {
        const res = await fetch(
            `${PG_BASE}/checkout/v2/order/${encodeURIComponent(id)}/status?details=true&errorContext=true`,
            {
                headers: { "Content-Type": "application/json", Authorization: `O-Bearer ${await getToken()}` },
                cache: "no-store",
            }
        );
        const json = await res.json().catch(() => ({}));

        if (res.status === 401) cachedToken = null;
        if (!res.ok || json.success === false) {
            const notFound = json.code === "ORDER_NOT_FOUND" || res.status === 404;
            return {
                ok: false,
                merchantOrderId: id,
                notFound,
                error: notFound ? "No PhonePe order with this id" : json.message ?? `PhonePe error ${res.status}`,
            };
        }
        return { ok: true, merchantOrderId: id, data: json as PhonePeOrderStatus };
    } catch (err) {
        console.error("PhonePe status failed:", err);
        return { ok: false, merchantOrderId: id, error: err instanceof Error ? err.message : "PhonePe is unreachable" };
    }
}

/** Run lookups with limited concurrency so we don't hammer PhonePe. */
export async function getPhonePeStatuses(ids: string[], concurrency = 5): Promise<Map<string, PhonePeResult>> {
    const out = new Map<string, PhonePeResult>();
    const queue = [...new Set(ids)];
    await Promise.all(
        Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
            for (let id = queue.shift(); id; id = queue.shift()) out.set(id, await getPhonePeOrderStatus(id));
        })
    );
    return out;
}

/** The attempt that actually succeeded, or the latest one. */
export function primaryAttempt(status: PhonePeOrderStatus): PhonePePaymentAttempt | undefined {
    const attempts = status.paymentDetails ?? [];
    return attempts.find((a) => a.state === "COMPLETED") ?? [...attempts].sort((a, b) => b.timestamp - a.timestamp)[0];
}
