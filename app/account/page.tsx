import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCustomer } from "@/lib/shopify/customer-api";
import AccountClient from "./AccountClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Account — SENZ8 Aroma" };

export default async function AccountPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("shopify_customer_token")?.value;

    if (!token) redirect("/login");

    const customer = await getCustomer(token);
    // Token rejected/expired: clear the cookie first, or /login ↔ /account loops
    if (customer === null) redirect("/api/auth/logout");
    // Shopify unreachable — show the error page rather than logging the user out
    if (!customer) throw new Error("Could not load your account. Please try again.");

    return <AccountClient customer={customer} />;
}
