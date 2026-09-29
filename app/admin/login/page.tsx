import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import LoginForm from "@/components/admin/LoginForm";
import { getAdminSession } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Sign in" };

export default async function AdminLoginPage() {
    if (await getAdminSession()) redirect("/admin");

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
            {/* Soft brand glow */}
            <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-[-20%] h-[520px] w-[720px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
                style={{ background: "radial-gradient(closest-side, rgba(201,163,106,0.35), transparent)" }}
            />

            <div className="relative w-full max-w-sm">
                <div className="mb-8 text-center">
                    <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-admin-accent/15 text-base font-bold text-admin-accent ring-1 ring-inset ring-admin-accent/30">
                        S8
                    </span>
                    <h1 className="mt-5 text-2xl font-semibold tracking-tight">SENZ8 Admin</h1>
                    <p className="mt-1.5 text-sm text-admin-muted">Orders, payments and shipping in one place.</p>
                </div>

                <div className="rounded-2xl border border-admin-line bg-admin-surface/80 p-6 shadow-2xl shadow-black/40 backdrop-blur">
                    <LoginForm />
                </div>

                <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-admin-muted">
                    <ShieldCheck size={13} />
                    Restricted area · sessions expire after 8 hours
                </p>
            </div>
        </div>
    );
}
