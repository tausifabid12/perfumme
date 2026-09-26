/**
 * Shopify Storefront API client
 * ─────────────────────────────
 * Uses the Storefront API GraphQL endpoint.
 *
 * Token types — these are NOT interchangeable:
 *   • Public Storefront token  (NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN)
 *       Header: X-Shopify-Storefront-Access-Token
 *       Format: 32-char hex string
 *   • Private Storefront token (SHOPIFY_STOREFRONT_PRIVATE_TOKEN)
 *       Header: Shopify-Storefront-Private-Token
 *       Format: shpst_…   ← NOT shpat_ (that's an Admin API token)
 *
 * shpat_ tokens are Admin API tokens and will always return UNAUTHORIZED
 * on the Storefront endpoint.
 */

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "";
const PUBLIC_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN ?? "";
// Must be a shpst_… token, NOT a shpat_… token
const PRIVATE_TOKEN = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN ?? "";

const ENDPOINT = `https://${DOMAIN}/api/2024-04/graphql.json`;

export async function shopifyFetch<T = unknown>(
    query: string,
    variables: Record<string, unknown> = {},
    // The customer's real IP. All requests come from our server's IP, so without
    // this Shopify rate-limits logins for every customer together.
    buyerIp?: string
): Promise<T> {
    if (!DOMAIN || (!PUBLIC_TOKEN && !PRIVATE_TOKEN)) {
        throw new Error(
            "Shopify credentials not configured. " +
            "Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and " +
            "NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN in .env.local"
        );
    }

    // Private token (shpst_…) uses a different header and gives higher rate limits
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (PRIVATE_TOKEN && PRIVATE_TOKEN.startsWith("shpst_")) {
        // Real Storefront private token
        headers["Shopify-Storefront-Private-Token"] = PRIVATE_TOKEN;
        // Only honoured together with the private token
        if (buyerIp) headers["Shopify-Storefront-Buyer-IP"] = buyerIp;
    } else {
        // Public Storefront access token (also works with shpat_ stripped out)
        headers["X-Shopify-Storefront-Access-Token"] = PUBLIC_TOKEN;
    }

    // Never cache mutations or customer-specific reads — otherwise the account
    // page shows stale data (e.g. a just-saved address) and mutations can be
    // served from cache. Public catalog queries keep the 60 s ISR cache.
    const isPrivate =
        /^\s*mutation\b/.test(query) || "customerAccessToken" in variables;

    const res = await fetch(ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify({ query, variables }),
        ...(isPrivate ? { cache: "no-store" as const } : { next: { revalidate: 60 } }), // ISR – refresh every 60 s
    });

    if (!res.ok) throw new Error(`Shopify fetch failed: ${res.status} ${res.statusText}`);

    const json = await res.json();
    if (json.errors?.length) throw new Error(json.errors[0].message);
    return json.data as T;
}
