/**
 * POST /api/cart/checkout  { cartId }
 * Logged in: attaches the customer (httpOnly token cookie) to the cart via
 * cartBuyerIdentityUpdate and returns the cart's checkoutUrl, so the order is
 * linked to their account. Guest: returns { checkoutUrl: null, guest: true }
 * and the client uses the cart's own checkoutUrl — Shopify guest checkout.
 */

import { NextRequest, NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify/client";

const CART_BUYER_IDENTITY_UPDATE = /* GraphQL */ `
  mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`;

export async function POST(req: NextRequest) {
    const token = req.cookies.get("shopify_customer_token")?.value;
    if (!token) {
        // No account needed — guest checkout uses the cart's checkoutUrl as is.
        return NextResponse.json({ checkoutUrl: null, guest: true });
    }

    const { cartId } = await req.json();
    if (!cartId) {
        return NextResponse.json({ error: "cartId required" }, { status: 400 });
    }

    try {
        const data = await shopifyFetch<{
            cartBuyerIdentityUpdate: {
                cart: { id: string; checkoutUrl: string } | null;
                userErrors: { field: string[]; message: string }[];
            };
        }>(CART_BUYER_IDENTITY_UPDATE, {
            cartId,
            buyerIdentity: { customerAccessToken: token },
        });

        const { cart, userErrors } = data.cartBuyerIdentityUpdate;
        if (userErrors.length || !cart) {
            console.error("cartBuyerIdentityUpdate:", userErrors);
            return NextResponse.json({ error: userErrors[0]?.message ?? "Cart not found" }, { status: 400 });
        }

        return NextResponse.json({ checkoutUrl: cart.checkoutUrl });
    } catch (err) {
        console.error("Checkout link failed:", err);
        return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
    }
}
