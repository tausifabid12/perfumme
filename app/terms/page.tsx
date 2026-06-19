import type { Metadata } from "next";
import LegalPageLayout, { type LegalSection } from "@/components/LegalPageLayout";

export const metadata: Metadata = {
    title: "Terms of Service — SENZ8",
    description: "The terms and conditions governing your use of SENZ8.",
};

const sections: LegalSection[] = [
    {
        heading: "Acceptance of Terms",
        body: (
            <p>By accessing or using the SENZ8 website, placing an order, or creating an account, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree with any part of these terms, you may not use our services. These terms apply to all visitors, customers, and others who access or use our platform.</p>
        ),
    },
    {
        heading: "Products & Pricing",
        body: (
            <>
                <p>All products listed on our website are subject to availability. We reserve the right to discontinue any product at any time without notice.</p>
                <ul className="list-none flex flex-col gap-2 mt-3">
                    {[
                        "Prices are displayed in Bangladeshi Taka (BDT) and are inclusive of applicable taxes unless stated otherwise.",
                        "We reserve the right to change prices at any time. Price changes will not affect orders already confirmed.",
                        "Product images are for illustrative purposes. Slight variations in colour, packaging or appearance may occur.",
                        "Limited edition and promotional products are available while stocks last.",
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
        heading: "Orders & Payment",
        body: (
            <>
                <p>When you place an order, you are making an offer to purchase the selected products. We reserve the right to accept or decline any order.</p>
                <ul className="list-none flex flex-col gap-2 mt-3 mb-4">
                    {[
                        "Order confirmation emails are sent automatically after a successful transaction.",
                        "We accept major payment methods including credit/debit cards and mobile banking (bKash, Nagad).",
                        "All payments are processed securely. We do not store your full card details.",
                        "In the event of a pricing error, we will contact you before processing your order.",
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--accent-gold)" }} />
                            {item}
                        </li>
                    ))}
                </ul>
                <p>SENZ8 reserves the right to cancel any order suspected of fraud or placed using unauthorised payment methods.</p>
            </>
        ),
    },
    {
        heading: "Shipping & Delivery",
        body: (
            <>
                <p>We aim to dispatch all orders within 1–2 business days of payment confirmation.</p>
                <ul className="list-none flex flex-col gap-2 mt-3 mb-4">
                    {[
                        "Standard delivery within Dhaka: 1–2 business days.",
                        "Nationwide delivery: 3–5 business days.",
                        "Free standard shipping on orders above a minimum threshold as stated on our website.",
                        "Delivery timeframes are estimates and not guaranteed — delays may occur due to courier issues or holidays.",
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--accent-gold)" }} />
                            {item}
                        </li>
                    ))}
                </ul>
                <p>Risk of loss and title for products passes to you upon delivery to the carrier. SENZ8 is not liable for delays or losses caused by the courier.</p>
            </>
        ),
    },
    {
        heading: "Returns & Refunds",
        body: (
            <>
                <p>We want you to love every scent. If you are not satisfied, please review our return conditions:</p>
                <ul className="list-none flex flex-col gap-2 mt-3 mb-4">
                    {[
                        "Returns are accepted within 7 days of delivery for unopened, unused products in original packaging.",
                        "To initiate a return, contact us at hello@senz8.com with your order number and reason.",
                        "Opened or used products cannot be returned due to hygiene reasons, unless defective.",
                        "Refunds are processed within 5–10 business days of receiving the returned item.",
                        "Shipping costs for returns are the customer's responsibility unless the item is defective or incorrect.",
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--accent-gold)" }} />
                            {item}
                        </li>
                    ))}
                </ul>
                <p>Defective or damaged items will be replaced or fully refunded — please provide photographic evidence when contacting us.</p>
            </>
        ),
    },
    {
        heading: "Intellectual Property",
        body: (
            <p>All content on the SENZ8 website — including but not limited to text, images, videos, logos, animations, and product names — is the intellectual property of SENZ8 or its licensors. You may not reproduce, distribute, modify or use any content for commercial purposes without our prior written consent. Unauthorised use may result in legal action.</p>
        ),
    },
    {
        heading: "User Accounts",
        body: (
            <>
                <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to:</p>
                <ul className="list-none flex flex-col gap-2 mt-3">
                    {[
                        "Provide accurate and complete information when creating an account.",
                        "Notify us immediately of any unauthorised access to your account.",
                        "Not share your account with any other person.",
                        "Not use another person's account without their explicit permission.",
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--accent-gold)" }} />
                            {item}
                        </li>
                    ))}
                </ul>
                <p className="mt-4">SENZ8 reserves the right to terminate accounts that violate these terms or engage in fraudulent activity.</p>
            </>
        ),
    },
    {
        heading: "Limitation of Liability",
        body: (
            <p>To the maximum extent permitted by law, SENZ8 shall not be liable for any indirect, incidental, special, consequential or punitive damages arising from your use of our website or products. Our total liability for any claim shall not exceed the amount paid by you for the specific product or service giving rise to the claim. We do not warrant that our website will be error-free, uninterrupted or free of viruses.</p>
        ),
    },
    {
        heading: "Governing Law",
        body: (
            <p>These Terms of Service are governed by and construed in accordance with the laws of the People's Republic of Bangladesh. Any disputes arising from or relating to these terms shall be subject to the exclusive jurisdiction of the courts of Dhaka, Bangladesh.</p>
        ),
    },
    {
        heading: "Changes to These Terms",
        body: (
            <p>We reserve the right to modify these Terms of Service at any time. Changes will be posted on this page with a revised "Last updated" date. Your continued use of our website or services following any changes constitutes your acceptance of the updated terms. We encourage you to review this page periodically.</p>
        ),
    },
    {
        heading: "Contact",
        body: (
            <p>For any questions regarding these Terms of Service, please contact us at <span style={{ color: "var(--accent-gold)" }}>hello@senz8.com</span> or visit our <a href="/contact" style={{ color: "var(--accent-gold)", textDecoration: "underline", textDecorationColor: "rgba(212,175,55,0.3)" }}>Contact page</a>.</p>
        ),
    },
];

export default function TermsPage() {
    return (
        <LegalPageLayout
            badge="Legal"
            title={["Terms of", "Service."]}
            subtitle="Please read these terms carefully before using our website or placing an order."
            lastUpdated="June 2025"
            sections={sections}
        />
    );
}
