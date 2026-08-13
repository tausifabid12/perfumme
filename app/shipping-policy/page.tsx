import type { Metadata } from "next";
import LegalPageLayout, { type LegalSection } from "@/components/LegalPageLayout";

export const metadata: Metadata = {
    title: "Shipping Policy — Senz8 Aroma",
    description:
        "Processing times, delivery estimates, and order tracking for Senz8 Aroma orders across India.",
    alternates: { canonical: "https://www.senz8.in/shipping-policy" },
    robots: { index: false, follow: false },
};

const sections: LegalSection[] = [
    {
        heading: "Processing Time",
        body: (
            <p>All orders are processed within 1-2 business days. During peak periods such as Festival season, processing may take longer, but we will make every effort to ship your order as quickly as possible.</p>
        ),
    },
    {
        heading: "Delivery Time",
        body: (
            <p>Delivery times may vary depending on your location. Typically, orders are delivered within 3-7 business days. Please note that delays may occur due to high demand during the festive season or unforeseen circumstances like weather conditions.</p>
        ),
    },
    {
        heading: "Order Tracking",
        body: (
            <p>Once your order is shipped, you will receive a tracking number via email, allowing you to track your shipment in real time.</p>
        ),
    },
];

export default function ShippingPolicyPage() {
    return (
        <LegalPageLayout
            badge="Legal"
            title={["Shipping", "Policy."]}
            subtitle="Everything you need to know about how we process, ship, and deliver your order."
            lastUpdated="June 2025"
            sections={sections}
        />
    );
}