import type { Metadata } from "next";
import LegalPageLayout, { type LegalSection } from "@/components/LegalPageLayout";

export const metadata: Metadata = {
    title: "Privacy Policy — SENZ8",
    description: "How SENZ8 collects, uses and protects your personal information.",
};

const sections: LegalSection[] = [
    {
        heading: "Information We Collect",
        body: (
            <>
                <p>When you visit our website or place an order, we may collect the following types of information:</p>
                <ul className="list-none flex flex-col gap-2 mt-3">
                    {[
                        "Personal identification information — name, email address, phone number, billing and shipping address.",
                        "Payment information — processed securely through our payment provider. We do not store full card details on our servers.",
                        "Device and usage data — browser type, IP address, pages visited, time spent, and referral source.",
                        "Order history and preferences — fragrances purchased, wishlist items, and communication history.",
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
                <p>We use the information we collect to:</p>
                <ul className="list-none flex flex-col gap-2 mt-3">
                    {[
                        "Process and fulfil your orders, including sending order confirmations and shipping updates.",
                        "Communicate with you about your account, enquiries or returns.",
                        "Send promotional emails and exclusive offers — only if you have opted in.",
                        "Improve our website, products and customer experience through analytics.",
                        "Prevent fraud, comply with legal obligations and enforce our terms.",
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--accent-gold)" }} />
                            {item}
                        </li>
                    ))}
                </ul>
                <p className="mt-4">We will never sell, trade or rent your personal information to third parties for their own marketing purposes.</p>
            </>
        ),
    },
    {
        heading: "Cookies & Tracking",
        body: (
            <>
                <p>Our website uses cookies — small text files stored on your device — to enhance your browsing experience. Cookies allow us to:</p>
                <ul className="list-none flex flex-col gap-2 mt-3 mb-4">
                    {[
                        "Remember your cart contents between sessions.",
                        "Understand how visitors navigate our site via analytics tools.",
                        "Deliver relevant advertisements on third-party platforms if you have consented.",
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--accent-gold)" }} />
                            {item}
                        </li>
                    ))}
                </ul>
                <p>You may disable cookies in your browser settings. Note that doing so may affect some functionality of our store.</p>
            </>
        ),
    },
    {
        heading: "Data Sharing & Third Parties",
        body: (
            <>
                <p>We work with trusted third-party service providers to operate our business. These include:</p>
                <ul className="list-none flex flex-col gap-2 mt-3 mb-4">
                    {[
                        "Shopify — our e-commerce platform, which processes and stores order data.",
                        "Payment gateways (SSL Commerz, bKash, etc.) — for secure transaction processing.",
                        "Courier partners — to fulfil and track your deliveries.",
                        "Email marketing tools — for transactional and promotional communications.",
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--accent-gold)" }} />
                            {item}
                        </li>
                    ))}
                </ul>
                <p>Each of these parties is contractually obligated to handle your data only as necessary to provide their services and in accordance with applicable data protection laws.</p>
            </>
        ),
    },
    {
        heading: "Data Retention",
        body: (
            <p>We retain your personal data for as long as your account is active or as needed to provide services. Order records may be retained for up to 7 years to comply with financial and tax regulations. You may request deletion of your personal data at any time by contacting us at <span style={{ color: "var(--accent-gold)" }}>hello@senz8.com</span>.</p>
        ),
    },
    {
        heading: "Your Rights",
        body: (
            <>
                <p>You have the following rights regarding your personal data:</p>
                <ul className="list-none flex flex-col gap-2 mt-3">
                    {[
                        "Right to access — request a copy of the personal data we hold about you.",
                        "Right to rectification — ask us to correct inaccurate or incomplete data.",
                        "Right to erasure — request that we delete your personal data, subject to legal obligations.",
                        "Right to opt out — unsubscribe from marketing communications at any time.",
                        "Right to data portability — receive your data in a machine-readable format.",
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--accent-gold)" }} />
                            {item}
                        </li>
                    ))}
                </ul>
                <p className="mt-4">To exercise any of these rights, contact us at <span style={{ color: "var(--accent-gold)" }}>hello@senz8.com</span>.</p>
            </>
        ),
    },
    {
        heading: "Security",
        body: (
            <p>We implement industry-standard security measures including SSL/TLS encryption, secure payment processing, and access controls to protect your personal information. However, no method of transmission over the internet is 100% secure. We encourage you to use a strong password and notify us immediately if you suspect any unauthorised access to your account.</p>
        ),
    },
    {
        heading: "Children's Privacy",
        body: (
            <p>Our website and products are not directed at children under the age of 16. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately and we will promptly delete it.</p>
        ),
    },
    {
        heading: "Changes to This Policy",
        body: (
            <p>We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. The updated policy will be posted on this page with a revised "Last updated" date. We encourage you to review this page periodically. Continued use of our website after any changes constitutes acceptance of the updated policy.</p>
        ),
    },
    {
        heading: "Contact",
        body: (
            <p>If you have any questions about this Privacy Policy or how we handle your data, please reach out to us at <span style={{ color: "var(--accent-gold)" }}>hello@senz8.com</span> or through our <a href="/contact" style={{ color: "var(--accent-gold)", textDecoration: "underline", textDecorationColor: "rgba(212,175,55,0.3)" }}>Contact page</a>.</p>
        ),
    },
];

export default function PrivacyPolicyPage() {
    return (
        <LegalPageLayout
            badge="Legal"
            title={["Privacy", "Policy."]}
            subtitle="We respect your privacy and are committed to protecting your personal information."
            lastUpdated="June 2025"
            sections={sections}
        />
    );
}
