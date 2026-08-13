import type { MetadataRoute } from "next";
import { getAllShopifyProducts } from "@/lib/shopify/api";

const BASE_URL = "https://www.senz8.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // ── Static pages ──────────────────────────────────────────────────
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/collections`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.6,
        },
        // Local cinematic product pages
        {
            url: `${BASE_URL}/products/imperial-smoke`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.85,
        },
        {
            url: `${BASE_URL}/products/rebel-girl`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.85,
        },
        {
            url: `${BASE_URL}/products/it-boy`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.85,
        },
        {
            url: `${BASE_URL}/products/blind-date`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.85,
        },
    ];

    // ── Dynamic Shopify product pages ─────────────────────────────────
    let shopifyRoutes: MetadataRoute.Sitemap = [];
    try {
        const products = await getAllShopifyProducts();
        shopifyRoutes = products.map((p) => ({
            url: `${BASE_URL}/products/shopify/${p.handle}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }));
    } catch {
        // Shopify not configured — skip dynamic routes
    }

    return [...staticRoutes, ...shopifyRoutes];
}
