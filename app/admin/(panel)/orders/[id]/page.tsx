import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    ArrowLeft,
    BadgeCheck,
    CreditCard,
    FileDown,
    FileText,
    History,
    MapPin,
    Package,
    Receipt,
    StickyNote,
    Truck,
    TriangleAlert,
    User,
} from "lucide-react";
import PhonePePayment, { reconcile } from "@/components/admin/PhonePePayment";
import ShippingPanel from "@/components/admin/ShippingPanel";
import { NoteTagsEditor, OrderStatusActions } from "@/components/admin/order-actions";
import { CopyButton, Copyable, RefreshButton } from "@/components/admin/client";
import { Badge, Card, CardHeader, ErrorNotice, Field, Skeleton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import {
    financialTone,
    formatDate,
    formatMoney,
    fulfillmentTone,
    humanize,
    stripHtml,
    txTone,
} from "@/lib/admin/format";
import { getPhonePeStatuses } from "@/lib/admin/phonepe";
import { getOrder, isPhonePeGateway, phonePeOrderIds, type Address, type OrderDetail } from "@/lib/admin/shopify-admin";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    return { title: `Order ${(await params).id}` };
}

const STORE_HANDLE = (process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "").replace(".myshopify.com", "");

export default async function OrderPage({ params }: { params: Params }) {
    await requireAdmin();
    const { id } = await params;

    let order: OrderDetail | null;
    try {
        order = await getOrder(id);
    } catch (err) {
        return (
            <div className="space-y-6">
                <BackLink />
                <ErrorNotice title="Couldn't load this order" message={err instanceof Error ? err.message : "Unknown error"} />
            </div>
        );
    }
    if (!order) notFound();

    const currency = order.totalPriceSet?.shopMoney.currencyCode ?? "INR";
    const money = (set: { shopMoney: { amount: string } } | null) => formatMoney(set?.shopMoney.amount ?? 0, currency);
    const phonePeIds = phonePeOrderIds(order.transactions);
    const total = Number(order.totalPriceSet?.shopMoney.amount ?? 0);

    return (
        <div className="space-y-6">
            <BackLink />

            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-semibold tracking-tight">{order.name}</h1>
                        {order.cancelledAt ? (
                            <Badge tone="red">Cancelled</Badge>
                        ) : (
                            <Badge tone={financialTone(order.displayFinancialStatus)}>
                                {humanize(order.displayFinancialStatus)}
                            </Badge>
                        )}
                        <Badge tone={fulfillmentTone(order.displayFulfillmentStatus)}>
                            {humanize(order.displayFulfillmentStatus)}
                        </Badge>
                        {order.test && <Badge tone="violet">Test</Badge>}
                        {order.closed && <Badge tone="neutral">Archived</Badge>}
                    </div>
                    <p className="mt-2 text-sm text-admin-muted">
                        Placed {formatDate(order.createdAt)} · {order.currentSubtotalLineItemsQuantity} item
                        {order.currentSubtotalLineItemsQuantity === 1 ? "" : "s"} · {money(order.totalPriceSet)}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <RefreshButton />
                    <a
                        href={`/admin/invoice/${order.legacyResourceId}`}
                        target="_blank"
                        rel="noopener"
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-admin-line bg-admin-surface px-3 text-sm transition hover:bg-admin-raised"
                    >
                        <FileText size={14} /> Invoice
                    </a>
                    <a
                        href={`/api/admin/orders/${order.legacyResourceId}/csv`}
                        download
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-admin-line bg-admin-surface px-3 text-sm transition hover:bg-admin-raised"
                        title="Download order details (CSV)"
                    >
                        <FileDown size={14} /> CSV
                    </a>
                    <OrderStatusActions
                        orderId={order.legacyResourceId}
                        orderName={order.name}
                        shopifyUrl={STORE_HANDLE ? `https://admin.shopify.com/store/${STORE_HANDLE}/orders/${order.legacyResourceId}` : null}
                        cancelled={!!order.cancelledAt}
                        archived={order.closed}
                        canMarkAsPaid={order.canMarkAsPaid}
                        canFulfill={order.fulfillmentOrders.nodes.some((fo) => fo.supportedActions.some((a) => a.action === "CREATE_FULFILLMENT"))}
                        paid={["PAID", "PARTIALLY_REFUNDED"].includes(order.displayFinancialStatus ?? "")}
                        total={money(order.totalPriceSet)}
                    />
                </div>
            </div>

            {order.cancelledAt && (
                <div className="flex items-start gap-3 rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-4 py-3 text-sm">
                    <TriangleAlert size={16} className="mt-0.5 text-rose-300" />
                    <p className="text-rose-200/90">
                        Cancelled {formatDate(order.cancelledAt)}
                        {order.cancelReason && <> — {humanize(order.cancelReason)}</>}
                    </p>
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main column */}
                <div className="space-y-6 lg:col-span-2">
                    {/* PhonePe — streamed in so the page shows instantly */}
                    <Card>
                        <CardHeader
                            icon={<CreditCard size={15} />}
                            title="PhonePe payment"
                            subtitle="Live status from PhonePe"
                        />
                        <div className="space-y-3 p-5">
                            {phonePeIds.length ? (
                                <Suspense fallback={<Skeleton className="h-52" />}>
                                    <PhonePePanel ids={phonePeIds} total={total} />
                                </Suspense>
                            ) : (
                                <p className="text-sm text-admin-muted">
                                    This order wasn&apos;t paid through PhonePe
                                    {order.paymentGatewayNames.length > 0 && (
                                        <> — gateway: {order.paymentGatewayNames.join(", ")}</>
                                    )}
                                    .
                                </p>
                            )}
                        </div>
                    </Card>

                    {/* Blue Dart via eShipz — streamed */}
                    <Card>
                        <CardHeader
                            icon={<Truck size={15} />}
                            title="Blue Dart shipping"
                            subtitle="Book, track and manage the shipment"
                        />
                        <div className="p-5">
                            <Suspense fallback={<Skeleton className="h-64" />}>
                                <ShippingPanel order={order} />
                            </Suspense>
                        </div>
                    </Card>

                    {/* Items */}
                    <Card>
                        <CardHeader icon={<Package size={15} />} title="Items" subtitle={`${order.lineItems.nodes.length} line item(s)`} />
                        <ul className="divide-y divide-admin-line">
                            {order.lineItems.nodes.map((li) => (
                                <li key={li.id} className="flex items-center gap-4 px-5 py-4">
                                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-admin-raised ring-1 ring-inset ring-admin-line">
                                        {li.image && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={li.image.url} alt={li.image.altText ?? li.title} className="h-full w-full object-cover" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium">{li.title}</p>
                                        <p className="truncate text-xs text-admin-muted">
                                            {[li.variantTitle, li.sku && `SKU ${li.sku}`].filter(Boolean).join(" · ") || "—"}
                                        </p>
                                    </div>
                                    <p className="whitespace-nowrap text-sm text-admin-muted">
                                        {money(li.originalUnitPriceSet)} × {li.quantity}
                                    </p>
                                    <p className="w-24 text-right text-sm font-medium">{money(li.discountedTotalSet)}</p>
                                </li>
                            ))}
                        </ul>
                        <dl className="space-y-2 border-t border-admin-line px-5 py-4 text-sm">
                            <SummaryRow label="Subtotal" value={money(order.subtotalPriceSet)} />
                            {Number(order.totalDiscountsSet?.shopMoney.amount) > 0 && (
                                <SummaryRow
                                    label={`Discount${order.discountCodes.length ? ` (${order.discountCodes.join(", ")})` : ""}`}
                                    value={`−${money(order.totalDiscountsSet)}`}
                                />
                            )}
                            <SummaryRow
                                label={`Shipping${order.shippingLines.nodes[0] ? ` · ${order.shippingLines.nodes[0].title}` : ""}`}
                                value={money(order.totalShippingPriceSet)}
                            />
                            {Number(order.totalTaxSet?.shopMoney.amount) > 0 && (
                                <SummaryRow label="Tax" value={money(order.totalTaxSet)} />
                            )}
                            <div className="flex justify-between border-t border-admin-line pt-3 text-base font-semibold">
                                <dt>Total</dt>
                                <dd>{money(order.totalPriceSet)}</dd>
                            </div>
                            {Number(order.totalRefundedSet?.shopMoney.amount) > 0 && (
                                <SummaryRow label="Refunded" value={`−${money(order.totalRefundedSet)}`} tone="text-violet-300" />
                            )}
                            {Number(order.totalOutstandingSet?.shopMoney.amount) > 0 && (
                                <SummaryRow label="Outstanding" value={money(order.totalOutstandingSet)} tone="text-amber-300" />
                            )}
                        </dl>
                    </Card>

                    {/* Shopify transactions */}
                    <Card>
                        <CardHeader icon={<Receipt size={15} />} title="Shopify transactions" />
                        {order.transactions.length ? (
                            <ul className="divide-y divide-admin-line">
                                {order.transactions.map((t) => (
                                    <li key={t.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3.5 text-sm">
                                        <span className="w-20 font-medium">{humanize(t.kind)}</span>
                                        <Badge tone={txTone(t.status)}>{humanize(t.status)}</Badge>
                                        <span className="min-w-0 flex-1 truncate text-admin-muted">
                                            {isPhonePeGateway(t.gateway) ? "PhonePe" : t.formattedGateway ?? t.gateway}
                                            {t.errorCode && <span className="text-rose-300"> · {humanize(t.errorCode)}</span>}
                                        </span>
                                        <span className="text-xs text-admin-muted">{formatDate(t.createdAt)}</span>
                                        <span className="w-24 text-right font-medium">{money(t.amountSet)}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="px-5 py-4 text-sm text-admin-muted">No transactions recorded.</p>
                        )}
                    </Card>

                    {/* Timeline */}
                    {order.events.nodes.length > 0 && (
                        <Card>
                            <CardHeader icon={<History size={15} />} title="Timeline" />
                            <ol className="relative space-y-4 px-5 py-5">
                                <span aria-hidden className="absolute bottom-6 left-[27px] top-6 w-px bg-admin-line" />
                                {order.events.nodes.map((e) => (
                                    <li key={e.id} className="relative flex gap-4">
                                        <span className="relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-admin-surface bg-admin-muted" />
                                        <div className="min-w-0">
                                            <p className="text-sm">{stripHtml(e.message)}</p>
                                            <p className="text-xs text-admin-muted">{formatDate(e.createdAt)}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </Card>
                    )}
                </div>

                {/* Side column */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader icon={<User size={15} />} title="Customer" />
                        <dl className="space-y-4 p-5">
                            <Field label="Name">{order.customer?.displayName ?? order.shippingAddress?.name ?? "Guest"}</Field>
                            <Field label="Email">
                                {(order.customer?.email ?? order.email) ? (
                                    <Copyable value={(order.customer?.email ?? order.email)!} mono={false} />
                                ) : (
                                    "—"
                                )}
                            </Field>
                            <Field label="Phone">
                                {(order.customer?.phone ?? order.phone ?? order.shippingAddress?.phone) ? (
                                    <Copyable value={(order.customer?.phone ?? order.phone ?? order.shippingAddress?.phone)!} mono={false} />
                                ) : (
                                    "—"
                                )}
                            </Field>
                            {order.customer && (
                                <Field label="History">
                                    {order.customer.numberOfOrders} order{order.customer.numberOfOrders === "1" ? "" : "s"} ·{" "}
                                    {formatMoney(order.customer.amountSpent.amount, order.customer.amountSpent.currencyCode)} spent
                                </Field>
                            )}
                        </dl>
                    </Card>

                    <Card>
                        <CardHeader
                            icon={<MapPin size={15} />}
                            title="Shipping address"
                            action={order.shippingAddress ? <CopyButton value={formatAddress(order.shippingAddress).join("\n")} label="Copy address" /> : undefined}
                        />
                        <div className="p-5 text-sm leading-relaxed">
                            {order.shippingAddress ? (
                                formatAddress(order.shippingAddress).map((line, i) => (
                                    <p key={i} className={i === 0 ? "font-medium" : "text-admin-muted"}>
                                        {line}
                                    </p>
                                ))
                            ) : (
                                <p className="text-admin-muted">No shipping address.</p>
                            )}
                        </div>
                    </Card>

                    <Card>
                        <CardHeader icon={<Package size={15} />} title="Shopify fulfillment" />
                        <div className="space-y-4 p-5">
                            {order.fulfillments.length ? (
                                order.fulfillments.map((f) => (
                                    <div key={f.id} className="space-y-2 rounded-xl border border-admin-line bg-admin-bg/50 p-4">
                                        <div className="flex items-center justify-between gap-2">
                                            <Badge tone={f.deliveredAt ? "green" : "blue"}>{humanize(f.displayStatus)}</Badge>
                                            <span className="text-xs text-admin-muted">{formatDate(f.createdAt, false)}</span>
                                        </div>
                                        {f.trackingInfo.map((t, i) => (
                                            <div key={i} className="text-sm">
                                                <p className="text-admin-muted">{t.company ?? "Carrier"}</p>
                                                {t.number && (
                                                    <div className="flex items-center gap-2">
                                                        <Copyable value={t.number} />
                                                        {t.url && (
                                                            <a
                                                                href={t.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-admin-accent hover:underline"
                                                            >
                                                                Track
                                                            </a>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {f.deliveredAt && (
                                            <p className="flex items-center gap-1.5 text-xs text-emerald-300">
                                                <BadgeCheck size={13} /> Delivered {formatDate(f.deliveredAt)}
                                            </p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-admin-muted">Not shipped yet.</p>
                            )}
                        </div>
                    </Card>

                    <Card>
                        <CardHeader icon={<StickyNote size={15} />} title="Notes & tags" />
                        <div className="p-5">
                            <NoteTagsEditor orderId={order.legacyResourceId} note={order.note ?? ""} tags={order.tags} />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

async function PhonePePanel({ ids, total }: { ids: string[]; total: number }) {
    const results = await getPhonePeStatuses(ids);
    // A single successful payment should be checked against the whole order total
    const single = ids.length === 1;
    return (
        <>
            {ids.map((id) => {
                const result = results.get(id)!;
                const check = reconcile(result, single ? total : undefined);
                return (
                    <div key={id} className="space-y-3">
                        {single && check.tone !== "green" && result.ok && (
                            <p className="flex items-center gap-2 text-sm text-amber-300">
                                <TriangleAlert size={14} /> {check.label} — review before shipping.
                            </p>
                        )}
                        <PhonePePayment result={result} shopifyAmount={single ? total : undefined} />
                    </div>
                );
            })}
        </>
    );
}

function SummaryRow({ label, value, tone = "" }: { label: string; value: string; tone?: string }) {
    return (
        <div className={`flex justify-between gap-4 ${tone || "text-admin-muted"}`}>
            <dt className="truncate">{label}</dt>
            <dd className="whitespace-nowrap">{value}</dd>
        </div>
    );
}

function formatAddress(a: Address): string[] {
    return [
        a.name,
        a.company,
        a.address1,
        a.address2,
        [a.city, a.province, a.zip].filter(Boolean).join(", "),
        a.country,
        a.phone,
    ].filter((l): l is string => !!l);
}

function BackLink() {
    return (
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-admin-muted transition hover:text-admin-text">
            <ArrowLeft size={15} /> All orders
        </Link>
    );
}
