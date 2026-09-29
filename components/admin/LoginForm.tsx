"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LoaderCircle, Lock, Mail } from "lucide-react";

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(json.error ?? "Sign in failed.");
                setLoading(false);
                return;
            }
            router.replace("/admin");
            router.refresh();
        } catch {
            setError("Network error. Check your connection and try again.");
            setLoading(false);
        }
    };

    const inputCls =
        "h-11 w-full rounded-xl border border-admin-line bg-admin-bg pl-10 pr-3 text-sm text-admin-text outline-none transition placeholder:text-admin-muted/60 focus:border-admin-accent/50 focus:ring-2 focus:ring-admin-accent/15";

    return (
        <form onSubmit={submit} className="space-y-4" noValidate>
            <div>
                <label htmlFor="admin-email" className="mb-1.5 block text-xs font-medium text-admin-muted">
                    Email
                </label>
                <div className="relative">
                    <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-admin-muted" />
                    <input
                        id="admin-email"
                        type="email"
                        autoComplete="username"
                        autoFocus
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@senz8.in"
                        className={inputCls}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="admin-password" className="mb-1.5 block text-xs font-medium text-admin-muted">
                    Password
                </label>
                <div className="relative">
                    <Lock size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-admin-muted" />
                    <input
                        id="admin-password"
                        type={show ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`${inputCls} pr-11`}
                    />
                    <button
                        type="button"
                        onClick={() => setShow((s) => !s)}
                        aria-label={show ? "Hide password" : "Show password"}
                        className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-admin-muted hover:bg-white/5 hover:text-admin-text"
                    >
                        {show ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                </div>
            </div>

            {error && (
                <p role="alert" className="rounded-lg border border-rose-400/20 bg-rose-400/[0.06] px-3 py-2 text-sm text-rose-300">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={loading || !email || !password}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-admin-accent text-sm font-semibold text-[#1A140C] transition hover:brightness-110 disabled:opacity-50"
            >
                {loading && <LoaderCircle size={16} className="animate-spin" />}
                {loading ? "Signing in…" : "Sign in"}
            </button>
        </form>
    );
}
