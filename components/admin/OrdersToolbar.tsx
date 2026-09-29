"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoaderCircle, Search, X } from "lucide-react";
import { ORDER_FILTERS } from "@/lib/admin/filters";

export default function OrdersToolbar({ q, filter }: { q: string; filter: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const [value, setValue] = useState(q);
    const [pending, start] = useTransition();
    const inputRef = useRef<HTMLInputElement>(null);

    const go = (next: { q?: string; filter?: string }) => {
        const params = new URLSearchParams();
        const nq = next.q ?? value;
        const nf = next.filter ?? filter;
        if (nq.trim()) params.set("q", nq.trim());
        if (nf && nf !== "all") params.set("filter", nf);
        const qs = params.toString();
        start(() => router.push(qs ? `${pathname}?${qs}` : pathname));
    };

    // Debounced search while typing
    useEffect(() => {
        if (value === q) return;
        const t = setTimeout(() => go({ q: value }), 400);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    // "/" focuses the search box
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:pb-0">
                {ORDER_FILTERS.map((f) => {
                    const active = filter === f.key;
                    return (
                        <button
                            key={f.key}
                            type="button"
                            onClick={() => go({ filter: f.key })}
                            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] transition ${
                                active
                                    ? "bg-admin-text text-admin-bg"
                                    : "text-admin-muted hover:bg-white/5 hover:text-admin-text"
                            }`}
                        >
                            {f.label}
                        </button>
                    );
                })}
            </div>

            <form
                role="search"
                onSubmit={(e) => {
                    e.preventDefault();
                    go({ q: value });
                }}
                className="relative w-full lg:w-80"
            >
                <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted" />
                <input
                    ref={inputRef}
                    type="search"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Order #, name, email, phone…"
                    aria-label="Search orders"
                    className="h-10 w-full rounded-xl border border-admin-line bg-admin-surface pl-9 pr-16 text-sm text-admin-text outline-none transition placeholder:text-admin-muted/70 focus:border-admin-accent/50 focus:ring-2 focus:ring-admin-accent/15 [&::-webkit-search-cancel-button]:hidden"
                />
                <span className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
                    {pending && <LoaderCircle size={14} className="animate-spin text-admin-muted" />}
                    {value ? (
                        <button
                            type="button"
                            aria-label="Clear search"
                            onClick={() => {
                                setValue("");
                                go({ q: "" });
                            }}
                            className="grid h-6 w-6 place-items-center rounded-md text-admin-muted hover:bg-white/5 hover:text-admin-text"
                        >
                            <X size={13} />
                        </button>
                    ) : (
                        <kbd className="hidden rounded border border-admin-line px-1.5 text-[10px] text-admin-muted sm:block">/</kbd>
                    )}
                </span>
            </form>
        </div>
    );
}
