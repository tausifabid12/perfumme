import type { Metadata } from "next";
import LegalPageLayout, { type LegalSection } from "@/components/LegalPageLayout";

export const metadata: Metadata = {
    title: "Privacy Policy — Senz8 Aroma",
    description:
        "How Senz8 Aroma collects, uses, and protects your personal information when you shop with us.",
    alternates: { canonical: "https://www.senz8.in/privacy-policy" },
    robots: { index: false, follow: false },
};

const sections: LegalSection[] = [
    {
        heading: "Introduction",
        body: (
            <p>Your privacy is very important to us.This Privacy Policy explains how we collect, use, and protect your personal information when you shop with us.</p>
        ),
    },
    {
        heading: "Information We Collect",
        body: (
            <>
                <p>When you place an order or interact with our website, we may collect the following information:</p>
                <ul className="list-none flex flex-col gap-2 mt-3">
                    {[
                        "Your name",
                        "Phone number",
                        "Email address",
                        "Shipping and billing address",
                        "Payment details (processed securely via third-party gateways)",
                        "Order history and preferences",
                        "Communication or feedback",
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--accent-gold)" }} />
                            {item}
                        </li>
                    ))}
                </ul>
            </>
        ),
    },
    {
        heading: "How We Use Your Information",
        body: (
            <>
                <p>We use your information to:</p>
                <ul className="list-none flex flex-col gap-2 mt-3">
                    {[
                        "Process and deliver your orders",
                        "Provide customer support",
                        "Send order updates and promotional offers (only with your consent)",
                        "Improve our website and services",
                        "Comply with legal obligations",
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--accent-gold)" }} />
                            {item}
                        </li>
                    ))}
                </ul>
            </>
        ),
    },
    {
        heading: "Sharing Your Information",
        body: (
            <>
                <p>We do not sell or rent your personal information to third parties. We may share it only with:</p>
                <ul className="list-none flex flex-col gap-2 mt-3">
                    {[
                        "Trusted service providers (e.g. delivery partners, payment processors) to fulfill your order",
                        "Government authorities if required by law",
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--accent-gold)" }} />
                            {item}
                        </li>
                    ))}
                </ul>
            </>
        ),
    },
    {
        heading: "Data Security",
        body: (
            <p>We take reasonable steps to protect your personal data from unauthorized access, misuse, or loss. Payments are securely handled by trusted payment gateways and are not stored on our servers.</p>
        ),
    },
    {
        heading: "Cookies",
        body: (
            <p>Our website uses cookies to improve your browsing experience. Cookies help us remember your preferences and track website performance. You can manage or disable cookies in your browser settings.</p>
        ),
    },
    {
        heading: "Your Rights",
        body: (
            <>
                <p>You have the right to:</p>
                <ul className="list-none flex flex-col gap-2 mt-3">
                    {[
                        "Access or update your personal information",
                        "Request deletion of your data (subject to order history and legal requirements)",
                        "Opt out of marketing communications",
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--accent-gold)" }} />
                            {item}
                        </li>
                    ))}
                </ul>
            </>
        ),
    },
    {
        heading: "Return Policy",
        body: (
            <>
                <p>We offer a 7-day return window, which means you can request a return within 7 days of receiving your item.</p>
                <p className="mt-4">To be eligible for a return:</p>
                <ul className="list-none flex flex-col gap-2 mt-3 mb-4">
                    {[
                        "The item must be unused and in its original packaging.",
                        "You must provide the receipt or proof of purchase.",
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--accent-gold)" }} />
                            {item}
                        </li>
                    ))}
                </ul>
                <p>To initiate a return, send us an email. Once your return request is approved, we will provide you with instructions on how and where to send the item.</p>
                <p className="mt-4">Please note: items returned without prior authorisation will not be accepted.</p>
            </>
        ),
    },
    {
        heading: "Replacement Policy",
        body: (
            <>
                <p>If you receive a damaged or defective item, please report it to us within 48 hours of delivery along with photos or videos as proof.</p>
                <p className="mt-4">Once we receive and inspect the returned item:</p>
                <ul className="list-none flex flex-col gap-2 mt-3 mb-4">
                    {[
                        "We will confirm the eligibility for a replacement.",
                        "If approved, a replacement will be delivered within 7–10 business days.",
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--accent-gold)" }} />
                            {item}
                        </li>
                    ))}
                </ul>
                <p>Replacements are subject to stock availability. If a replacement is not available, we may offer a refund or an alternative item.</p>
            </>
        ),
    },
    {
        heading: "Refund Policy",
        body: (
            <>
                <p>After we receive and inspect your return, we&apos;ll notify you via email or message regarding the status of your refund.</p>
                <p className="mt-4">If approved:</p>
                <ul className="list-none flex flex-col gap-2 mt-3 mb-4">
                    {[
                        "Your refund will be credited automatically to your original method of payment within 10 business days.",
                        "You will receive a confirmation once the refund is issued.",
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--accent-gold)" }} />
                            {item}
                        </li>
                    ))}
                </ul>
                <p>Please note: your bank or credit card provider may take additional time to reflect the refund in your account. Shipping charges (if any) are non-refundable unless the return is due to our error (e.g. defective or wrong item).</p>
            </>
        ),
    },
    {
        heading: "Shipping Policy",
        body: (
            <>
                <p>We aim to dispatch all orders promptly and deliver them within the estimated time frame. Orders are typically delivered within 10 to 15 business days from the date of order confirmation and/or payment.</p>
                <p className="mt-4">Delivery time may vary depending on your location, courier service performance, or unforeseen delays. Once your order is shipped, you will receive tracking details via email or SMS.</p>
                <p className="mt-4">We are not responsible for delays caused by courier services or force majeure events (e.g. natural disasters, strikes, or government restrictions).</p>
                <p className="mt-4 font-medium">Shipping Charges:</p>
                <ul className="list-none flex flex-col gap-2 mt-3">
                    {[
                        "Shipping fees (if applicable) will be calculated and displayed at checkout.",
                        "Free shipping may be available on select items or order values.",
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--accent-gold)" }} />
                            {item}
                        </li>
                    ))}
                </ul>
            </>
        ),
    },
    {
        heading: "Contact Us",
        body: (
            <p>If you have any questions or concerns about this Privacy Policy, please contact us at <span style={{ color: "var(--accent-gold)" }}>contact@senz8.in</span> or visit our <a href="/contact" style={{ color: "var(--accent-gold)", textDecoration: "underline", textDecorationColor: "rgba(212,175,55,0.3)" }}>Contact page</a>.</p>
        ),
    },
];

export default function PrivacyPolicyPage() {
    return (
        <LegalPageLayout
            badge="Legal"
            title={["Privacy", "Policy."]}
            subtitle="How we collect, use, and protect your personal information when you shop with us."
            lastUpdated="July 2026"
            sections={sections}
        />
    );
}