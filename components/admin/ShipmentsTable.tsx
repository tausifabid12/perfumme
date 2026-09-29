"use client";

import { useState } from "react";
import Link from "next/link";
import { FileDown } from "lucide-react";
import type { Tone } from "@/lib/admin/format";
import { Badge } from "./ui";
import { Copyable } from "./client";
import { BulkShipmentBar } from "./shipping-client";

export interface ShipmentRow {
    eshipzId: string;
    awb: string;
    reference: string;
    orderHref: string | null;
    customer: string;
    city: string;
    service: string;
    created: string;
    statusLabel: string;
    statusTone: Tone;
    pickupRequested: boolean;
    labelUrl: string | null;
    selectable: boolean;
}

export default function ShipmentsTable({ rows }: { rows: ShipmentRow[] }) {
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const selectable = rows.filter((r) => r.selectable);
    const allSelected = selectable.length > 0 && selectable.every((r) => selected.has(r.eshipzId));

    const toggle = (id: string) =>
        setSelected((s) => {
            const n = new Set(s);
            if (n.has(id)) n.delete(id);
            else n.add(id);
            return n;
        });

    return (
        <>
            <div className="hidden grid-cols-[28px_1fr_1.1fr_1.4fr_1fr_1fr_40px] items-center gap-4 border-b border-admin-line px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-admin-muted md:grid">
                <input
                    type="checkbox"
                    aria-label="Select all"
                    checked={allSelected}
                    onChange={() => setSelected(allSelected ? new Set() : new Set(selectable.map((r) => r.eshipzId)))}
                    className="h-4 w-4 accent-[#C9A36A]"
                />
                <span>Order</span>
                <span>AWB</span>
                <span>Customer</span>
                <span>Service</span>
                <span>Status</span>
                <span />
            </div>

            <ul className="divide-y divide-admin-line">
                {rows.map((r) => (
                    <li
                        key={r.eshipzId}
                        className={`grid grid-cols-[28px_1fr_auto] items-center gap-x-4 gap-y-1.5 px-5 py-3.5 text-sm transition md:grid-cols-[28px_1fr_1.1fr_1.4fr_1fr_1fr_40px] ${
                            selected.has(r.eshipzId) ? "bg-admin-accent/[0.05]" : ""
                        }`}
                    >
                        <input
                            type="checkbox"
                            aria-label={`Select ${r.awb}`}
                            disabled={!r.selectable}
                            checked={selected.has(r.eshipzId)}
                            onChange={() => toggle(r.eshipzId)}
                            className="h-4 w-4 accent-[#C9A36A] disabled:opacity-30"
                        />
                        <div>
                            {r.orderHref ? (
                                <Link href={r.orderHref} className="font-semibold hover:text-admin-accent">
                                    #{r.reference}
                                </Link>
                            ) : (
                                <span className="font-semibold">{r.reference || "—"}</span>
                            )}
                            <p className="text-xs text-admin-muted">{r.created}</p>
                        </div>
                        <div className="justify-self-end md:justify-self-start">
                            <Copyable value={r.awb} />
                        </div>
                        <div className="col-start-2 min-w-0 md:col-start-auto">
                            <p className="truncate">{r.customer || "—"}</p>
                            <p className="truncate text-xs text-admin-muted">{r.city}</p>
                        </div>
                        <p className="hidden truncate text-admin-muted md:block">
                            {r.service}
                        </p>
                        <div className="col-start-2 flex flex-wrap gap-1.5 md:col-start-auto">
                            <Badge tone={r.statusTone}>{r.statusLabel}</Badge>
                            {r.pickupRequested && <Badge tone="blue" dot={false}>Pickup</Badge>}
                        </div>
                        <div className="hidden md:block">
                            {r.labelUrl && (
                                <a
                                    href={r.labelUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Download label"
                                    aria-label={`Download label for ${r.awb}`}
                                    className="grid h-8 w-8 place-items-center rounded-lg text-admin-muted hover:bg-white/5 hover:text-admin-text"
                                >
                                    <FileDown size={15} />
                                </a>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

            {selected.size > 0 && (
                <div className="px-4 pb-4">
                    <BulkShipmentBar ids={[...selected]} onClear={() => setSelected(new Set())} />
                </div>
            )}
        </>
    );
}
