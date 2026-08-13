import type { Metadata, Viewport } from "next";
import { Inter, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { PageTransitionProvider } from "@/components/PageTransition";
import { CartProvider } from "@/components/providers/CartProvider";
import CartDrawer from "@/components/CartDrawer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
});

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-bodoni",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const BASE_URL = "https://www.senz8.in";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "SENZ8 Aroma — Parfum Maison | Luxury Fragrances",
    template: "%s | SENZ8 Aroma",
  },
  description:
    "SENZ8 Aroma — a luxury fragrance house crafting bold, cinematic perfumes. Discover Imperial Smoke, Rebel Girl, It Boy and more. Extrait de Parfum. Made to be remembered.",
  keywords: [
    "SENZ8",
    "Senz8 Aroma",
    "luxury perfume",
    "extrait de parfum",
    "Indian perfume brand",
    "Imperial Smoke perfume",
    "Rebel Girl perfume",
    "It Boy perfume",
    "fragrance house India",
    "premium attar",
    "long lasting perfume",
    "Senz8 Aroma Private Limited",
  ],
  authors: [{ name: "Senz8 Aroma Private Limited", url: BASE_URL }],
  creator: "Senz8 Aroma Private Limited",
  publisher: "Senz8 Aroma Private Limited",
  category: "shopping",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "SENZ8 Aroma",
    title: "SENZ8 Aroma — Parfum Maison | Luxury Fragrances",
    description:
      "Bold, cinematic perfumes crafted in the house of SENZ8. Discover our collection of Extrait de Parfum — crafted in shadow, remembered forever.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SENZ8 Aroma — Luxury Parfum Maison",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SENZ8 Aroma — Parfum Maison | Luxury Fragrances",
    description:
      "Bold, cinematic perfumes crafted in the house of SENZ8. Discover Imperial Smoke, Rebel Girl, It Boy & more.",
    images: ["/images/og-image.jpg"],
    creator: "@senz8aroma",
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${bodoniModa.variable}`}>
      <body>
        <SmoothScrollProvider>
          <CartProvider>
            <PageTransitionProvider>
              {children}
            </PageTransitionProvider>
            <CartDrawer />
          </CartProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}