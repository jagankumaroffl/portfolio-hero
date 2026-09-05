// Named values for the About section's GSAP/ScrollTrigger choreography.
// Nothing in the scene animations is a bare inline magic number.

/** Duration for a masked line reveal (SplitType lines translating up from behind a mask). */
export const LINE_REVEAL_DURATION = 1.1;

/** Stagger between successive lines in a masked reveal. */
export const LINE_REVEAL_STAGGER = 0.12;

/** Vertical travel (in %, relative to the line's own height) a masked line starts from. */
export const LINE_REVEAL_START_Y_PERCENT = 110;

/** Duration for a simple upward fade-in (independent elements in Scene 2/3/6). */
export const FADE_UP_DURATION = 0.9;

/** Vertical travel (px) for a simple upward fade-in. */
export const FADE_UP_TRAVEL_PX = 36;

/** Stagger between independently-revealing statements in Scene 3. */
export const STATEMENT_STAGGER = 0.15;

/** Portrait scale range for Scene 4's subtle scroll-scale (start -> end). */
export const PORTRAIT_SCALE_RANGE: [number, number] = [1, 1.06];

/** Duration for the Scene 5 quote's masked reveal. */
export const QUOTE_REVEAL_DURATION = 1.2;

/** Duration for each stat's count-up animation. */
export const STAT_COUNT_DURATION = 1.4;

/** Reduced-motion fallback: plain fade duration for any scene element. */
export const REDUCED_MOTION_FADE_DURATION = 0.6;

/** Shared ease for reveal animations, matching the Hero's --ease-primary curve. */
export const EASE_PRIMARY = "cubic-bezier(0.16, 1, 0.3, 1)";

/** ScrollTrigger "start" position used by every scene reveal — fires as a scene enters view. */
export const SCENE_TRIGGER_START = "top 75%";