// Named values for the Selected Work section's GSAP/ScrollTrigger
// choreography. Nothing in the scene/project animations is a bare inline
// magic number. Mirrors the naming conventions in lib/animations/about.ts.

/** Duration for a masked line reveal (SplitType heading/subtitle). */
export const LINE_REVEAL_DURATION = 1.1;

/** Stagger between successive lines in a masked reveal. */
export const LINE_REVEAL_STAGGER = 0.12;

/** Vertical travel (in %, relative to line height) a masked line starts from. */
export const LINE_REVEAL_START_Y_PERCENT = 110;

/** Duration for a simple upward fade-in (project meta pieces, stack list, buttons). */
export const FADE_UP_DURATION = 0.9;

/** Vertical travel (px) for a simple upward fade-in. */
export const FADE_UP_TRAVEL_PX = 32;

/** Reduced-motion fallback fade duration for any reveal in this section. */
export const REDUCED_MOTION_FADE_DURATION = 0.6;

/** Shared ease for reveals, matching Hero/About's --ease-primary curve. */
export const EASE_PRIMARY = "cubic-bezier(0.16, 1, 0.3, 1)";

/** ScrollTrigger "start" position used by scene/element reveals. */
export const SCENE_TRIGGER_START = "top 80%";

/**
 * Per-project reveal stagger (seconds) applied across: project number ->
 * screenshot -> title/description -> tech stack -> buttons. Keeps the
 * "cascade" from the spec's timeline without a single all-at-once fade.
 */
export const PROJECT_REVEAL_STAGGER = 0.14;

/** Screenshot scroll-scale range (start -> end) as the project scrolls through view. */
export const IMAGE_SCALE_RANGE: [number, number] = [1, 1.04];

/** Screenshot parallax travel (px, negative = up) across the scroll-through distance. */
export const IMAGE_PARALLAX_TRAVEL_PX = -40;

/** Screenshot hover: brightness range (rest -> hover). */
export const IMAGE_HOVER_BRIGHTNESS: [number, number] = [0.95, 1];

/** Screenshot hover: upward lift (px). */
export const IMAGE_HOVER_LIFT_PX = -6;

/** Screenshot hover transition duration (s). */
export const IMAGE_HOVER_DURATION = 0.4;

/** Large translucent project-number decoration opacity. */
export const PROJECT_NUMBER_OPACITY = 0.08;