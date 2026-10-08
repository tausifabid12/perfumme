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
    // Play the frame files last → first. Every timing below is in *playback*
    // space (p = 0 is the first frame shown), so nothing else needs to know.
    reversed: boolean;
    // Product order as it appears on screen.
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

// 432 frames, 16:9, played in reverse.
//   Imperial Smoke  sharp f432–401 (p 0–0.07)    drifts away by p 0.10
//   It Boy          sharp f321–261 (p 0.26–0.40) recedes by p 0.42
//   Rebel Girl      sharp f173–117 (p 0.60–0.73) recedes by p 0.80
//   Blind Date      sharp f33–1    (p 0.92–1.0)  resolves from close-up at p 0.89
const WEB: CinematicVariant = {
    dir: "/frames-web",
    frames: 432,
    reversed: true,
    order: ["imperial-smoke", "it-boy", "rebel-girl", "blind-date"],
    introOut: [0.06, 0.095],
    middle: {
        "it-boy": [0.21, 0.43],
        "rebel-girl": [0.555, 0.77],
    },
    finalAt: 0.905,
    stops: [0, 0.33, 0.665, 0.985],
};

// 288 frames, portrait (1280×2276), played in reverse.
//   Imperial Smoke  sharp f288–277 (p 0–0.04)    drifts away by p 0.08
//   Rebel Girl      sharp f217–173 (p 0.25–0.40) recedes by p 0.46
//   It Boy          sharp f109–81  (p 0.62–0.72) recedes by p 0.76
//   Blind Date      sharp f21–1    (p 0.93–1.0)  resolves from close-up at p 0.88
const MOBILE: CinematicVariant = {
    dir: "/frames-mobile",
    frames: 288,
    reversed: true,
    order: ["imperial-smoke", "rebel-girl", "it-boy", "blind-date"],
    introOut: [0.035, 0.075],
    middle: {
        "rebel-girl": [0.2, 0.45],
        "it-boy": [0.57, 0.76],
    },
    finalAt: 0.9,
    // Last stop stays below the 0.998 point where the overlay hides.
    stops: [0, 0.32, 0.67, 0.985],
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
