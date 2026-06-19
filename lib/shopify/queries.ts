// GraphQL fragments & queries for Shopify Storefront API

export const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    vendor
    productType
    tags
    featuredImage { url altText width height }
    images(first: 8) { nodes { url altText width height } }
    variants(first: 20) {
      nodes {
        id
        title
        availableForSale
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        selectedOptions { name value }
      }
    }
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    compareAtPriceRange {
      minVariantPrice { amount currencyCode }
    }
    metafields(identifiers: [
      { namespace: "custom", key: "longevity" }
      { namespace: "custom", key: "concentration" }
      { namespace: "custom", key: "gender" }
      { namespace: "custom", key: "top_notes" }
      { namespace: "custom", key: "heart_notes" }
      { namespace: "custom", key: "base_notes" }
    ]) {
      key value namespace
    }
  }
`;

export const GET_ALL_PRODUCTS = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query GetAllProducts($first: Int!, $after: String) {
    products(first: $first, after: $after, sortKey: TITLE) {
      pageInfo { hasNextPage endCursor }
      nodes { ...ProductFields }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) { ...ProductFields }
  }
`;

export const CREATE_CART = /* GraphQL */ `
  mutation CreateCart($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id checkoutUrl totalQuantity
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
        }
        lines(first: 50) {
          nodes {
            id quantity
            merchandise {
              ... on ProductVariant {
                id title
                price { amount currencyCode }
                product { title handle featuredImage { url altText width height } }
              }
            }
            cost { totalAmount { amount currencyCode } }
          }
        }
      }
      userErrors { field message }
    }
  }
`;

export const ADD_TO_CART = /* GraphQL */ `
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id checkoutUrl totalQuantity
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
        }
        lines(first: 50) {
          nodes {
            id quantity
            merchandise {
              ... on ProductVariant {
                id title
                price { amount currencyCode }
                product { title handle featuredImage { url altText width height } }
              }
            }
            cost { totalAmount { amount currencyCode } }
          }
        }
      }
      userErrors { field message }
    }
  }
`;
