import SplitType from "split-type";
import { ensureGsapRegistered, gsap } from "@/lib/scroll/gsap";
import { prefersReducedMotion } from "@/lib/loader";
import {
  EASE_PRIMARY,
  FADE_UP_DURATION,
  FADE_UP_TRAVEL_PX,
  LINE_REVEAL_DURATION,
  LINE_REVEAL_STAGGER,
  LINE_REVEAL_START_Y_PERCENT,
  LINK_HOVER_ARROW_SHIFT_PX,
  LINK_HOVER_DURATION,
  LINK_HOVER_LIFT_PX,
  LINK_REVEAL_STAGGER,
  REDUCED_MOTION_FADE_DURATION,
  SCENE_TRIGGER_START,
} from "./contactConstants";

/**
 * Splits an element's text into lines and animates them upward from behind
 * a mask as the element scrolls into view. Used for the section heading
 * and the "Have an idea? / Let's build it." statement. Returns the
 * SplitType instance so the caller can `.revert()` it on cleanup.
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
 * Animates a group of elements upward + fading in with a small stagger as
 * they scroll into view, sharing one ScrollTrigger on the group's common
 * ancestor. Used for the contact links list, the availability block, and
 * the CTA — the sequenced "links, then availability, then CTA" reveal the
 * brief asks for is just three separate calls to this, each on its own
 * element group, triggered by the same scroll position.
 */
export function revealGroupOnScroll(
  trigger: Element,
  elements: Element[] | NodeListOf<Element>,
  options?: { stagger?: number }
): gsap.core.Tween[] {
  ensureGsapRegistered();
  const reduced = prefersReducedMotion();
  const list = Array.from(elements);
  if (list.length === 0) return [];

  const scrollTrigger = {
    trigger,
    start: SCENE_TRIGGER_START,
    toggleActions: "play none none reverse",
  } as const;

  if (reduced) {
    return list.map((el) => {
      gsap.set(el, { opacity: 1, y: 0 });
      return gsap.from(el, {
        opacity: 0,
        duration: REDUCED_MOTION_FADE_DURATION,
        ease: "power1.out",
        scrollTrigger,
      });
    });
  }

  return list.map((el, i) => {
    gsap.set(el, { opacity: 0, y: FADE_UP_TRAVEL_PX });
    return gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: FADE_UP_DURATION,
      delay: (options?.stagger ?? LINK_REVEAL_STAGGER) * i,
      ease: EASE_PRIMARY,
      scrollTrigger,
    });
  });
}

/**
 * Wires a contact link's hover/focus interaction: text lifts slightly, the
 * arrow glyph shifts right, and an underline draws left-to-right — one
 * paused timeline played forward on enter/focus and reversed on
 * leave/blur, matching the pattern used by Toolbox's tool-hover and Lab's
 * card-hover timelines. Returns a cleanup function. No-op under reduced
 * motion; the link keeps its CSS-only focus-visible outline instead (see
 * contact.styles.ts) — text movement is exactly what reduced motion asks
 * to remove, and the underline is available at rest on mobile/touch
 * anyway since hover-only state never carries information here.
 */
export function bindLinkHover(
  link: HTMLElement,
  parts: { arrow?: Element | null; underline?: Element | null }
): () => void {
  ensureGsapRegistered();
  if (prefersReducedMotion()) {
    return () => {};
  }

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: "power2.out", duration: LINK_HOVER_DURATION },
  });
  tl.to(link, { y: LINK_HOVER_LIFT_PX }, 0);
  if (parts.arrow) {
    tl.to(parts.arrow, { x: LINK_HOVER_ARROW_SHIFT_PX }, 0);
  }
  if (parts.underline) {
    gsap.set(parts.underline, { scaleX: 0, transformOrigin: "left center" });
    tl.to(parts.underline, { scaleX: 1 }, 0);
  }

  const onEnter = () => tl.play();
  const onLeave = () => tl.reverse();

  link.addEventListener("pointerenter", onEnter);
  link.addEventListener("pointerleave", onLeave);
  link.addEventListener("focus", onEnter);
  link.addEventListener("blur", onLeave);

  return () => {
    link.removeEventListener("pointerenter", onEnter);
    link.removeEventListener("pointerleave", onLeave);
    link.removeEventListener("focus", onEnter);
    link.removeEventListener("blur", onLeave);
    tl.kill();
  };
}