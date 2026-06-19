/**
 * High-level Shopify helpers used by server components & actions
 */

import { shopifyFetch } from "./client";
import { GET_ALL_PRODUCTS, GET_PRODUCT_BY_HANDLE, CREATE_CART, ADD_TO_CART } from "./queries";
import type { ShopifyProduct, ShopifyCart } from "./types";

// ─── Products ────────────────────────────────────────────────────────────────

/** Fetch all products (paginates automatically, max 250) */
export async function getAllShopifyProducts(): Promise<ShopifyProduct[]> {
    const products: ShopifyProduct[] = [];
    let after: string | null = null;

    try {
        do {
            type PageData = {
                products: { pageInfo: { hasNextPage: boolean; endCursor: string }; nodes: ShopifyProduct[] };
            };
            const data: PageData = await shopifyFetch<PageData>(GET_ALL_PRODUCTS, { first: 50, after });
            products.push(...data.products.nodes);
            after = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null;
        } while (after);
    } catch {
        // Shopify not configured or network error — return empty list
        return [];
    }

    return products;
}

/** Fetch a single product by handle */
export async function getShopifyProductByHandle(handle: string): Promise<ShopifyProduct | null> {
    try {
        const data = await shopifyFetch<{ productByHandle: ShopifyProduct | null }>(
            GET_PRODUCT_BY_HANDLE,
            { handle }
        );
        return data.productByHandle;
    } catch {
        return null;
    }
}

// ─── Cart ────────────────────────────────────────────────────────────────────

/** Create a new cart with one line item, return the cart */
export async function createCart(variantId: string, quantity = 1): Promise<ShopifyCart | null> {
    try {
        const data = await shopifyFetch<{
            cartCreate: { cart: ShopifyCart; userErrors: { field: string; message: string }[] };
        }>(CREATE_CART, { lines: [{ merchandiseId: variantId, quantity }] });

        if (data.cartCreate.userErrors.length) {
            console.error("Cart error:", data.cartCreate.userErrors);
            return null;
        }
        return data.cartCreate.cart;
    } catch {
        return null;
    }
}

/** Add a line item to an existing cart */
export async function addToCart(
    cartId: string,
    variantId: string,
    quantity = 1
): Promise<ShopifyCart | null> {
    try {
        const data = await shopifyFetch<{
            cartLinesAdd: { cart: ShopifyCart; userErrors: { field: string; message: string }[] };
        }>(ADD_TO_CART, { cartId, lines: [{ merchandiseId: variantId, quantity }] });

        if (data.cartLinesAdd.userErrors.length) {
            console.error("Cart error:", data.cartLinesAdd.userErrors);
            return null;
        }
        return data.cartLinesAdd.cart;
    } catch {
        return null;
    }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Format a Shopify price like "৳1,699" */
export function formatPrice(amount: string, currencyCode: string): string {
    const num = parseFloat(amount);
    if (currencyCode === "BDT") return `৳${Math.round(num).toLocaleString("en-BD")}`;
    return new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode }).format(num);
}

/** Extract a metafield value by key */
export function getMeta(product: ShopifyProduct, key: string): string {
    return product.metafields?.find((m) => m?.key === key)?.value ?? "";
}
