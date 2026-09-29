"use client";

import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";

export default function InvoiceToolbar({ orderId, orderName }: { orderId: string; orderName: string }) {
    return (
        <div className="mx-auto mb-6 flex w-full max-w-[820px] items-center justify-between gap-3 px-4 sm:px-0 print:hidden">
            <Link
                href={`/admin/orders/${orderId}`}
                className="inline-flex items-center gap-1.5 text-sm text-neutral-600 transition hover:text-neutral-900"
            >
                <ArrowLeft size={15} /> Back to {orderName}
            </Link>
            <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-neutral-900 px-4 text-sm font-semibold text-white transition hover:bg-neutral-700"
            >
                <Printer size={15} /> Download PDF / Print
            </button>
        </div>
    );
}
