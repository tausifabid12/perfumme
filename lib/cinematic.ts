// Single source of truth for the home-page cinematic scroll.
// GodModeExperience (frames), CinematicTypography (text) and
// MobileCinematicSnap (swipe stops) all read from here so the copy always
// lines up with the bottle that is on screen.
//
// All timings are fractions of the cinematic scroll max (12 × innerHeight),
// which maps linearly onto frame index: p = (frame - 1) / (frames - 1).

export type ProductKey = "blind-date" | "rebel-girl" | "it-boy" | "imperial-smoke";

// [start, end] scroll window for a middle product's scrubbed text timeline.
// The text is fully in at ~28% of the window and starts leaving at ~82%,
// so windows are chosen to bracket the frames where the bottle is sharp.
export type Window = [number, number];

export interface CinematicVariant {
    dir: string;
    frames: number;
    // Product order as it appears in this frame sequence.
    order: [ProductKey, ProductKey, ProductKey, ProductKey];
    // Product 1 text is revealed on load; scrubbed out over this window.
    introOut: Window;
    // Products 2 & 3 — scrubbed in/hold/out.
    middle: Partial<Record<ProductKey, Window>>;
    // Product 4 plays in at this point and stays until HomeSections.
    finalAt: number;
    // Mobile swipe stops — each one lands on a sharp bottle with its text fully in.
    stops: number[];
}

// 432 frames, 16:9.
//   Blind Date      sharp f1–33    (p 0–0.076)   zooms past by f49
//   Rebel Girl      sharp f117–173 (p 0.27–0.40) zooms past by f193
//   It Boy          sharp f261–321 (p 0.60–0.74) zooms past by f349
//   Imperial Smoke  sharp f401–432 (p 0.93–1.0)
const WEB: CinematicVariant = {
    dir: "/frames-web",
    frames: 432,
    order: ["blind-date", "rebel-girl", "it-boy", "imperial-smoke"],
    introOut: [0.055, 0.095],
    middle: {
        "rebel-girl": [0.21, 0.43],
        "it-boy": [0.56, 0.78],
    },
    finalAt: 0.9,
    stops: [0, 0.335, 0.675, 0.985],
};

// 288 frames, portrait (1280×2276).
//   Blind Date      sharp f1–21    (p 0–0.07)    zooms past by f37
//   It Boy          sharp f81–109  (p 0.28–0.38) slides out by f125
//   Rebel Girl      sharp f173–217 (p 0.60–0.75) zooms past by f229
//   Imperial Smoke  sharp f277–288 (p 0.96–1.0)
const MOBILE: CinematicVariant = {
    dir: "/frames-mobile",
    frames: 288,
    order: ["blind-date", "it-boy", "rebel-girl", "imperial-smoke"],
    introOut: [0.05, 0.09],
    middle: {
        "it-boy": [0.22, 0.41],
        "rebel-girl": [0.54, 0.785],
    },
    finalAt: 0.93,
    // Last stop stays below the 0.998 point where the overlay hides.
    stops: [0, 0.325, 0.67, 0.985],
};

export const MOBILE_BREAKPOINT = 768;

export const isMobileViewport = () => window.innerWidth < MOBILE_BREAKPOINT;

export const getCinematicVariant = (): CinematicVariant =>
    isMobileViewport() ? MOBILE : WEB;

export const cinematicMaxScroll = () => window.innerHeight * 12;

// ── Displayed-frame progress ─────────────────────────────────────────
// The canvas eases toward the scroll target and can lag further while frames
// are still downloading (it falls back to the last loaded frame). The copy is
// timed against the frame that is actually painted, not raw scroll, so text
// never appears over the wrong bottle.
type ProgressListener = (p: number) => void;
let displayedProgress = 0;
const progressListeners = new Set<ProgressListener>();

export const setDisplayedProgress = (p: number) => {
    if (p === displayedProgress) return;
    displayedProgress = p;
    progressListeners.forEach(fn => fn(p));
};

export const onDisplayedProgress = (fn: ProgressListener) => {
    progressListeners.add(fn);
    fn(displayedProgress);
    return () => { progressListeners.delete(fn); };
};
