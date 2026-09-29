import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, PackageCheck, Search, Truck } from "lucide-react";
import { RefreshButton } from "@/components/admin/client";
import { NotConnected } from "@/components/admin/ShippingPanel";
import ShipmentsTable, { type ShipmentRow } from "@/components/admin/ShipmentsTable";
import { Card, CardHeader, EmptyState, ErrorNotice, Skeleton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { eshipzMissingConfig, isCancelled, listShipments } from "@/lib/admin/eshipz";
import { formatDate, formatMoney, tagLabel, timeAgo, trackingTone } from "@/lib/admin/format";
import { adminFetch, listOrders } from "@/lib/admin/shopify-admin";
import { ORDER_FILTERS } from "@/lib/admin/filters";

export const metadata: Metadata = { title: "Blue Dart shipping" };

type SearchParams = Promise<{ days?: string; q?: string; page?: string }>;
const RANGES = [7, 30, 90];
const PAGE_SIZE = 25;

export default async function ShippingPage({ searchParams }: { searchParams: SearchParams }) {
    await requireAdmin();
    const sp = await searchParams;
    const days = RANGES.includes(Number(sp.days)) ? Number(sp.days) : 30;
    const q = (sp.q ?? "").trim().slice(0, 40);
    const page = Math.max(1, Math.min(200, Number(sp.page) || 1));
    const missing = eshipzMissingConfig();

    return (
        <div className="space-y-8">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Blue Dart shipping</h1>
                    <p className="mt-1 text-sm text-admin-muted">Book from an order, then schedule pickups and print manifests here.</p>
                </div>
                <RefreshButton />
            </div>

            {missing.length > 0 && <NotConnected missing={missing} />}

            <Suspense fallback={<Skeleton className="h-40 !rounded-2xl" />}>
                <ReadyToShip />
            </Suspense>

            {missing.length === 0 && (
                <Card className="overflow-hidden">
                    <CardHeader
                        icon={<Truck size={15} />}
                        title="Shipments"
                        subtitle="Select shipments to request a pickup or create a handover manifest"
                        action={<RangeTabs days={days} q={q} />}
                    />
                    <form method="get" className="border-b border-admin-line px-5 py-3">
                        <input type="hidden" name="days" value={days} />
                        <div className="relative max-w-sm">
                            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted" />
                            <input
                                type="search"
                                name="q"
                                defaultValue={q}
                                placeholder="AWB or order number"
                                aria-label="Search shipments"
                                className="h-9 w-full rounded-lg border border-admin-line bg-admin-bg pl-9 pr-3 text-sm outline-none focus:border-admin-accent/50"
                            />
                        </div>
                    </form>
                    <Suspense key={`${days}|${q}|${page}`} fallback={<RowsSkeleton />}>
                        <Shipments days={days} q={q} page={page} />
                    </Suspense>
                </Card>
            )}
        </div>
    );
}

// ── Ready to ship (Shopify: paid, not fulfilled) ─────────────────────────────

async function ReadyToShip() {
    let orders;
    try {
        const query = ORDER_FILTERS.find((f) => f.key === "unfulfilled")!.query;
        orders = (await listOrders({ query, pageSize: 8 })).orders;
    } catch (err) {
        return <ErrorNotice title="Couldn't load orders from Shopify" message={err instanceof Error ? err.message : "Unknown error"} />;
    }

    return (
        <Card>
            <CardHeader
                icon={<PackageCheck size={15} />}
                title="Ready to ship"
                subtitle="Paid Shopify orders that haven't been fulfilled"
                action={
                    <Link href="/admin?filter=unfulfilled" className="text-xs text-admin-accent hover:underline">
                        View all
                    </Link>
                }
            />
            {orders.length ? (
                <ul className="grid gap-px bg-admin-line sm:grid-cols-2">
                    {orders.map((o) => (
                        <li key={o.id} className="bg-admin-surface">
                            <Link
                                href={`/admin/orders/${o.legacyResourceId}`}
                                className="flex items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-white/[0.025]"
                            >
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold">
                                        {o.name}
                                        <span className="ml-2 font-normal text-admin-muted">
                                            {o.customer?.displayName ?? o.shippingAddress?.name ?? "Guest"}
                                        </span>
                                    </p>
                                    <p className="truncate text-xs text-admin-muted">
                                        {[o.shippingAddress?.city, timeAgo(o.createdAt)].filter(Boolean).join(" · ")}
                                    </p>
                                </div>
                                <span className="flex shrink-0 items-center gap-3">
                                    <span className="text-sm">
                                        {formatMoney(o.totalPriceSet?.shopMoney.amount, o.totalPriceSet?.shopMoney.currencyCode)}
                                    </span>
                                    <span className="rounded-lg bg-admin-accent/15 px-2.5 py-1 text-xs font-medium text-admin-accent">Ship →</span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <EmptyState icon={<PackageCheck size={20} />} title="All caught up">
                    Every paid order has been shipped.
                </EmptyState>
            )}
        </Card>
    );
}

// ── Shipments list (eShipz) ──────────────────────────────────────────────────

async function Shipments({ days, q, page }: { days: number; q: string; page: number }) {
    const range = dateRange(days);
    let shipments;
    try {
        const isAwb = /^\d{9,}$/.test(q);
        shipments = await listShipments({
            page,
            limit: PAGE_SIZE,
            ...(q ? (isAwb ? { awb: q } : { orderId: q.replace(/^#/, "") }) : range),
        });
    } catch (err) {
        return (
            <div className="p-5">
                <ErrorNotice title="Couldn't load shipments from eShipz" message={err instanceof Error ? err.message : "Unknown error"} />
            </div>
        );
    }

    if (!shipments.length) {
        return (
            <EmptyState icon={<Truck size={20} />} title={q ? "No shipment matches" : "No shipments yet"}>
                {q ? `Nothing found for “${q}”.` : "Open an order and book it with Blue Dart — it'll show up here."}
            </EmptyState>
        );
    }

    // Map order numbers → Shopify order ids so rows can link to the order page
    const refs = [...new Set(shipments.map((s) => s.customer_referenc).filter((r): r is string => !!r && /^\d+$/.test(r)))];
    const idByName = new Map<string, string>();
    if (refs.length) {
        try {
            const data = await adminFetch<{ orders: { nodes: { name: string; legacyResourceId: string }[] } }>(
                `query($q: String!) { orders(first: 50, query: $q) { nodes { name legacyResourceId } } }`,
                { q: refs.map((r) => `name:#${r}`).join(" OR ") }
            );
            for (const o of data.orders.nodes) idByName.set(o.name.replace(/^#/, ""), o.legacyResourceId);
        } catch {
            /* links are a nicety */
        }
    }

    const rows: ShipmentRow[] = shipments.map((s) => {
        const cancelled = isCancelled(s);
        const tag = cancelled ? "Cancelled" : s.tracking_status ?? "InfoReceived";
        const ref = s.customer_referenc ?? "";
        const legacy = idByName.get(ref);
        const receiver = s.order_details?.receiver_address;
        return {
            eshipzId: s.order_id,
            awb: s.awb,
            reference: ref,
            orderHref: legacy ? `/admin/orders/${legacy}` : null,
            customer: receiver?.contact_name ?? "",
            city: [receiver?.city, receiver?.postal_code].filter(Boolean).join(" "),
            service: s.service_type ?? "—",
            created: s.creation_date ? formatDate(s.creation_date) : "",
            statusLabel: tagLabel(tag),
            statusTone: trackingTone(tag),
            pickupRequested: !!s.pickup_meta?.pickup_request,
            labelUrl: s.label_meta?.url ?? null,
            // Pickup/manifest only make sense before the parcel leaves
            selectable: !cancelled && /inforeceived|pending|created|booked|manifest/i.test(tag),
        };
    });

    const href = (p: number) => `/admin/shipping?${new URLSearchParams({ days: String(days), ...(q ? { q } : {}), page: String(p) })}`;

    return (
        <>
            <ShipmentsTable rows={rows} />
            {(page > 1 || shipments.length === PAGE_SIZE) && (
                <nav className="flex items-center justify-between border-t border-admin-line px-5 py-3" aria-label="Pagination">
                    {page > 1 ? (
                        <Link href={href(page - 1)} className="inline-flex h-8 items-center gap-1 rounded-lg border border-admin-line px-3 text-sm hover:bg-admin-raised">
                            <ChevronLeft size={15} /> Newer
                        </Link>
                    ) : (
                        <span />
                    )}
                    <span className="text-xs text-admin-muted">Page {page}</span>
                    {shipments.length === PAGE_SIZE ? (
                        <Link href={href(page + 1)} className="inline-flex h-8 items-center gap-1 rounded-lg border border-admin-line px-3 text-sm hover:bg-admin-raised">
                            Older <ChevronRight size={15} />
                        </Link>
                    ) : (
                        <span />
                    )}
                </nav>
            )}
        </>
    );
}

/** Last `days` days as eShipz min/max dates (YYYY-MM-DD, IST). */
function dateRange(days: number) {
    const ymd = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    return { minDate: ymd(new Date(Date.now() - days * 86400_000)), maxDate: ymd(new Date()) };
}

function RangeTabs({ days, q }: { days: number; q: string }) {
    return (
        <div className="flex gap-1 rounded-lg border border-admin-line p-0.5">
            {RANGES.map((d) => (
                <Link
                    key={d}
                    href={`/admin/shipping?${new URLSearchParams({ days: String(d), ...(q ? { q } : {}) })}`}
                    className={`rounded-md px-2.5 py-1 text-xs transition ${
                        d === days ? "bg-admin-raised text-admin-text" : "text-admin-muted hover:text-admin-text"
                    }`}
                >
                    {d}d
                </Link>
            ))}
        </div>
    );
}

function RowsSkeleton() {
    return (
        <div className="divide-y divide-admin-line">
            {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="flex items-center gap-6 px-5 py-4">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-5 w-24" />
                </div>
            ))}
        </div>
    );
}
