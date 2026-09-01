"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import CinematicNav from "@/components/Cinematicnav";
import type { Customer, CustomerAddress, CustomerOrder } from "@/lib/shopify/customer-api";

// ── helpers ───────────────────────────────────────────────────────────────────
function fmt(amount: string, code: string) {
    const n = parseFloat(amount);
    try { return new Intl.NumberFormat("en-IN", { style: "currency", currency: code }).format(n); }
    catch { return `${code} ${n.toFixed(2)}`; }
}

function statusColor(s: string) {
    const map: Record<string, string> = {
        PAID: "rgba(74,222,128,0.9)", PARTIALLY_PAID: "rgba(251,191,36,0.9)",
        PENDING: "rgba(251,191,36,0.9)", REFUNDED: "rgba(148,163,184,0.9)",
        FULFILLED: "rgba(74,222,128,0.9)", UNFULFILLED: "rgba(251,191,36,0.9)",
        PARTIALLY_FULFILLED: "rgba(251,191,36,0.9)", CANCELLED: "rgba(248,113,113,0.9)",
    };
    return map[s] ?? "rgba(245,245,245,0.5)";
}

// ── design tokens ─────────────────────────────────────────────────────────────
const CARD: React.CSSProperties = {
    background: "linear-gradient(155deg,#111116 0%,#0c0c10 100%)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16, padding: "24px",
    position: "relative", overflow: "hidden",
};
const INPUT: React.CSSProperties = {
    width: "100%", height: 46,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, padding: "0 14px",
    color: "#F5F5F5", fontSize: 13, outline: "none",
    transition: "border-color 0.25s",
};
const GOLD = "#D4AF37";
const TABS = ["Orders", "Profile", "Addresses"] as const;
type Tab = typeof TABS[number];

// ── root ──────────────────────────────────────────────────────────────────────
export default function AccountClient({ customer }: { customer: Customer }) {
    const router = useRouter();
    const [tab, setTab] = useState<Tab>("Orders");
    const contentRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.fromTo(heroRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.65, ease: "expo.out" });
    }, []);

    useEffect(() => {
        if (contentRef.current) {
            gsap.fromTo(contentRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" });
        }
    }, [tab]);

    const logout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
        router.refresh();
    };

    const initials = `${customer.firstName?.charAt(0) ?? ""}${customer.lastName?.charAt(0) ?? ""}`.toUpperCase() || "U";

    return (
        <main className="page-auth" style={{ minHeight: "100dvh", background: "#060609", color: "#F5F5F5" }}>
            {/* Site navbar */}
            <CinematicNav canAnimate={true} />

            {/* Background glow */}
            <div aria-hidden style={{
                position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
                background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212,175,55,0.06) 0%, transparent 65%)",
            }} />

            {/* Top edge line */}
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.3),transparent)", zIndex: 10 }} />

            {/* Content — padded below fixed navbar (~88px) */}
            <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "0 20px 80px" }}>

                {/* ── Header ── */}
                <div ref={heroRef} style={{ opacity: 0, paddingTop: 108, paddingBottom: 28, borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 32 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            {/* Avatar */}
                            <div style={{
                                width: 52, height: 52, borderRadius: "50%",
                                background: "rgba(212,175,55,0.12)",
                                border: "1.5px solid rgba(212,175,55,0.4)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 17, fontWeight: 900, color: GOLD,
                                flexShrink: 0,
                            }}>
                                {initials}
                            </div>
                            <div>
                                <span style={{ fontSize: 10, letterSpacing: "0.5em", textTransform: "uppercase", color: GOLD, fontWeight: 700, display: "block", marginBottom: 3 }}>
                                    My Account
                                </span>
                                <h1 style={{ fontSize: "clamp(20px,2.8vw,30px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, color: "#F5F5F5" }}>
                                    {customer.firstName} {customer.lastName}
                                </h1>
                                <p style={{ fontSize: 12, color: "rgba(245,245,245,0.4)", marginTop: 3 }}>{customer.email}</p>
                            </div>
                        </div>

                        {/* Sign out only — nav covers "go to store" */}
                        <button
                            onClick={logout}
                            style={{
                                height: 36, padding: "0 16px", borderRadius: 999,
                                background: "transparent",
                                border: "1px solid rgba(248,113,113,0.3)",
                                color: "rgba(248,113,113,0.75)",
                                fontSize: 10, fontWeight: 700,
                                letterSpacing: "0.2em", textTransform: "uppercase",
                                cursor: "pointer", transition: "border-color 0.2s, color 0.2s",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(248,113,113,0.7)"; e.currentTarget.style.color = "rgba(248,113,113,1)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(248,113,113,0.3)"; e.currentTarget.style.color = "rgba(248,113,113,0.75)"; }}
                        >
                            Sign Out
                        </button>
                    </div>

                    {/* Tab bar */}
                    <div style={{ display: "flex", gap: 0, marginTop: 28, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                        {TABS.map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                style={{
                                    background: "none", border: "none", cursor: "pointer",
                                    padding: "10px 20px",
                                    fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
                                    color: tab === t ? GOLD : "rgba(245,245,245,0.4)",
                                    borderBottom: `2px solid ${tab === t ? GOLD : "transparent"}`,
                                    transition: "all 0.2s",
                                    marginBottom: -1,
                                }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Tab content ── */}
                <div ref={contentRef} style={{ opacity: 0 }}>
                    {tab === "Orders" && <OrdersTab orders={customer.orders.nodes} />}
                    {tab === "Profile" && <ProfileTab customer={customer} />}
                    {tab === "Addresses" && <AddressesTab customer={customer} />}
                </div>
            </div>
        </main>
    );
}

// ── Orders tab ────────────────────────────────────────────────────────────────
function OrdersTab({ orders }: { orders: CustomerOrder[] }) {
    if (!orders.length) return (
        <EmptyState icon="📦" title="No orders yet" sub="Your order history will appear here once you make a purchase." cta="Shop Now" href="/collections" />
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {orders.map((o) => (
                <div key={o.id} style={{ ...CARD }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.3),transparent)" }} />

                    {/* Order header */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
                        <div>
                            <p style={{ fontSize: 14, fontWeight: 800, color: "#F5F5F5", letterSpacing: "-0.01em" }}>
                                Order {o.name}
                            </p>
                            <p style={{ fontSize: 11, color: "rgba(245,245,245,0.4)", marginTop: 3 }}>
                                {new Date(o.processedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                            </p>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                            <Badge label={o.financialStatus} color={statusColor(o.financialStatus)} />
                            <Badge label={o.fulfillmentStatus} color={statusColor(o.fulfillmentStatus)} />
                            <span style={{ fontSize: 15, fontWeight: 800, color: GOLD, letterSpacing: "-0.02em" }}>
                                {fmt(o.currentTotalPrice.amount, o.currentTotalPrice.currencyCode)}
                            </span>
                        </div>
                    </div>

                    {/* Line items */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {o.lineItems.nodes.map((li, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                {li.variant?.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={li.variant.image.url} alt={li.title}
                                        style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", background: "#1a1a20", flexShrink: 0 }} />
                                ) : (
                                    <div style={{ width: 44, height: 44, borderRadius: 8, background: "rgba(212,175,55,0.08)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🧴</div>
                                )}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: 12, fontWeight: 700, color: "#F5F5F5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{li.title}</p>
                                    <p style={{ fontSize: 11, color: "rgba(245,245,245,0.4)", marginTop: 2 }}>Qty: {li.quantity}</p>
                                </div>
                                {li.variant && (
                                    <p style={{ fontSize: 12, fontWeight: 700, color: GOLD, flexShrink: 0 }}>
                                        {fmt(li.variant.price.amount, li.variant.price.currencyCode)}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── Profile tab ───────────────────────────────────────────────────────────────
function ProfileTab({ customer }: { customer: Customer }) {
    const [firstName, setFirstName] = useState(customer.firstName ?? "");
    const [lastName, setLastName] = useState(customer.lastName ?? "");
    const [email, setEmail] = useState(customer.email ?? "");
    const [phone, setPhone] = useState(customer.phone ?? "");
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");

    const save = async (e: React.FormEvent) => {
        e.preventDefault(); setMsg(""); setErr(""); setSaving(true);
        const res = await fetch("/api/auth/update", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "updateProfile", firstName, lastName, email, phone }),
        });
        const data = await res.json();
        setSaving(false);
        if (!res.ok) { setErr(data.error); return; }
        setMsg("Profile updated successfully.");
    };

    return (
        <div style={{ maxWidth: 520 }}>
            <SectionHead title="Personal Details" sub="Update your name, email and phone number." />
            <form onSubmit={save} style={{ ...CARD, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.3),transparent)" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <FormField label="First Name" value={firstName} onChange={setFirstName} />
                    <FormField label="Last Name" value={lastName} onChange={setLastName} />
                </div>
                <FormField label="Email" type="email" value={email} onChange={setEmail} />
                <FormField label="Phone" type="tel" value={phone} onChange={setPhone} />
                {err && <ErrorMsg msg={err} />}
                {msg && <SuccessMsg msg={msg} />}
                <SaveBtn loading={saving} />
            </form>
        </div>
    );
}

// ── Addresses tab ─────────────────────────────────────────────────────────────
function AddressesTab({ customer }: { customer: Customer }) {
    const [editing, setEditing] = useState<CustomerAddress | "new" | null>(null);
    const addresses = customer.addresses.nodes;

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <SectionHead title="Shipping Addresses" sub="Manage your saved addresses." noMargin />
                {!editing && (
                    <button onClick={() => setEditing("new")} style={{
                        height: 38, padding: "0 18px", borderRadius: 999,
                        background: "rgba(212,175,55,0.1)",
                        border: "1px solid rgba(212,175,55,0.55)",
                        color: "#D4AF37",
                        fontSize: 10, fontWeight: 800, letterSpacing: "0.2em",
                        textTransform: "uppercase", cursor: "pointer",
                        transition: "background 0.2s, box-shadow 0.2s",
                        boxShadow: "0 0 16px rgba(212,175,55,0.12)",
                    }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,175,55,0.18)"; e.currentTarget.style.boxShadow = "0 0 24px rgba(212,175,55,0.28)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(212,175,55,0.1)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(212,175,55,0.12)"; }}
                    >
                        + Add Address
                    </button>
                )}
            </div>

            {editing && (
                <AddressForm
                    initial={editing === "new" ? undefined : editing}
                    isNew={editing === "new"}
                    defaultAddressId={customer.defaultAddress?.id}
                    onDone={() => { setEditing(null); window.location.reload(); }}
                    onCancel={() => setEditing(null)}
                />
            )}

            {!editing && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 14 }}>
                    {addresses.length === 0 && (
                        <EmptyState icon="📍" title="No addresses saved" sub="Add a shipping address to speed up checkout." cta="Add Address" onCta={() => setEditing("new")} />
                    )}
                    {addresses.map((a) => (
                        <AddressCard
                            key={a.id}
                            address={a}
                            isDefault={a.id === customer.defaultAddress?.id}
                            onEdit={() => setEditing(a)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function AddressCard({ address: a, isDefault, onEdit }: { address: CustomerAddress; isDefault: boolean; onEdit: () => void }) {
    return (
        <div style={{ ...CARD }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,rgba(212,175,55,${isDefault ? 0.5 : 0.2}),transparent)` }} />
            {isDefault && (
                <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, background: "rgba(212,175,55,0.1)", padding: "3px 8px", borderRadius: 999, border: "1px solid rgba(212,175,55,0.25)", display: "inline-block", marginBottom: 12 }}>
                    Default
                </span>
            )}
            <p style={{ fontSize: 13, fontWeight: 700, color: "#F5F5F5", marginBottom: 6 }}>
                {a.firstName} {a.lastName}
            </p>
            <p style={{ fontSize: 12, color: "rgba(245,245,245,0.5)", lineHeight: 1.65 }}>
                {a.address1}{a.address2 ? `, ${a.address2}` : ""}<br />
                {a.city}{a.province ? `, ${a.province}` : ""} {a.zip}<br />
                {a.country}
                {a.phone && <><br />{a.phone}</>}
            </p>
            <button onClick={onEdit} style={{ marginTop: 14, background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 14px", color: "rgba(245,245,245,0.6)", fontSize: 11, cursor: "pointer", fontWeight: 600, letterSpacing: "0.1em" }}>
                Edit
            </button>
        </div>
    );
}

function AddressForm({ initial, isNew, defaultAddressId, onDone, onCancel }: {
    initial?: CustomerAddress; isNew: boolean;
    defaultAddressId?: string; onDone: () => void; onCancel: () => void;
}) {
    const [form, setForm] = useState({
        firstName: initial?.firstName ?? "",
        lastName: initial?.lastName ?? "",
        address1: initial?.address1 ?? "",
        address2: initial?.address2 ?? "",
        city: initial?.city ?? "",
        province: initial?.province ?? "",
        country: initial?.country ?? "India",
        zip: initial?.zip ?? "",
        phone: initial?.phone ?? "",
    });
    const [makeDefault, setMakeDefault] = useState(!defaultAddressId || initial?.id === defaultAddressId);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState("");

    const set = (k: keyof typeof form) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

    const save = async (e: React.FormEvent) => {
        e.preventDefault(); setErr(""); setSaving(true);
        const action = isNew ? "createAddress" : "updateAddress";
        const body = isNew ? { action, address: form } : { action, id: initial!.id, address: form };
        const res = await fetch("/api/auth/update", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        const data = await res.json();
        if (!res.ok) { setErr(data.error); setSaving(false); return; }

        // Set as default if requested
        if (makeDefault) {
            if (!isNew && initial?.id) {
                // For edits, we know the address ID
                await fetch("/api/auth/update", {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "setDefaultAddress", addressId: initial.id }),
                });
            }
            // For new addresses, Shopify auto-sets first address as default;
            // for subsequent ones the user can set it from the address card
        }
        onDone();
    };

    return (
        <div style={{ ...CARD, marginBottom: 20 }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.4),transparent)" }} />
            <p style={{ fontSize: 14, fontWeight: 800, color: "#F5F5F5", marginBottom: 20 }}>{isNew ? "New Address" : "Edit Address"}</p>
            <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <FormField label="First Name" value={form.firstName} onChange={set("firstName")} />
                    <FormField label="Last Name" value={form.lastName} onChange={set("lastName")} />
                </div>
                <FormField label="Address Line 1" value={form.address1} onChange={set("address1")} />
                <FormField label="Address Line 2 (opt)" value={form.address2} onChange={set("address2")} required={false} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <FormField label="City" value={form.city} onChange={set("city")} />
                    <FormField label="State" value={form.province} onChange={set("province")} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <FormField label="Zip / Postal Code" value={form.zip} onChange={set("zip")} />
                    <FormField label="Country" value={form.country} onChange={set("country")} />
                </div>
                <FormField label="Phone" type="tel" value={form.phone} onChange={set("phone")} required={false} />

                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                    <input type="checkbox" checked={makeDefault} onChange={(e) => setMakeDefault(e.target.checked)}
                        style={{ accentColor: GOLD, width: 16, height: 16 }} />
                    <span style={{ fontSize: 12, color: "rgba(245,245,245,0.6)" }}>Set as default address</span>
                </label>

                {err && <ErrorMsg msg={err} />}
                <div style={{ display: "flex", gap: 10 }}>
                    <SaveBtn loading={saving} label={isNew ? "Save Address" : "Update Address"} />
                    <button type="button" onClick={onCancel} style={{ height: 46, padding: "0 20px", borderRadius: 999, background: "none", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(245,245,245,0.5)", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

// ── Shared micro-components ───────────────────────────────────────────────────
function SectionHead({ title, sub, noMargin }: { title: string; sub: string; noMargin?: boolean }) {
    return (
        <div style={{ marginBottom: noMargin ? 0 : 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: "#F5F5F5", letterSpacing: "-0.03em", lineHeight: 1 }}>{title}</h2>
            <p style={{ fontSize: 12, color: "rgba(245,245,245,0.4)", marginTop: 5 }}>{sub}</p>
        </div>
    );
}

function FormField({ label, type = "text", value, onChange, required = true }: {
    label: string; type?: string; value: string;
    onChange: (v: string) => void; required?: boolean;
}) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,245,245,0.4)" }}>{label}</label>
            <input
                type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)}
                style={INPUT}
                onFocus={(e) => e.currentTarget.style.borderColor = "rgba(212,175,55,0.45)"}
                onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
            />
        </div>
    );
}

function SaveBtn({ loading, label = "Save Changes" }: { loading: boolean; label?: string }) {
    return (
        <button
            type="submit"
            disabled={loading}
            style={{
                alignSelf: "flex-start",
                height: 46,
                padding: "0 32px",
                borderRadius: 999,
                border: "1px solid rgba(212,175,55,0.6)",
                background: loading
                    ? "rgba(212,175,55,0.08)"
                    : "rgba(212,175,55,0.1)",
                color: loading ? "rgba(212,175,55,0.4)" : "#D4AF37",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "background 0.25s, box-shadow 0.25s, border-color 0.25s",
                boxShadow: loading ? "none" : "0 0 20px rgba(212,175,55,0.15)",
            }}
            onMouseEnter={(e) => {
                if (!loading) {
                    const el = e.currentTarget;
                    el.style.background = "rgba(212,175,55,0.18)";
                    el.style.boxShadow = "0 0 32px rgba(212,175,55,0.3)";
                    el.style.borderColor = "rgba(212,175,55,0.9)";
                }
            }}
            onMouseLeave={(e) => {
                if (!loading) {
                    const el = e.currentTarget;
                    el.style.background = "rgba(212,175,55,0.1)";
                    el.style.boxShadow = "0 0 20px rgba(212,175,55,0.15)";
                    el.style.borderColor = "rgba(212,175,55,0.6)";
                }
            }}
        >
            {loading ? (
                <>
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="20" strokeDashoffset="10" />
                    </svg>
                    Saving…
                </>
            ) : (
                <>
                    {label}
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </>
            )}
        </button>
    );
}

function Badge({ label, color }: { label: string; color: string }) {
    return (
        <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
            padding: "3px 8px", borderRadius: 999,
            background: `${color.replace("0.9", "0.1")}`,
            border: `1px solid ${color.replace("0.9", "0.35")}`,
            color,
        }}>
            {label.replace(/_/g, " ")}
        </span>
    );
}

function ErrorMsg({ msg }: { msg: string }) {
    return <p style={{ fontSize: 12, color: "#f87171", background: "rgba(248,113,113,0.08)", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(248,113,113,0.2)" }}>{msg}</p>;
}

function SuccessMsg({ msg }: { msg: string }) {
    return <p style={{ fontSize: 12, color: "#4ade80", background: "rgba(74,222,128,0.08)", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(74,222,128,0.2)" }}>{msg}</p>;
}

function EmptyState({ icon, title, sub, cta, href, onCta }: {
    icon: string; title: string; sub: string; cta: string; href?: string; onCta?: () => void;
}) {
    return (
        <div style={{ textAlign: "center", padding: "48px 24px" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>{icon}</div>
            <p style={{ fontSize: 15, fontWeight: 800, color: "#F5F5F5", marginBottom: 8 }}>{title}</p>
            <p style={{ fontSize: 13, color: "rgba(245,245,245,0.45)", marginBottom: 20 }}>{sub}</p>
            {href ? (
                <Link href={href} style={{
                    display: "inline-flex", alignItems: "center", height: 44, padding: "0 24px", borderRadius: 999,
                    background: GOLD, color: "#0A0A0A", fontSize: 10, fontWeight: 800,
                    letterSpacing: "0.25em", textTransform: "uppercase", textDecoration: "none",
                }}>
                    {cta}
                </Link>
            ) : (
                <button onClick={onCta} style={{
                    height: 44, padding: "0 24px", borderRadius: 999, border: "none",
                    background: GOLD, color: "#0A0A0A", fontSize: 10, fontWeight: 800,
                    letterSpacing: "0.25em", textTransform: "uppercase", cursor: "pointer",
                }}>
                    {cta}
                </button>
            )}
        </div>
    );
}
