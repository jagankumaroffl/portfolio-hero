// Named values for the Toolbox section's GSAP/ScrollTrigger choreography.
// Mirrors lib/animations/journeyConstants.ts and projectsConstants.ts —
// nothing here is a bare inline magic number.

/** Duration for a masked line reveal (SplitType heading/subtitle). */
export const LINE_REVEAL_DURATION = 1.1;

/** Stagger between successive lines in a masked reveal. */
export const LINE_REVEAL_STAGGER = 0.12;

/** Vertical travel (in %, relative to line height) a masked line starts from. */
export const LINE_REVEAL_START_Y_PERCENT = 110;

/** Duration for a simple upward fade-in (category rows, tool items, ending lines). */
export const FADE_UP_DURATION = 0.9;

/** Vertical travel (px) for a simple upward fade-in. */
export const FADE_UP_TRAVEL_PX = 32;

/** Reduced-motion fallback fade duration for any reveal in this section. */
export const REDUCED_MOTION_FADE_DURATION = 0.6;

/** Shared ease, matching Hero/About/Projects/Journey's --ease-primary curve. */
export const EASE_PRIMARY = "cubic-bezier(0.16, 1, 0.3, 1)";

/** ScrollTrigger "start" position used by scene/element reveals. */
export const SCENE_TRIGGER_START = "top 80%";

/** Per-category reveal stagger (seconds) applied across its tool items. */
export const TOOL_REVEAL_STAGGER = 0.06;

/** Hover: upward lift (px) on a tool item. */
export const TOOL_HOVER_LIFT_PX = -3;

/** Hover: transition duration (s) for the lift/brighten/underline. */
export const TOOL_HOVER_DURATION = 0.3;

/** Spotlight: opacity the rest of the section dims to while one tool is hovered. */
export const SPOTLIGHT_DIM_OPACITY = 0.4;

/** Spotlight: dim/undim transition duration (s). */
export const SPOTLIGHT_DURATION = 0.35;