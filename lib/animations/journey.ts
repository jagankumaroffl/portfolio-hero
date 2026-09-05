import SplitType from "split-type";
import { ensureGsapRegistered, gsap, ScrollTrigger } from "@/lib/scroll/gsap";
import { prefersReducedMotion } from "@/lib/loader";
import {
  EASE_PRIMARY,
  FADE_UP_DURATION,
  FADE_UP_TRAVEL_PX,
  LINE_REVEAL_DURATION,
  LINE_REVEAL_STAGGER,
  LINE_REVEAL_START_Y_PERCENT,
  MILESTONE_REVEAL_STAGGER,
  NODE_SCALE_RANGE,
  REDUCED_MOTION_FADE_DURATION,
  SCENE_TRIGGER_START,
} from "./journeyConstants";

/**
 * Splits an element's text into lines and animates them upward from behind
 * a mask as the element scrolls into view. Used for the intro and ending
 * statement lines. Returns the SplitType instance so the caller can
 * `.revert()` it on cleanup.
 */
export function revealLinesOnScroll(target: HTMLElement): SplitType {
  ensureGsapRegistered();
  const reduced = prefersReducedMotion();

  const split = new SplitType(target, { types: "lines", tagName: "span" });
  const lines = split.lines ?? [];

  lines.forEach((line) => {
    const mask = document.createElement("span");
    mask.style.display = "block";
    mask.style.overflow = "hidden";
    line.parentNode?.insertBefore(mask, line);
    mask.appendChild(line);
  });

  if (reduced) {
    gsap.set(lines, { yPercent: 0, opacity: 1 });
    gsap.from(lines, {
      opacity: 0,
      duration: REDUCED_MOTION_FADE_DURATION,
      stagger: LINE_REVEAL_STAGGER,
      ease: "power1.out",
      scrollTrigger: {
        trigger: target,
        start: SCENE_TRIGGER_START,
        toggleActions: "play none none reverse",
      },
    });
    return split;
  }

  gsap.set(lines, { yPercent: LINE_REVEAL_START_Y_PERCENT });
  gsap.to(lines, {
    yPercent: 0,
    duration: LINE_REVEAL_DURATION,
    stagger: LINE_REVEAL_STAGGER,
    ease: EASE_PRIMARY,
    scrollTrigger: {
      trigger: target,
      start: SCENE_TRIGGER_START,
      toggleActions: "play none none reverse",
    },
  });

  return split;
}

/**
 * Animates a group of elements upward + fading in independently as they
 * scroll into view, each with its own ScrollTrigger. Used for the ending
 * statement lines and the Toolbox transition placeholder.
 */
export function revealElementsIndividually(
  elements: Element[] | NodeListOf<Element>,
  options?: { stagger?: number }
): gsap.core.Tween[] {
  ensureGsapRegistered();
  const reduced = prefersReducedMotion();
  const list = Array.from(elements);
  if (list.length === 0) return [];

  if (reduced) {
    return list.map((el) => {
      gsap.set(el, { opacity: 1, y: 0 });
      return gsap.from(el, {
        opacity: 0,
        duration: REDUCED_MOTION_FADE_DURATION,
        ease: "power1.out",
        scrollTrigger: {
          trigger: el,
          start: SCENE_TRIGGER_START,
          toggleActions: "play none none reverse",
        },
      });
    });
  }

  return list.map((el, i) => {
    gsap.set(el, { opacity: 0, y: FADE_UP_TRAVEL_PX });
    return gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: FADE_UP_DURATION,
      delay: (options?.stagger ?? 0) * i,
      ease: EASE_PRIMARY,
      scrollTrigger: {
        trigger: el,
        start: SCENE_TRIGGER_START,
        toggleActions: "play none none reverse",
      },
    });
  });
}

/**
 * Draws the horizontal (desktop) or vertical (mobile) journey line by
 * scrubbing scaleX/scaleY from 0 to 1 as the pinned scene scrolls, tied to
 * the same ScrollTrigger instance that drives milestone activation via
 * `onProgress`. Transform only (never animates width/height) so there's no
 * layout thrashing. Returns null under reduced motion — the line stays at
 * its CSS-authored state (fully drawn, milestones shown normally) and the
 * caller should skip pinning entirely.
 */
export function drawJourneyLine(
  lineEl: HTMLElement,
  options: {
    trigger: Element;
    axis: "x" | "y";
    scrollDistance: string;
    pin?: Element | boolean;
    onProgress?: (progress: number) => void;
  }
): ScrollTrigger | null {
  ensureGsapRegistered();
  if (prefersReducedMotion()) return null;

  const scaleProp = options.axis === "x" ? "scaleX" : "scaleY";
  gsap.set(lineEl, {
    [scaleProp]: 0,
    transformOrigin: options.axis === "x" ? "left center" : "top center",
  });

  return ScrollTrigger.create({
    trigger: options.trigger,
    start: "top top",
    end: `+=${options.scrollDistance}`,
    pin: options.pin ?? false,
    scrub: 1,
    onUpdate: (self) => {
      gsap.set(lineEl, { [scaleProp]: self.progress });
      options.onProgress?.(self.progress);
    },
  });
}

/**
 * Reveals a single milestone's parts in a short cascade — node, then year,
 * then title, then description — once the journey line's progress reaches
 * this milestone's threshold. Node expands slightly (scale, never bounce);
 * everything else is a plain fade + lift. Called imperatively from the
 * line-draw's onProgress callback rather than its own ScrollTrigger, since
 * activation is driven by line progress, not by the milestone's own scroll
 * position.
 */
export function activateMilestone(parts: {
  node?: Element | null;
  year?: Element | null;
  title?: Element | null;
  description?: Element | null;
}) {
  ensureGsapRegistered();
  const reduced = prefersReducedMotion();

  const ordered = [parts.year, parts.title, parts.description].filter(
    (el): el is Element => Boolean(el)
  );

  if (parts.node) {
    if (reduced) {
      gsap.set(parts.node, { opacity: 1, scale: NODE_SCALE_RANGE[1] });
    } else {
      gsap.to(parts.node, {
        opacity: 1,
        scale: NODE_SCALE_RANGE[1],
        duration: FADE_UP_DURATION * 0.6,
        ease: EASE_PRIMARY,
        overwrite: true,
      });
    }
  }

  ordered.forEach((el, i) => {
    if (reduced) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: FADE_UP_DURATION * 0.7,
      delay: i * MILESTONE_REVEAL_STAGGER,
      ease: EASE_PRIMARY,
      overwrite: true,
    });
  });
}

/**
 * Resets a milestone's parts back to their hidden/subtle resting state.
 * Used when scrolling back up past a milestone's threshold so the reveal
 * can play again going forward, matching the reverse behavior of the
 * section's other scroll-linked reveals.
 */
export function deactivateMilestone(parts: {
  node?: Element | null;
  year?: Element | null;
  title?: Element | null;
  description?: Element | null;
}) {
  if (prefersReducedMotion()) return;
  ensureGsapRegistered();

  if (parts.node) {
    gsap.to(parts.node, {
      opacity: 0,
      scale: NODE_SCALE_RANGE[0],
      duration: REDUCED_MOTION_FADE_DURATION,
      ease: "power1.out",
      overwrite: true,
    });
  }

  [parts.year, parts.title, parts.description]
    .filter((el): el is Element => Boolean(el))
    .forEach((el) => {
      gsap.to(el, {
        opacity: 0,
        y: FADE_UP_TRAVEL_PX,
        duration: REDUCED_MOTION_FADE_DURATION,
        ease: "power1.out",
        overwrite: true,
      });
    });
}

/**
 * Sets the initial hidden/subtle resting state for a milestone's parts
 * before any scroll activation. Node starts small + transparent (never
 * display:none, so it stays in the accessibility tree); text parts start
 * faded + offset. No-op visual baseline under reduced motion — parts stay
 * at their natural CSS state so everything is readable without scroll.
 */
export function setMilestoneInitialState(parts: {
  node?: Element | null;
  year?: Element | null;
  title?: Element | null;
  description?: Element | null;
}) {
  ensureGsapRegistered();
  if (prefersReducedMotion()) return;

  if (parts.node) {
    gsap.set(parts.node, { opacity: 0, scale: NODE_SCALE_RANGE[0] });
  }
  [parts.year, parts.title, parts.description]
    .filter((el): el is Element => Boolean(el))
    .forEach((el) => {
      gsap.set(el, { opacity: 0, y: FADE_UP_TRAVEL_PX });
    });
}