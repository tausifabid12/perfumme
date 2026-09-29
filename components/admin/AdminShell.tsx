"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CreditCard, LogOut, Menu, ShoppingBag, Truck, X } from "lucide-react";

const NAV = [
    { href: "/admin", label: "Orders", icon: ShoppingBag, match: (p: string) => p === "/admin" || p.startsWith("/admin/orders") },
    { href: "/admin/payments", label: "PhonePe payments", icon: CreditCard, match: (p: string) => p.startsWith("/admin/payments") },
    { href: "/admin/shipping", label: "Blue Dart shipping", icon: Truck, match: (p: string) => p.startsWith("/admin/shipping") },
];

export default function AdminShell({ email, children }: { email: string; children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [signingOut, setSigningOut] = useState(false);

    const signOut = async () => {
        setSigningOut(true);
        await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
        router.replace("/admin/login");
        router.refresh();
    };

    const sidebar = (
        <div className="flex h-full flex-col">
            <div className="flex items-center gap-3 px-5 pb-6 pt-6">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-admin-accent/15 text-sm font-bold tracking-tight text-admin-accent ring-1 ring-inset ring-admin-accent/30">
                    S8
                </span>
                <div>
                    <p className="text-sm font-semibold tracking-wide text-admin-text">SENZ8</p>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-admin-muted">Admin</p>
                </div>
            </div>

            <nav className="flex-1 space-y-1 px-3">
                {NAV.map(({ href, label, icon: Icon, match }) => {
                    const active = match(pathname);
                    return (
                        <Link
                            key={href}
                            href={href}
                            aria-current={active ? "page" : undefined}
                            onClick={() => setOpen(false)}
                            className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                                active
                                    ? "bg-white/[0.06] text-admin-text"
                                    : "text-admin-muted hover:bg-white/[0.03] hover:text-admin-text"
                            }`}
                        >
                            <Icon size={16} className={active ? "text-admin-accent" : ""} />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-admin-line p-3">
                <div className="flex items-center gap-3 rounded-lg px-2 py-2">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/[0.06] text-xs font-semibold uppercase text-admin-text">
                        {email.slice(0, 1)}
                    </span>
                    <p className="min-w-0 flex-1 truncate text-xs text-admin-muted">{email}</p>
                    <button
                        type="button"
                        onClick={signOut}
                        disabled={signingOut}
                        title="Sign out"
                        aria-label="Sign out"
                        className="grid h-8 w-8 place-items-center rounded-lg text-admin-muted transition hover:bg-white/5 hover:text-rose-300 disabled:opacity-50"
                    >
                        <LogOut size={15} />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-admin-bg text-admin-text">
            {/* Desktop sidebar */}
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-admin-line bg-admin-surface/60 backdrop-blur lg:block">
                {sidebar}
            </aside>

            {/* Mobile top bar */}
            <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-admin-line bg-admin-bg/85 px-4 backdrop-blur lg:hidden">
                <p className="text-sm font-semibold tracking-wide">
                    SENZ8 <span className="text-admin-muted">Admin</span>
                </p>
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-label="Open menu"
                    className="grid h-9 w-9 place-items-center rounded-lg border border-admin-line"
                >
                    <Menu size={17} />
                </button>
            </div>

            {/* Mobile drawer */}
            {open && (
                <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
                    <aside className="absolute inset-y-0 left-0 w-72 border-r border-admin-line bg-admin-surface">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Close menu"
                            className="absolute right-3 top-5 grid h-8 w-8 place-items-center rounded-lg text-admin-muted hover:bg-white/5"
                        >
                            <X size={16} />
                        </button>
                        {sidebar}
                    </aside>
                </div>
            )}

            <main className="lg:pl-64">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</div>
            </main>
        </div>
    );
}
