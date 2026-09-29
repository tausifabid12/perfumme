/** Order list filters → Shopify order search syntax. Shared by server + client. */
export const ORDER_FILTERS = [
    { key: "all", label: "All", query: "" },
    { key: "unfulfilled", label: "To ship", query: "status:open fulfillment_status:unfulfilled financial_status:paid" },
    { key: "pending", label: "Payment pending", query: "status:open financial_status:pending" },
    { key: "paid", label: "Paid", query: "financial_status:paid" },
    { key: "refunded", label: "Refunded", query: "(financial_status:refunded OR financial_status:partially_refunded)" },
    { key: "cancelled", label: "Cancelled", query: "status:cancelled" },
] as const;

export function buildOrderQuery(filter: string, q: string): string {
    const base = ORDER_FILTERS.find((f) => f.key === filter)?.query ?? "";
    let text = q.trim().slice(0, 100);
    // "#1009" / "1009" → exact order name
    if (/^#?\d+$/.test(text)) text = `name:#${text.replace("#", "")}`;
    else if (text) text = text.replace(/[()\\]/g, " ");
    return [base, text].filter(Boolean).join(" ");
}
