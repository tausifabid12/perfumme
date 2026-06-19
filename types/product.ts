export interface Brand {
  name: string;
  tagline: string;
}

export interface ProductInfo {
  name: string;
  fullName: string;
  description: string;
  price: number;
  currency: string;
  priceUnit: string;
  rating: number;
  reviewCount: number;
  image: string;
  heroBg: string;
  statsBg: string;
  footerImage: string;
}

export interface Variant {
  name: string;
  sku: string;
}

export interface NavData {
  items: string[];
}

export interface HeroData {
  title: string[];
  description: string;
  scrollIndicator: string;
}

export interface Stat {
  number: string;
  label: string;
}

export interface ProductTransformFrame {
  label: string;
  headline?: string;
  position: string;
  stat?: string;
  statLabel?: string;
  sub?: string;
  cta?: string;
}

export interface ProductTransformData {
  frames: ProductTransformFrame[];
}

export interface FragranceNote {
  type: string;
  typeColor: string;
  title: string;
  description: string;
  position: string;
  top: string | null;
}

export interface FragranceNotesData {
  title: string;
  notes: FragranceNote[];
}

export interface Ingredient {
  name: string;
  sub: string;
  icon: string;
}

export interface NutritionFacts {
  title: string;
  serving: string;
  items: [string, string][];
}

export interface CompositionData {
  tag: string;
  title: string;
  ingredients: Ingredient[];
  facts: NutritionFacts;
}

export interface StorySlide {
  label: string;
  headline: string;
  sub: string;
}

export interface FullViewportData {
  eyebrow: string;
  headline: string[];
  subtext: string;
  cta: string;
  bgImage: string;
}

export interface ShowcaseData {
  eyebrow: string;
  headline: string[];
  label: string;
  image1: string;
  image2: string;
}

export interface YouMayAlsoLikeData {
  eyebrow: string;
  title: string;
}

export interface ProductCardData {
  name: string;
  image: string;
}

export interface TestimonialData {
  name: string;
  image: string;
}

export interface TestimonialsSectionData {
  title: string;
}

export interface FAQData {
  q: string;
  a: string;
}

export interface FAQSectionData {
  tag: string;
  title: string;
}

export interface FooterLinks {
  scents: string[];
  community: string[];
  company: string[];
}

export interface FooterData {
  hashtag: string;
  cta: string;
  links: FooterLinks;
  newsletter: string;
}

export interface SocialData {
  platforms: string[];
}

export interface BuyWidgetData {
  shippingText: string;
}

export interface ProductData {
  slug?: string
  brand: Brand;
  product: ProductInfo;
  variants: Variant[];
  nav: NavData;
  hero: HeroData;
  stats: Stat[];
  productTransform: ProductTransformData;
  fragranceNotes: FragranceNotesData;
  composition: CompositionData;
  storySlides: StorySlide[];
  marqueeItems: string[];
  fullViewport: FullViewportData;
  showcase: ShowcaseData;
  youMayAlsoLike: YouMayAlsoLikeData;
  collection: ProductCardData[];
  testimonials: TestimonialData[];
  testimonialsSection: TestimonialsSectionData;
  faqs: FAQData[];
  faqSection: FAQSectionData;
  footer: FooterData;
  social: SocialData;
  buyWidget: BuyWidgetData;
}
