// Named values for the Journey section's GSAP/ScrollTrigger choreography.
// Mirrors the naming conventions in lib/animations/projectsConstants.ts and
// lib/animations/aboutConstants.ts — nothing here is a bare inline magic
// number.

/** Duration for a masked line reveal (SplitType heading/subtitle). */
export const LINE_REVEAL_DURATION = 1.1;

/** Stagger between successive lines in a masked reveal. */
export const LINE_REVEAL_STAGGER = 0.12;

/** Vertical travel (in %, relative to line height) a masked line starts from. */
export const LINE_REVEAL_START_Y_PERCENT = 110;

/** Duration for a simple upward fade-in (milestone parts, ending lines). */
export const FADE_UP_DURATION = 0.9;

/** Vertical travel (px) for a simple upward fade-in. */
export const FADE_UP_TRAVEL_PX = 32;

/** Reduced-motion fallback fade duration for any reveal in this section. */
export const REDUCED_MOTION_FADE_DURATION = 0.6;

/** Shared ease, matching Hero/About/Projects' --ease-primary curve. */
export const EASE_PRIMARY = "cubic-bezier(0.16, 1, 0.3, 1)";

/** ScrollTrigger "start" position used by scene/element reveals. */
export const SCENE_TRIGGER_START = "top 80%";

/** Per-milestone reveal stagger (seconds): node -> year -> title -> description. */
export const MILESTONE_REVEAL_STAGGER = 0.14;

/** Pinned scroll distance for the desktop line-draw scene, in viewport heights. */
export const LINE_SCENE_SCROLL_VH = 200;

/** Node scale range (rest -> revealed) when a milestone activates. */
export const NODE_SCALE_RANGE: [number, number] = [0.4, 1];