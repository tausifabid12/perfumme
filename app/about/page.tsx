import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
    title: "About — Senz8 Aroma | The Story Behind the Scent",
    description:
        "The story behind Senz8 Aroma — a fragrance house built for a generation that refuses to be ordinary. Crafted in Bangalore, remembered everywhere.",
    alternates: { canonical: "https://www.senz8.in/about" },
    openGraph: {
        title: "About — Senz8 Aroma | The Story Behind the Scent",
        description:
            "Discover the philosophy and story behind Senz8 Aroma. Bold, cinematic fragrances for those who leave a mark.",
        url: "https://www.senz8.in/about",
        images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "About Senz8 Aroma" }],
    },
};

export default function AboutPage() {
    return <AboutClient />;
}
