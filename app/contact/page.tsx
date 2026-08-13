import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
    title: "Contact — Senz8 Aroma | Get in Touch",
    description:
        "Get in touch with the House of Senz8 Aroma. Questions about orders, products, or collaborations — we're here to help.",
    alternates: { canonical: "https://www.senz8.in/contact" },
    openGraph: {
        title: "Contact — Senz8 Aroma",
        description: "Reach out to the Senz8 Aroma team for any queries, orders, or collaborations.",
        url: "https://www.senz8.in/contact",
        images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "Contact Senz8 Aroma" }],
    },
};

export default function ContactPage() {
    return <ContactClient />;
}
