/**
 * POST /api/cart/checkout  { cartId }
 * Requires a signed-in customer or a WhatsApp-verified number; with neither
 * returns 403 { needsOtp: true } and the client shows the WhatsApp OTP step,
 * which also signs the customer in (see /api/otp/verify).
 *
 * The customer (httpOnly token cookie) is attached to the cart so the order is
 * linked to their account, plus the verified number (pre-fills phone). If the
 * OTP login failed, a verified guest still gets Shopify guest checkout.
 */

import { NextRequest, NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify/client";
import { verifiedPhone } from "@/lib/whatsapp-otp";
import { TOKEN_COOKIE } from "@/lib/shopify/auth-cookie";

const CART_BUYER_IDENTITY_UPDATE = /* GraphQL */ `
  mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`;

type UpdateResult = {
    cartBuyerIdentityUpdate: {
        cart: { id: string; checkoutUrl: string } | null;
        userErrors: { field: string[]; message: string }[];
    };
};

export async function POST(req: NextRequest) {
    // Signed in (WhatsApp OTP login, or an older password session) → go ahead.
    // Not signed in → the WhatsApp OTP step signs them in first.
    const token = req.cookies.get(TOKEN_COOKIE)?.value;
    const phone = verifiedPhone(req);
    if (!token && !phone) {
        return NextResponse.json({ error: "Verify your WhatsApp number to continue.", needsOtp: true }, { status: 403 });
    }

    const { cartId } = await req.json().catch(() => ({}));
    if (!cartId) {
        return NextResponse.json({ error: "cartId required" }, { status: 400 });
    }

    const update = (buyerIdentity: Record<string, string>) =>
        shopifyFetch<UpdateResult>(CART_BUYER_IDENTITY_UPDATE, { cartId, buyerIdentity })
            .then(d => d.cartBuyerIdentityUpdate);

    try {
        let { cart, userErrors } = await update({
            ...(phone ? { phone: `+${phone}` } : {}),
            ...(token ? { customerAccessToken: token } : {}),
        });

        // A phone Shopify rejects must not block the purchase — retry without it.
        if ((userErrors.length || !cart) && token && phone) {
            console.error("cartBuyerIdentityUpdate (with phone):", userErrors);
            ({ cart, userErrors } = await update({ customerAccessToken: token }));
        }

        if (userErrors.length || !cart) {
            console.error("cartBuyerIdentityUpdate:", userErrors);
            // Verified guest → cart's own checkoutUrl (client fallback)
            if (phone) return NextResponse.json({ checkoutUrl: null, guest: true, phone });
            // Signed in but the token was rejected (expired) → sign in again via OTP
            const res = NextResponse.json({ error: "Please verify your WhatsApp number again.", needsOtp: true }, { status: 403 });
            res.cookies.delete(TOKEN_COOKIE);
            return res;
        }

        return NextResponse.json({ checkoutUrl: cart.checkoutUrl, phone });
    } catch (err) {
        console.error("Checkout link failed:", err);
        return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
    }
}
