import { products as localProducts } from "@/data/products";
import { getAllShopifyProducts, formatPrice } from "@/lib/shopify/api";
import type { ShopifyProduct } from "@/lib/shopify/types";
import CollectionsClient from "./CollectionsClient";

export const metadata = {
    title: "The Collection — SENZ8",
    description: "Every bottle tells a story. Discover the full SENZ8 collection.",
};

// The 4 slugs that have a full cinematic product page
const LOCAL_SLUGS = new Set(["imperial-smoke", "it-boy", "rebel-girl", "blind-date"]);

export interface CollectionProduct {
    /** Used as the URL segment */
    slug: string;
    /** Where clicking the card routes to */
    href: string;
    /** "local" cards use local ProductData; "shopify" use Shopify data */
    source: "local" | "shopify";

    // ── Displayed fields (normalised from either source) ──────────────────────
    name: string;
    subtitle: string;
    description: string;
    image: string;
    hoverImage?: string;
    price: string;           // formatted, e.g. "৳1,699"
    priceRaw: number;        // for sorting
    currency: string;
    priceUnit: string;
    rating?: number;
    reviewCount?: number;
    tag: string;             // "For Him" / "For Her" / "Unisex" / "Signature"
    note0: string;           // top note label
    note2: string;           // base note label
    stat0: { number: string; label: string };
    stat1: { number: string; label: string };

    // ── Shopify-only ──────────────────────────────────────────────────────────
    shopifyVariantId?: string;   // default variant GID for Add to Cart
    shopifyProduct?: ShopifyProduct;
}

export default async function CollectionsPage() {
    // ── Fetch Shopify products once ────────────────────────────────────────────
    let allShopifyProducts: ShopifyProduct[] = [];
    try {
        allShopifyProducts = await getAllShopifyProducts();
    } catch { /* Shopify not configured */ }

    // Build maps: local-slug → variant ID, shopify handle, and Shopify-formatted price
    const shopifyVariantMap: Record<string, string> = {};
    const shopifyHandleMap: Record<string, string> = {};
    const shopifyPriceMap: Record<string, string> = {}; // local-slug → formatted price from Shopify

    const LOCAL_SLUGS_LIST = ["imperial-smoke", "it-boy", "rebel-girl", "blind-date"];

    for (const slug of LOCAL_SLUGS_LIST) {
        const match =
            allShopifyProducts.find((p) => p.handle === slug) ??
            allShopifyProducts.find((p) => p.handle.startsWith(slug)) ??
            allShopifyProducts.find((p) =>
                p.title.toLowerCase().includes(slug.replace(/-/g, " "))
            );

        if (match?.variants.nodes[0]?.id) {
            shopifyVariantMap[slug] = match.variants.nodes[0].id;
            shopifyHandleMap[slug] = match.handle;
            shopifyPriceMap[slug] = formatPrice(
                match.priceRange.minVariantPrice.amount,
                match.priceRange.minVariantPrice.currencyCode
            );
        }
    }

    // Also map remaining Shopify products by their own handle (for shopify-only entries)
    for (const p of allShopifyProducts) {
        if (p.variants.nodes[0]?.id && !Object.values(shopifyHandleMap).includes(p.handle)) {
            shopifyVariantMap[p.handle] = p.variants.nodes[0].id;
        }
    }

    // ── 1. Local products — only show if Shopify has a matching product ──────────
    const localEntries: CollectionProduct[] = Object.entries(localProducts)
        .filter(([slug]) => shopifyVariantMap[slug]) // hide if not in Shopify
        .map(
            ([slug, d]) => ({
                slug,
                href: `/products/${slug}`,
                source: "local",
                name: d.product.name,
                subtitle: d.product.fullName.replace(d.product.name, "").trim(),
                description: d.product.description,
                image: d.product.image,
                price: shopifyPriceMap[slug] ?? `${d.product.currency}${d.product.price}`,
                priceRaw: d.product.price,
                currency: d.product.currency,
                priceUnit: d.product.priceUnit,
                rating: d.product.rating,
                reviewCount: d.product.reviewCount,
                tag: (() => {
                    const genderVal = (d.composition?.facts?.items?.find(([k]: [string, string]) => k === "Gender")?.[1]) ?? "";
                    if (genderVal === "Female") return "For Her";
                    if (genderVal === "Unisex") return "Unisex";
                    return "For Him";
                })(),
                note0: d.fragranceNotes.notes[0]?.title.split("\n")[0] ?? "",
                note2: d.fragranceNotes.notes[2]?.title.split("\n")[0] ?? "",
                stat0: d.stats[0] ?? { number: "35%", label: "Oil" },
                stat1: d.stats[1] ?? { number: "12HR+", label: "Longevity" },
                // Wire up Add-to-Cart if the matching Shopify product exists
                shopifyVariantId: shopifyVariantMap[slug],
            })
        );

    // ── 2. Shopify-only products (exclude any handle already matched to a local slug) ─────────
    const matchedShopifyHandles = new Set(Object.values(shopifyHandleMap));
    const shopifyEntries: CollectionProduct[] = allShopifyProducts
        .filter((p) => !matchedShopifyHandles.has(p.handle))
        .map((p) => {
            const variant = p.variants.nodes[0];
            const priceStr = formatPrice(
                p.priceRange.minVariantPrice.amount,
                p.priceRange.minVariantPrice.currencyCode
            );
            const tagRaw = p.tags.find((t) =>
                ["For Him", "For Her", "Unisex"].includes(t)
            ) ?? "Signature";

            const metaTop = p.metafields?.find((m) => m?.key === "top_notes")?.value ?? "";
            const metaBase = p.metafields?.find((m) => m?.key === "base_notes")?.value ?? "";
            const metaLong = p.metafields?.find((m) => m?.key === "longevity")?.value ?? "";
            const metaConc = p.metafields?.find((m) => m?.key === "concentration")?.value ?? "";

            return {
                slug: p.handle,
                href: `/products/shopify/${p.handle}`,
                source: "shopify" as const,
                name: p.title,
                subtitle: p.productType || "Extrait de Parfum",
                description: p.description,
                image: p.featuredImage?.url ?? "",
                hoverImage: p.images.nodes[1]?.url,
                price: priceStr,
                priceRaw: parseFloat(p.priceRange.minVariantPrice.amount),
                currency: p.priceRange.minVariantPrice.currencyCode,
                priceUnit: "50ML",
                tag: tagRaw,
                note0: metaTop,
                note2: metaBase,
                stat0: { number: metaConc || "35%", label: "Concentration" },
                stat1: { number: metaLong || "12HR+", label: "Longevity" },
                shopifyVariantId: variant?.id,
                shopifyProduct: p,
            };
        });

    const allProducts: CollectionProduct[] = [...localEntries, ...shopifyEntries];

    return <CollectionsClient products={allProducts} />;
}
