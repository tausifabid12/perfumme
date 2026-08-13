import { getShopifyProductByHandle, getAllShopifyProducts, formatPrice, getMeta } from "@/lib/shopify/api";
import { notFound } from "next/navigation";
import ShopifyProductClient from "./ShopifyProductClient";

type Props = { params: Promise<{ handle: string }> };

export async function generateStaticParams() {
    const products = await getAllShopifyProducts();
    return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: Props) {
    const { handle } = await params;
    const product = await getShopifyProductByHandle(handle);
    if (!product) return { title: "Product Not Found | SENZ8 Aroma" };

    const title = `${product.title} — Senz8 Aroma | Buy Online`;
    const description = product.description
        ? product.description.slice(0, 155)
        : `Shop ${product.title} by Senz8 Aroma. A bold Extrait de Parfum crafted for those who leave a mark.`;

    return {
        title,
        description,
        alternates: { canonical: `https://www.senz8.in/products/shopify/${handle}` },
        openGraph: {
            title,
            description,
            url: `https://www.senz8.in/products/shopify/${handle}`,
            type: "website",
            images: product.featuredImage
                ? [{ url: product.featuredImage.url, width: 1200, height: 630, alt: product.title }]
                : [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: product.title }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: product.featuredImage ? [product.featuredImage.url] : ["/images/og-image.jpg"],
        },
    };
}

export default async function ShopifyProductPage({ params }: Props) {
    const { handle } = await params;
    const product = await getShopifyProductByHandle(handle);
    if (!product) notFound();

    const defaultVariant = product.variants.nodes[0];
    const price = formatPrice(
        product.priceRange.minVariantPrice.amount,
        product.priceRange.minVariantPrice.currencyCode
    );

    return (
        <ShopifyProductClient
            product={product}
            defaultVariantId={defaultVariant?.id ?? ""}
            price={price}
            longevity={getMeta(product, "longevity")}
            concentration={getMeta(product, "concentration")}
            topNotes={getMeta(product, "top_notes")}
            heartNotes={getMeta(product, "heart_notes")}
            baseNotes={getMeta(product, "base_notes")}
        />
    );
}
