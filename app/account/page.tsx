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
    if (!customer) redirect("/login");

    return <AccountClient customer={customer} />;
}
