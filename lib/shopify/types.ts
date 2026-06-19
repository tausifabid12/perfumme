// Shopify Storefront API — normalised types used throughout the app

export interface ShopifyImage {
    url: string;
    altText: string | null;
    width: number;
    height: number;
}

export interface ShopifyMoneyV2 {
    amount: string;          // "1699.00"
    currencyCode: string;    // "BDT"
}

export interface ShopifyProductVariant {
    id: string;              // global ID  gid://shopify/ProductVariant/123
    title: string;           // "50ml"
    availableForSale: boolean;
    price: ShopifyMoneyV2;
    compareAtPrice: ShopifyMoneyV2 | null;
    selectedOptions: { name: string; value: string }[];
}

export interface ShopifyProduct {
    id: string;
    handle: string;
    title: string;
    description: string;
    descriptionHtml: string;
    vendor: string;
    productType: string;
    tags: string[];
    featuredImage: ShopifyImage | null;
    images: { nodes: ShopifyImage[] };
    variants: { nodes: ShopifyProductVariant[] };
    priceRange: {
        minVariantPrice: ShopifyMoneyV2;
        maxVariantPrice: ShopifyMoneyV2;
    };
    compareAtPriceRange: {
        minVariantPrice: ShopifyMoneyV2;
    };
    metafields: Array<{ key: string; value: string; namespace: string } | null>;
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export interface ShopifyCartLine {
    id: string;
    quantity: number;
    merchandise: {
        id: string;
        title: string;
        product: { title: string; handle: string; featuredImage: ShopifyImage | null };
        price: ShopifyMoneyV2;
    };
    cost: { totalAmount: ShopifyMoneyV2 };
}

export interface ShopifyCart {
    id: string;
    checkoutUrl: string;
    totalQuantity: number;
    cost: {
        subtotalAmount: ShopifyMoneyV2;
        totalAmount: ShopifyMoneyV2;
    };
    lines: { nodes: ShopifyCartLine[] };
}
