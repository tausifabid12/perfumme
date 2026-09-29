/**
 * Shopify Admin GraphQL API client (server only).
 * ───────────────────────────────────────────────
 * Auth: client-credentials grant with SHOPIFY_CLIENT_ID / SHOPIFY_CLIENT_SECRET
 * (token valid ~24 h, cached in memory). Falls back to SHOPIFY_ADMIN_ACCESS_TOKEN
 * if the client credentials are missing. The app needs read_orders +
 * read_all_orders (orders older than 60 days).
 */

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "";
const API_VERSION = process.env.SHOPIFY_ADMIN_API_VERSION ?? "2026-07";

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAdminToken(): Promise<string> {
    if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;

    const clientId = process.env.SHOPIFY_CLIENT_ID;
    const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

    if (clientId && clientSecret) {
        const res = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                grant_type: "client_credentials",
                client_id: clientId,
                client_secret: clientSecret,
            }),
            cache: "no-store",
        });
        if (res.ok) {
            const json = (await res.json()) as { access_token: string; expires_in?: number };
            // Refresh 5 minutes before Shopify expires it
            const ttl = ((json.expires_in ?? 86400) - 300) * 1000;
            cachedToken = { value: json.access_token, expiresAt: Date.now() + ttl };
            return json.access_token;
        }
        console.error("Shopify client-credentials grant failed:", res.status, await res.text());
    }

    const staticToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    if (staticToken) return staticToken;
    throw new Error("Shopify Admin API credentials are not configured.");
}

export async function adminFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
    if (!DOMAIN) throw new Error("NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is not set.");

    const res = await fetch(`https://${DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": await getAdminToken(),
        },
        body: JSON.stringify({ query, variables }),
        cache: "no-store",
    });

    if (res.status === 401) cachedToken = null;
    if (!res.ok) {
        const detail = (await res.text().catch(() => "")).replace(/\s+/g, " ").slice(0, 200);
        if (res.status === 402) {
            throw new Error(
                `Shopify says the store is unavailable (402 Payment Required) — check Settings → Billing / Plan in Shopify admin. ${detail}`
            );
        }
        throw new Error(`Shopify Admin API ${res.status} ${res.statusText} ${detail}`.trim());
    }

    const json = await res.json();
    // Field-level access errors (e.g. protected customer data) still return the
    // rest of the order — only fail when nothing came back.
    if (json.errors?.length) {
        if (!json.data) throw new Error(json.errors[0].message);
        console.warn("Shopify Admin API partial errors:", json.errors.map((e: { message: string }) => e.message));
    }
    return json.data as T;
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface Money {
    amount: string;
    currencyCode: string;
}
type MoneySet = { shopMoney: Money } | null;

export interface Address {
    name: string | null;
    firstName?: string | null;
    lastName?: string | null;
    provinceCode?: string | null;
    company: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    province: string | null;
    zip: string | null;
    country: string | null;
    phone: string | null;
}

export interface OrderTransaction {
    id: string;
    kind: string;
    status: string;
    gateway: string | null;
    formattedGateway: string | null;
    createdAt: string;
    paymentId: string | null;
    receiptJson: string | null;
    errorCode: string | null;
    amountSet: MoneySet;
}

export interface OrderListItem {
    id: string;
    legacyResourceId: string;
    name: string;
    createdAt: string;
    cancelledAt: string | null;
    displayFinancialStatus: string | null;
    displayFulfillmentStatus: string;
    currentSubtotalLineItemsQuantity: number;
    paymentGatewayNames: string[];
    totalPriceSet: MoneySet;
    customer: { displayName: string } | null;
    shippingAddress: Pick<Address, "name" | "city"> | null;
    transactions: Pick<OrderTransaction, "paymentId" | "gateway" | "kind" | "status">[];
}

export interface OrderDetail extends Omit<OrderListItem, "transactions" | "shippingAddress"> {
    processedAt: string;
    closedAt: string | null;
    closed: boolean;
    canMarkAsPaid: boolean;
    taxesIncluded: boolean;
    taxLines: TaxLine[];
    cancelReason: string | null;
    test: boolean;
    note: string | null;
    tags: string[];
    email: string | null;
    phone: string | null;
    discountCodes: string[];
    statusPageUrl: string | null;
    customer: {
        displayName: string;
        email: string | null;
        phone: string | null;
        numberOfOrders: string;
        amountSpent: Money;
    } | null;
    shippingAddress: Address | null;
    billingAddress: Address | null;
    subtotalPriceSet: MoneySet;
    totalDiscountsSet: MoneySet;
    totalShippingPriceSet: MoneySet;
    totalTaxSet: MoneySet;
    totalRefundedSet: MoneySet;
    totalOutstandingSet: MoneySet;
    shippingLines: { nodes: { title: string; originalPriceSet: MoneySet }[] };
    lineItems: {
        nodes: {
            id: string;
            name: string;
            title: string;
            variantTitle: string | null;
            sku: string | null;
            quantity: number;
            requiresShipping: boolean;
            variant: { inventoryItem: { measurement: { weight: { value: number; unit: string } | null } | null } | null } | null;
            image: { url: string; altText: string | null } | null;
            originalUnitPriceSet: MoneySet;
            discountedTotalSet: MoneySet;
            taxLines: TaxLine[];
        }[];
    };
    transactions: OrderTransaction[];
    fulfillmentOrders: {
        nodes: { id: string; status: string; supportedActions: { action: string }[] }[];
    };
    fulfillments: {
        id: string;
        displayStatus: string | null;
        createdAt: string;
        deliveredAt: string | null;
        estimatedDeliveryAt: string | null;
        trackingInfo: { company: string | null; number: string | null; url: string | null }[];
    }[];
    events: { nodes: { id: string; createdAt: string; message: string }[] };
}

export interface TaxLine {
    title: string;
    rate: number | null;
    priceSet: MoneySet;
}

export interface PageInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
}

// ── Queries ──────────────────────────────────────────────────────────────────

const MONEY = `shopMoney { amount currencyCode }`;

const ORDER_BASE_FIELDS = /* GraphQL */ `
  id legacyResourceId name createdAt cancelledAt
  displayFinancialStatus displayFulfillmentStatus
  currentSubtotalLineItemsQuantity paymentGatewayNames
  totalPriceSet { ${MONEY} }
`;

const ORDER_LIST_FIELDS = /* GraphQL */ `
  ${ORDER_BASE_FIELDS}
  customer { displayName }
  shippingAddress { name city }
  transactions(first: 5) { paymentId gateway kind status }
`;

export async function listOrders(opts: {
    query?: string;
    after?: string;
    before?: string;
    pageSize?: number;
}): Promise<{ orders: OrderListItem[]; pageInfo: PageInfo }> {
    const size = opts.pageSize ?? 20;
    const paging = opts.before ? { last: size, before: opts.before } : { first: size, after: opts.after ?? null };

    const data = await adminFetch<{ orders: { nodes: OrderListItem[]; pageInfo: PageInfo } }>(
        /* GraphQL */ `
      query Orders($first: Int, $last: Int, $after: String, $before: String, $query: String) {
        orders(first: $first, last: $last, after: $after, before: $before, query: $query, sortKey: CREATED_AT, reverse: true) {
          pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
          nodes { ${ORDER_LIST_FIELDS} }
        }
      }`,
        { ...paging, query: opts.query || null }
    );
    return { orders: data.orders.nodes, pageInfo: data.orders.pageInfo };
}

export async function getOrder(legacyId: string): Promise<OrderDetail | null> {
    if (!/^\d+$/.test(legacyId)) return null;

    const data = await adminFetch<{ order: OrderDetail | null }>(
        /* GraphQL */ `
      query Order($id: ID!) {
        order(id: $id) {
          ${ORDER_BASE_FIELDS}
          processedAt closedAt closed canMarkAsPaid taxesIncluded cancelReason test note tags email phone discountCodes statusPageUrl
          taxLines { title rate priceSet { ${MONEY} } }
          customer { displayName email phone numberOfOrders amountSpent { amount currencyCode } }
          shippingAddress { name firstName lastName company address1 address2 city province provinceCode zip country phone }
          billingAddress { name company address1 address2 city province zip country phone }
          subtotalPriceSet { ${MONEY} }
          totalDiscountsSet { ${MONEY} }
          totalShippingPriceSet { ${MONEY} }
          totalTaxSet { ${MONEY} }
          totalRefundedSet { ${MONEY} }
          totalOutstandingSet { ${MONEY} }
          shippingLines(first: 5) { nodes { title originalPriceSet { ${MONEY} } } }
          lineItems(first: 50) {
            nodes {
              id name title variantTitle sku quantity requiresShipping
              variant { inventoryItem { measurement { weight { value unit } } } }
              image { url(transform: { maxWidth: 160 }) altText }
              originalUnitPriceSet { ${MONEY} }
              discountedTotalSet { ${MONEY} }
              taxLines { title rate priceSet { ${MONEY} } }
            }
          }
          transactions(first: 25) {
            id kind status gateway formattedGateway createdAt paymentId receiptJson errorCode
            amountSet { ${MONEY} }
          }
          fulfillmentOrders(first: 10) { nodes { id status supportedActions { action } } }
          fulfillments(first: 10) {
            id displayStatus createdAt deliveredAt estimatedDeliveryAt
            trackingInfo(first: 5) { company number url }
          }
          events(first: 40, sortKey: CREATED_AT, reverse: true) { nodes { id createdAt message } }
        }
      }`,
        { id: `gid://shopify/Order/${legacyId}` }
    );
    return data.order;
}

/** Dashboard numbers: today + last 14 days, computed from the orders themselves. */
export async function getOverview(timeZone: string): Promise<{
    days: { date: string; revenue: number; orders: number }[];
    currency: string;
    awaitingFulfillment: number;
    pendingPayment: number;
}> {
    const since = new Date(Date.now() - 14 * 86400_000);
    const data = await adminFetch<{
        recent: { nodes: { createdAt: string; cancelledAt: string | null; totalPriceSet: MoneySet }[] };
        unfulfilled: { count: number } | null;
        pending: { count: number } | null;
    }>(
        /* GraphQL */ `
      query Overview($recentQuery: String!) {
        recent: orders(first: 250, query: $recentQuery, sortKey: CREATED_AT, reverse: true) {
          nodes { createdAt cancelledAt totalPriceSet { ${MONEY} } }
        }
        unfulfilled: ordersCount(query: "status:open fulfillment_status:unfulfilled financial_status:paid") { count }
        pending: ordersCount(query: "status:open financial_status:pending") { count }
      }`,
        { recentQuery: `created_at:>=${since.toISOString().slice(0, 10)}` }
    );

    const dayKey = (d: Date) => d.toLocaleDateString("en-CA", { timeZone }); // YYYY-MM-DD
    const days = new Map<string, { revenue: number; orders: number }>();
    for (let i = 13; i >= 0; i--) days.set(dayKey(new Date(Date.now() - i * 86400_000)), { revenue: 0, orders: 0 });

    let currency = "INR";
    for (const o of data.recent.nodes) {
        const bucket = days.get(dayKey(new Date(o.createdAt)));
        if (!bucket || o.cancelledAt) continue;
        bucket.orders++;
        bucket.revenue += Number(o.totalPriceSet?.shopMoney.amount ?? 0);
        currency = o.totalPriceSet?.shopMoney.currencyCode ?? currency;
    }

    return {
        days: [...days].map(([date, v]) => ({ date, ...v })),
        currency,
        awaitingFulfillment: data.unfulfilled?.count ?? 0,
        pendingPayment: data.pending?.count ?? 0,
    };
}

export async function getShopTimezone(): Promise<string> {
    try {
        const data = await adminFetch<{ shop: { ianaTimezone: string } }>(`{ shop { ianaTimezone } }`);
        return data.shop.ianaTimezone;
    } catch {
        return "Asia/Kolkata";
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export const isPhonePeGateway = (gateway: string | null | undefined) => /phone\s*pe/i.test(gateway ?? "");

/**
 * The PhonePe Shopify app uses Shopify's payment id as PhonePe's merchantOrderId,
 * so this is the key for PhonePe's order-status API.
 */
export function phonePeOrderIds(transactions: Pick<OrderTransaction, "paymentId" | "gateway">[]): string[] {
    const ids = transactions.filter((t) => isPhonePeGateway(t.gateway) && t.paymentId).map((t) => t.paymentId!);
    return [...new Set(ids)];
}

// ── Fulfillment (write) ──────────────────────────────────────────────────────

type UserError = { field?: string[] | null; message: string };

function throwUserErrors(errors: UserError[] | undefined, what: string) {
    if (errors?.length) throw new Error(`${what}: ${errors.map((e) => e.message).join("; ")}`);
}

/** Total parcel weight in kg from Shopify product weights (0 when unknown). */
export function orderWeightKg(order: OrderDetail): number {
    const toKg: Record<string, number> = { GRAMS: 0.001, KILOGRAMS: 1, OUNCES: 0.0283495, POUNDS: 0.453592 };
    return order.lineItems.nodes.reduce((sum, li) => {
        const w = li.variant?.inventoryItem?.measurement?.weight;
        return sum + (w ? w.value * (toKg[w.unit] ?? 0) * li.quantity : 0);
    }, 0);
}

export interface TrackingInput {
    company: string;
    number: string;
    url: string;
}

/**
 * Mark the order as shipped in Shopify with the AWB. If the order already has a
 * fulfillment (e.g. fulfilled manually) we attach the tracking to it instead.
 */
export async function fulfillWithTracking(legacyOrderId: string, tracking: TrackingInput, notifyCustomer: boolean): Promise<void> {
    const order = await getOrder(legacyOrderId);
    if (!order) throw new Error("Order not found in Shopify.");

    const openFulfillmentOrders = order.fulfillmentOrders.nodes.filter((fo) =>
        fo.supportedActions.some((a) => a.action === "CREATE_FULFILLMENT")
    );

    if (openFulfillmentOrders.length) {
        const data = await adminFetch<{ fulfillmentCreate: { userErrors: UserError[] } }>(
            /* GraphQL */ `
          mutation Fulfill($fulfillment: FulfillmentInput!) {
            fulfillmentCreate(fulfillment: $fulfillment) { fulfillment { id } userErrors { field message } }
          }`,
            {
                fulfillment: {
                    notifyCustomer,
                    trackingInfo: tracking,
                    lineItemsByFulfillmentOrder: openFulfillmentOrders.map((fo) => ({ fulfillmentOrderId: fo.id })),
                },
            }
        );
        throwUserErrors(data.fulfillmentCreate.userErrors, "Shopify fulfillment failed");
        return;
    }

    // Already fulfilled — put the AWB on the most recent fulfillment without one
    const target = order.fulfillments.find((f) => !f.trackingInfo.some((t) => t.number)) ?? order.fulfillments[0];
    if (!target) throw new Error("Nothing left to fulfill on this order.");
    const data = await adminFetch<{ fulfillmentTrackingInfoUpdate: { userErrors: UserError[] } }>(
        /* GraphQL */ `
      mutation Track($fulfillmentId: ID!, $trackingInfoInput: FulfillmentTrackingInput!, $notifyCustomer: Boolean) {
        fulfillmentTrackingInfoUpdate(fulfillmentId: $fulfillmentId, trackingInfoInput: $trackingInfoInput, notifyCustomer: $notifyCustomer) {
          fulfillment { id } userErrors { field message }
        }
      }`,
        { fulfillmentId: target.id, trackingInfoInput: tracking, notifyCustomer }
    );
    throwUserErrors(data.fulfillmentTrackingInfoUpdate.userErrors, "Updating Shopify tracking failed");
}

/** Find the Shopify fulfillment that carries this AWB (used by the tracking webhook). */
export async function findFulfillmentByAwb(orderName: string, awb: string): Promise<string | null> {
    const data = await adminFetch<{
        orders: { nodes: { fulfillments: { id: string; trackingInfo: { number: string | null }[] }[] }[] };
    }>(
        /* GraphQL */ `
      query FindOrder($query: String!) {
        orders(first: 3, query: $query) {
          nodes { fulfillments(first: 10) { id trackingInfo(first: 5) { number } } }
        }
      }`,
        { query: `name:#${orderName.replace(/^#/, "")}` }
    );
    for (const o of data.orders.nodes) {
        const f = o.fulfillments.find((f) => f.trackingInfo.some((t) => t.number === awb));
        if (f) return f.id;
    }
    return null;
}

/** Shopify's shipment status events (shown on the order + customer status page). */
export type FulfillmentEventStatus =
    | "LABEL_PRINTED"
    | "CONFIRMED"
    | "CARRIER_PICKED_UP"
    | "IN_TRANSIT"
    | "OUT_FOR_DELIVERY"
    | "ATTEMPTED_DELIVERY"
    | "DELAYED"
    | "FAILURE"
    | "DELIVERED";

export async function createFulfillmentEvent(
    fulfillmentId: string,
    status: FulfillmentEventStatus,
    message: string,
    happenedAt?: string
): Promise<void> {
    const data = await adminFetch<{ fulfillmentEventCreate: { userErrors: UserError[] } }>(
        /* GraphQL */ `
      mutation Event($fulfillmentEvent: FulfillmentEventInput!) {
        fulfillmentEventCreate(fulfillmentEvent: $fulfillmentEvent) { fulfillmentEvent { id } userErrors { field message } }
      }`,
        { fulfillmentEvent: { fulfillmentId, status, message, ...(happenedAt ? { happenedAt } : {}) } }
    );
    throwUserErrors(data.fulfillmentEventCreate.userErrors, "Shopify fulfillment event failed");
}

/** The AWB numbers already recorded on the order's Shopify fulfillments. */
export const orderAwbs = (order: OrderDetail) =>
    order.fulfillments.flatMap((f) => f.trackingInfo.map((t) => t.number)).filter((n): n is string => !!n);

/** customer_reference we send to eShipz — the Shopify order number without "#". */
export const shipmentReference = (orderName: string) => orderName.replace(/^#/, "");

// ── Order status (write) ─────────────────────────────────────────────────────

const orderGid = (legacyId: string) => `gid://shopify/Order/${legacyId}`;

export type CancelReason = "CUSTOMER" | "PAYMENT_DECLINED" | "FRAUD" | "INVENTORY" | "STAFF_ERROR" | "OTHER";

/** Cancels asynchronously in Shopify; refund goes back through the original gateway (PhonePe). */
export async function cancelOrder(
    legacyId: string,
    opts: { reason: CancelReason; refund: boolean; restock: boolean; notifyCustomer: boolean; staffNote?: string }
): Promise<void> {
    const data = await adminFetch<{ orderCancel: { orderCancelUserErrors: UserError[] } }>(
        /* GraphQL */ `
      mutation Cancel($orderId: ID!, $reason: OrderCancelReason!, $restock: Boolean!, $notifyCustomer: Boolean, $refundMethod: OrderCancelRefundMethodInput, $staffNote: String) {
        orderCancel(orderId: $orderId, reason: $reason, restock: $restock, notifyCustomer: $notifyCustomer, refundMethod: $refundMethod, staffNote: $staffNote) {
          job { id }
          orderCancelUserErrors { field message code }
        }
      }`,
        {
            orderId: orderGid(legacyId),
            reason: opts.reason,
            restock: opts.restock,
            notifyCustomer: opts.notifyCustomer,
            refundMethod: opts.refund ? { originalPaymentMethodsRefund: true } : null,
            staffNote: opts.staffNote?.slice(0, 255) || null,
        }
    );
    throwUserErrors(data.orderCancel.orderCancelUserErrors, "Shopify couldn't cancel the order");
}

/** Archive (close) or unarchive (open) an order. */
export async function setOrderArchived(legacyId: string, archived: boolean): Promise<void> {
    const field = archived ? "orderClose" : "orderOpen";
    const input = archived ? "OrderCloseInput" : "OrderOpenInput";
    const data = await adminFetch<Record<string, { userErrors: UserError[] }>>(
        `mutation Archive($input: ${input}!) { ${field}(input: $input) { order { id } userErrors { field message } } }`,
        { input: { id: orderGid(legacyId) } }
    );
    throwUserErrors(data[field].userErrors, `Shopify couldn't ${archived ? "archive" : "unarchive"} the order`);
}

export async function markOrderPaid(legacyId: string): Promise<void> {
    const data = await adminFetch<{ orderMarkAsPaid: { userErrors: UserError[] } }>(
        `mutation Paid($input: OrderMarkAsPaidInput!) { orderMarkAsPaid(input: $input) { order { id } userErrors { field message } } }`,
        { input: { id: orderGid(legacyId) } }
    );
    throwUserErrors(data.orderMarkAsPaid.userErrors, "Shopify couldn't mark the order as paid");
}

export async function updateOrderNoteTags(legacyId: string, note: string, tags: string[]): Promise<void> {
    const data = await adminFetch<{ orderUpdate: { userErrors: UserError[] } }>(
        `mutation Update($input: OrderInput!) { orderUpdate(input: $input) { order { id } userErrors { field message } } }`,
        { input: { id: orderGid(legacyId), note, tags } }
    );
    throwUserErrors(data.orderUpdate.userErrors, "Shopify couldn't update the order");
}

/** Mark everything as fulfilled without a carrier (e.g. hand delivery). */
export async function fulfillWithoutTracking(legacyId: string, notifyCustomer: boolean): Promise<void> {
    const order = await getOrder(legacyId);
    if (!order) throw new Error("Order not found in Shopify.");
    const open = order.fulfillmentOrders.nodes.filter((fo) => fo.supportedActions.some((a) => a.action === "CREATE_FULFILLMENT"));
    if (!open.length) throw new Error("Nothing left to fulfill on this order.");
    const data = await adminFetch<{ fulfillmentCreate: { userErrors: UserError[] } }>(
        /* GraphQL */ `
      mutation Fulfill($fulfillment: FulfillmentInput!) {
        fulfillmentCreate(fulfillment: $fulfillment) { fulfillment { id } userErrors { field message } }
      }`,
        { fulfillment: { notifyCustomer, lineItemsByFulfillmentOrder: open.map((fo) => ({ fulfillmentOrderId: fo.id })) } }
    );
    throwUserErrors(data.fulfillmentCreate.userErrors, "Shopify fulfillment failed");
}
