import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Module-level guard: Next.js can re-evaluate this module across HMR
// updates and multiple client entry points, but gsap.registerPlugin must
// only ever run once per page load or ScrollTrigger's internal state can
// desync from the DOM.
let registered = false;

/** Registers ScrollTrigger with GSAP exactly once. Safe to call repeatedly. */
export function ensureGsapRegistered(): void {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  // Mobile browsers fire resize events as their address bar/toolbar
  // collapses or expands mid-scroll. Without this, ScrollTrigger treats
  // each of those as a real layout change and recalculates every trigger's
  // start position against whatever viewport height happens to be current
  // at that instant — so a trigger computed while the address bar was
  // visible (shorter viewport) ends up requiring extra scroll distance
  // once the bar hides (taller viewport), which is exactly what makes
  // reveal animations feel like they fire late/inconsistently on phones.
  // This tells ScrollTrigger to ignore those address-bar-only resizes
  // while still recalculating on genuine orientation/layout changes.
  ScrollTrigger.config({ ignoreMobileResize: true });

  registered = true;
}

export { gsap, ScrollTrigger };