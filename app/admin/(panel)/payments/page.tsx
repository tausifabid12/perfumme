import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import PhonePePayment, { reconcile } from "@/components/admin/PhonePePayment";
import { Copyable, RefreshButton } from "@/components/admin/client";
import { Badge, Card, CardHeader, ErrorNotice, Skeleton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { formatMoney, humanize, paiseToRupees, phonePeTone, timeAgo, formatDate } from "@/lib/admin/format";
import { getPhonePeOrderStatus, getPhonePeStatuses, primaryAttempt } from "@/lib/admin/phonepe";
import { listOrders, phonePeOrderIds } from "@/lib/admin/shopify-admin";

export const metadata: Metadata = { title: "PhonePe payments" };

type SearchParams = Promise<{ id?: string; after?: string; before?: string }>;

export default async function PaymentsPage({ searchParams }: { searchParams: SearchParams }) {
    await requireAdmin();
    const { id = "", after, before } = await searchParams;

    return (
        <div className="space-y-8">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">PhonePe payments</h1>
                    <p className="mt-1 text-sm text-admin-muted">
                        Every Shopify order checked against PhonePe: status, UTR and amount.
                    </p>
                </div>
                <RefreshButton />
            </div>

            {/* Lookup */}
            <Card>
                <CardHeader
                    icon={<Search size={15} />}
                    title="Look up a payment"
                    subtitle="Paste a merchant order id (Shopify payment id)"
                />
                <div className="space-y-4 p-5">
                    <form method="get" className="flex flex-col gap-2 sm:flex-row">
                        <input
                            type="text"
                            name="id"
                            defaultValue={id}
                            placeholder="e.g. rttfEaQAzmX1daU4GKxgusbWQ"
                            aria-label="Merchant order id"
                            spellCheck={false}
                            className="h-10 flex-1 rounded-xl border border-admin-line bg-admin-bg px-3.5 font-mono text-sm text-admin-text outline-none transition placeholder:font-sans placeholder:text-admin-muted/60 focus:border-admin-accent/50 focus:ring-2 focus:ring-admin-accent/15"
                        />
                        <button
                            type="submit"
                            className="h-10 rounded-xl bg-admin-accent px-5 text-sm font-semibold text-[#1A140C] transition hover:brightness-110"
                        >
                            Check status
                        </button>
                    </form>
                    {id && (
                        <Suspense key={id} fallback={<Skeleton className="h-52" />}>
                            <Lookup id={id} />
                        </Suspense>
                    )}
                </div>
            </Card>

            <Suspense key={`${after}|${before}`} fallback={<ListSkeleton />}>
                <Reconciliation after={after} before={before} />
            </Suspense>
        </div>
    );
}

async function Lookup({ id }: { id: string }) {
    return <PhonePePayment result={await getPhonePeOrderStatus(id)} />;
}

async function Reconciliation({ after, before }: { after?: string; before?: string }) {
    let page;
    try {
        page = await listOrders({ after, before, pageSize: 25 });
    } catch (err) {
        return <ErrorNotice title="Couldn't load orders from Shopify" message={err instanceof Error ? err.message : "Unknown error"} />;
    }

    const rows = page.orders.map((o) => ({ order: o, ids: phonePeOrderIds(o.transactions) }));
    const statuses = await getPhonePeStatuses(rows.flatMap((r) => r.ids));

    const summary = { Verified: 0, Attention: 0, Other: 0 };
    for (const r of rows) {
        if (!r.ids.length) summary.Other++;
        else {
            const res = statuses.get(r.ids[0])!;
            const check = reconcile(res, r.ids.length === 1 ? Number(r.order.totalPriceSet?.shopMoney.amount ?? 0) : undefined);
            if (check.tone === "green") summary.Verified++;
            else summary.Attention++;
        }
    }

    const pageHref = (c: { after?: string | null; before?: string | null }) =>
        `/admin/payments?${new URLSearchParams(c.after ? { after: c.after } : c.before ? { before: c.before } : {})}`;

    return (
        <Card className="overflow-hidden">
            <CardHeader
                title="Recent orders"
                subtitle="Checked live with PhonePe, 25 per page"
                action={
                    <div className="hidden items-center gap-2 sm:flex">
                        <Badge tone="green">{summary.Verified} verified</Badge>
                        {summary.Attention > 0 && <Badge tone="amber">{summary.Attention} need attention</Badge>}
                        {summary.Other > 0 && <Badge tone="neutral">{summary.Other} other gateway</Badge>}
                    </div>
                }
            />

            <div className="hidden grid-cols-[0.8fr_1.3fr_1fr_1fr_1.4fr_1.1fr] gap-4 border-b border-admin-line px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-admin-muted md:grid">
                <span>Order</span>
                <span>PhonePe status</span>
                <span>Mode</span>
                <span className="text-right">Amount</span>
                <span>UTR</span>
                <span>Check</span>
            </div>

            <ul className="divide-y divide-admin-line">
                {rows.map(({ order, ids }) => {
                    const shopifyTotal = Number(order.totalPriceSet?.shopMoney.amount ?? 0);
                    const res = ids[0] ? statuses.get(ids[0]) : undefined;
                    const data = res?.ok ? res.data : undefined;
                    const attempt = data ? primaryAttempt(data) : undefined;
                    const check = res ? reconcile(res, ids.length === 1 ? shopifyTotal : undefined) : null;

                    return (
                        <li
                            key={order.id}
                            className="grid grid-cols-2 items-center gap-x-4 gap-y-2 px-5 py-3.5 text-sm md:grid-cols-[0.8fr_1.3fr_1fr_1fr_1.4fr_1.1fr]"
                        >
                            <Link href={`/admin/orders/${order.legacyResourceId}`} className="group">
                                <p className="font-semibold group-hover:text-admin-accent">{order.name}</p>
                                <p className="text-xs text-admin-muted" title={formatDate(order.createdAt)}>
                                    {timeAgo(order.createdAt)}
                                </p>
                            </Link>

                            <div className="text-right md:text-left">
                                {!ids.length ? (
                                    <span className="text-xs text-admin-muted">
                                        {order.paymentGatewayNames[0] ?? "No payment"}
                                    </span>
                                ) : data ? (
                                    <Badge tone={phonePeTone(data.state)}>{humanize(data.state)}</Badge>
                                ) : (
                                    <Badge tone="red">{res?.ok === false ? res.error : "Unknown"}</Badge>
                                )}
                            </div>

                            <span className="text-admin-muted">{attempt ? humanize(attempt.paymentMode) : "—"}</span>

                            <div className="text-right">
                                <p>{data ? formatMoney(paiseToRupees(data.amount)) : "—"}</p>
                                {data && Math.abs(paiseToRupees(data.amount) - shopifyTotal) > 0.5 && (
                                    <p className="text-xs text-admin-muted">Shopify {formatMoney(shopifyTotal)}</p>
                                )}
                            </div>

                            <div className="min-w-0 text-admin-muted">
                                {attempt?.rail?.utr ? <Copyable value={attempt.rail.utr} /> : "—"}
                            </div>

                            <div className="text-right md:text-left">
                                {check ? <Badge tone={check.tone} dot={false}>{check.label}</Badge> : <span className="text-admin-muted">—</span>}
                            </div>
                        </li>
                    );
                })}
            </ul>

            {(page.pageInfo.hasNextPage || page.pageInfo.hasPreviousPage) && (
                <nav className="flex items-center justify-between border-t border-admin-line px-5 py-3" aria-label="Pagination">
                    {page.pageInfo.hasPreviousPage ? (
                        <Link href={pageHref({ before: page.pageInfo.startCursor })} className="inline-flex h-8 items-center gap-1 rounded-lg border border-admin-line px-3 text-sm hover:bg-admin-raised">
                            <ChevronLeft size={15} /> Newer
                        </Link>
                    ) : (
                        <span />
                    )}
                    {page.pageInfo.hasNextPage && (
                        <Link href={pageHref({ after: page.pageInfo.endCursor })} className="inline-flex h-8 items-center gap-1 rounded-lg border border-admin-line px-3 text-sm hover:bg-admin-raised">
                            Older <ChevronRight size={15} />
                        </Link>
                    )}
                </nav>
            )}
        </Card>
    );
}

function ListSkeleton() {
    return (
        <Card className="divide-y divide-admin-line">
            <div className="px-5 py-4">
                <Skeleton className="h-5 w-40" />
            </div>
            {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="flex items-center gap-6 px-5 py-4">
                    <Skeleton className="h-9 w-16" />
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-5 w-20" />
                </div>
            ))}
        </Card>
    );
}
