import type { MetadataRoute } from "next";

const BASE_URL = "https://www.senz8.in";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/api/",
                    "/privacy-policy",
                    "/refund-policy",
                    "/shipping-policy",
                    "/terms",
                ],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
        host: BASE_URL,
    };
}
