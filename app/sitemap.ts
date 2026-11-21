import type { MetadataRoute } from "next";

const BASE_URL = "https://www.senz8.in";

export default function sitemap(): MetadataRoute.Sitemap {
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

    // Shopify product pages (/products/shopify/[handle]) are intentionally
    // left out — they duplicate the cinematic product pages above.
    return staticRoutes;
}
