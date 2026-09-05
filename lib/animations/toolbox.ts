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
  SPOTLIGHT_DIM_OPACITY,
  SPOTLIGHT_DURATION,
  TOOL_HOVER_DURATION,
  TOOL_HOVER_LIFT_PX,
  TOOL_REVEAL_STAGGER,
} from "./toolboxConstants";

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
 * statement lines and the Lab transition placeholder.
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
 * Reveals one category "row" (its number/title + all of its tool items) as
 * it scrolls into view, with tool items cascading in a short stagger after
 * the heading — giving the sequential "01 reveals, then 02 reveals..."
 * behavior from the spec without a single shared ScrollTrigger animating
 * every category at once.
 */
export function revealCategoryOnScroll(
  root: Element,
  parts: { heading?: Element | null; tools?: Element[] | NodeListOf<Element> }
): gsap.core.Tween[] {
  ensureGsapRegistered();
  const reduced = prefersReducedMotion();
  const tools = parts.tools ? Array.from(parts.tools) : [];
  const ordered = [parts.heading, ...tools].filter((el): el is Element => Boolean(el));
  if (ordered.length === 0) return [];

  const scrollTrigger = {
    trigger: root,
    start: SCENE_TRIGGER_START,
    toggleActions: "play none none reverse",
  } as const;

  if (reduced) {
    return ordered.map((el) => {
      gsap.set(el, { opacity: 1, y: 0 });
      return gsap.from(el, {
        opacity: 0,
        duration: REDUCED_MOTION_FADE_DURATION,
        ease: "power1.out",
        scrollTrigger,
      });
    });
  }

  return ordered.map((el, i) => {
    gsap.set(el, { opacity: 0, y: FADE_UP_TRAVEL_PX });
    return gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: FADE_UP_DURATION,
      delay: i * TOOL_REVEAL_STAGGER,
      ease: EASE_PRIMARY,
      scrollTrigger,
    });
  });
}

/**
 * Wires a tool item's hover/focus interaction: brighten + tiny upward lift
 * + underline expand, driven by a single paused timeline played forward on
 * enter/focus and reversed on leave/blur. Keyboard-accessible by binding
 * the same handlers to focus/blur, not just pointer events. Returns a
 * cleanup function that removes all listeners. No-op (but still returns a
 * cleanup) under reduced motion — the item keeps its resting state and
 * relies on the CSS hover/focus rules in toolbox.styles.ts instead.
 */
export function bindToolHover(target: HTMLElement, underline?: Element | null): () => void {
  ensureGsapRegistered();
  const reduced = prefersReducedMotion();

  if (reduced) {
    return () => {};
  }

  const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out", duration: TOOL_HOVER_DURATION } });
  tl.to(target, { y: TOOL_HOVER_LIFT_PX, opacity: 1 }, 0);
  if (underline) {
    gsap.set(underline, { scaleX: 0, transformOrigin: "left center" });
    tl.to(underline, { scaleX: 1 }, 0);
  }

  const onEnter = () => tl.play();
  const onLeave = () => tl.reverse();

  target.addEventListener("pointerenter", onEnter);
  target.addEventListener("pointerleave", onLeave);
  target.addEventListener("focus", onEnter);
  target.addEventListener("blur", onLeave);

  return () => {
    target.removeEventListener("pointerenter", onEnter);
    target.removeEventListener("pointerleave", onLeave);
    target.removeEventListener("focus", onEnter);
    target.removeEventListener("blur", onLeave);
    tl.kill();
  };
}

/**
 * Dims every tool item except the hovered/focused one, so the hovered tool
 * reads as the visual focus without scaling or a cursor-following card.
 * `allItems` should include the hovered item itself (it's excluded from
 * the dim). No-op under reduced motion, since it's a visual nicety layered
 * on top of the already-accessible hover/focus state.
 */
export function spotlightTool(hovered: Element, allItems: Element[]): () => void {
  ensureGsapRegistered();
  if (prefersReducedMotion()) {
    return () => {};
  }

  const others = allItems.filter((el) => el !== hovered);
  gsap.to(others, { opacity: SPOTLIGHT_DIM_OPACITY, duration: SPOTLIGHT_DURATION, ease: "power1.out" });

  return () => {
    gsap.to(others, { opacity: 1, duration: SPOTLIGHT_DURATION, ease: "power1.out" });
  };
}