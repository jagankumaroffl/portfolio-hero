import { useEffect, type RefObject } from "react";
import { ensureGsapRegistered, gsap, ScrollTrigger } from "@/lib/scroll/gsap";
import { prefersReducedMotion } from "@/lib/loader";
import {
  GRID_PARALLAX_FACTOR,
  HEADLINE_END_OPACITY,
  HEADLINE_TRAVEL_Y,
  HERO_SCROLL_DISTANCE_VH,
  HERO_TIMELINE_MARKERS,
  PORTRAIT_END_SCALE,
  PORTRAIT_TRAVEL_Y,
  SIMPLE_FADE_SCROLL_VH,
} from "./heroExitConstants";

export type HeroExitRefs = {
  /** The section that gets pinned — wraps the whole Hero. */
  pinTarget: RefObject<HTMLElement | null>;
  /** Base + reveal portrait image layers (the pointer-reveal element itself is untouched). */
  portrait: RefObject<HTMLDivElement | null>;
  /** Decorative grid/circle backdrop. */
  grid: RefObject<HTMLDivElement | null>;
  /** Main headline block. */
  headline: RefObject<HTMLElement | null>;
  /** Returns the current intro/CTA/nav elements that fade first (10%). Read at effect-run time. */
  getEarlyFadeTargets: () => Element[];
  /** The element the Hero should fade into (About section root). */
  nextSection: RefObject<HTMLElement | null>;
};

/**
 * Wires the Hero → About scroll transition: pins the Hero, then scrubs a
 * single GSAP timeline across the pinned distance driving independent
 * parallax layers (grid slower than portrait) plus a cross-fade into the
 * About section underneath. Never touches the pointer-reveal element or its
 * mask CSS variables — only opacity/transform on the layers listed above.
 *
 * Responsive behavior:
 * - Desktop/tablet: full pin + parallax, tablet gets reduced travel distances.
 * - Mobile (<768px) or prefers-reduced-motion: no pin, simple opacity fade.
 */
export function useHeroExitTimeline(refs: HeroExitRefs) {
  useEffect(() => {
    const pinEl = refs.pinTarget.current;
    const portraitEl = refs.portrait.current;
    const gridEl = refs.grid.current;
    const headlineEl = refs.headline.current;
    const earlyFadeEls = refs.getEarlyFadeTargets();
    const nextEl = refs.nextSection.current;

    if (!pinEl || !nextEl) return;

    ensureGsapRegistered();

    const reduced = prefersReducedMotion();
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const isTablet = window.matchMedia("(min-width: 768px) and (max-width: 1023px)").matches;

    const ctx = gsap.context(() => {
      if (reduced || isMobile) {
        // Simple fallback: no pinning, no scale/parallax — just fade the
        // Hero out and let the About section fade in as you scroll past.
        gsap.set(nextEl, { opacity: 0 });

        ScrollTrigger.create({
          trigger: pinEl,
          start: "top top",
          end: `+=${SIMPLE_FADE_SCROLL_VH}%`,
          scrub: 1,
          onUpdate: (self) => {
            gsap.set(pinEl, { opacity: 1 - self.progress });
            gsap.set(nextEl, { opacity: self.progress });
          },
        });
        return;
      }

      // Tablet gets reduced travel distances; desktop gets the full spec.
      const travelScale = isTablet ? 0.6 : 1;
      const portraitScale = 1 + (PORTRAIT_END_SCALE - 1) * travelScale;
      const portraitY = PORTRAIT_TRAVEL_Y * travelScale;
      const headlineY = HEADLINE_TRAVEL_Y * travelScale;

      gsap.set(nextEl, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinEl,
          start: "top top",
          end: `+=${HERO_SCROLL_DISTANCE_VH}%`,
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
        defaults: { ease: "none" },
      });

      const m = HERO_TIMELINE_MARKERS;

      // 10%: intro text / CTA / nav fade out for good.
      if (earlyFadeEls.length > 0) {
        tl.to(
          earlyFadeEls,
          { opacity: 0, duration: m.headlineShiftStart - m.introFadeStart },
          m.introFadeStart
        );
      }

      // 25%: headline drifts upward, opacity eases down slightly. No scale.
      if (headlineEl) {
        tl.to(
          headlineEl,
          {
            y: headlineY,
            opacity: HEADLINE_END_OPACITY,
            duration: m.portraitScaleStart - m.headlineShiftStart,
          },
          m.headlineShiftStart
        );
      }

      // 40%: portrait scales up slightly and drifts up. Transform only —
      // the pointer-reveal mask (--reveal-x/y/radius) is never touched.
      if (portraitEl) {
        tl.to(
          portraitEl,
          {
            scale: portraitScale,
            y: portraitY,
            duration: m.complete - m.portraitScaleStart,
          },
          m.portraitScaleStart
        );
      }

      // 50%: grid drifts at a fraction of the portrait's speed for depth.
      if (gridEl) {
        tl.to(
          gridEl,
          {
            y: portraitY * GRID_PARALLAX_FACTOR,
            duration: m.complete - m.gridParallaxStart,
          },
          m.gridParallaxStart
        );
      }

      // 60% -> 100%: Hero fades out as About fades in underneath.
      tl.to(pinEl, { opacity: 0, duration: m.complete - m.heroFadeStart }, m.heroFadeStart);
      tl.to(nextEl, { opacity: 1, duration: m.complete - m.heroFadeStart }, m.heroFadeStart);
    }, pinEl);

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}