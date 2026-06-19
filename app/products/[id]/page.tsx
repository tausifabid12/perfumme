import { products } from "@/data/products";
import { getAllShopifyProducts, formatPrice } from "@/lib/shopify/api";
import { notFound } from "next/navigation";
import ProductPageClient from "./ProductPageClient";

export async function generateStaticParams() {
  return Object.keys(products).map((id) => ({ id }));
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const productData = products[id];
  if (!productData) notFound();

  // Resolve the matching Shopify product using the same fuzzy matching as collections page
  let shopifyVariantId: string | undefined;
  let shopifyPrice: string | undefined;   // e.g. "৳1,699" — shown instead of local price

  try {
    const allProducts = await getAllShopifyProducts();
    const match =
      allProducts.find((p) => p.handle === id) ??
      allProducts.find((p) => p.handle.startsWith(id)) ??
      allProducts.find((p) =>
        p.title.toLowerCase().includes(id.replace(/-/g, " "))
      );

    if (match) {
      shopifyVariantId = match.variants.nodes[0]?.id;
      shopifyPrice = formatPrice(
        match.priceRange.minVariantPrice.amount,
        match.priceRange.minVariantPrice.currencyCode
      );
    }
  } catch { /* Shopify not configured — fall back to local price */ }

  return (
    <ProductPageClient
      data={productData}
      shopifyVariantId={shopifyVariantId}
      shopifyPrice={shopifyPrice}
    />
  );
}
