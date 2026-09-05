// Named values for the Hero → About scroll-driven exit. Nothing here is a
// magic number inline in the ScrollTrigger timeline.

/** Total scroll distance (vh) the pinned Hero transition plays across. */
export const HERO_SCROLL_DISTANCE_VH = 150;

/** Portrait scale at the end of the transition (starts at 1). */
export const PORTRAIT_END_SCALE = 1.08;

/** Portrait upward travel at the end of the transition (px, negative = up). */
export const PORTRAIT_TRAVEL_Y = -60;

/** Headline upward travel at the end of the transition (px). */
export const HEADLINE_TRAVEL_Y = -40;

/** Headline opacity at the end of its fade (25%–60% of the timeline). */
export const HEADLINE_END_OPACITY = 0.4;

/** Grid backdrop travel as a fraction of the portrait's travel — creates depth via a slower layer. */
export const GRID_PARALLAX_FACTOR = 0.4;

/** Scroll-fraction progress markers from the spec, as 0–1 timeline positions. */
export const HERO_TIMELINE_MARKERS = {
  introFadeStart: 0.1,
  headlineShiftStart: 0.25,
  portraitScaleStart: 0.4,
  gridParallaxStart: 0.5,
  heroFadeStart: 0.6,
  heroNearGone: 0.8,
  complete: 1,
} as const;

/** Reduced-motion / mobile fallback: simple Hero fade duration (viewport-height fraction). */
export const SIMPLE_FADE_SCROLL_VH = 80;