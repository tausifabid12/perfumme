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
    return {
        title: product ? `${product.title} — SENZ8` : "Product — SENZ8",
        description: product?.description ?? "",
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
