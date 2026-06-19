"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

const CART_KEY = "senz8_cart_id";
// All Shopify calls go through our own API route to avoid CORS and keep tokens server-side
const ENDPOINT = "/api/shopify";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: { title: string; handle: string; featuredImage: { url: string } | null };
    price: { amount: string; currencyCode: string };
  };
  cost: { totalAmount: { amount: string; currencyCode: string } };
}

interface CartCtx {
  cartId: string | null;
  checkoutUrl: string | null;
  totalQuantity: number;
  lines: CartLine[];
  subtotal: string;
  adding: boolean;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  addToCart: (variantId: string, qty?: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  updateQty: (lineId: string, qty: number) => Promise<void>;
}

const Ctx = createContext<CartCtx>({
  cartId: null, checkoutUrl: null, totalQuantity: 0, lines: [],
  subtotal: "", adding: false, cartOpen: false,
  setCartOpen: () => { },
  addToCart: async () => { },
  removeFromCart: async () => { },
  updateQty: async () => { },
});

export const useCart = () => useContext(Ctx);

// ─── GraphQL helper ────────────────────────────────────────────────────────────
async function gql(query: string, variables: Record<string, unknown> = {}) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data ?? null;
}

// ─── Shared cart fragment ───────────────────────────────────────────────────────
const CART_FIELDS = /* GraphQL */`
  fragment CartFields on Cart {
    id checkoutUrl totalQuantity
    cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
    lines(first: 50) {
      nodes {
        id quantity
        merchandise {
          ... on ProductVariant {
            id title
            price { amount currencyCode }
            product { title handle featuredImage { url altText } }
          }
        }
        cost { totalAmount { amount currencyCode } }
      }
    }
  }
`;

const CREATE_CART_Q = /* GraphQL */`
  ${CART_FIELDS}
  mutation CreateCart($variantId: ID!, $qty: Int!) {
    cartCreate(input: { lines: [{ merchandiseId: $variantId, quantity: $qty }] }) {
      cart { ...CartFields }
      userErrors { message }
    }
  }
`;

const ADD_LINE_Q = /* GraphQL */`
  ${CART_FIELDS}
  mutation AddLine($cartId: ID!, $variantId: ID!, $qty: Int!) {
    cartLinesAdd(cartId: $cartId, lines: [{ merchandiseId: $variantId, quantity: $qty }]) {
      cart { ...CartFields }
      userErrors { message }
    }
  }
`;

const REMOVE_LINE_Q = /* GraphQL */`
  ${CART_FIELDS}
  mutation RemoveLine($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFields }
      userErrors { message }
    }
  }
`;

const UPDATE_LINE_Q = /* GraphQL */`
  ${CART_FIELDS}
  mutation UpdateLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { message }
    }
  }
`;

const GET_CART_Q = /* GraphQL */`
  ${CART_FIELDS}
  query GetCart($cartId: ID!) {
    cart(id: $cartId) { ...CartFields }
  }
`;

// ─── Format price ───────────────────────────────────────────────────────────────
function fmt(amount: string, currencyCode: string) {
  const n = parseFloat(amount);
  if (currencyCode === "BDT") return `৳${Math.round(n).toLocaleString("en-BD")}`;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode }).format(n);
}

// ─── Provider ────────────────────────────────────────────────────────────────────
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [subtotal, setSubtotal] = useState("");
  const [adding, setAdding] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const applyCart = useCallback((cart: {
    id: string; checkoutUrl: string; totalQuantity: number;
    cost: { subtotalAmount: { amount: string; currencyCode: string } };
    lines: { nodes: CartLine[] };
  }) => {
    setCartId(cart.id);
    setCheckoutUrl(cart.checkoutUrl);
    setTotalQuantity(cart.totalQuantity);
    setLines(cart.lines.nodes);
    setSubtotal(fmt(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode));
    if (typeof window !== "undefined") localStorage.setItem(CART_KEY, cart.id);
  }, []);

  // Rehydrate cart from localStorage on mount
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(CART_KEY) : null;
    if (!stored) return;
    gql(GET_CART_Q, { cartId: stored }).then(data => {
      if (data?.cart) applyCart(data.cart);
    });
  }, [applyCart]);

  const addToCart = useCallback(async (variantId: string, qty = 1) => {
    setAdding(true);
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem(CART_KEY) : null;
      const currentId = cartId ?? stored;
      let cart = null;

      if (currentId) {
        const data = await gql(ADD_LINE_Q, { cartId: currentId, variantId, qty });
        cart = data?.cartLinesAdd?.cart ?? null;
      }
      if (!cart) {
        const data = await gql(CREATE_CART_Q, { variantId, qty });
        cart = data?.cartCreate?.cart ?? null;
      }
      if (cart) { applyCart(cart); setCartOpen(true); }
    } finally {
      setAdding(false);
    }
  }, [cartId, applyCart]);

  const removeFromCart = useCallback(async (lineId: string) => {
    if (!cartId) return;
    const data = await gql(REMOVE_LINE_Q, { cartId, lineIds: [lineId] });
    if (data?.cartLinesRemove?.cart) applyCart(data.cartLinesRemove.cart);
  }, [cartId, applyCart]);

  const updateQty = useCallback(async (lineId: string, qty: number) => {
    if (!cartId) return;
    if (qty <= 0) { await removeFromCart(lineId); return; }
    const data = await gql(UPDATE_LINE_Q, { cartId, lines: [{ id: lineId, quantity: qty }] });
    if (data?.cartLinesUpdate?.cart) applyCart(data.cartLinesUpdate.cart);
  }, [cartId, applyCart, removeFromCart]);

  return (
    <Ctx.Provider value={{ cartId, checkoutUrl, totalQuantity, lines, subtotal, adding, cartOpen, setCartOpen, addToCart, removeFromCart, updateQty }}>
      {children}
    </Ctx.Provider>
  );
}
