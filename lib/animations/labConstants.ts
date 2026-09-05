// Named values for the Lab section's GSAP/ScrollTrigger choreography.
// Mirrors lib/animations/toolboxConstants.ts and journeyConstants.ts —
// nothing here is a bare inline magic number.

/** Duration for a masked line reveal (SplitType heading/subtitle). */
export const LINE_REVEAL_DURATION = 1.1;

/** Stagger between successive lines in a masked reveal. */
export const LINE_REVEAL_STAGGER = 0.12;

/** Vertical travel (in %, relative to line height) a masked line starts from. */
export const LINE_REVEAL_START_Y_PERCENT = 110;

/** Duration for a simple upward fade-in (ending lines). */
export const FADE_UP_DURATION = 0.9;

/** Vertical travel (px) for a simple upward fade-in. */
export const FADE_UP_TRAVEL_PX = 32;

/** Reduced-motion fallback fade duration for any reveal in this section. */
export const REDUCED_MOTION_FADE_DURATION = 0.6;

/** Shared ease, matching the rest of the page's --ease-primary curve. */
export const EASE_PRIMARY = "cubic-bezier(0.16, 1, 0.3, 1)";

/** ScrollTrigger "start" position used by scene/element reveals. */
export const SCENE_TRIGGER_START = "top 80%";

/** Stagger between successive experiment cards revealing into the grid. */
export const CARD_REVEAL_STAGGER = 0.08;

/** Card hover: upward lift (px). */
export const CARD_HOVER_LIFT_PX = -6;

/** Card hover: visual-area scale. */
export const CARD_HOVER_VISUAL_SCALE = 1.04;

/** Card hover: title shift (px). */
export const CARD_HOVER_TITLE_SHIFT_PX = 4;

/** Card hover: transition duration (s). */
export const CARD_HOVER_DURATION = 0.4;

/** Detail overlay open/close duration (s). */
export const DETAIL_TRANSITION_DURATION = 0.5;

/** Detail overlay backdrop dim duration (s). */
export const DETAIL_BACKDROP_DURATION = 0.35;