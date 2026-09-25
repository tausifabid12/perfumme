/**
 * POST /api/cart/checkout  { cartId }
 * Attaches the logged-in customer (httpOnly token cookie) to the cart via
 * cartBuyerIdentityUpdate, then returns the cart's checkoutUrl. Without this
 * the cart is anonymous and Shopify checkout treats the user as a guest.
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
        return NextResponse.json({ error: "Not logged in" }, { status: 401 });
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
