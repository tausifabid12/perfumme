import { BadgeCheck, CircleDashed, Plug } from "lucide-react";
import {
    eshipzConfig,
    eshipzMissingConfig,
    getTracking,
    isCancelled,
    isException,
    shipmentsForOrder,
    type EshipzShipment,
    type Tracking,
} from "@/lib/admin/eshipz";
import { formatDate, tagLabel, trackingTone } from "@/lib/admin/format";
import {
    orderAwbs,
    orderWeightKg,
    shipmentReference,
    type OrderDetail,
} from "@/lib/admin/shopify-admin";
import { Badge, ErrorNotice } from "./ui";
import { Copyable } from "./client";
import { BookShipment, ShipmentActions } from "./shipping-client";

export default async function ShippingPanel({ order }: { order: OrderDetail }) {
    const missing = eshipzMissingConfig();
    if (missing.length) return <NotConnected missing={missing} />;

    const awbs = orderAwbs(order);
    let shipments: EshipzShipment[];
    try {
        shipments = await shipmentsForOrder(shipmentReference(order.name), awbs);
    } catch (err) {
        return <ErrorNotice title="Couldn't reach eShipz" message={err instanceof Error ? err.message : "Unknown error"} />;
    }

    const active = shipments.find((s) => !isCancelled(s));
    const cancelled = shipments.filter((s) => isCancelled(s));
    const tracking: Tracking | null = active ? await getTracking(active.awb).catch(() => null) : null;

    return (
        <div className="space-y-5">
            {active ? (
                <ActiveShipment order={order} shipment={active} tracking={tracking} inShopify={awbs.includes(active.awb)} />
            ) : order.cancelledAt ? (
                <p className="text-sm text-admin-muted">Order is cancelled — nothing to ship.</p>
            ) : (
                <BookShipment
                    orderId={order.legacyResourceId}
                    alreadyFulfilled={order.fulfillments.length > 0}
                    defaultService={eshipzConfig.servicePrepaid}
                    defaults={{
                        weightKg: Math.round((orderWeightKg(order) || eshipzConfig.defaultWeightKg) * 100) / 100,
                        ...eshipzConfig.defaultBox,
                    }}
                />
            )}

            {cancelled.length > 0 && (
                <details className="group rounded-xl border border-admin-line">
                    <summary className="flex list-none items-center justify-between px-4 py-2.5 text-xs text-admin-muted hover:text-admin-text">
                        {cancelled.length} cancelled shipment{cancelled.length > 1 ? "s" : ""}
                        <span className="transition group-open:rotate-180">▾</span>
                    </summary>
                    <ul className="divide-y divide-admin-line border-t border-admin-line text-sm">
                        {cancelled.map((s) => (
                            <li key={s.order_id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
                                <span className="font-mono text-[13px] text-admin-muted line-through">{s.awb}</span>
                                <span className="text-xs text-admin-muted">{s.creation_date ? formatDate(s.creation_date) : ""}</span>
                            </li>
                        ))}
                    </ul>
                </details>
            )}
        </div>
    );
}

function ActiveShipment({
    order,
    shipment,
    tracking,
    inShopify,
}: {
    order: OrderDetail;
    shipment: EshipzShipment;
    tracking: Tracking | null;
    inShopify: boolean;
}) {
    const tag = tracking?.tag ?? shipment.tracking_status ?? "InfoReceived";
    const delivered = /^delivered$/i.test(tag);
    const checkpoints = tracking?.checkpoints ?? [];
    const recent = checkpoints.slice(0, 6);
    const older = checkpoints.slice(6);

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge tone={trackingTone(tag)}>{tagLabel(tag)}</Badge>
                        {shipment.pickup_meta?.pickup_request && <Badge tone="blue" dot={false}>Pickup requested</Badge>}
                        {inShopify ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-300">
                                <BadgeCheck size={13} /> In Shopify
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-300">
                                <CircleDashed size={13} /> Not in Shopify yet
                            </span>
                        )}
                    </div>
                    <p className="flex items-center gap-2 text-sm">
                        <span className="text-admin-muted">AWB</span> <Copyable value={shipment.awb} />
                    </p>
                </div>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-right text-xs text-admin-muted">
                    <dt>Service</dt>
                    <dd className="text-admin-text">{shipment.service_type ?? "—"}</dd>
                    {shipment.charge_weight?.value != null && (
                        <>
                            <dt>Weight</dt>
                            <dd className="text-admin-text">
                                {shipment.charge_weight.value} {shipment.charge_weight.unit?.toLowerCase()}
                            </dd>
                        </>
                    )}
                    {(tracking?.delivery_date || tracking?.expected_delivery_date) && (
                        <>
                            <dt>{tracking?.delivery_date ? "Delivered" : "Expected"}</dt>
                            <dd className="text-admin-text">
                                {formatDate((tracking.delivery_date ?? tracking.expected_delivery_date)!, false)}
                            </dd>
                        </>
                    )}
                </dl>
            </div>

            <ShipmentActions
                orderId={order.legacyResourceId}
                eshipzId={shipment.order_id}
                awb={shipment.awb}
                labelUrl={shipment.label_meta?.url ?? null}
                inShopify={inShopify}
                delivered={delivered}
                exception={isException(tag)}
                pickupRequested={!!shipment.pickup_meta?.pickup_request}
            />

            {/* Tracking timeline */}
            {checkpoints.length > 0 ? (
                <div className="rounded-xl border border-admin-line bg-admin-bg/40 px-4 py-4">
                    <Timeline items={recent} />
                    {older.length > 0 && (
                        <details className="group mt-3">
                            <summary className="list-none text-xs text-admin-muted hover:text-admin-text">
                                <span className="group-open:hidden">Show {older.length} earlier scans</span>
                                <span className="hidden group-open:inline">Hide earlier scans</span>
                            </summary>
                            <div className="mt-3">
                                <Timeline items={older} muted />
                            </div>
                        </details>
                    )}
                </div>
            ) : (
                <p className="text-sm text-admin-muted">No scans yet — tracking starts once Blue Dart picks up the parcel.</p>
            )}
        </div>
    );
}

function Timeline({ items, muted = false }: { items: Tracking["checkpoints"]; muted?: boolean }) {
    return (
        <ol className="relative space-y-3.5">
            <span aria-hidden className="absolute bottom-2 left-[4px] top-2 w-px bg-admin-line" />
            {items.map((c, i) => {
                const tone = trackingTone(c.tag);
                const dot =
                    !muted && i === 0
                        ? tone === "green"
                            ? "bg-emerald-400"
                            : tone === "red"
                              ? "bg-rose-400"
                              : "bg-admin-accent"
                        : "bg-admin-muted/60";
                return (
                    <li key={`${c.date}-${i}`} className="relative flex gap-3.5">
                        <span className={`relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-admin-surface ${dot}`} />
                        <div className="min-w-0">
                            <p className={`text-sm ${!muted && i === 0 ? "font-medium" : "text-admin-text/85"}`}>{c.remark ?? tagLabel(c.tag)}</p>
                            <p className="text-xs text-admin-muted">
                                {[c.city, formatDate(c.date)].filter(Boolean).join(" · ")}
                            </p>
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}

export function NotConnected({ missing }: { missing: string[] }) {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-dashed border-admin-line p-4">
            <Plug size={17} className="mt-0.5 shrink-0 text-admin-accent" />
            <div className="min-w-0 text-sm">
                <p className="font-medium">Connect Blue Dart (via eShipz)</p>
                <p className="mt-1 text-admin-muted">Add these to your environment and restart:</p>
                <p className="mt-2 flex flex-wrap gap-1.5">
                    {missing.map((k) => (
                        <code key={k} className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-admin-text">
                            {k}
                        </code>
                    ))}
                </p>
            </div>
        </div>
    );
}
