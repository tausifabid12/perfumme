/**
 * Admin session token
 * ───────────────────
 * Stateless, HMAC-SHA256 signed token stored in an httpOnly cookie. Uses only
 * Web Crypto so the same code runs in middleware and in route handlers.
 *
 * Token format: base64url(JSON payload) + "." + base64url(signature)
 *
 * Signing key: ADMIN_SESSION_SECRET if set, otherwise derived from the admin
 * credentials + Shopify client secret. Deriving from the password means that
 * changing ADMIN_PASSWORD instantly invalidates every existing session.
 */

export const ADMIN_COOKIE = "senz8_admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

export interface AdminSession {
    sub: string; // admin email
    iat: number; // issued at (unix seconds)
    exp: number; // expires at (unix seconds)
}

const encoder = new TextEncoder();

function b64urlEncode(bytes: Uint8Array): string {
    let bin = "";
    for (const b of bytes) bin += String.fromCharCode(b);
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(str: string): Uint8Array {
    const b64 = str.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((str.length + 3) % 4);
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
}

let keyPromise: Promise<CryptoKey> | null = null;

function getKey(): Promise<CryptoKey> {
    if (!keyPromise) {
        const secret =
            process.env.ADMIN_SESSION_SECRET ||
            [
                "senz8-admin-session-v1",
                process.env.ADMIN_EMAIL ?? "",
                process.env.ADMIN_PASSWORD ?? "",
                process.env.SHOPIFY_CLIENT_SECRET ?? "",
            ].join("|");

        keyPromise = crypto.subtle
            .digest("SHA-256", encoder.encode(secret))
            .then((raw) =>
                crypto.subtle.importKey("raw", raw, { name: "HMAC", hash: "SHA-256" }, false, [
                    "sign",
                    "verify",
                ])
            );
    }
    return keyPromise;
}

export async function signSession(email: string): Promise<{ token: string; expires: Date }> {
    const now = Math.floor(Date.now() / 1000);
    const payload: AdminSession = { sub: email, iat: now, exp: now + SESSION_TTL_SECONDS };
    const body = b64urlEncode(encoder.encode(JSON.stringify(payload)));
    const sig = new Uint8Array(await crypto.subtle.sign("HMAC", await getKey(), encoder.encode(body)));
    return { token: `${body}.${b64urlEncode(sig)}`, expires: new Date(payload.exp * 1000) };
}

/** Returns the session if the token is authentic, unexpired and for the configured admin. */
export async function verifySession(token: string | undefined | null): Promise<AdminSession | null> {
    if (!token || token.length > 1024) return null;
    const [body, sig] = token.split(".");
    if (!body || !sig) return null;

    try {
        // crypto.subtle.verify is constant-time
        const ok = await crypto.subtle.verify(
            "HMAC",
            await getKey(),
            b64urlDecode(sig) as BufferSource,
            encoder.encode(body)
        );
        if (!ok) return null;

        const payload = JSON.parse(new TextDecoder().decode(b64urlDecode(body))) as AdminSession;
        if (typeof payload.exp !== "number" || payload.exp * 1000 < Date.now()) return null;
        if (payload.sub !== (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase()) return null;
        return payload;
    } catch {
        return null;
    }
}
