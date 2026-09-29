"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, RefreshCw } from "lucide-react";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <button
            type="button"
            aria-label={`${label}: ${value}`}
            title={copied ? "Copied" : label}
            onClick={async () => {
                try {
                    await navigator.clipboard.writeText(value);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1400);
                } catch {
                    /* clipboard blocked — nothing to do */
                }
            }}
            className="inline-grid h-6 w-6 shrink-0 place-items-center rounded-md text-admin-muted transition hover:bg-white/5 hover:text-admin-text"
        >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
        </button>
    );
}

/** Text + copy button, e.g. a UTR or transaction id. */
export function Copyable({ value, mono = true }: { value: string; mono?: boolean }) {
    return (
        <span className="inline-flex max-w-full items-center gap-1">
            <span className={`truncate ${mono ? "font-mono text-[13px]" : ""}`}>{value}</span>
            <CopyButton value={value} />
        </span>
    );
}

export function RefreshButton({ label = "Refresh" }: { label?: string }) {
    const router = useRouter();
    const [pending, start] = useTransition();
    return (
        <button
            type="button"
            onClick={() => start(() => router.refresh())}
            disabled={pending}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-admin-line bg-admin-surface px-3 text-sm text-admin-text transition hover:bg-admin-raised disabled:opacity-60"
        >
            <RefreshCw size={14} className={pending ? "animate-spin" : ""} />
            <span className="hidden sm:inline">{pending ? "Refreshing…" : label}</span>
        </button>
    );
}
