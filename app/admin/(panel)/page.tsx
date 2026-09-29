import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, FileDown, Inbox } from "lucide-react";
import OrdersToolbar from "@/components/admin/OrdersToolbar";
import { RefreshButton } from "@/components/admin/client";
import { Badge, Card, EmptyState, ErrorNotice, Skeleton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { buildOrderQuery } from "@/lib/admin/filters";
import { financialTone, formatMoney, fulfillmentTone, humanize, timeAgo, formatDate } from "@/lib/admin/format";
import { getOverview, getShopTimezone, isPhonePeGateway, listOrders } from "@/lib/admin/shopify-admin";

export const metadata: Metadata = { title: "Orders" };

type SearchParams = Promise<{ q?: string; filter?: string; after?: string; before?: string }>;

export default async function OrdersPage({ searchParams }: { searchParams: SearchParams }) {
    await requireAdmin();
    const { q = "", filter = "all", after, before } = await searchParams;

    return (
        <div className="space-y-8">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
                    <p className="mt-1 text-sm text-admin-muted">Live from Shopify, with PhonePe payment status.</p>
                </div>
                <div className="flex gap-2">
                    <a
                        href={`/api/admin/orders/export?${new URLSearchParams({ q, filter })}`}
                        download
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-admin-line bg-admin-surface px-3 text-sm text-admin-text transition hover:bg-admin-raised"
                        title="Export the orders in this view as CSV"
                    >
                        <FileDown size={14} /> <span className="hidden sm:inline">Export CSV</span>
                    </a>
                    <RefreshButton />
                </div>
            </div>

            <Suspense fallback={<StatsSkeleton />}>
                <Stats />
            </Suspense>

            <div className="space-y-4">
                <OrdersToolbar q={q} filter={filter} />
                <Suspense key={`${q}|${filter}|${after}|${before}`} fallback={<TableSkeleton />}>
                    <OrdersTable q={q} filter={filter} after={after} before={before} />
                </Suspense>
            </div>
        </div>
    );
}

// ── Stats ────────────────────────────────────────────────────────────────────

async function Stats() {
    let overview;
    try {
        overview = await getOverview(await getShopTimezone());
    } catch (err) {
        return <ErrorNotice title="Couldn't load stats" message={err instanceof Error ? err.message : "Unknown error"} />;
    }

    const { days, currency, awaitingFulfillment, pendingPayment } = overview;
    const today = days[days.length - 1];
    const yesterday = days[days.length - 2];
    const last7 = days.slice(-7).reduce((s, d) => s + d.revenue, 0);
    const prev7 = days.slice(0, 7).reduce((s, d) => s + d.revenue, 0);
    const change = prev7 > 0 ? Math.round(((last7 - prev7) / prev7) * 100) : null;
    const max = Math.max(1, ...days.map((d) => d.revenue));

    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile label="Today" value={formatMoney(today.revenue, currency)}>
                {today.orders} order{today.orders === 1 ? "" : "s"}
                <span className="text-admin-muted/60"> · yesterday {formatMoney(yesterday.revenue, currency)}</span>
            </StatTile>

            <StatTile label="Last 7 days" value={formatMoney(last7, currency)}>
                {change === null ? (
                    "vs. previous week"
                ) : (
                    <span className={change >= 0 ? "text-emerald-300" : "text-rose-300"}>
                        {change >= 0 ? "▲" : "▼"} {Math.abs(change)}% vs. previous week
                    </span>
                )}
                <div className="mt-3 flex h-8 items-end gap-[3px]" aria-hidden>
                    {days.map((d, i) => (
                        <span
                            key={d.date}
                            title={`${d.date}: ${formatMoney(d.revenue, currency)} · ${d.orders} orders`}
                            className={`flex-1 rounded-sm ${i >= 7 ? "bg-admin-accent/70" : "bg-white/10"}`}
                            style={{ height: `${Math.max(6, (d.revenue / max) * 100)}%` }}
                        />
                    ))}
                </div>
            </StatTile>

            <Link href="/admin?filter=unfulfilled" className="group">
                <StatTile label="To ship" value={String(awaitingFulfillment)} highlight={awaitingFulfillment > 0}>
                    <span className="group-hover:text-admin-text">Paid, not yet fulfilled →</span>
                </StatTile>
            </Link>

            <Link href="/admin?filter=pending" className="group">
                <StatTile label="Payment pending" value={String(pendingPayment)}>
                    <span className="group-hover:text-admin-text">Open orders awaiting payment →</span>
                </StatTile>
            </Link>
        </div>
    );
}

function StatTile({
    label,
    value,
    children,
    highlight = false,
}: {
    label: string;
    value: string;
    children?: React.ReactNode;
    highlight?: boolean;
}) {
    return (
        <div
            className={`h-full rounded-2xl border bg-admin-surface p-4 transition sm:p-5 ${
                highlight ? "border-admin-accent/30" : "border-admin-line"
            } hover:border-white/15`}
        >
            <p className="text-xs font-medium uppercase tracking-wider text-admin-muted">{label}</p>
            <p className={`mt-2 text-2xl font-semibold tracking-tight ${highlight ? "text-admin-accent" : ""}`}>{value}</p>
            <div className="mt-1 text-xs text-admin-muted">{children}</div>
        </div>
    );
}

function StatsSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-[118px] !rounded-2xl" />
            ))}
        </div>
    );
}

// ── Orders table ─────────────────────────────────────────────────────────────

async function OrdersTable({ q, filter, after, before }: { q: string; filter: string; after?: string; before?: string }) {
    let result;
    try {
        result = await listOrders({ query: buildOrderQuery(filter, q), after, before });
    } catch (err) {
        return <ErrorNotice title="Couldn't load orders from Shopify" message={err instanceof Error ? err.message : "Unknown error"} />;
    }
    const { orders, pageInfo } = result;

    if (!orders.length) {
        return (
            <Card>
                <EmptyState icon={<Inbox size={20} />} title="No orders found">
                    {q ? <>Nothing matches “{q}”. Try an order number, name, email or phone.</> : "Nothing in this view yet."}
                </EmptyState>
            </Card>
        );
    }

    const pageHref = (cursor: { after?: string; before?: string }) => {
        const p = new URLSearchParams();
        if (q) p.set("q", q);
        if (filter !== "all") p.set("filter", filter);
        if (cursor.after) p.set("after", cursor.after);
        if (cursor.before) p.set("before", cursor.before);
        return `/admin?${p}`;
    };

    return (
        <Card className="overflow-hidden">
            {/* Column headings (desktop) */}
            <div className="hidden grid-cols-[1.1fr_1.6fr_0.6fr_1.3fr_1fr_0.9fr] gap-4 border-b border-admin-line px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-admin-muted md:grid">
                <span>Order</span>
                <span>Customer</span>
                <span>Items</span>
                <span>Payment</span>
                <span>Fulfillment</span>
                <span className="text-right">Total</span>
            </div>

            <ul className="divide-y divide-admin-line">
                {orders.map((o) => {
                    const phonePe = o.paymentGatewayNames.some(isPhonePeGateway);
                    const total = o.totalPriceSet?.shopMoney;
                    return (
                        <li key={o.id}>
                            <Link
                                href={`/admin/orders/${o.legacyResourceId}`}
                                className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 px-5 py-4 transition hover:bg-white/[0.025] focus-visible:bg-white/[0.04] focus-visible:outline-none md:grid-cols-[1.1fr_1.6fr_0.6fr_1.3fr_1fr_0.9fr] md:items-center"
                            >
                                <div>
                                    <p className="text-sm font-semibold">{o.name}</p>
                                    <p className="text-xs text-admin-muted" title={formatDate(o.createdAt)}>
                                        {timeAgo(o.createdAt)}
                                    </p>
                                </div>

                                <p className="text-right text-sm font-semibold md:order-last">
                                    {total ? formatMoney(total.amount, total.currencyCode) : "—"}
                                </p>

                                <div className="col-span-2 min-w-0 md:col-span-1">
                                    <p className="truncate text-sm">
                                        {o.customer?.displayName ?? o.shippingAddress?.name ?? "Guest"}
                                    </p>
                                    {o.shippingAddress?.city && (
                                        <p className="truncate text-xs text-admin-muted">{o.shippingAddress.city}</p>
                                    )}
                                </div>

                                <p className="hidden text-sm text-admin-muted md:block">
                                    {o.currentSubtotalLineItemsQuantity}
                                </p>

                                <div className="flex flex-wrap items-center gap-1.5">
                                    {o.cancelledAt ? (
                                        <Badge tone="red">Cancelled</Badge>
                                    ) : (
                                        <Badge tone={financialTone(o.displayFinancialStatus)}>
                                            {humanize(o.displayFinancialStatus)}
                                        </Badge>
                                    )}
                                    {phonePe && (
                                        <span className="rounded-md bg-[#5f259f]/25 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-[#c9a7f5]">
                                            PhonePe
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <Badge tone={fulfillmentTone(o.displayFulfillmentStatus)}>
                                        {humanize(o.displayFulfillmentStatus)}
                                    </Badge>
                                </div>
                            </Link>
                        </li>
                    );
                })}
            </ul>

            {(pageInfo.hasNextPage || pageInfo.hasPreviousPage) && (
                <nav className="flex items-center justify-between border-t border-admin-line px-5 py-3" aria-label="Pagination">
                    <PageLink disabled={!pageInfo.hasPreviousPage} href={pageHref({ before: pageInfo.startCursor ?? undefined })}>
                        <ChevronLeft size={15} /> Newer
                    </PageLink>
                    <PageLink disabled={!pageInfo.hasNextPage} href={pageHref({ after: pageInfo.endCursor ?? undefined })}>
                        Older <ChevronRight size={15} />
                    </PageLink>
                </nav>
            )}
        </Card>
    );
}

function PageLink({ href, disabled, children }: { href: string; disabled: boolean; children: React.ReactNode }) {
    const cls = "inline-flex h-8 items-center gap-1 rounded-lg border border-admin-line px-3 text-sm transition";
    if (disabled) return <span className={`${cls} text-admin-muted/40`}>{children}</span>;
    return (
        <Link href={href} className={`${cls} hover:bg-admin-raised`}>
            {children}
        </Link>
    );
}

function TableSkeleton() {
    return (
        <Card className="divide-y divide-admin-line">
            {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="flex items-center gap-6 px-5 py-4">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="hidden h-5 w-24 md:block" />
                    <Skeleton className="hidden h-5 w-24 md:block" />
                    <Skeleton className="h-4 w-16" />
                </div>
            ))}
        </Card>
    );
}
