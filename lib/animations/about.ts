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
  REDUCED_MOTION_FADE_DURATION,
  SCENE_TRIGGER_START,
  STAT_COUNT_DURATION,
} from "./aboutConstants";

/**
 * Splits an element's text into lines (via SplitType), wraps each line in a
 * mask (overflow: hidden), and animates the lines upward from behind that
 * mask as the element scrolls into view. This is the "line reveal" used for
 * Scene 1's headline and Scene 5's quote.
 *
 * Returns the SplitType instance so the caller can `.revert()` it on
 * cleanup (restores the original unsplit text, important for React
 * StrictMode's double-invoke and for route changes).
 */
export function revealLinesOnScroll(
  target: HTMLElement,
  options?: { trigger?: Element; scrub?: boolean }
): SplitType {
  ensureGsapRegistered();
  const reduced = prefersReducedMotion();

  const split = new SplitType(target, { types: "lines", tagName: "span" });
  const lines = split.lines ?? [];

  // Mask wrapper per line so the reveal looks like it's sliding out from
  // behind an edge rather than just translating on top of visible content.
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
        trigger: options?.trigger ?? target,
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
      trigger: options?.trigger ?? target,
      start: SCENE_TRIGGER_START,
      toggleActions: "play none none reverse",
    },
  });

  return split;
}

/**
 * Animates a group of elements upward + fading in independently as they
 * scroll into view, each with its own ScrollTrigger (so they don't all fire
 * at once — used for Scene 2's identity lines, Scene 3's statements, and
 * Scene 6's stat columns).
 */
export function revealElementsIndividually(
  elements: Element[] | NodeListOf<Element>,
  options?: { stagger?: number }
) {
  ensureGsapRegistered();
  const reduced = prefersReducedMotion();
  const list = Array.from(elements);
  if (list.length === 0) return;

  if (reduced) {
    list.forEach((el) => {
      gsap.set(el, { opacity: 1, y: 0 });
      gsap.from(el, {
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
    return;
  }

  list.forEach((el, i) => {
    gsap.set(el, { opacity: 0, y: FADE_UP_TRAVEL_PX });
    gsap.to(el, {
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
 * Subtle scroll-linked scale on a portrait image — scrubs from `from` to
 * `to` across the time the element is in the viewport. Transform only, no
 * layout impact. Disabled (returns null) under reduced motion.
 */
export function scalePortraitOnScroll(
  target: Element,
  range: [number, number]
): ScrollTrigger | null {
  ensureGsapRegistered();
  if (prefersReducedMotion()) return null;

  gsap.set(target, { scale: range[0] });
  return ScrollTrigger.create({
    trigger: target,
    start: "top bottom",
    end: "bottom top",
    scrub: 1,
    onUpdate: (self) => {
      const scale = range[0] + (range[1] - range[0]) * self.progress;
      gsap.set(target, { scale });
    },
  });
}

/**
 * Animates a numeric stat counting up from 0 to its target value as it
 * scrolls into view. `el`'s text content is replaced with the formatted
 * number each frame. Non-numeric stat values (e.g. "AI", "Always") are
 * revealed with a simple fade instead — count-up only applies to numbers.
 */
export function countUpStat(el: HTMLElement, targetValue: number, suffix = "") {
  ensureGsapRegistered();
  const reduced = prefersReducedMotion();

  if (reduced) {
    el.textContent = `${targetValue}${suffix}`;
    gsap.from(el, {
      opacity: 0,
      duration: REDUCED_MOTION_FADE_DURATION,
      ease: "power1.out",
      scrollTrigger: {
        trigger: el,
        start: SCENE_TRIGGER_START,
        toggleActions: "play none none reverse",
      },
    });
    return;
  }

  const counter = { value: 0 };
  gsap.to(counter, {
    value: targetValue,
    duration: STAT_COUNT_DURATION,
    ease: "power2.out",
    scrollTrigger: {
      trigger: el,
      start: SCENE_TRIGGER_START,
      toggleActions: "play none none reverse",
    },
    onUpdate: () => {
      el.textContent = `${Math.round(counter.value)}${suffix}`;
    },
  });
}