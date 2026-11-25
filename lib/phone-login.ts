/**
 * Phone (WhatsApp OTP) login on top of Shopify's email + password accounts.
 * ────────────────────────────────────────────────────────────────────────
 * Shopify can only issue a customer access token for email + password, so
 * after the OTP is verified we log the customer in on their behalf:
 *
 *   1. Find the Shopify customer by phone (Admin API).
 *   2. If they have our stored password (AES-256-GCM encrypted, in customer
 *      metafield senz8_auth.login_secret), log in with it.
 *   3. Otherwise — new number, an account that used its own password, or the
 *      stored one stopped working — generate a random password, set it through
 *      the Admin REST API (creating the customer if needed, with a placeholder
 *      email), store it encrypted, and log in.
 *
 * Customers never see or type a password. Needs Admin API scopes
 * read_customers + write_customers.
 *
 * Env:
 *   LOGIN_SECRET_KEY        Key for encrypting stored passwords (any long random
 *                           string). If it changes, passwords are simply reset
 *                           on each customer's next login.
 *   PHONE_LOGIN_EMAIL_DOMAIN  Placeholder email domain (default wa.senz8.in)
 */

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";
import { adminFetch, adminRest } from "@/lib/admin/shopify-admin";
import { customerLogin } from "@/lib/shopify/customer-api";

const MF_NAMESPACE = "senz8_auth";
const MF_KEY = "login_secret";

// ─── Encryption ──────────────────────────────────────────────────────────────
const key = () => {
    const s = process.env.LOGIN_SECRET_KEY || process.env.SHOPIFY_CLIENT_SECRET;
    if (!s) throw new Error("LOGIN_SECRET_KEY is not set");
    return createHash("sha256").update(s).digest();
};

function encrypt(plain: string): string {
    const iv = randomBytes(12);
    const c = createCipheriv("aes-256-gcm", key(), iv);
    const enc = Buffer.concat([c.update(plain, "utf8"), c.final()]);
    return ["v1", iv.toString("base64url"), c.getAuthTag().toString("base64url"), enc.toString("base64url")].join(".");
}

function decrypt(token: string): string | null {
    try {
        const [v, iv, tag, enc] = token.split(".");
        if (v !== "v1") return null;
        const d = createDecipheriv("aes-256-gcm", key(), Buffer.from(iv, "base64url"));
        d.setAuthTag(Buffer.from(tag, "base64url"));
        return Buffer.concat([d.update(Buffer.from(enc, "base64url")), d.final()]).toString("utf8");
    } catch {
        return null; // wrong key / tampered → treated as "no stored password"
    }
}

// Shopify allows 5–40 characters
const newPassword = () => randomBytes(24).toString("base64url"); // 32 chars

const placeholderEmail = (phone: string) =>
    `${phone}@${process.env.PHONE_LOGIN_EMAIL_DOMAIN || "wa.senz8.in"}`;

// ─── Admin API ───────────────────────────────────────────────────────────────
type FoundCustomer = { id: string; legacyResourceId: string; email: string | null; secret: string | null };

const FIND_BY_PHONE = /* GraphQL */ `
  query customerByPhone($q: String!) {
    customers(first: 1, query: $q) {
      nodes {
        id legacyResourceId email phone
        metafield(namespace: "${MF_NAMESPACE}", key: "${MF_KEY}") { value }
      }
    }
  }
`;

async function findByPhone(e164: string): Promise<FoundCustomer | null> {
    const data = await adminFetch<{
        customers: { nodes: { id: string; legacyResourceId: string; email: string | null; phone: string | null; metafield: { value: string } | null }[] };
    }>(FIND_BY_PHONE, { q: `phone:${e164}` });
    // Search is fuzzy; only accept an exact phone match
    const c = data.customers.nodes.find(n => n.phone === e164);
    return c ? { id: c.id, legacyResourceId: c.legacyResourceId, email: c.email, secret: c.metafield?.value ?? null } : null;
}

const METAFIELDS_SET = /* GraphQL */ `
  mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) { userErrors { field message } }
  }
`;

async function storeSecret(customerGid: string, password: string) {
    const data = await adminFetch<{ metafieldsSet: { userErrors: { message: string }[] } }>(METAFIELDS_SET, {
        metafields: [{ ownerId: customerGid, namespace: MF_NAMESPACE, key: MF_KEY, type: "single_line_text_field", value: encrypt(password) }],
    });
    if (data.metafieldsSet.userErrors.length) {
        throw new Error(`metafieldsSet: ${data.metafieldsSet.userErrors[0].message}`);
    }
}

type RestCustomer = { customer: { id: number; email: string | null; admin_graphql_api_id: string } };

/** Sets a new password on an existing customer (and a placeholder email if it has none). */
async function resetPassword(c: FoundCustomer, phone: string, password: string): Promise<string> {
    const email = c.email || placeholderEmail(phone);
    await adminRest<RestCustomer>("PUT", `customers/${c.legacyResourceId}.json`, {
        customer: {
            id: Number(c.legacyResourceId),
            ...(c.email ? {} : { email }),
            password,
            password_confirmation: password,
        },
    });
    return email;
}

async function createCustomer(phone: string, password: string): Promise<{ gid: string; email: string }> {
    const email = placeholderEmail(phone);
    const { customer } = await adminRest<RestCustomer>("POST", "customers.json", {
        customer: {
            email,
            phone: `+${phone}`,
            password,
            password_confirmation: password,
            verified_email: true,
            send_email_welcome: false, // placeholder address — nothing to send to
            tags: "whatsapp-otp",
        },
    });
    return { gid: customer.admin_graphql_api_id, email };
}

// ─── Login ───────────────────────────────────────────────────────────────────
export type PhoneLoginResult = { accessToken: string; expiresAt: string; isNew: boolean };

/** `phone` is digits with country code, e.g. 919876543210 (already OTP-verified). */
export async function loginWithPhone(phone: string, buyerIp?: string): Promise<PhoneLoginResult> {
    const e164 = `+${phone}`;
    const existing = await findByPhone(e164);

    // 1. Returning customer with our stored password
    if (existing?.email && existing.secret) {
        const stored = decrypt(existing.secret);
        if (stored) {
            const r = await customerLogin(existing.email, stored, buyerIp);
            if (r.customerAccessToken) return { ...r.customerAccessToken, isNew: false };
            console.warn("phone-login: stored password rejected, resetting", existing.legacyResourceId, r.customerUserErrors);
        }
    }

    // 2. Set (or create with) a fresh password
    const password = newPassword();
    let email: string, gid: string;
    if (existing) {
        email = await resetPassword(existing, phone, password);
        gid = existing.id;
    } else {
        ({ gid, email } = await createCustomer(phone, password));
    }
    await storeSecret(gid, password);

    const r = await customerLogin(email, password, buyerIp);
    if (!r.customerAccessToken) {
        throw new Error(`phone-login: login after password set failed: ${JSON.stringify(r.customerUserErrors)}`);
    }
    return { ...r.customerAccessToken, isNew: !existing };
}
