import type { Metadata } from "next";
import LegalPageLayout, { type LegalSection } from "@/components/LegalPageLayout";

export const metadata: Metadata = {
    title: "Refund Policy — SENZ8",
    description: "Our order cancellation, refund, and return policy.",
};

const sections: LegalSection[] = [
    {
        heading: "Order Cancellation",
        body: (
            <>
                <p>Physical Products:</p>
                <ul className="list-none flex flex-col gap-2 mt-3">
                    {[
                        "Orders can be cancelled only before the item is shipped.",
                        "Orders already shipped cannot be cancelled.",
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
        heading: "Refund Policy",
        body: (
            <>
                <p className="font-medium mb-2">No-Refund Policy</p>
                <p>We maintain a strict no-refund policy for all products. However, we may make exceptions in the following cases:</p>
                <ul className="list-none flex flex-col gap-2 mt-3 mb-4">
                    {[
                        "Product not received.",
                        "If the product is lost in transit.",
                        "If the wrong product is delivered.",
                        "If the product is damaged during shipping.",
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--accent-gold)" }} />
                            {item}
                        </li>
                    ))}
                </ul>
                <p className="font-medium mb-2">Refund Process (When Applicable)</p>
                <p>If any refund is approved, the amount will be credited back to the original payment method within 7–14 business days.</p>
            </>
        ),
    },
    {
        heading: "Return Policy",
        body: (
            <>
                <p>We are committed to ensuring customer satisfaction and stand by the quality of our products. Below is our return policy to guide you through the return and replacement process.</p>

                <p className="font-medium mt-4 mb-2">Eligibility for Return</p>
                <ul className="list-none flex flex-col gap-2 mb-4">
                    {[
                        "Returns are accepted only for defective, damaged, or incorrect products received.",
                        "The return request must be initiated within 24 hours of receiving the product.",
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--accent-gold)" }} />
                            {item}
                        </li>
                    ))}
                </ul>

                <p className="font-medium mb-2">Return Process</p>
                <ul className="list-none flex flex-col gap-2 mb-4">
                    {[
                        "If your return request is approved, the replacement process will be initiated within 2–3 business days.",
                        "Once the replacement is dispatched, it is expected to be delivered within 4–7 business days.",
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--accent-gold)" }} />
                            {item}
                        </li>
                    ))}
                </ul>

                <p className="font-medium mb-2">Important Notes</p>
                <ul className="list-none flex flex-col gap-2 mb-4">
                    {[
                        "Delivery timelines may be affected by delays from the transport company, adverse weather conditions, or other unforeseen circumstances.",
                        "We are not responsible for delays caused by external factors beyond our control.",
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--accent-gold)" }} />
                            {item}
                        </li>
                    ))}
                </ul>

                <p>We aim to make the return and replacement process as seamless as possible.</p>
            </>
        ),
    },
    {
        heading: "Contact",
        body: (
            <p>For any questions regarding this Refund Policy, please contact us at <span style={{ color: "var(--accent-gold)" }}>contact@senz8.in</span> or visit our <a href="/contact" style={{ color: "var(--accent-gold)", textDecoration: "underline", textDecorationColor: "rgba(212,175,55,0.3)" }}>Contact page</a>.</p>
        ),
    },
];

export default function RefundPolicyPage() {
    return (
        <LegalPageLayout
            badge="Legal"
            title={["Refund", "Policy."]}
            subtitle="Everything you need to know about cancellations, refunds, and returns."
            lastUpdated="June 2025"
            sections={sections}
        />
    );
}