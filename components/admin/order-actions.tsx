"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
    Archive,
    ArchiveRestore,
    Ban,
    ChevronDown,
    CircleCheck,
    ExternalLink,
    IndianRupee,
    LoaderCircle,
    PackageCheck,
    Pencil,
    TriangleAlert,
} from "lucide-react";
import {
    archiveOrderAction,
    cancelOrderAction,
    fulfillManuallyAction,
    markPaidAction,
    updateNoteTagsAction,
    type ActionResult,
} from "@/lib/admin/actions";
import type { CancelReason } from "@/lib/admin/shopify-admin";

const btn =
    "inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-admin-line bg-admin-surface px-3 text-sm text-admin-text transition hover:bg-admin-raised disabled:pointer-events-none disabled:opacity-50";
const btnPrimary =
    "inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-admin-accent px-4 text-sm font-semibold text-[#1A140C] transition hover:brightness-110 disabled:opacity-50";
const btnDanger =
    "inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-rose-400/30 bg-rose-400/15 px-4 text-sm font-medium text-rose-100 transition hover:bg-rose-400/25 disabled:opacity-50";
const field =
    "h-10 w-full rounded-xl border border-admin-line bg-admin-bg px-3 text-sm text-admin-text outline-none transition focus:border-admin-accent/50 focus:ring-2 focus:ring-admin-accent/15 [color-scheme:dark]";

type Panel = null | "cancel" | "fulfill" | "paid" | "archive";
type Notice = { ok: boolean; text: string } | null;

function useRun() {
    const [pending, start] = useTransition();
    const [notice, setNotice] = useState<Notice>(null);
    const run = (fn: () => Promise<ActionResult>, okText: string, after?: () => void) => {
        setNotice(null);
        start(async () => {
            const res = await fn();
            if (res.ok) {
                setNotice({ ok: true, text: okText });
                after?.();
            } else setNotice({ ok: false, text: res.error });
        });
    };
    return { pending, notice, setNotice, run };
}

function NoticeLine({ notice }: { notice: Notice }) {
    if (!notice) return null;
    return (
        <p
            role="status"
            className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${
                notice.ok ? "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-200" : "border-rose-400/20 bg-rose-400/[0.06] text-rose-200"
            }`}
        >
            {notice.ok ? <CircleCheck size={15} className="mt-0.5 shrink-0" /> : <TriangleAlert size={15} className="mt-0.5 shrink-0" />}
            {notice.text}
        </p>
    );
}

const REASONS: { value: CancelReason; label: string }[] = [
    { value: "CUSTOMER", label: "Customer changed or cancelled order" },
    { value: "INVENTORY", label: "Items unavailable" },
    { value: "PAYMENT_DECLINED", label: "Payment declined" },
    { value: "FRAUD", label: "Fraudulent order" },
    { value: "STAFF_ERROR", label: "Staff error" },
    { value: "OTHER", label: "Other" },
];

/** "Manage" menu in the order header + the confirmation panel it opens. */
export function OrderStatusActions({
    orderId,
    orderName,
    shopifyUrl,
    cancelled,
    archived,
    canMarkAsPaid,
    canFulfill,
    paid,
    total,
}: {
    orderId: string;
    orderName: string;
    shopifyUrl: string | null;
    cancelled: boolean;
    archived: boolean;
    canMarkAsPaid: boolean;
    canFulfill: boolean;
    paid: boolean;
    total: string;
}) {
    const [open, setOpen] = useState(false);
    const [panel, setPanel] = useState<Panel>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const { pending, notice, setNotice, run } = useRun();

    const [reason, setReason] = useState<CancelReason>("CUSTOMER");
    const [refund, setRefund] = useState(paid);
    const [restock, setRestock] = useState(true);
    const [notifyCancel, setNotifyCancel] = useState(true);
    const [staffNote, setStaffNote] = useState("");
    const [notifyFulfill, setNotifyFulfill] = useState(true);

    // Close the menu on outside click / Escape
    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const choose = (p: Panel) => {
        setNotice(null);
        setPanel(p);
        setOpen(false);
    };
    const close = () => setPanel(null);

    const items: { key: Panel | "shopify"; label: string; icon: React.ReactNode; show: boolean; danger?: boolean }[] = [
        { key: "fulfill", label: "Mark as fulfilled", icon: <PackageCheck size={15} />, show: canFulfill && !cancelled },
        { key: "paid", label: "Mark as paid", icon: <IndianRupee size={15} />, show: canMarkAsPaid && !cancelled },
        {
            key: "archive",
            label: archived ? "Unarchive order" : "Archive order",
            icon: archived ? <ArchiveRestore size={15} /> : <Archive size={15} />,
            show: true,
        },
        { key: "cancel", label: "Cancel order", icon: <Ban size={15} />, show: !cancelled, danger: true },
    ];

    return (
        <>
            <div ref={menuRef} className="relative">
                <button
                    type="button"
                    className={btn}
                    aria-haspopup="menu"
                    aria-expanded={open}
                    onClick={() => setOpen((o) => !o)}
                >
                    Manage <ChevronDown size={14} className={`transition ${open ? "rotate-180" : ""}`} />
                </button>
                {open && (
                    <div
                        role="menu"
                        className="absolute right-0 top-11 z-30 w-56 overflow-hidden rounded-xl border border-admin-line bg-admin-raised py-1 shadow-2xl shadow-black/50"
                    >
                        {items
                            .filter((i) => i.show)
                            .map((i) => (
                                <button
                                    key={i.key}
                                    role="menuitem"
                                    type="button"
                                    onClick={() => choose(i.key as Panel)}
                                    className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm transition hover:bg-white/5 ${
                                        i.danger ? "text-rose-300" : "text-admin-text"
                                    }`}
                                >
                                    {i.icon}
                                    {i.label}
                                </button>
                            ))}
                        {shopifyUrl && (
                            <a
                                role="menuitem"
                                href={shopifyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 border-t border-admin-line px-3.5 py-2 text-sm text-admin-muted transition hover:bg-white/5 hover:text-admin-text"
                            >
                                <ExternalLink size={15} /> Open in Shopify
                            </a>
                        )}
                    </div>
                )}
            </div>

            {/* Confirmation sheet — bottom sheet on mobile, floating card on desktop */}
            {(panel || notice) && (
                <div className="fixed inset-x-0 bottom-0 z-40 p-4 sm:bottom-6 sm:left-auto sm:right-6 sm:w-[440px] sm:p-0">
                    <div className="space-y-3 rounded-2xl border border-admin-line bg-admin-raised p-5 shadow-2xl shadow-black/60">
                        {panel === "cancel" && (
                            <div className="space-y-4">
                                <div>
                                    <p className="font-semibold">Cancel {orderName}?</p>
                                    <p className="mt-1 text-sm text-admin-muted">This can&apos;t be undone.</p>
                                </div>
                                <label className="block">
                                    <span className="mb-1.5 block text-xs font-medium text-admin-muted">Reason</span>
                                    <select value={reason} onChange={(e) => setReason(e.target.value as CancelReason)} className={field}>
                                        {REASONS.map((r) => (
                                            <option key={r.value} value={r.value}>
                                                {r.label}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <div className="space-y-2 text-sm">
                                    {paid && (
                                        <Check checked={refund} onChange={setRefund}>
                                            Refund {total} to the original payment (PhonePe)
                                        </Check>
                                    )}
                                    <Check checked={restock} onChange={setRestock}>
                                        Restock items
                                    </Check>
                                    <Check checked={notifyCancel} onChange={setNotifyCancel}>
                                        Email the customer
                                    </Check>
                                </div>
                                <input
                                    value={staffNote}
                                    maxLength={255}
                                    onChange={(e) => setStaffNote(e.target.value)}
                                    placeholder="Internal note (optional)"
                                    className={field}
                                />
                                {paid && !refund && (
                                    <p className="text-xs text-amber-300">No refund will be issued — you&apos;ll need to refund manually.</p>
                                )}
                                <Buttons
                                    pending={pending}
                                    onBack={close}
                                    confirmClass={btnDanger}
                                    confirmLabel="Cancel order"
                                    onConfirm={() =>
                                        run(
                                            () => cancelOrderAction(orderId, { reason, refund: paid && refund, restock, notifyCustomer: notifyCancel, staffNote }),
                                            paid && refund ? "Order cancelled — refund started in Shopify." : "Order cancelled.",
                                            close
                                        )
                                    }
                                />
                            </div>
                        )}

                        {panel === "fulfill" && (
                            <div className="space-y-4">
                                <div>
                                    <p className="font-semibold">Mark {orderName} as fulfilled?</p>
                                    <p className="mt-1 text-sm text-admin-muted">
                                        Without a tracking number. To ship with Blue Dart, book it from the shipping card instead.
                                    </p>
                                </div>
                                <Check checked={notifyFulfill} onChange={setNotifyFulfill}>
                                    Email the customer a shipping confirmation
                                </Check>
                                <Buttons
                                    pending={pending}
                                    onBack={close}
                                    confirmClass={btnPrimary}
                                    confirmLabel="Mark fulfilled"
                                    onConfirm={() => run(() => fulfillManuallyAction(orderId, notifyFulfill), "Order marked as fulfilled.", close)}
                                />
                            </div>
                        )}

                        {panel === "paid" && (
                            <div className="space-y-4">
                                <div>
                                    <p className="font-semibold">Mark {orderName} as paid?</p>
                                    <p className="mt-1 text-sm text-admin-muted">
                                        Only do this if you received {total} outside Shopify. Check the PhonePe card first.
                                    </p>
                                </div>
                                <Buttons
                                    pending={pending}
                                    onBack={close}
                                    confirmClass={btnPrimary}
                                    confirmLabel="Mark as paid"
                                    onConfirm={() => run(() => markPaidAction(orderId), "Order marked as paid.", close)}
                                />
                            </div>
                        )}

                        {panel === "archive" && (
                            <div className="space-y-4">
                                <div>
                                    <p className="font-semibold">{archived ? "Unarchive" : "Archive"} {orderName}?</p>
                                    <p className="mt-1 text-sm text-admin-muted">
                                        {archived
                                            ? "The order goes back to your open orders."
                                            : "Archived orders are hidden from open orders in Shopify. Nothing else changes."}
                                    </p>
                                </div>
                                <Buttons
                                    pending={pending}
                                    onBack={close}
                                    confirmClass={btnPrimary}
                                    confirmLabel={archived ? "Unarchive" : "Archive"}
                                    onConfirm={() =>
                                        run(() => archiveOrderAction(orderId, !archived), archived ? "Order unarchived." : "Order archived.", close)
                                    }
                                />
                            </div>
                        )}

                        <NoticeLine notice={notice} />
                        {!panel && notice && (
                            <button type="button" className="text-xs text-admin-muted hover:text-admin-text" onClick={() => setNotice(null)}>
                                Dismiss
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

function Check({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
    return (
        <label className="flex items-center gap-2.5 text-sm">
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[#C9A36A]" />
            {children}
        </label>
    );
}

function Buttons({
    pending,
    onBack,
    onConfirm,
    confirmLabel,
    confirmClass,
}: {
    pending: boolean;
    onBack: () => void;
    onConfirm: () => void;
    confirmLabel: string;
    confirmClass: string;
}) {
    return (
        <div className="flex justify-end gap-2">
            <button type="button" className={btn} onClick={onBack} disabled={pending}>
                Back
            </button>
            <button type="button" className={confirmClass} onClick={onConfirm} disabled={pending}>
                {pending && <LoaderCircle size={14} className="animate-spin" />}
                {confirmLabel}
            </button>
        </div>
    );
}

/** Inline editor for the order note + tags (Notes card). */
export function NoteTagsEditor({ orderId, note, tags }: { orderId: string; note: string; tags: string[] }) {
    const [editing, setEditing] = useState(false);
    const [draftNote, setDraftNote] = useState(note);
    const [draftTags, setDraftTags] = useState(tags.join(", "));
    const { pending, notice, run } = useRun();

    if (!editing) {
        return (
            <div className="space-y-3 text-sm">
                {note ? <p className="whitespace-pre-wrap text-admin-muted">{note}</p> : <p className="text-admin-muted/60">No note.</p>}
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {tags.map((t) => (
                            <span key={t} className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-admin-muted">
                                {t}
                            </span>
                        ))}
                    </div>
                )}
                <button type="button" onClick={() => setEditing(true)} className="inline-flex items-center gap-1.5 text-xs text-admin-accent hover:underline">
                    <Pencil size={12} /> Edit note & tags
                </button>
                <NoticeLine notice={notice} />
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <textarea
                value={draftNote}
                onChange={(e) => setDraftNote(e.target.value)}
                rows={4}
                maxLength={5000}
                placeholder="Note (visible to staff in Shopify)"
                className={`${field} h-auto py-2`}
            />
            <input value={draftTags} onChange={(e) => setDraftTags(e.target.value)} placeholder="Tags, comma separated" className={field} />
            <NoticeLine notice={notice} />
            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    className={btn}
                    disabled={pending}
                    onClick={() => {
                        setDraftNote(note);
                        setDraftTags(tags.join(", "));
                        setEditing(false);
                    }}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className={btnPrimary}
                    disabled={pending}
                    onClick={() => run(() => updateNoteTagsAction(orderId, draftNote, draftTags), "Saved to Shopify.", () => setEditing(false))}
                >
                    {pending && <LoaderCircle size={14} className="animate-spin" />} Save
                </button>
            </div>
        </div>
    );
}
