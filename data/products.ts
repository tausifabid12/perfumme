import type { ProductData } from "@/types/product";

const imperialSmoke: ProductData = {
  brand: { name: "SENZ8", tagline: "Parfum Maison" },
  product: {
    name: "IMPERIAL SMOKE",

    fullName: "IMPERIAL SMOKE EXTRAIT DE PARFUM",
    tagline: "a signature for men",
    description: "Built To Dominate The Room. A dark, smoky, intense fragrance crafted for Gen Z men who want power, confidence, and attention in every spray.",
    price: 1799, currency: "৳", priceUnit: "50ML",
    rating: 4.9, reviewCount: 1247,
    image: "/images/imps-1.png", heroBg: "/images/bg-1.png",
    statsBg: "/images/stats-bg.jpg", footerImage: "/images/imps-footer.png",
  },
  variants: [
    { name: "Imperial Smoke", sku: "imperial-smoke" },
    { name: "It Boy", sku: "it-boy" },
    { name: "Rebel Girl", sku: "rebel-girl" },
    { name: "Blind Date", sku: "blind-date" },
  ],
  nav: { items: ["Shop All Scents", "About LUXE", "Fragrance Guide", "Store Locator", "Contact"] },
  hero: { title: ["IMPERIAL", "SMOKE"], description: "Dark. Smoky. Intense. Built for men who enter with presence and leave an unforgettable impression.", scrollIndicator: "Scroll" },
  stats: [
    { number: "12HR+", label: "LONG LASTING" },
    { number: "35%", label: "OIL CONCENTRATION" },
    { number: "50ML", label: "BOTTLE SIZE" },
    { number: "EXTRAIT", label: "DE PARFUM" },
    { number: "MEN", label: "SIGNATURE SCENT" },
  ],
  productTransform: {
    frames: [
      { label: "IMPERIAL SMOKE", headline: "Built To\nDominate.", position: "top" },
      { label: "Powered by", stat: "35%", statLabel: "Oil Concentration", position: "bottom-right" },
      { label: "Crafted with", stat: "12HR+", statLabel: "Performance", sub: "Strong projection. Bold masculine trail. Luxury feel.", position: "right" },
      { label: "Available now", headline: "Own The\nMoment", cta: "Buy Now", position: "center" },
    ],
  },
  fragranceNotes: {
    title: "The Composition",
    notes: [
      { type: "Top Note", typeColor: "gold", title: "Oud Wood\nRaspberry", description: "A rich smoky opening softened by fruity sweetness and saffron spice.", position: "left", top: "30%" },
      { type: "Heart Note", typeColor: "silver", title: "Rose\nIncense", description: "Dark florals wrapped in smoky incense create mystery and depth.", position: "right", top: "25%" },
      { type: "Base Note", typeColor: "secondary", title: "Amberwood\nBenzoin", description: "Warm, resinous and addictive. The signature masculine finish.", position: "bottom", top: null },
    ],
  },
  composition: {
    tag: "Composition & Notes", title: "Dark. Smoky. Addictive.",
    ingredients: [
      { name: "OUD WOOD", sub: "TOP NOTE", icon: "OW" },
      { name: "RASPBERRY", sub: "TOP NOTE", icon: "RB" },
      { name: "SAFFRON", sub: "TOP NOTE", icon: "SF" },
      { name: "ROSE", sub: "HEART NOTE", icon: "RS" },
      { name: "INCENSE", sub: "HEART NOTE", icon: "IN" },
      { name: "AMBERWOOD", sub: "BASE NOTE", icon: "AW" },
    ],
    facts: {
      title: "Fragrance Facts", serving: "1 Spray",
      items: [
        ["Concentration", "35%"], ["Type", "Extrait De Parfum"], ["Longevity", "12+ Hours"],
        ["Projection", "Strong"], ["Gender", "Male"], ["Bottle Size", "50ML"],
        ["Material", "Glass"], ["Made For", "Daily Wear"],
      ],
    },
  },
  storySlides: [
    { label: "PRESENCE", headline: "Walk In.\nOwn It.", sub: "Designed for men who don't wait for attention. They command it." },
    { label: "PERFORMANCE", headline: "12HR+\nLongevity", sub: "From classes to night drives. One spray keeps going." },
    { label: "INTENSITY", headline: "Dark.\nSmoky.", sub: "Oud, incense and amberwood create a powerful masculine trail." },
    { label: "ATTITUDE", headline: "Confidence\nBottled", sub: "Not a soft fragrance. This is attitude in liquid form." },
  ],
  marqueeItems: ["IMPERIAL SMOKE", "IT BOY", "REBEL GIRL", "BLIND DATE", "35% OIL", "EXTRAIT DE PARFUM"],
  fullViewport: {
    eyebrow: "Power. Confidence. Presence.", headline: ["Built To", "Dominate."],
    subtext: "A signature fragrance for men who want every entrance to feel unforgettable.",
    cta: "Shop Now", bgImage: "/images/hero-bg.jpg",
  },
  showcase: {
    eyebrow: "The experience", headline: ["Born to", "be Worn"],
    label: "Spray it. Wear it. Repeat.", image1: "/images/hero-bg.jpg", image2: "/images/stats-bg.jpg",
  },
  youMayAlsoLike: { eyebrow: "Our Full Range", title: "You May Also Like" },
  collection: [
    { name: "IT BOY", image: "/images/it-boy-bottle.png" },
    { name: "REBEL GIRL", image: "/images/rabel-girl-bottle.png" },
    { name: "BLIND DATE", image: "/images/blind-date-bottle.png" },
  ],
  testimonials: [
    { name: "Isabella", image: "/images/testimonial-1.jpg" },
    { name: "Alexander", image: "/images/testimonial-2.jpg" },
    { name: "Victoria", image: "/images/testimonial-3.jpg" },
    { name: "Sebastian", image: "/images/testimonial-4.jpg" },
    { name: "Olivia", image: "/images/testimonial-5.jpg" },
    { name: "James", image: "/images/testimonial-1.jpg" },
  ],
  testimonialsSection: { title: "What's Everyone Talking About" },
  faqs: [
    {
      q: "What does Imperial Smoke smell like?",
      a: "Imperial Smoke opens with rich Oud Wood and a hint of Raspberry sweetness, evolves into smoky Rose and Incense in the heart, and dries down to a warm, resinous Amberwood and Benzoin base. Dark, powerful, and unmistakably masculine.",
    },
    {
      q: "How long does Imperial Smoke last on skin?",
      a: "At 35% oil concentration (Extrait de Parfum), Imperial Smoke delivers 12+ hours of longevity with strong projection for the first 4–5 hours. Performance improves on moisturised skin — apply right after a shower for best results.",
    },
    {
      q: "Is Imperial Smoke suitable for daily wear?",
      a: "It's bold enough to be your signature scent for important moments and confident enough for daily office wear. The dark smoky character makes it exceptional for evenings, formal settings, and cooler months.",
    },
    // {
    //   q: "How much does shipping cost and how long does delivery take?",
    //   a: "Shipping is FREE across India on all orders. Standard delivery takes 2–3 business days. Orders are dispatched within 24 hours on business days. You'll receive a tracking link by email and SMS once your order ships.",
    // },
    // {
    //   q: "What is your return and refund policy?",
    //   a: "We accept returns within 7 days of delivery if the product is unused, sealed, and in original packaging. If you received a damaged or incorrect item, we'll replace it immediately at no cost. Contact us at contact@senz8.in with your order number.",
    // },
    {
      q: "How should I apply and store Imperial Smoke?",
      a: "Spray 2–3 times on pulse points — wrists, neck, and inner elbows. Don't rub after spraying. Store in a cool, dry place away from direct sunlight. Keep the bottle upright to preserve the atomiser.",
    },
  ],
  faqSection: { tag: "Fragrance Questions", title: "Everything About Imperial Smoke." },
  footer: {
    hashtag: "#WEARYOURIDENTITY", cta: "Shop LUXE Now",
    links: { scents: ["IT BOY", "REBEL GIRL", "BLIND DATE", "IMPERIAL SMOKE"], community: ["Scent Society", "Brand Ambassadors", "Affiliate Program"], company: ["Our Story", "Contact", "Press"] },
    newsletter: "Get exclusive early access and stay informed about limited drops and events.",
  },
  social: { platforms: ["youtube", "instagram", "twitter"] },
  buyWidget: { shippingText: "FREE shipping · arrives in 2-3 days" },
};

const itBoy: ProductData = {
  brand: { name: "SENZ8", tagline: "Parfum Maison" },
  product: {
    name: "IT BOY",
    fullName: "IT BOY EXTRAIT DE PARFUM",
    tagline: "a signature for boys",
    description: "Not Just A Perfume. A Personality. Built for the guy who walks in like he owns the room.",
    price: 1599, currency: "৳", priceUnit: "50ML",
    rating: 4.8, reviewCount: 985,
    image: "/images/it-boy-bottle.png", heroBg: "/images/bg-1.png",
    statsBg: "/images/stats-bg.jpg", footerImage: "/images/imps-footer.png",
  },
  variants: [
    { name: "It Boy", sku: "it-boy" },
    { name: "Imperial Smoke", sku: "imperial-smoke" },
    { name: "Rebel Girl", sku: "rebel-girl" },
    { name: "Blind Date", sku: "blind-date" },
  ],
  nav: { items: ["Shop All Scents", "About LUXE", "Fragrance Guide", "Store Locator", "Contact"] },
  hero: { title: ["IT", "BOY"], description: "Fresh. Bold. Addictive. The signature scent for Gen Z men who don't follow trends — they become them.", scrollIndicator: "Scroll" },
  stats: [
    { number: "10HR+", label: "LONG LASTING" },
    { number: "35%", label: "OIL CONCENTRATION" },
    { number: "50ML", label: "BOTTLE SIZE" },
    { number: "EXTRAIT", label: "DE PARFUM" },
    { number: "MEN", label: "SIGNATURE SCENT" },
  ],
  productTransform: {
    frames: [
      { label: "IT BOY", headline: "Walk In.\nOwn It.", position: "top" },
      { label: "Powered by", stat: "35%", statLabel: "Oil Concentration", position: "bottom-right" },
      { label: "Crafted with", stat: "10HR+", statLabel: "Performance", sub: "Fresh enough for everyday. Bold enough to be remembered.", position: "right" },
      { label: "Available now", headline: "Become The\nTrend", cta: "Buy Now", position: "center" },
    ],
  },
  fragranceNotes: {
    title: "The Composition",
    notes: [
      { type: "Top Note", typeColor: "gold", title: "Bergamot\nPink Pepper", description: "Bright citrus with a spicy kick. Fresh, energetic, and instantly captivating.", position: "left", top: "30%" },
      { type: "Heart Note", typeColor: "silver", title: "Cedarwood\nClary Sage", description: "Woody and aromatic depth that grounds the fragrance with sophistication.", position: "right", top: "25%" },
      { type: "Base Note", typeColor: "secondary", title: "Tonka Bean\nCocoa", description: "Warm, creamy, and addictive. The trail that keeps them coming back.", position: "bottom", top: null },
    ],
  },
  composition: {
    tag: "Composition & Notes", title: "Fresh. Bold. Addictive.",
    ingredients: [
      { name: "BERGAMOT", sub: "TOP NOTE", icon: "BG" },
      { name: "PINK PEPPER", sub: "TOP NOTE", icon: "PP" },
      { name: "CEDARWOOD", sub: "HEART NOTE", icon: "CW" },
      { name: "CLARY SAGE", sub: "HEART NOTE", icon: "CS" },
      { name: "TONKA BEAN", sub: "BASE NOTE", icon: "TB" },
      { name: "COCOA", sub: "BASE NOTE", icon: "CO" },
    ],
    facts: {
      title: "Fragrance Facts", serving: "1 Spray",
      items: [
        ["Concentration", "35%"], ["Type", "Extrait De Parfum"], ["Longevity", "10+ Hours"],
        ["Projection", "Strong"], ["Gender", "Male"], ["Bottle Size", "50ML"],
        ["Material", "Glass"], ["Made For", "Daily Wear"],
      ],
    },
  },
  storySlides: [
    { label: "FRESH", headline: "Everyday\nConfidence", sub: "From college fits to late nights. Fresh enough for any occasion." },
    { label: "BOLD", headline: "Spice &\nWood", sub: "Bergamot and pink pepper open bright, while cedarwood grounds the scent." },
    { label: "ADDICTIVE", headline: "Warm &\nCreamy", sub: "Tonka bean and cocoa create an irresistible, memorable trail." },
    { label: "ATTITUDE", headline: "Personality\nBottled", sub: "Not just a perfume. A statement. Made for men who lead." },
  ],
  marqueeItems: ["IT BOY", "IMPERIAL SMOKE", "REBEL GIRL", "BLIND DATE", "35% OIL", "EXTRAIT DE PARFUM"],
  fullViewport: {
    eyebrow: "Fresh. Bold. Addictive.", headline: ["Not Just A", "Perfume."],
    subtext: "A personality in a bottle. Built for Gen Z men who walk in like they own the room.",
    cta: "Shop Now", bgImage: "/images/hero-itboy.jpg",
  },
  showcase: {
    eyebrow: "The experience", headline: ["Confidence", "in Every Spray"],
    label: "Spray it. Wear it. Repeat.", image1: "/images/hero-itboy.jpg", image2: "/images/stats-bg.jpg",
  },
  youMayAlsoLike: { eyebrow: "Our Full Range", title: "You May Also Like" },
  collection: [
    { name: "IMPERIAL SMOKE", image: "/images/imps-1.png" },
    { name: "REBEL GIRL", image: "/images/rabel-girl-bottle.png" },
    { name: "BLIND DATE", image: "/images/blind-date-bottle.png" },
  ],
  testimonials: [
    { name: "Isabella", image: "/images/testimonial-1.jpg" },
    { name: "Alexander", image: "/images/testimonial-2.jpg" },
    { name: "Victoria", image: "/images/testimonial-3.jpg" },
    { name: "Sebastian", image: "/images/testimonial-4.jpg" },
    { name: "Olivia", image: "/images/testimonial-5.jpg" },
    { name: "James", image: "/images/testimonial-1.jpg" },
  ],
  testimonialsSection: { title: "What's Everyone Talking About" },
  faqs: [
    {
      q: "What does IT BOY smell like?",
      a: "IT BOY opens with bright Bergamot and a spicy Pink Pepper kick, settles into a woody Cedarwood and aromatic Clary Sage heart, then finishes with a warm, creamy Tonka Bean and Cocoa base. Fresh, bold, and deeply addictive.",
    },
    {
      q: "Is IT BOY suitable for everyday wear?",
      a: "Absolutely — IT BOY was designed for daily wear. It's fresh enough for college, office, and casual outings but bold enough to turn heads on date nights. One of the most versatile scents in the SENZ8 collection.",
    },
    {
      q: "How long does IT BOY last?",
      a: "With 35% oil concentration, IT BOY lasts 10+ hours on skin. The dry-down — Tonka Bean and Cocoa — is especially long-lasting and stays close to the skin for a signature personal warmth throughout the day.",
    },
    // {
    //   q: "How much does shipping cost and how long does delivery take?",
    //   a: "Shipping is FREE across India on all orders. Standard delivery takes 2–3 business days. Orders are dispatched within 24 hours on business days. You'll receive a tracking link by email and SMS once your order ships.",
    // },
    // {
    //   q: "What is your return and refund policy?",
    //   a: "We accept returns within 7 days of delivery if the product is unused, sealed, and in original packaging. If you received a damaged or incorrect item, we'll replace it immediately at no cost. Contact us at contact@senz8.in with your order number.",
    // },
    {
      q: "Can IT BOY be gifted? Do you offer gift packaging?",
      a: "IT BOY makes an excellent gift for birthdays, anniversaries, or celebrations. The bottle arrives in a premium box ready to gift. For special gift messages or custom notes, mention it in your order comments and we'll add a handwritten card.",
    },
  ],
  faqSection: { tag: "Fragrance Questions", title: "Everything About IT BOY." },
  footer: {
    hashtag: "#WEARYOURIDENTITY", cta: "Shop LUXE Now",
    links: { scents: ["IMPERIAL SMOKE", "REBEL GIRL", "BLIND DATE", "IT BOY"], community: ["Scent Society", "Brand Ambassadors", "Affiliate Program"], company: ["Our Story", "Contact", "Press"] },
    newsletter: "Get exclusive early access and stay informed about limited drops and events.",
  },
  social: { platforms: ["youtube", "instagram", "twitter"] },
  buyWidget: { shippingText: "FREE shipping · arrives in 2-3 days" },
};

const rebelGirl: ProductData = {
  brand: { name: "SENZ8", tagline: "Parfum Maison" },
  product: {
    name: "REBEL GIRL",
    fullName: "REBEL GIRL EXTRAIT DE PARFUM",
    tagline: "a signature for girls",
    description: "Pretty. Powerful. Unapologetic. She's not here to fit in. She's here to be remembered.",
    price: 1599, currency: "৳", priceUnit: "50ML",
    rating: 4.9, reviewCount: 1320,
    image: "/images/rabel-girl-bottle.png", heroBg: "/images/bg-1.png",
    statsBg: "/images/stats-bg.jpg", footerImage: "/images/imps-footer.png",
  },
  variants: [
    { name: "Rebel Girl", sku: "rebel-girl" },
    { name: "Imperial Smoke", sku: "imperial-smoke" },
    { name: "It Boy", sku: "it-boy" },
    { name: "Blind Date", sku: "blind-date" },
  ],
  nav: { items: ["Shop All Scents", "About LUXE", "Fragrance Guide", "Store Locator", "Contact"] },
  hero: { title: ["REBEL", "GIRL"], description: "Pretty. Powerful. Unapologetic. A bold fragrance for the fearless generation.", scrollIndicator: "Scroll" },
  stats: [
    { number: "10HR+", label: "LONG LASTING" },
    { number: "35%", label: "OIL CONCENTRATION" },
    { number: "50ML", label: "BOTTLE SIZE" },
    { number: "EXTRAIT", label: "DE PARFUM" },
    { number: "WOMEN", label: "SIGNATURE SCENT" },
  ],
  productTransform: {
    frames: [
      { label: "REBEL GIRL", headline: "Pretty.\nPowerful.", position: "top" },
      { label: "Powered by", stat: "35%", statLabel: "Oil Concentration", position: "bottom-right" },
      { label: "Crafted with", stat: "10HR+", statLabel: "Performance", sub: "Soft feminine notes. Bold addictive trail. Made for main-character moments.", position: "right" },
      { label: "Available now", headline: "Be\nRemembered", cta: "Buy Now", position: "center" },
    ],
  },
  fragranceNotes: {
    title: "The Composition",
    notes: [
      { type: "Top Note", typeColor: "gold", title: "Agarwood\nOud", description: "A rich, luxurious opening that announces presence with elegance and depth.", position: "left", top: "30%" },
      { type: "Heart Note", typeColor: "silver", title: "Vanilla\nSugar", description: "Sweet and warm. Soft feminine notes that draw you in and linger.", position: "right", top: "25%" },
      { type: "Base Note", typeColor: "secondary", title: "Sandalwood\nHerbal Notes", description: "Creamy wood balanced with green freshness for a signature finish.", position: "bottom", top: null },
    ],
  },
  composition: {
    tag: "Composition & Notes", title: "Soft. Bold. Unforgettable.",
    ingredients: [
      { name: "AGARWOOD", sub: "TOP NOTE", icon: "AG" },
      { name: "OUD", sub: "TOP NOTE", icon: "OU" },
      { name: "VANILLA", sub: "HEART NOTE", icon: "VA" },
      { name: "SUGAR", sub: "HEART NOTE", icon: "SU" },
      { name: "SANDALWOOD", sub: "BASE NOTE", icon: "SA" },
      { name: "HERBAL NOTES", sub: "BASE NOTE", icon: "HN" },
    ],
    facts: {
      title: "Fragrance Facts", serving: "1 Spray",
      items: [
        ["Concentration", "35%"], ["Type", "Extrait De Parfum"], ["Longevity", "10+ Hours"],
        ["Projection", "Strong"], ["Gender", "Female"], ["Bottle Size", "50ML"],
        ["Material", "Glass"], ["Made For", "Daily Wear"],
      ],
    },
  },
  storySlides: [
    { label: "BOLD", headline: "Confidence\nBottled", sub: "Made for girls who carry confidence like a signature." },
    { label: "FEMININE", headline: "Soft &\nSeductive", sub: "Vanilla and sugar create warmth while oud adds depth and mystery." },
    { label: "POWERFUL", headline: "Unapologetic\nAura", sub: "From coffee dates to night outs. Always unforgettable." },
    { label: "FEARLESS", headline: "Not Here\nto Fit In", sub: "A fragrance for the rebel in every woman." },
  ],
  marqueeItems: ["REBEL GIRL", "IMPERIAL SMOKE", "IT BOY", "BLIND DATE", "35% OIL", "EXTRAIT DE PARFUM"],
  fullViewport: {
    eyebrow: "Pretty. Powerful. Unapologetic.", headline: ["She's Not Here", "to Fit In."],
    subtext: "A signature scent for girls who want to be remembered. Bold, feminine, and absolutely addictive.",
    cta: "Shop Now", bgImage: "/images/hero-rebel.jpg",
  },
  showcase: {
    eyebrow: "The experience", headline: ["Confidence", "in Every Spray"],
    label: "Spray it. Wear it. Repeat.", image1: "/images/hero-rebel.jpg", image2: "/images/stats-bg.jpg",
  },
  youMayAlsoLike: { eyebrow: "Our Full Range", title: "You May Also Like" },
  collection: [
    { name: "IMPERIAL SMOKE", image: "/images/imps-1.png" },
    { name: "IT BOY", image: "/images/it-boy-bottle.png" },
    { name: "BLIND DATE", image: "/images/blind-date-bottle.png" },
  ],
  testimonials: [
    { name: "Isabella", image: "/images/testimonial-1.jpg" },
    { name: "Alexander", image: "/images/testimonial-2.jpg" },
    { name: "Victoria", image: "/images/testimonial-3.jpg" },
    { name: "Sebastian", image: "/images/testimonial-4.jpg" },
    { name: "Olivia", image: "/images/testimonial-5.jpg" },
    { name: "James", image: "/images/testimonial-1.jpg" },
  ],
  testimonialsSection: { title: "What's Everyone Talking About" },
  faqs: [
    {
      q: "What does REBEL GIRL smell like?",
      a: "REBEL GIRL opens with luxurious Agarwood and Oud, blooms into sweet Vanilla and Sugar in the heart, then finishes with creamy Sandalwood and fresh Herbal Notes. Soft, bold, and completely unforgettable — a feminine power statement.",
    },
    {
      q: "How long does REBEL GIRL last?",
      a: "With 35% oil concentration (Extrait de Parfum), REBEL GIRL lasts 10+ hours. The Vanilla and Oud base is particularly tenacious — you'll notice the scent on your clothing even the next day. Apply to pulse points and moisturised skin for best performance.",
    },
    {
      q: "Is REBEL GIRL for women only?",
      a: "REBEL GIRL is crafted as a feminine signature, but fragrance has no rules. The Oud and Sandalwood base makes it a complex unisex-leaning scent that confident individuals of any gender can wear beautifully.",
    },
    // {
    //   q: "How much does shipping cost and how long does delivery take?",
    //   a: "Shipping is FREE across India on all orders. Standard delivery takes 2–3 business days. Orders are dispatched within 24 hours on business days. You'll receive a tracking link by email and SMS once your order ships.",
    // },
    // {
    //   q: "What is your return and refund policy?",
    //   a: "We accept returns within 7 days of delivery if the product is unused, sealed, and in original packaging. If you received a damaged or incorrect item, we'll replace it immediately at no cost. Contact us at contact@senz8.in with your order number.",
    // },
    {
      q: "Can I layer REBEL GIRL with other fragrances?",
      a: "Yes — REBEL GIRL layers beautifully. For a lighter, daytime feel, apply a floral body mist first then spray REBEL GIRL on top. For an evening intensity boost, layer with a musky or woody base. The Oud and Vanilla blend well with most oriental and floral scents.",
    },
  ],
  faqSection: { tag: "Fragrance Questions", title: "Everything About REBEL GIRL." },
  footer: {
    hashtag: "#WEARYOURIDENTITY", cta: "Shop LUXE Now",
    links: { scents: ["IMPERIAL SMOKE", "IT BOY", "BLIND DATE", "REBEL GIRL"], community: ["Scent Society", "Brand Ambassadors", "Affiliate Program"], company: ["Our Story", "Contact", "Press"] },
    newsletter: "Get exclusive early access and stay informed about limited drops and events.",
  },
  social: { platforms: ["youtube", "instagram", "twitter"] },
  buyWidget: { shippingText: "FREE shipping · arrives in 2-3 days" },
};

const blindDate: ProductData = {
  brand: { name: "SENZ8", tagline: "Parfum Maison" },
  product: {
    name: "BLIND DATE",
    fullName: "BLIND DATE EXTRAIT DE PARFUM",
    tagline: "a signature for them",
    description: "One Spray. Endless Chemistry. A romantic, addictive fragrance for stolen glances and unforgettable chemistry.",
    price: 1799, currency: "৳", priceUnit: "50ML",
    rating: 4.7, reviewCount: 876,
    image: "/images/blind-date-bottle.png", heroBg: "/images/bg-1.png",
    statsBg: "/images/stats-bg.jpg", footerImage: "/images/imps-footer.png",
  },
  variants: [
    { name: "Blind Date", sku: "blind-date" },
    { name: "Imperial Smoke", sku: "imperial-smoke" },
    { name: "It Boy", sku: "it-boy" },
    { name: "Rebel Girl", sku: "rebel-girl" },
  ],
  nav: { items: ["Shop All Scents", "About LUXE", "Fragrance Guide", "Store Locator", "Contact"] },
  hero: { title: ["BLIND", "DATE"], description: "Romantic. Addictive. Chemistry in a bottle. Made for stolen glances and unforgettable moments.", scrollIndicator: "Scroll" },
  stats: [
    { number: "10HR+", label: "LONG LASTING" },
    { number: "35%", label: "OIL CONCENTRATION" },
    { number: "50ML", label: "BOTTLE SIZE" },
    { number: "EXTRAIT", label: "DE PARFUM" },
    { number: "UNISEX", label: "SIGNATURE SCENT" },
  ],
  productTransform: {
    frames: [
      { label: "BLIND DATE", headline: "One Spray.\nChemistry.", position: "top" },
      { label: "Powered by", stat: "35%", statLabel: "Oil Concentration", position: "bottom-right" },
      { label: "Crafted with", stat: "10HR+", statLabel: "Performance", sub: "Fresh at first. Warm after. Just like falling for someone unexpectedly.", position: "right" },
      { label: "Available now", headline: "Feel The\nChemistry", cta: "Buy Now", position: "center" },
    ],
  },
  fragranceNotes: {
    title: "The Composition",
    notes: [
      { type: "Top Note", typeColor: "gold", title: "Black Currant\nPear", description: "Juicy and bright. A fresh, fruity opening that feels instantly romantic.", position: "left", top: "30%" },
      { type: "Heart Note", typeColor: "silver", title: "Jasmine\nOrange Blossom", description: "Floral elegance with a hint of sweetness. Soft, warm, and inviting.", position: "right", top: "25%" },
      { type: "Base Note", typeColor: "secondary", title: "Praline\nVanilla", description: "Warm, sweet, and irresistible. The perfect finish for an addictive trail.", position: "bottom", top: null },
    ],
  },
  composition: {
    tag: "Composition & Notes", title: "Fresh. Warm. Irresistible.",
    ingredients: [
      { name: "BLACK CURRANT", sub: "TOP NOTE", icon: "BC" },
      { name: "PEAR", sub: "TOP NOTE", icon: "PE" },
      { name: "JASMINE", sub: "HEART NOTE", icon: "JA" },
      { name: "ORANGE BLOSSOM", sub: "HEART NOTE", icon: "OB" },
      { name: "PRALINE", sub: "BASE NOTE", icon: "PR" },
      { name: "VANILLA", sub: "BASE NOTE", icon: "VA" },
    ],
    facts: {
      title: "Fragrance Facts", serving: "1 Spray",
      items: [
        ["Concentration", "35%"], ["Type", "Extrait De Parfum"], ["Longevity", "10+ Hours"],
        ["Projection", "Moderate-Strong"], ["Gender", "Unisex"], ["Bottle Size", "50ML"],
        ["Material", "Glass"], ["Made For", "Daily Wear"],
      ],
    },
  },
  storySlides: [
    { label: "ROMANTIC", headline: "Chemistry\nin a Bottle", sub: "Made for stolen glances, café meetups, and unforgettable chemistry." },
    { label: "FRESH", headline: "Bright &\nFruity", sub: "Black currant and pear open with a vibrant, refreshing energy." },
    { label: "WARM", headline: "Soft &\nFloral", sub: "Jasmine and orange blossom add warmth and romantic depth." },
    { label: "ADDICTIVE", headline: "Sweet &\nIrresistible", sub: "Praline and vanilla create a trail that keeps them coming back." },
  ],
  marqueeItems: ["BLIND DATE", "IMPERIAL SMOKE", "IT BOY", "REBEL GIRL", "35% OIL", "EXTRAIT DE PARFUM"],
  fullViewport: {
    eyebrow: "One Spray. Endless Chemistry.", headline: ["Feel The", "Chemistry."],
    subtext: "A romantic, unisex fragrance for Gen Z boys and girls who believe attraction starts before the first word.",
    cta: "Shop Now", bgImage: "/images/hero-blind.jpg",
  },
  showcase: {
    eyebrow: "The experience", headline: ["Chemistry", "in Every Spray"],
    label: "Spray it. Wear it. Repeat.", image1: "/images/hero-blind.jpg", image2: "/images/stats-bg.jpg",
  },
  youMayAlsoLike: { eyebrow: "Our Full Range", title: "You May Also Like" },
  collection: [
    { name: "IMPERIAL SMOKE", image: "/images/imps-1.png" },
    { name: "IT BOY", image: "/images/it-boy-bottle.png" },
    { name: "REBEL GIRL", image: "/images/rabel-girl-bottle.png" },
  ],
  testimonials: [
    { name: "Isabella", image: "/images/testimonial-1.jpg" },
    { name: "Alexander", image: "/images/testimonial-2.jpg" },
    { name: "Victoria", image: "/images/testimonial-3.jpg" },
    { name: "Sebastian", image: "/images/testimonial-4.jpg" },
    { name: "Olivia", image: "/images/testimonial-5.jpg" },
    { name: "James", image: "/images/testimonial-1.jpg" },
  ],
  testimonialsSection: { title: "What's Everyone Talking About" },
  faqs: [
    {
      q: "What does BLIND DATE smell like?",
      a: "BLIND DATE opens with juicy Black Currant and fresh Pear, blossoms into elegant Jasmine and Orange Blossom in the heart, and finishes with an irresistibly warm Praline and Vanilla base. Romantic, fresh, and deeply addictive — perfect for close encounters.",
    },
    {
      q: "Is BLIND DATE unisex?",
      a: "Yes — BLIND DATE is designed to be worn by anyone. The fruity top notes and floral heart have wide appeal, while the Praline and Vanilla base adds a warm sweetness that works beautifully on all skin types and genders.",
    },
    {
      q: "How long does BLIND DATE last?",
      a: "With 35% oil concentration (Extrait de Parfum), BLIND DATE lasts 10+ hours. The Praline and Vanilla dry-down is particularly long-lasting and leaves a subtle, irresistible trail that's perfect for intimate settings.",
    },
    // {
    //   q: "How much does shipping cost and how long does delivery take?",
    //   a: "Shipping is FREE across India on all orders. Standard delivery takes 2–3 business days. Orders are dispatched within 24 hours on business days. You'll receive a tracking link by email and SMS once your order ships.",
    // },
    // {
    //   q: "What is your return and refund policy?",
    //   a: "We accept returns within 7 days of delivery if the product is unused, sealed, and in original packaging. If you received a damaged or incorrect item, we'll replace it immediately at no cost. Contact us at contact@senz8.in with your order number.",
    // },
    {
      q: "Is BLIND DATE suitable for warm weather and summer?",
      a: "Absolutely. The fresh Black Currant and Pear opening makes BLIND DATE ideal for spring and summer. It's one of the most season-versatile fragrances in the SENZ8 collection — light and fresh in warm weather, warm and cosy in cooler months.",
    },
  ],
  faqSection: { tag: "Fragrance Questions", title: "Everything About BLIND DATE." },
  footer: {
    hashtag: "#WEARYOURIDENTITY", cta: "Shop LUXE Now",
    links: { scents: ["IMPERIAL SMOKE", "IT BOY", "REBEL GIRL", "BLIND DATE"], community: ["Scent Society", "Brand Ambassadors", "Affiliate Program"], company: ["Our Story", "Contact", "Press"] },
    newsletter: "Get exclusive early access and stay informed about limited drops and events.",
  },
  social: { platforms: ["youtube", "instagram", "twitter"] },
  buyWidget: { shippingText: "FREE shipping · arrives in 2-3 days" },
};

export const products: Record<string, ProductData> = {
  "imperial-smoke": imperialSmoke,
  "it-boy": itBoy,
  "rebel-girl": rebelGirl,
  "blind-date": blindDate,
};
