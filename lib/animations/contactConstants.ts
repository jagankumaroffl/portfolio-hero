// Named values for the Contact section's GSAP/ScrollTrigger choreography.
// Mirrors lib/animations/labConstants.ts and toolboxConstants.ts — nothing
// here is a bare inline magic number. Durations/travel skew slightly
// smaller and slower than Lab's to match this section's calmer, more
// restrained pace.

/** Duration for a masked line reveal (SplitType heading/subtitle). */
export const LINE_REVEAL_DURATION = 1.2;

/** Stagger between successive lines in a masked reveal. */
export const LINE_REVEAL_STAGGER = 0.15;

/** Vertical travel (in %, relative to line height) a masked line starts from. */
export const LINE_REVEAL_START_Y_PERCENT = 110;

/** Duration for a simple upward fade-in (links, availability, CTA). */
export const FADE_UP_DURATION = 0.85;

/** Vertical travel (px) for a simple upward fade-in — smaller than other sections, calmer motion. */
export const FADE_UP_TRAVEL_PX = 20;

/** Reduced-motion fallback fade duration for any reveal in this section. */
export const REDUCED_MOTION_FADE_DURATION = 0.6;

/** Shared ease, matching the rest of the page's --ease-primary curve. */
export const EASE_PRIMARY = "cubic-bezier(0.16, 1, 0.3, 1)";

/** ScrollTrigger "start" position used by scene/element reveals. */
export const SCENE_TRIGGER_START = "top 80%";

/** Stagger between successive contact links revealing. */
export const LINK_REVEAL_STAGGER = 0.08;

/** Link hover: upward lift (px). */
export const LINK_HOVER_LIFT_PX = -3;

/** Link hover: arrow rightward shift (px). */
export const LINK_HOVER_ARROW_SHIFT_PX = 5;

/** Link hover: transition duration (s), within the 0.3-0.5s range the brief asks for. */
export const LINK_HOVER_DURATION = 0.4;

/** Availability dot: gentle pulse cycle duration (s). */
export const AVAILABILITY_PULSE_DURATION = 2.4;