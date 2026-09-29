/**
 * Admin auth helpers (server only).
 * Credentials come from ADMIN_EMAIL / ADMIN_PASSWORD — no database.
 */

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifySession, type AdminSession } from "./session";

function sha256(value: string): Buffer {
    return createHash("sha256").update(value, "utf8").digest();
}

/** Constant-time check of the submitted email + password against env. */
export function checkCredentials(email: string, password: string): boolean {
    const expectedEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
    const expectedPassword = process.env.ADMIN_PASSWORD ?? "";
    if (!expectedEmail || !expectedPassword) return false;

    // Hash first so both buffers have equal length; compare both halves every time.
    const emailOk = timingSafeEqual(sha256(email.trim().toLowerCase()), sha256(expectedEmail));
    const passOk = timingSafeEqual(sha256(password), sha256(expectedPassword));
    return emailOk && passOk;
}

/** Current admin session, or null. For route handlers. */
export async function getAdminSession(): Promise<AdminSession | null> {
    const store = await cookies();
    return verifySession(store.get(ADMIN_COOKIE)?.value);
}

/** Use at the top of every admin page: redirects to login when not signed in. */
export async function requireAdmin(): Promise<AdminSession> {
    const session = await getAdminSession();
    if (!session) redirect("/admin/login");
    return session;
}

// ── Login throttling ─────────────────────────────────────────────────────────
// In-memory, per server instance. Not bullet-proof on serverless (instances are
// short-lived), but it slows down brute force without needing a database.

const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;
const failures = new Map<string, { count: number; first: number }>();

export function loginBlockedFor(ip: string): number {
    const entry = failures.get(ip);
    if (!entry) return 0;
    const elapsed = Date.now() - entry.first;
    if (elapsed > WINDOW_MS) {
        failures.delete(ip);
        return 0;
    }
    return entry.count >= MAX_FAILURES ? Math.ceil((WINDOW_MS - elapsed) / 1000) : 0;
}

export function recordLoginFailure(ip: string): void {
    const entry = failures.get(ip);
    if (!entry || Date.now() - entry.first > WINDOW_MS) {
        failures.set(ip, { count: 1, first: Date.now() });
    } else {
        entry.count++;
    }
    // Keep the map bounded
    if (failures.size > 5000) failures.clear();
}

export function clearLoginFailures(ip: string): void {
    failures.delete(ip);
}
