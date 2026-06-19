import type { ProductData } from "@/types/product";

const imperialSmoke: ProductData = {
  brand: { name: "SENZ8", tagline: "Parfum Maison" },
  product: {
    name: "IMPERIAL SMOKE",
    fullName: "IMPERIAL SMOKE EXTRAIT DE PARFUM",
    description: "Built To Dominate The Room. A dark, smoky, intense fragrance crafted for Gen Z men who want power, confidence, and attention in every spray.",
    price: 1699, currency: "৳", priceUnit: "50ML",
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
        ["Color", "Black"], ["Material", "Glass"], ["Made For", "Daily Wear"],
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
    { q: "How should I store my LUXE fragrance?", a: "Keep your bottle in a cool, dry place away from direct sunlight. Our fragrances are crafted to mature beautifully, but heat and light can alter the composition. Always seal the cap after use." },
    { q: "Is LUXE cruelty-free and vegan?", a: "Absolutely. We never test on animals, and our formulations contain no animal-derived ingredients. Our oud is sustainably sourced and lab-cultivated to protect wild agarwood populations." },
    { q: "Why does LUXE last so long without alcohol?", a: "Science! We use a proprietary micro-encapsulation technique that binds fragrance oils to skin gradually. The result is a pure, alcohol-free scent that outlasts traditional eau de parfums." },
    { q: "Is LUXE suitable for sensitive skin?", a: "Yes — our alcohol-free, hypoallergenic formula is dermatologically tested. Of the 26 common fragrance allergens, we use none. The only note you will feel is confidence." },
  ],
  faqSection: { tag: "Frequently Asked Questions", title: "Got questions? We've got answers." },
  footer: {
    hashtag: "#WEARYOURSCENT", cta: "Shop LUXE Now",
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
        ["Color", "Gold"], ["Material", "Glass"], ["Made For", "Daily Wear"],
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
    { q: "How should I store my LUXE fragrance?", a: "Keep your bottle in a cool, dry place away from direct sunlight. Our fragrances are crafted to mature beautifully, but heat and light can alter the composition. Always seal the cap after use." },
    { q: "Is LUXE cruelty-free and vegan?", a: "Absolutely. We never test on animals, and our formulations contain no animal-derived ingredients. Our oud is sustainably sourced and lab-cultivated to protect wild agarwood populations." },
    { q: "Why does LUXE last so long without alcohol?", a: "Science! We use a proprietary micro-encapsulation technique that binds fragrance oils to skin gradually. The result is a pure, alcohol-free scent that outlasts traditional eau de parfums." },
    { q: "Is LUXE suitable for sensitive skin?", a: "Yes — our alcohol-free, hypoallergenic formula is dermatologically tested. Of the 26 common fragrance allergens, we use none. The only note you will feel is confidence." },
  ],
  faqSection: { tag: "Frequently Asked Questions", title: "Got questions? We've got answers." },
  footer: {
    hashtag: "#WEARYOURSCENT", cta: "Shop LUXE Now",
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
        ["Color", "Red"], ["Material", "Glass"], ["Made For", "Daily Wear"],
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
    { q: "How should I store my LUXE fragrance?", a: "Keep your bottle in a cool, dry place away from direct sunlight. Our fragrances are crafted to mature beautifully, but heat and light can alter the composition. Always seal the cap after use." },
    { q: "Is LUXE cruelty-free and vegan?", a: "Absolutely. We never test on animals, and our formulations contain no animal-derived ingredients. Our oud is sustainably sourced and lab-cultivated to protect wild agarwood populations." },
    { q: "Why does LUXE last so long without alcohol?", a: "Science! We use a proprietary micro-encapsulation technique that binds fragrance oils to skin gradually. The result is a pure, alcohol-free scent that outlasts traditional eau de parfums." },
    { q: "Is LUXE suitable for sensitive skin?", a: "Yes — our alcohol-free, hypoallergenic formula is dermatologically tested. Of the 26 common fragrance allergens, we use none. The only note you will feel is confidence." },
  ],
  faqSection: { tag: "Frequently Asked Questions", title: "Got questions? We've got answers." },
  footer: {
    hashtag: "#WEARYOURSCENT", cta: "Shop LUXE Now",
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
    description: "One Spray. Endless Chemistry. A romantic, addictive fragrance for stolen glances and unforgettable chemistry.",
    price: 1699, currency: "৳", priceUnit: "50ML",
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
        ["Color", "Black"], ["Material", "Glass"], ["Made For", "Daily Wear"],
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
    { q: "How should I store my LUXE fragrance?", a: "Keep your bottle in a cool, dry place away from direct sunlight. Our fragrances are crafted to mature beautifully, but heat and light can alter the composition. Always seal the cap after use." },
    { q: "Is LUXE cruelty-free and vegan?", a: "Absolutely. We never test on animals, and our formulations contain no animal-derived ingredients. Our oud is sustainably sourced and lab-cultivated to protect wild agarwood populations." },
    { q: "Why does LUXE last so long without alcohol?", a: "Science! We use a proprietary micro-encapsulation technique that binds fragrance oils to skin gradually. The result is a pure, alcohol-free scent that outlasts traditional eau de parfums." },
    { q: "Is LUXE suitable for sensitive skin?", a: "Yes — our alcohol-free, hypoallergenic formula is dermatologically tested. Of the 26 common fragrance allergens, we use none. The only note you will feel is confidence." },
  ],
  faqSection: { tag: "Frequently Asked Questions", title: "Got questions? We've got answers." },
  footer: {
    hashtag: "#WEARYOURSCENT", cta: "Shop LUXE Now",
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
