import type { ReactNode } from "react";
import type { Tone } from "@/lib/admin/format";

const TONES: Record<Tone, string> = {
    green: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
    amber: "bg-amber-400/10 text-amber-300 ring-amber-400/20",
    red: "bg-rose-400/10 text-rose-300 ring-rose-400/20",
    blue: "bg-sky-400/10 text-sky-300 ring-sky-400/20",
    violet: "bg-violet-400/10 text-violet-300 ring-violet-400/20",
    neutral: "bg-white/5 text-admin-muted ring-white/10",
};

const DOTS: Record<Tone, string> = {
    green: "bg-emerald-400",
    amber: "bg-amber-400",
    red: "bg-rose-400",
    blue: "bg-sky-400",
    violet: "bg-violet-400",
    neutral: "bg-admin-muted",
};

export function Badge({ tone = "neutral", children, dot = true }: { tone?: Tone; children: ReactNode; dot?: boolean }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${TONES[tone]}`}
        >
            {dot && <span className={`h-1.5 w-1.5 rounded-full ${DOTS[tone]}`} />}
            {children}
        </span>
    );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <section className={`rounded-2xl border border-admin-line bg-admin-surface ${className}`}>{children}</section>
    );
}

export function CardHeader({
    icon,
    title,
    subtitle,
    action,
}: {
    icon?: ReactNode;
    title: ReactNode;
    subtitle?: ReactNode;
    action?: ReactNode;
}) {
    return (
        <header className="flex items-start justify-between gap-3 border-b border-admin-line px-5 py-4">
            <div className="flex min-w-0 items-center gap-3">
                {icon && (
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[0.04] text-admin-accent ring-1 ring-inset ring-admin-line">
                        {icon}
                    </span>
                )}
                <div className="min-w-0">
                    <h2 className="text-sm font-semibold text-admin-text">{title}</h2>
                    {subtitle && <p className="mt-0.5 truncate text-xs text-admin-muted">{subtitle}</p>}
                </div>
            </div>
            {action}
        </header>
    );
}

export function Field({ label, children, mono = false }: { label: string; children: ReactNode; mono?: boolean }) {
    return (
        <div className="min-w-0">
            <dt className="text-[11px] font-medium uppercase tracking-wider text-admin-muted">{label}</dt>
            <dd className={`mt-1 break-words text-sm text-admin-text ${mono ? "font-mono text-[13px]" : ""}`}>
                {children ?? "—"}
            </dd>
        </div>
    );
}

export function EmptyState({ icon, title, children }: { icon: ReactNode; title: string; children?: ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.04] text-admin-muted ring-1 ring-inset ring-admin-line">
                {icon}
            </span>
            <p className="mt-4 text-sm font-medium text-admin-text">{title}</p>
            {children && <div className="mt-1 max-w-sm text-sm text-admin-muted">{children}</div>}
        </div>
    );
}

export function ErrorNotice({ title, message }: { title: string; message: string }) {
    return (
        <div className="rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-4 py-3 text-sm">
            <p className="font-medium text-rose-300">{title}</p>
            <p className="mt-0.5 text-rose-200/70">{message}</p>
        </div>
    );
}

export function Skeleton({ className = "" }: { className?: string }) {
    return <div className={`admin-skeleton ${className}`} />;
}
