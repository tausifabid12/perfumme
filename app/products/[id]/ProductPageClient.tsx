"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProductData } from "@/types/product";

import ScrollProgress from "@/lib/animations/scroll-progress";
import ScrollSkewProvider from "@/lib/animations/scroll-skew-provider";

import HeroSection from "@/components/product/hero-section";
import ProductTransformSection from "@/components/product/product-transform-section";
import StatsSection from "@/components/product/stats-section";
import FragranceNotesSection from "@/components/product/fragrance-notes-section";
import CompositionSection from "@/components/product/composition-section";
import DripTransition from "@/components/product/drip-transition";
import MarqueeSection from "@/components/product/marquee-section";
import HorizontalStorySection from "@/components/product/horizontal-story-section";
import YouMayAlsoLikeSection from "@/components/product/you-may-also-like-section";
import TestimonialsSection from "@/components/product/testimonials-section";
import FAQSection from "@/components/product/faq-section";
import Footer from "@/components/product/footer";
import CinematicNav from "@/components/Cinematicnav";

export default function ProductPageClient({
  data,
  shopifyVariantId,
  shopifyPrice,
}: {
  data: ProductData;
  shopifyVariantId?: string;
  shopifyPrice?: string;
}) {
  useEffect(() => {
    ScrollTrigger.refresh();
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div className="relative" style={{ background: "var(--bg-primary)" }}>
      <ScrollProgress />
      <ScrollSkewProvider />
      <CinematicNav />

      <HeroSection
        data={data}
        onAnimationComplete={() => { }}
        shopifyVariantId={shopifyVariantId}
        shopifyPrice={shopifyPrice}
      />
      <ProductTransformSection data={data} />
      <StatsSection data={data} />
      <FragranceNotesSection data={data} />
      <CompositionSection data={data} />
      <DripTransition />
      <MarqueeSection data={data} />
      <HorizontalStorySection data={data} />
      <TestimonialsSection data={data} />
      <YouMayAlsoLikeSection data={data} />
      <FAQSection data={data} />
      <Footer data={data} />
    </div>
  );
}
