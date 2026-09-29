import { CircleCheck, CircleX, Hourglass, TriangleAlert } from "lucide-react";
import { primaryAttempt, type PhonePeResult } from "@/lib/admin/phonepe";
import { formatDate, formatMoney, humanize, paiseToRupees, phonePeTone } from "@/lib/admin/format";
import { Badge, Field } from "./ui";
import { Copyable } from "./client";

/** Compare PhonePe's amount with what Shopify says the order is worth. */
export function reconcile(result: PhonePeResult, shopifyAmount?: number) {
    if (!result.ok) return { tone: "red" as const, label: result.notFound ? "Not found on PhonePe" : "Couldn't verify" };
    const { state, amount } = result.data;
    if (state === "FAILED") return { tone: "red" as const, label: "Payment failed" };
    if (state === "PENDING") return { tone: "amber" as const, label: "Awaiting payment" };
    if (shopifyAmount !== undefined && Math.abs(paiseToRupees(amount) - shopifyAmount) > 0.5) {
        return { tone: "amber" as const, label: "Amount mismatch" };
    }
    return { tone: "green" as const, label: "Verified" };
}

export default function PhonePePayment({ result, shopifyAmount }: { result: PhonePeResult; shopifyAmount?: number }) {
    if (!result.ok) {
        return (
            <div className="flex items-start gap-3 rounded-xl border border-admin-line bg-admin-bg/50 p-4">
                <TriangleAlert size={17} className="mt-0.5 shrink-0 text-amber-300" />
                <div className="min-w-0 text-sm">
                    <p className="font-medium text-admin-text">{result.error}</p>
                    <p className="mt-1 text-admin-muted">
                        Merchant order id <Copyable value={result.merchantOrderId} />
                    </p>
                </div>
            </div>
        );
    }

    const s = result.data;
    const attempt = primaryAttempt(s);
    const check = reconcile(result, shopifyAmount);
    const StateIcon = s.state === "COMPLETED" ? CircleCheck : s.state === "FAILED" ? CircleX : Hourglass;
    const stateColor =
        s.state === "COMPLETED" ? "text-emerald-400" : s.state === "FAILED" ? "text-rose-400" : "text-amber-300";
    const instrument = attempt?.instrument;
    const rail = attempt?.rail;
    const extraAttempts = (s.paymentDetails ?? []).filter((a) => a !== attempt);

    return (
        <div className="overflow-hidden rounded-xl border border-admin-line bg-admin-bg/50">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-admin-line px-4 py-3.5">
                <div className="flex items-center gap-3">
                    <StateIcon size={22} className={stateColor} />
                    <div>
                        <p className="text-lg font-semibold leading-tight">
                            {formatMoney(paiseToRupees(s.amount), s.currency ?? "INR")}
                        </p>
                        <p className="text-xs text-admin-muted">
                            {attempt ? formatDate(attempt.timestamp) : "No payment attempt yet"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge tone={phonePeTone(s.state)}>{humanize(s.state)}</Badge>
                    {shopifyAmount !== undefined && <Badge tone={check.tone} dot={false}>{check.label}</Badge>}
                </div>
            </div>

            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 p-4 sm:grid-cols-2">
                <Field label="Payment mode">{attempt ? humanize(attempt.paymentMode) : "—"}</Field>
                <Field label="UTR">{rail?.utr ? <Copyable value={rail.utr} /> : "—"}</Field>
                <Field label="PhonePe order id">
                    <Copyable value={s.orderId} />
                </Field>
                <Field label="Transaction id">{attempt ? <Copyable value={attempt.transactionId} /> : "—"}</Field>
                <Field label="Merchant order id">
                    <Copyable value={result.merchantOrderId} />
                </Field>
                {rail?.upiTransactionId && (
                    <Field label="UPI transaction id">
                        <Copyable value={rail.upiTransactionId} />
                    </Field>
                )}
                {instrument && (
                    <Field label="Paid with">
                        {[
                            humanize(instrument.type),
                            instrument.bankId,
                            instrument.cardNetwork,
                            instrument.maskedCardNumber ?? instrument.maskedAccountNumber,
                        ]
                            .filter(Boolean)
                            .join(" · ")}
                    </Field>
                )}
                {rail?.vpa && <Field label="UPI id">{rail.vpa}</Field>}
                {!!s.feeAmount && <Field label="Fee">{formatMoney(paiseToRupees(s.feeAmount))}</Field>}
                {(s.errorCode || attempt?.errorCode) && (
                    <Field label="Error">
                        <span className="text-rose-300">
                            {s.errorContext?.description ?? humanize(s.detailedErrorCode ?? s.errorCode ?? attempt?.errorCode)}
                        </span>
                    </Field>
                )}
            </dl>

            {extraAttempts.length > 0 && (
                <details className="group border-t border-admin-line">
                    <summary className="flex list-none items-center justify-between px-4 py-3 text-xs text-admin-muted hover:text-admin-text">
                        {extraAttempts.length} other payment attempt{extraAttempts.length > 1 ? "s" : ""}
                        <span className="transition group-open:rotate-180">▾</span>
                    </summary>
                    <ul className="divide-y divide-admin-line border-t border-admin-line">
                        {extraAttempts.map((a) => (
                            <li key={a.transactionId} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-sm">
                                <span className="font-mono text-[12px] text-admin-muted">{a.transactionId}</span>
                                <span className="text-admin-muted">{humanize(a.paymentMode)}</span>
                                <span className="text-admin-muted">{formatDate(a.timestamp)}</span>
                                <Badge tone={phonePeTone(a.state)}>{humanize(a.state)}</Badge>
                            </li>
                        ))}
                    </ul>
                </details>
            )}
        </div>
    );
}
