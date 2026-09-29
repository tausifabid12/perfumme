"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
    Ban,
    CalendarClock,
    CircleCheck,
    FileDown,
    LoaderCircle,
    MapPin,
    RotateCcw,
    Send,
    TriangleAlert,
    Undo2,
    FileCheck,
} from "lucide-react";
import {
    bookShipmentAction,
    cancelShipmentAction,
    checkServicesAction,
    createManifestAction,
    ndrAction,
    podAction,
    schedulePickupAction,
    syncToShopifyAction,
    type ActionResult,
} from "@/lib/admin/actions";
import type { ServiceOption } from "@/lib/admin/eshipz";

// ── Shared bits ──────────────────────────────────────────────────────────────

const btn =
    "inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-admin-line bg-admin-surface px-3 text-sm text-admin-text transition hover:bg-admin-raised disabled:pointer-events-none disabled:opacity-50";
const btnPrimary =
    "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-admin-accent px-4 text-sm font-semibold text-[#1A140C] transition hover:brightness-110 disabled:pointer-events-none disabled:opacity-50";
const btnDanger =
    "inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 text-sm text-rose-200 transition hover:bg-rose-400/20 disabled:opacity-50";
const input =
    "h-10 w-full rounded-xl border border-admin-line bg-admin-bg px-3 text-sm text-admin-text outline-none transition focus:border-admin-accent/50 focus:ring-2 focus:ring-admin-accent/15 [color-scheme:dark]";

type Notice = { tone: "ok" | "error" | "warn"; text: string } | null;

function NoticeLine({ notice }: { notice: Notice }) {
    if (!notice) return null;
    const cls =
        notice.tone === "ok"
            ? "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-200"
            : notice.tone === "warn"
              ? "border-amber-400/20 bg-amber-400/[0.06] text-amber-200"
              : "border-rose-400/20 bg-rose-400/[0.06] text-rose-200";
    const Icon = notice.tone === "ok" ? CircleCheck : TriangleAlert;
    return (
        <p role="status" className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${cls}`}>
            <Icon size={15} className="mt-0.5 shrink-0" />
            {notice.text}
        </p>
    );
}

/** Run a server action with pending state + result notice. */
function useAction() {
    const [pending, start] = useTransition();
    const [notice, setNotice] = useState<Notice>(null);
    const run = <T,>(fn: () => Promise<ActionResult<T>>, okText: string | ((r: T) => string), after?: (r: T) => void) => {
        setNotice(null);
        start(async () => {
            const res = await fn();
            if (res.ok) {
                setNotice({ tone: "ok", text: typeof okText === "function" ? okText(res as T) : okText });
                after?.(res as T);
            } else setNotice({ tone: "error", text: res.error });
        });
    };
    return { pending, notice, setNotice, run };
}

const todayIST = () => new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10);

/** Next sensible pickup slot: today 2 PM, or tomorrow 11 AM if that's passed. */
function defaultPickup(): string {
    const nowIst = new Date(Date.now() + 5.5 * 3600_000);
    const hour = nowIst.getUTCHours();
    if (hour < 13) return `${nowIst.toISOString().slice(0, 10)}T14:00`;
    const t = new Date(nowIst.getTime() + 86400_000);
    return `${t.toISOString().slice(0, 10)}T11:00`;
}

// ── Book shipment ────────────────────────────────────────────────────────────

export function BookShipment({
    orderId,
    defaults,
    defaultService,
    alreadyFulfilled,
}: {
    orderId: string;
    defaults: { weightKg: number; length: number; width: number; height: number };
    defaultService: string;
    alreadyFulfilled: boolean;
}) {
    const [weightKg, setWeight] = useState(String(defaults.weightKg));
    const [dims, setDims] = useState({ length: String(defaults.length), width: String(defaults.width), height: String(defaults.height) });
    const [service, setService] = useState(defaultService);
    const [markFulfilled, setMarkFulfilled] = useState(true);
    const [notify, setNotify] = useState(true);
    const [confirming, setConfirming] = useState(false);

    const [checking, setChecking] = useState(false);
    const [pincode, setPincode] = useState<boolean | null>(null);
    const [services, setServices] = useState<ServiceOption[]>([]);
    const [checkError, setCheckError] = useState("");
    const { pending, notice, run } = useAction();
    const serviceTouched = useRef(false);

    const parcel = {
        weightKg: Number(weightKg),
        length: Number(dims.length),
        width: Number(dims.width),
        height: Number(dims.height),
    };
    const parcelKey = JSON.stringify(parcel);

    // Re-check serviceability whenever the parcel changes (debounced)
    useEffect(() => {
        const t = setTimeout(async () => {
            setChecking(true);
            setCheckError("");
            const res = await checkServicesAction(orderId, JSON.parse(parcelKey));
            setChecking(false);
            if (!res.ok) {
                setCheckError(res.error);
                return;
            }
            setPincode(res.pincode);
            setServices(res.services);
            // Pre-select the configured default if available, else the first available service
            if (!serviceTouched.current) {
                const avail = res.services.filter((s) => s.available);
                if (avail.length && !avail.some((s) => s.serviceType === defaultService)) setService(avail[0].serviceType);
                else setService(defaultService);
            }
        }, 500);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parcelKey, orderId]);

    const selected = services.find((s) => s.serviceType === service);
    const lane = pincode;

    const book = () =>
        run(
            () => bookShipmentAction(orderId, { ...parcel, serviceType: service, markFulfilled, notifyCustomer: notify }),
            (r: { awb: string; warning?: string }) => `Booked — AWB ${r.awb}.${r.warning ? " " + r.warning : ""}`,
            (r: { labelUrl: string | null }) => {
                setConfirming(false);
                if (r.labelUrl) window.open(r.labelUrl, "_blank", "noopener");
            }
        );

    return (
        <div className="space-y-5">
            {/* Lane check */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
                <MapPin size={15} className="text-admin-muted" />
                {checking ? (
                    <span className="flex items-center gap-2 text-admin-muted">
                        <LoaderCircle size={13} className="animate-spin" /> Checking Blue Dart serviceability…
                    </span>
                ) : checkError ? (
                    <span className="text-amber-300">{checkError}</span>
                ) : lane === null ? (
                    <span className="text-admin-muted">Serviceability unknown for this pincode.</span>
                ) : lane ? (
                    <span className="text-emerald-300">Blue Dart delivers to this pincode.</span>
                ) : (
                    <span className="text-rose-300">Blue Dart doesn&apos;t deliver to this pincode.</span>
                )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-admin-muted">Weight (kg)</span>
                    <input type="number" step="0.05" min="0.05" value={weightKg} onChange={(e) => setWeight(e.target.value)} className={input} />
                </label>
                <div>
                    <span className="mb-1.5 block text-xs font-medium text-admin-muted">Box L × W × H (cm)</span>
                    <div className="grid grid-cols-3 gap-2">
                        {(["length", "width", "height"] as const).map((k) => (
                            <input
                                key={k}
                                type="number"
                                min="1"
                                aria-label={k}
                                value={dims[k]}
                                onChange={(e) => setDims((d) => ({ ...d, [k]: e.target.value }))}
                                className={input}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Service */}
            <div>
                <span className="mb-1.5 block text-xs font-medium text-admin-muted">Blue Dart service</span>
                {services.length > 0 ? (
                    <div className="grid gap-2 sm:grid-cols-2">
                        {services.map((s) => (
                            <button
                                key={s.serviceType}
                                type="button"
                                disabled={!s.available}
                                title={s.error ?? undefined}
                                onClick={() => {
                                    serviceTouched.current = true;
                                    setService(s.serviceType);
                                }}
                                className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition disabled:opacity-40 ${
                                    service === s.serviceType
                                        ? "border-admin-accent/60 bg-admin-accent/10"
                                        : "border-admin-line bg-admin-bg hover:border-white/20"
                                }`}
                            >
                                <span>
                                    <span className="block font-medium">{s.serviceType}</span>
                                    <span className="block text-xs text-admin-muted">
                                        {s.available ? s.transitTime ?? "Available" : s.error ?? "Not available"}
                                    </span>
                                </span>
                                {s.charge != null && <span className="text-sm font-medium">₹{s.charge}</span>}
                            </button>
                        ))}
                    </div>
                ) : (
                    <input
                        value={service}
                        onChange={(e) => {
                            serviceTouched.current = true;
                            setService(e.target.value);
                        }}
                        className={`${input} font-mono`}
                        aria-label="Service type"
                    />
                )}
            </div>

            <div className="space-y-2">
                <label className="flex items-center gap-2.5 text-sm">
                    <input type="checkbox" checked={markFulfilled} onChange={(e) => setMarkFulfilled(e.target.checked)} className="h-4 w-4 accent-[#C9A36A]" />
                    {alreadyFulfilled ? "Add the AWB to the Shopify fulfillment" : "Mark as fulfilled in Shopify with tracking"}
                </label>
                <label className={`flex items-center gap-2.5 text-sm ${markFulfilled ? "" : "opacity-40"}`}>
                    <input
                        type="checkbox"
                        checked={notify && markFulfilled}
                        disabled={!markFulfilled}
                        onChange={(e) => setNotify(e.target.checked)}
                        className="h-4 w-4 accent-[#C9A36A]"
                    />
                    Email the customer their tracking link
                </label>
            </div>

            <NoticeLine notice={notice} />

            {confirming ? (
                <div className="flex flex-col gap-3 rounded-xl border border-admin-accent/30 bg-admin-accent/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm">
                        Book <span className="font-semibold">{service}</span> · {parcel.weightKg} kg ·{" "}
                        prepaid
                        {selected?.charge != null && <> · ₹{selected.charge}</>}?
                    </p>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setConfirming(false)} disabled={pending} className={btn}>
                            Back
                        </button>
                        <button type="button" onClick={book} disabled={pending} className={btnPrimary}>
                            {pending && <LoaderCircle size={15} className="animate-spin" />}
                            {pending ? "Booking…" : "Confirm booking"}
                        </button>
                    </div>
                </div>
            ) : (
                <button type="button" onClick={() => setConfirming(true)} disabled={!service || lane === false} className={`${btnPrimary} w-full sm:w-auto`}>
                    <Send size={15} /> Book Blue Dart shipment
                </button>
            )}
        </div>
    );
}

// ── Actions on an existing shipment ──────────────────────────────────────────

export function ShipmentActions({
    orderId,
    eshipzId,
    awb,
    labelUrl,
    inShopify,
    delivered,
    exception,
    pickupRequested,
}: {
    orderId?: string;
    eshipzId: string;
    awb: string;
    labelUrl: string | null;
    inShopify: boolean;
    delivered: boolean;
    exception: boolean;
    pickupRequested: boolean;
}) {
    const [panel, setPanel] = useState<null | "pickup" | "cancel" | "reattempt" | "rto">(null);
    const [pickAt, setPickAt] = useState(defaultPickup);
    const [reDate, setReDate] = useState(todayIST);
    const [comments, setComments] = useState("");
    const { pending, notice, run } = useAction();
    const close = () => setPanel(null);

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                {labelUrl && (
                    <a href={labelUrl} target="_blank" rel="noopener noreferrer" className={btn}>
                        <FileDown size={14} /> Label
                    </a>
                )}
                {!delivered && (
                    <button type="button" className={btn} onClick={() => setPanel(panel === "pickup" ? null : "pickup")}>
                        <CalendarClock size={14} /> {pickupRequested ? "Reschedule pickup" : "Schedule pickup"}
                    </button>
                )}
                {orderId && !inShopify && (
                    <button
                        type="button"
                        className={btn}
                        disabled={pending}
                        onClick={() => run(() => syncToShopifyAction(orderId, awb, true), "Shopify updated and customer emailed.")}
                    >
                        <Send size={14} /> Sync to Shopify
                    </button>
                )}
                {exception && (
                    <>
                        <button type="button" className={btn} onClick={() => setPanel(panel === "reattempt" ? null : "reattempt")}>
                            <RotateCcw size={14} /> Re-attempt delivery
                        </button>
                        <button type="button" className={btn} onClick={() => setPanel(panel === "rto" ? null : "rto")}>
                            <Undo2 size={14} /> Return to origin
                        </button>
                    </>
                )}
                {delivered && (
                    <button
                        type="button"
                        className={btn}
                        disabled={pending}
                        onClick={() =>
                            run(() => podAction(awb), "Proof of delivery opened.", (r: { url: string }) => window.open(r.url, "_blank", "noopener"))
                        }
                    >
                        <FileCheck size={14} /> Proof of delivery
                    </button>
                )}
                {!delivered && (
                    <button type="button" className={`${btn} ml-auto text-rose-300`} onClick={() => setPanel(panel === "cancel" ? null : "cancel")}>
                        <Ban size={14} /> Cancel
                    </button>
                )}
            </div>

            {panel === "pickup" && (
                <InlinePanel>
                    <label className="block flex-1">
                        <span className="mb-1.5 block text-xs font-medium text-admin-muted">Pickup date & time (IST)</span>
                        <input type="datetime-local" value={pickAt} onChange={(e) => setPickAt(e.target.value)} className={input} />
                    </label>
                    <button
                        type="button"
                        className={btnPrimary}
                        disabled={pending}
                        onClick={() => run(() => schedulePickupAction([eshipzId], pickAt), "Pickup requested with Blue Dart.", close)}
                    >
                        {pending && <LoaderCircle size={15} className="animate-spin" />} Request pickup
                    </button>
                </InlinePanel>
            )}

            {panel === "reattempt" && (
                <InlinePanel>
                    <label className="block">
                        <span className="mb-1.5 block text-xs font-medium text-admin-muted">Re-attempt on</span>
                        <input type="date" min={todayIST()} value={reDate} onChange={(e) => setReDate(e.target.value)} className={input} />
                    </label>
                    <label className="block flex-1">
                        <span className="mb-1.5 block text-xs font-medium text-admin-muted">Note for courier (optional)</span>
                        <input value={comments} maxLength={250} onChange={(e) => setComments(e.target.value)} placeholder="Customer available after 5 PM" className={input} />
                    </label>
                    <button
                        type="button"
                        className={btnPrimary}
                        disabled={pending}
                        onClick={() => run(() => ndrAction(awb, "reattempt", { date: reDate, comments }), "Re-attempt requested.", close)}
                    >
                        {pending && <LoaderCircle size={15} className="animate-spin" />} Send
                    </button>
                </InlinePanel>
            )}

            {panel === "rto" && (
                <ConfirmPanel
                    text="Return this parcel to your warehouse? Blue Dart will stop delivery attempts."
                    confirmLabel="Return to origin"
                    pending={pending}
                    onCancel={close}
                    onConfirm={() => run(() => ndrAction(awb, "return", { comments }), "Return to origin requested.", close)}
                />
            )}

            {panel === "cancel" && (
                <ConfirmPanel
                    text={`Cancel shipment ${awb}? The AWB can't be reused. Shopify's fulfillment is not changed.`}
                    confirmLabel="Cancel shipment"
                    pending={pending}
                    onCancel={close}
                    onConfirm={() => run(() => cancelShipmentAction(eshipzId), "Shipment cancelled.", close)}
                />
            )}

            <NoticeLine notice={notice} />
        </div>
    );
}

function InlinePanel({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-admin-line bg-admin-bg/60 p-4 sm:flex-row sm:items-end">{children}</div>
    );
}

function ConfirmPanel({
    text,
    confirmLabel,
    pending,
    onCancel,
    onConfirm,
}: {
    text: string;
    confirmLabel: string;
    pending: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}) {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-rose-400/25 bg-rose-400/[0.05] p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-rose-100/90">{text}</p>
            <div className="flex shrink-0 gap-2">
                <button type="button" className={btn} onClick={onCancel} disabled={pending}>
                    Keep
                </button>
                <button type="button" className={btnDanger} onClick={onConfirm} disabled={pending}>
                    {pending && <LoaderCircle size={14} className="animate-spin" />} {confirmLabel}
                </button>
            </div>
        </div>
    );
}

// ── Bulk actions on the Shipping page ────────────────────────────────────────

export function BulkShipmentBar({ ids, onClear }: { ids: string[]; onClear: () => void }) {
    const [pickAt, setPickAt] = useState(defaultPickup);
    const [showPickup, setShowPickup] = useState(false);
    const { pending, notice, run } = useAction();

    return (
        <div className="sticky bottom-4 z-20 mx-auto w-full max-w-3xl space-y-2">
            <NoticeLine notice={notice} />
            <div className="flex flex-col gap-3 rounded-2xl border border-admin-line bg-admin-raised/95 p-3 shadow-2xl shadow-black/50 backdrop-blur sm:flex-row sm:items-center">
                <p className="px-2 text-sm">
                    <span className="font-semibold">{ids.length}</span> selected
                    <button type="button" onClick={onClear} className="ml-3 text-xs text-admin-muted hover:text-admin-text">
                        Clear
                    </button>
                </p>
                <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
                    {showPickup && (
                        <input
                            type="datetime-local"
                            value={pickAt}
                            onChange={(e) => setPickAt(e.target.value)}
                            className={`${input} h-9 w-auto`}
                            aria-label="Pickup time"
                        />
                    )}
                    <button
                        type="button"
                        className={btn}
                        disabled={pending}
                        onClick={() =>
                            showPickup
                                ? run(() => schedulePickupAction(ids, pickAt), `Pickup requested for ${ids.length} shipment(s).`, () => setShowPickup(false))
                                : setShowPickup(true)
                        }
                    >
                        <CalendarClock size={14} /> {showPickup ? "Confirm pickup" : "Schedule pickup"}
                    </button>
                    <button
                        type="button"
                        className={btnPrimary + " h-9"}
                        disabled={pending}
                        onClick={() =>
                            run(
                                () => createManifestAction(ids),
                                (r: { userManifestId: string }) => `Manifest ${r.userManifestId} created.`,
                                (r: { manifestId: string }) =>
                                    window.open(`/api/admin/eshipz/manifest?id=${encodeURIComponent(r.manifestId)}`, "_blank", "noopener")
                            )
                        }
                    >
                        {pending ? <LoaderCircle size={14} className="animate-spin" /> : <FileDown size={14} />} Handover manifest
                    </button>
                </div>
            </div>
        </div>
    );
}
