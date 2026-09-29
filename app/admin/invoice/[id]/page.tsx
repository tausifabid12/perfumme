/**
 * Printable GST tax invoice for one order: /admin/invoice/:id
 * "Download PDF" uses the browser's print → Save as PDF, so there's no PDF
 * library and the layout stays pixel-perfect.
 *
 * Seller details are the official ones published on the site (Terms → Company
 * Details, Contact page). Only the GSTIN and numbering come from env:
 *   SHIP_FROM_GSTIN, INVOICE_PREFIX (default "INV-"), INVOICE_HSN (default "3303" — perfumes)
 * Never use the mailer env (EMAIL / SUPPORT_EMAIL) here — those aren't public addresses.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { formatDate } from "@/lib/admin/format";
import { getOrder, type Address, type TaxLine } from "@/lib/admin/shopify-admin";
import InvoiceToolbar from "./InvoiceToolbar";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    return { title: `Invoice ${(await params).id}` };
}

const env = process.env;
// Official company details (Terms page → Company Details, Contact page)
const seller = {
    name: "Senz Eight Aroma Private Limited",
    lines: [
        "Registered office: No. 427 Srinivasa Nilaya, 6th Cross,",
        "Domlur, Bangalore North, Bangalore – 560071",
        "Karnataka, India",
    ],
    gstin: env.SHIP_FROM_GSTIN ?? "",
    email: "wecare@senz8.in",
    phone: "+91 90197 09227",
    website: "senz8.in",
};
const PREFIX = env.INVOICE_PREFIX || "INV-";
const HSN = env.INVOICE_HSN || "3303";

const inr = (n: number) =>
    new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const num = (set: { shopMoney: { amount: string } } | null | undefined) => Number(set?.shopMoney.amount ?? 0);
const sumTax = (lines: TaxLine[]) => lines.reduce((s, t) => s + num(t.priceSet), 0);

export default async function InvoicePage({ params }: { params: Params }) {
    await requireAdmin();
    const { id } = await params;
    const order = await getOrder(id);
    if (!order) notFound();

    const invoiceNo = `${PREFIX}${order.name.replace("#", "")}`;
    const billTo = order.billingAddress ?? order.shippingAddress;
    const shipTo = order.shippingAddress;

    // Per line: Shopify's discounted total may include or exclude tax (taxesIncluded)
    const rows = order.lineItems.nodes.map((li, i) => {
        const gross = num(li.originalUnitPriceSet) * li.quantity;
        const lineTotal = num(li.discountedTotalSet);
        const tax = sumTax(li.taxLines);
        const taxable = order.taxesIncluded ? lineTotal - tax : lineTotal;
        return {
            n: i + 1,
            name: li.title,
            variant: li.variantTitle,
            sku: li.sku,
            qty: li.quantity,
            rate: num(li.originalUnitPriceSet),
            discount: Math.max(0, gross - lineTotal),
            taxable,
            tax,
            taxLabel: li.taxLines.map((t) => `${t.title} ${t.rate != null ? Math.round(t.rate * 1000) / 10 + "%" : ""}`.trim()).join(" + "),
            total: taxable + tax,
        };
    });

    const shipping = num(order.totalShippingPriceSet);
    const total = num(order.totalPriceSet);
    const refunded = num(order.totalRefundedSet);
    const taxable = rows.reduce((s, r) => s + r.taxable, 0);
    // Group order-level tax lines (includes any tax on shipping) by title for the summary
    const taxSummary = new Map<string, number>();
    for (const t of order.taxLines) {
        const key = `${t.title}${t.rate != null ? ` @ ${Math.round(t.rate * 1000) / 10}%` : ""}`;
        taxSummary.set(key, (taxSummary.get(key) ?? 0) + num(t.priceSet));
    }

    return (
        <div className="min-h-screen bg-neutral-200 py-8 text-neutral-900 print:bg-white print:py-0">
            <style>{`@page { size: A4; margin: 12mm; } @media print { body { background: #fff !important; } }`}</style>
            <InvoiceToolbar orderId={order.legacyResourceId} orderName={order.name} />

            <article className="mx-auto w-full max-w-[820px] bg-white p-10 shadow-xl print:max-w-none print:p-0 print:shadow-none">
                {/* Header */}
                <header className="flex items-start justify-between gap-8 border-b-2 border-neutral-900 pb-6">
                    <div>
                        <p className="text-2xl font-bold tracking-tight">{seller.name}</p>
                        <div className="mt-2 text-xs leading-relaxed text-neutral-600">
                            {seller.lines.map((l) => (
                                <p key={l}>{l}</p>
                            ))}
                            {seller.gstin && <p className="mt-1 font-medium text-neutral-900">GSTIN: {seller.gstin}</p>}
                            <p>{[seller.email, seller.phone, seller.website].join(" · ")}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Tax invoice</p>
                        <p className="mt-1 text-xl font-bold">{invoiceNo}</p>
                        <dl className="mt-3 space-y-0.5 text-xs text-neutral-600">
                            <Row label="Invoice date" value={formatDate(order.processedAt, false)} />
                            <Row label="Order" value={order.name} />
                            <Row label="Place of supply" value={shipTo?.province ?? "—"} />
                            <Row label="Payment" value={order.cancelledAt ? "Cancelled" : order.displayFinancialStatus === "PAID" ? "Paid (prepaid)" : (order.displayFinancialStatus ?? "—").replace(/_/g, " ").toLowerCase()} />
                        </dl>
                    </div>
                </header>

                {/* Parties */}
                <section className="grid grid-cols-2 gap-8 py-6 text-sm">
                    <Party title="Bill to" address={billTo} email={order.email ?? order.customer?.email} />
                    <Party title="Ship to" address={shipTo} />
                </section>

                {/* Items */}
                <table className="w-full border-collapse text-xs">
                    <thead>
                        <tr className="border-y border-neutral-900 text-left uppercase tracking-wider text-neutral-500">
                            <th className="py-2 pr-2 font-semibold">#</th>
                            <th className="py-2 pr-2 font-semibold">Item</th>
                            <th className="py-2 pr-2 font-semibold">HSN</th>
                            <th className="py-2 pr-2 text-right font-semibold">Qty</th>
                            <th className="py-2 pr-2 text-right font-semibold">Rate</th>
                            <th className="py-2 pr-2 text-right font-semibold">Discount</th>
                            <th className="py-2 pr-2 text-right font-semibold">Taxable</th>
                            <th className="py-2 pr-2 text-right font-semibold">Tax</th>
                            <th className="py-2 text-right font-semibold">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.n} className="border-b border-neutral-200 align-top">
                                <td className="py-2.5 pr-2 text-neutral-500">{r.n}</td>
                                <td className="py-2.5 pr-2">
                                    <p className="font-medium text-neutral-900">{r.name}</p>
                                    {(r.variant || r.sku) && (
                                        <p className="text-neutral-500">{[r.variant, r.sku && `SKU ${r.sku}`].filter(Boolean).join(" · ")}</p>
                                    )}
                                </td>
                                <td className="py-2.5 pr-2">{HSN}</td>
                                <td className="py-2.5 pr-2 text-right">{r.qty}</td>
                                <td className="py-2.5 pr-2 text-right">{inr(r.rate)}</td>
                                <td className="py-2.5 pr-2 text-right">{r.discount ? inr(r.discount) : "—"}</td>
                                <td className="py-2.5 pr-2 text-right">{inr(r.taxable)}</td>
                                <td className="py-2.5 pr-2 text-right">
                                    {inr(r.tax)}
                                    {r.taxLabel && <p className="text-[10px] text-neutral-500">{r.taxLabel}</p>}
                                </td>
                                <td className="py-2.5 text-right font-medium">{inr(r.total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <section className="mt-6 flex flex-col-reverse gap-8 sm:flex-row sm:justify-between print:flex-row print:justify-between">
                    <div className="max-w-xs text-xs text-neutral-600">
                        <p className="font-semibold uppercase tracking-wider text-neutral-500">Amount in words</p>
                        <p className="mt-1 text-sm text-neutral-900">{amountInWords(total)}</p>
                        {order.discountCodes.length > 0 && <p className="mt-3">Discount code: {order.discountCodes.join(", ")}</p>}
                        <p className="mt-3">{order.taxesIncluded ? "Prices are inclusive of GST." : "GST is charged in addition to item prices."}</p>
                    </div>
                    <dl className="w-full space-y-1.5 text-sm sm:w-72 print:w-72">
                        <Total label="Taxable value" value={inr(taxable)} />
                        {[...taxSummary].map(([k, v]) => (
                            <Total key={k} label={k} value={inr(v)} />
                        ))}
                        {taxSummary.size === 0 && <Total label="GST" value={inr(0)} />}
                        <Total label="Shipping" value={shipping ? inr(shipping) : "Free"} />
                        <div className="flex justify-between border-t-2 border-neutral-900 pt-2 text-base font-bold">
                            <dt>Total (INR)</dt>
                            <dd>₹{inr(total)}</dd>
                        </div>
                        {refunded > 0 && <Total label="Refunded" value={`−${inr(refunded)}`} />}
                    </dl>
                </section>

                <footer className="mt-12 flex items-end justify-between gap-8 border-t border-neutral-200 pt-6 text-[11px] text-neutral-500">
                    <p className="max-w-sm">
                        This is a computer-generated invoice and does not require a signature. Thank you for shopping with {seller.name}.
                    </p>
                    <div className="text-right">
                        <p className="font-semibold text-neutral-900">For {seller.name}</p>
                        <p className="mt-8">Authorised signatory</p>
                    </div>
                </footer>
            </article>
        </div>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-end gap-3">
            <dt>{label}</dt>
            <dd className="min-w-[90px] font-medium capitalize text-neutral-900">{value}</dd>
        </div>
    );
}

function Total({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between text-neutral-600">
            <dt>{label}</dt>
            <dd className="text-neutral-900">{value}</dd>
        </div>
    );
}

function Party({ title, address, email }: { title: string; address: Address | null; email?: string | null }) {
    return (
        <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{title}</p>
            {address ? (
                <div className="mt-1.5 leading-relaxed">
                    <p className="font-semibold">{address.name}</p>
                    {address.company && <p>{address.company}</p>}
                    {address.address1 && <p>{address.address1}</p>}
                    {address.address2 && <p>{address.address2}</p>}
                    <p>{[address.city, address.province, address.zip].filter(Boolean).join(", ")}</p>
                    {address.phone && <p className="text-neutral-600">{address.phone}</p>}
                    {email && <p className="text-neutral-600">{email}</p>}
                </div>
            ) : (
                <p className="mt-1.5 text-neutral-500">—</p>
            )}
        </div>
    );
}

/** 1599.5 → "Rupees One Thousand Five Hundred Ninety Nine and Fifty Paise Only" (Indian numbering). */
function amountInWords(amount: number): string {
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
        "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const two = (n: number) => (n < 20 ? ones[n] : `${tens[Math.floor(n / 10)]} ${ones[n % 10]}`.trim());
    const three = (n: number) => [n >= 100 ? `${ones[Math.floor(n / 100)]} Hundred` : "", two(n % 100)].filter(Boolean).join(" ");

    const words = (n: number): string => {
        if (n === 0) return "Zero";
        const parts: string[] = [];
        const crore = Math.floor(n / 1e7);
        const lakh = Math.floor((n % 1e7) / 1e5);
        const thousand = Math.floor((n % 1e5) / 1e3);
        const rest = n % 1e3;
        if (crore) parts.push(`${words(crore)} Crore`);
        if (lakh) parts.push(`${two(lakh)} Lakh`);
        if (thousand) parts.push(`${two(thousand)} Thousand`);
        if (rest) parts.push(three(rest));
        return parts.join(" ");
    };

    const rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);
    return `Rupees ${words(rupees)}${paise ? ` and ${two(paise)} Paise` : ""} Only`;
}
