# Requirements Document

## Introduction

The SENZ8 perfume e-commerce site is a Next.js 16 (App Router) application with a cinematic, luxury aesthetic. It features a WebGL particle field (Three.js), a 583-frame canvas scroll animation, two simultaneously preloaded looping videos, Framer-Motion-style GSAP animations, Lenis smooth scroll, and multiple heavy product page sections. The site currently has no image optimization, no lazy loading, no code splitting configuration, and no Core Web Vitals instrumentation.

This feature defines the performance optimization requirements that will reduce initial bundle size, improve Time-to-Interactive (TTI), improve Largest Contentful Paint (LCP), eliminate Cumulative Layout Shift (CLS), and maintain the full cinematic UX experience — including all animations, page transitions, the loading screen, and the WebGL scene.

## Glossary

- **System**: The SENZ8 Next.js web application.
- **Optimizer**: The Next.js build pipeline and runtime optimization layer (image optimization, code splitting, prefetching).
- **CinematicZone**: The 1300vh scroll section on the homepage (`GodModeExperience` + `GodModeScene` + `CinematicTypography`).
- **BelowFold**: The `HomeSections` + `SiteFooter` block that is hidden until the CinematicZone scroll completes (~98.5% scroll progress).
- **HeavyComponent**: Any component that imports Three.js, GSAP ScrollTrigger, or performs canvas frame rendering (specifically: `GodModeScene`, `GodModeExperience`, `HorizontalStorySection`, `ProductTransformSection`, and `CompositionSection`).
- **LazyBoundary**: A `React.lazy` + `Suspense` split point with a lightweight fallback.
- **LCP_Element**: The first visible above-the-fold image or video — on the homepage this is the smoke video; on product pages this is the hero bottle image.
- **CLS**: Cumulative Layout Shift — unwanted visual movement of page elements during load.
- **TTI**: Time to Interactive — the time until the page's main thread is reliably idle.
- **CoreWebVitals**: The set of LCP, CLS, and Interaction to Next Paint (INP) metrics as defined by Google.
- **NoiseTexture**: The grain SVG currently fetched from the external URL `https://grainy-gradients.vercel.app/noise.svg`.
- **ShopifyApiRoute**: The Next.js API route at `/api/shopify/route.ts` that proxies Shopify GraphQL calls.

---

## Requirements

### Requirement 1: Next.js Image Optimization

**User Story:** As a site visitor, I want product and hero images to load quickly in the right format and size for my device, so that pages feel fast and sharp without unnecessary data transfer.

#### Acceptance Criteria

1. THE System SHALL replace every `<img>` tag that references local `/images/` paths with Next.js `<Image>` components, including images in `HomeSections`, `CollectionsClient`, `ShopifyProductClient`, `ProductPageClient` sub-components, and `CartDrawer`.
2. WHEN a product image is in the above-the-fold viewport on initial load, THE Optimizer SHALL set `priority` on that `<Image>` component so it generates a `<link rel="preload">` tag in the HTML `<head>`.
3. WHEN a product image is below the fold or inside a non-visible section, THE Optimizer SHALL use `loading="lazy"` on that `<Image>` component.
4. THE Optimizer SHALL serve images in WebP or AVIF format by default via `next/image` automatic format negotiation.
5. THE System SHALL configure `next.config.ts` with a `formats` array of `["image/avif", "image/webp"]` and a `deviceSizes` array appropriate for mobile, tablet, and desktop breakpoints.
6. IF an image's natural dimensions cannot be determined at build time (e.g., Shopify CDN images), THEN THE System SHALL use `fill` layout with an explicit aspect-ratio wrapper rather than omitting `width` and `height` props, to prevent CLS.
7. THE System SHALL replace the `<img>` tag in `HeroSection` (`hero-section.tsx`) for `data.product.heroBg` and `data.product.image` with Next.js `<Image>` components with explicit `priority` on both.

---

### Requirement 2: Elimination of External Asset Dependency (NoiseTexture)

**User Story:** As a site visitor, I want the page to load without depending on a third-party CDN that could be slow, offline, or rate-limited, so that the grain texture always renders without network latency.

#### Acceptance Criteria

1. THE System SHALL host the noise SVG as a local static asset at `/public/noise.svg` instead of fetching it from `https://grainy-gradients.vercel.app/noise.svg`.
2. WHEN any component references the external noise SVG URL, THE System SHALL replace that reference with the local `/noise.svg` path.
3. THE System SHALL apply this replacement in all components that currently reference the external URL: `CinematicNav`, `LoadingScreen`, and `PageTransition`.
4. WHERE the noise texture is used purely for visual decoration, THE Optimizer SHALL serve it with a long-lived `Cache-Control` header via Next.js static asset caching.

---

### Requirement 3: Code Splitting and Lazy Loading of Heavy Components

**User Story:** As a site visitor, I want the initial page JavaScript to be small so the browser can start rendering quickly, while heavy interactive experiences load only when they are needed.

#### Acceptance Criteria

1. THE System SHALL wrap `GodModeScene` in a `LazyBoundary` using `next/dynamic` with `ssr: false` and a transparent `div` fallback, so Three.js is not included in the initial JS bundle.
2. THE System SHALL wrap `GodModeExperience` in a `LazyBoundary` using `next/dynamic` with `ssr: false` so the canvas frame-rendering module is deferred until client hydration.
3. THE System SHALL wrap `CartDrawer` in a `LazyBoundary` using `next/dynamic` with `ssr: false` in `layout.tsx`, so it is not included in the initial server render or the critical JS bundle.
4. THE System SHALL wrap `HomeSections` in a `LazyBoundary` in `page.tsx` so it is not eagerly evaluated during SSR since it is hidden until the CinematicZone scroll completes.
5. WHEN a product page (`ProductPageClient`) mounts, THE System SHALL load `HorizontalStorySection`, `CompositionSection`, and `ProductTransformSection` via `next/dynamic` with `ssr: false`, since they are below-the-fold and use heavy GSAP ScrollTrigger logic.
6. THE System SHALL wrap `SmoothScrollProvider` in a `next/dynamic` with `ssr: false` in `layout.tsx` to prevent Lenis hydration from blocking the initial server render.
7. WHEN a `LazyBoundary` is loading a heavy component, THE System SHALL render a lightweight skeleton or transparent placeholder that matches the component's reserved height to prevent CLS.

---

### Requirement 4: Canvas Frame Preloading Strategy

**User Story:** As a site visitor on the homepage, I want the scroll-driven canvas animation to load frames progressively so the page is interactive before all 583 frames are decoded, while the animation still plays smoothly as I scroll.

#### Acceptance Criteria

1. WHEN `GodModeExperience` initializes, THE System SHALL load the first 60 frames (approximately the first 10% of the cinematic scroll zone) eagerly before loading the remaining frames.
2. WHEN the first 60 frames are loaded, THE System SHALL begin loading the remaining frames in batches of 60 using `requestIdleCallback` or a time-sliced approach that yields to the main thread between batches.
3. WHEN a frame is requested for rendering and has not yet loaded, THE System SHALL render the last successfully loaded frame rather than dropping the canvas paint.
4. THE System SHALL track the highest continuously loaded frame index and prevent the canvas from advancing `targetFrame` beyond that index until the corresponding frame image is ready.
5. WHEN a browser does not support `requestIdleCallback`, THE System SHALL fall back to `setTimeout` with a 16ms delay between batches.

---

### Requirement 5: Core Web Vitals — LCP Optimization

**User Story:** As a site visitor, I want the main visual content to appear quickly on screen so the site feels responsive and Google Search ranking is not penalized.

#### Acceptance Criteria

1. THE System SHALL add `<link rel="preconnect">` and `<link rel="dns-prefetch">` tags in `layout.tsx` for the Shopify CDN domain used for product images.
2. WHEN the homepage loads, THE System SHALL ensure the smoke video (`smoke1.mp4`) has `preload="metadata"` rather than `preload="auto"` for Video B (the standby video in `GodModeExperience`) to reduce initial bandwidth, while Video A retains `preload="auto"` so it can start playing immediately.
3. THE System SHALL add `fetchPriority="high"` to the LCP image on the collections page (the first product card bottle image).
4. THE System SHALL add an explicit `width` and `height` to the root `<html>` layout so the document has a stable intrinsic size from the first paint.
5. WHEN any page in the application is server-rendered, THE System SHALL ensure the page's HTML response contains the correct font `<link>` preloads generated by `next/font` (already configured) without any additional render-blocking stylesheets.

---

### Requirement 6: Cumulative Layout Shift (CLS) Elimination

**User Story:** As a site visitor, I want elements to appear in their final position immediately so the page does not visually jump or reflow while loading.

#### Acceptance Criteria

1. THE System SHALL reserve explicit height for the `GodModeScene` fixed canvas by setting `width: 100vw` and `height: 100vh` as inline styles so the element's space is claimed before the Three.js renderer attaches.
2. THE System SHALL ensure all `next/dynamic` lazy-loaded components that have a predictable height render a placeholder `<div>` with the same height class (e.g., `min-h-screen` for full-viewport sections) to prevent document reflow.
3. THE System SHALL configure `next/font` with `display: "swap"` for both Inter and Bodoni Moda (already set) and confirm no fallback font causes a layout shift by specifying `adjustFontFallback: false` for Bodoni Moda where the fallback font metrics differ significantly from the web font.
4. WHEN Shopify product images are rendered in `CartDrawer` using a fixed `72×72` container, THE System SHALL ensure the container has explicit `width` and `height` CSS so the image slot is reserved before the image loads, preventing shifts in the cart drawer.
5. THE System SHALL verify that the `HomeSections` visibility toggle (currently `visibility: hidden / visible`) does not cause a layout recalculation by using `contain: layout` on the `belowFoldRef` wrapper div in `page.tsx`.

---

### Requirement 7: JavaScript Bundle Size Reduction

**User Story:** As a site visitor on a slow connection, I want the JavaScript needed to make the page interactive to be as small as possible, so the page responds quickly to my interactions.

#### Acceptance Criteria

1. THE System SHALL configure `next.config.ts` to enable `bundleAnalyzer` in analysis mode (via `@next/bundle-analyzer`) so the team can inspect bundle composition.
2. THE System SHALL import GSAP plugins (`ScrollTrigger`, `ScrollToPlugin`) with per-component registration using `gsap.registerPlugin(...)` only in the components that use them, and SHALL NOT re-register the same plugin across multiple modules that are bundled together.
3. THE System SHALL ensure Three.js is imported only inside the `GodModeScene` component's lazy boundary, so it is never included in the homepage SSR bundle or in any page that does not render the WebGL scene.
4. THE System SHALL replace the full `lucide-react` barrel import pattern with named per-icon imports (already in use) and confirm that tree-shaking is effective by verifying the bundle analyzer output contains only icons that are actually used.
5. WHERE a component imports both `gsap` core and a plugin, THE System SHALL use the combined import `import gsap from "gsap"` plus `import { ScrollTrigger } from "gsap/ScrollTrigger"` (currently correct in most files) rather than `import "gsap/ScrollTrigger"` side-effect imports that defeat tree-shaking.

---

### Requirement 8: Mobile and Network Performance

**User Story:** As a mobile visitor on a 4G or slower connection, I want animations and media to load in a way that is appropriate for my device's capabilities and network speed, so I get a usable experience without excessive data transfer.

#### Acceptance Criteria

1. WHEN the user's device reports `navigator.connection.effectiveType` as `"2g"` or `"slow-2g"`, THE System SHALL disable the canvas frame animation in `GodModeExperience` and display a static image fallback instead.
2. WHEN `window.matchMedia("(prefers-reduced-motion: reduce)")` returns `true`, THE System SHALL skip the GSAP entry animations in `LoadingScreen`, `CinematicNav`, and `PageTransition`, and instead show the final state immediately.
3. THE System SHALL disable `Lenis` smooth scroll on mobile viewports (screen width < 768px) and fall back to native browser scroll to avoid the additional JS overhead and potential jank on lower-powered devices.
4. WHEN the Three.js `GodModeScene` renderer initializes on a mobile device, THE System SHALL set `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1))` instead of `Math.min(..., 2)` to halve the GPU rendering workload on high-DPI mobile screens.
5. THE System SHALL add `rel="preload"` for the `/smoke1.mp4` video in `layout.tsx` only on the homepage route (detectable via route segment config), scoped to non-mobile viewports, to avoid mobile users downloading a video they will not play.

---

### Requirement 9: Shopify API Route Performance

**User Story:** As a shopper, I want cart operations (add, remove, update) to respond quickly so checkout feels smooth and trustworthy.

#### Acceptance Criteria

1. WHEN a cart ID is stored in `localStorage`, THE System SHALL rehydrate the cart state in `CartProvider` on mount without blocking the initial render by using `startTransition` to defer the `applyCart` state updates.
2. THE ShopifyApiRoute SHALL set a `Cache-Control: no-store` response header on all cart mutation responses (create, add, remove, update) to prevent intermediate caches from serving stale cart data.
3. THE ShopifyApiRoute SHALL set a `cache: "no-store"` option on the `fetch` call inside the route handler to opt out of Next.js Data Cache for cart mutations.
4. WHEN a Shopify API call fails with a network error, THE ShopifyApiRoute SHALL return a structured JSON error response with an HTTP 502 status rather than letting the error propagate as an unhandled exception.
5. THE System SHALL add a `timeout` to the `fetch` call inside `ShopifyApiRoute` using `AbortController` with a 10-second deadline so slow Shopify responses do not hold the serverless function open indefinitely.

---

### Requirement 10: Performance Monitoring and Observability

**User Story:** As a developer, I want Core Web Vitals and runtime performance metrics to be collected and visible so I can verify improvements and catch regressions.

#### Acceptance Criteria

1. THE System SHALL implement a `reportWebVitals` export in `app/layout.tsx` (or a dedicated `instrumentation.ts` file as supported by Next.js App Router) that logs LCP, CLS, and INP values to the browser console in development.
2. WHEN the application is built in production mode, THE System SHALL send Core Web Vitals metrics to an analytics endpoint (configurable via environment variable `NEXT_PUBLIC_ANALYTICS_ENDPOINT`) using `navigator.sendBeacon` so reports are non-blocking.
3. THE System SHALL add `next build` output size tracking by configuring `experimental.bundlePagesExternals` and ensuring the build log reports per-page JavaScript sizes.
4. THE System SHALL document the baseline performance metrics (LCP, CLS, TTI, total JS size) in a `PERFORMANCE.md` file at the project root before optimization work begins, to enable before/after comparison.
5. IF `NEXT_PUBLIC_ANALYTICS_ENDPOINT` is not set, THEN THE System SHALL skip the remote reporting step and only log metrics to the browser console, so the application functions correctly in environments without analytics configured.
