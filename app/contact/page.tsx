import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
    title: "Contact — SENZ8",
    description: "Get in touch with the House of SENZ8.",
};

export default function ContactPage() {
    return <ContactClient />;
}
