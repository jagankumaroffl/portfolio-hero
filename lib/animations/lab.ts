import SplitType from "split-type";
import { ensureGsapRegistered, gsap, ScrollTrigger } from "@/lib/scroll/gsap";
import { prefersReducedMotion } from "@/lib/loader";
import {
  CARD_HOVER_DURATION,
  CARD_HOVER_LIFT_PX,
  CARD_HOVER_TITLE_SHIFT_PX,
  CARD_HOVER_VISUAL_SCALE,
  CARD_REVEAL_STAGGER,
  DETAIL_BACKDROP_DURATION,
  DETAIL_TRANSITION_DURATION,
  EASE_PRIMARY,
  FADE_UP_DURATION,
  FADE_UP_TRAVEL_PX,
  LINE_REVEAL_DURATION,
  LINE_REVEAL_STAGGER,
  LINE_REVEAL_START_Y_PERCENT,
  REDUCED_MOTION_FADE_DURATION,
  SCENE_TRIGGER_START,
} from "./labConstants";

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
 * statement lines and the "Let's Build Together" transition placeholder.
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
 * Reveals the experiment grid's cards with a short stagger as the grid
 * scrolls into view — one shared ScrollTrigger on the grid root rather
 * than one per card, since they enter the viewport together.
 */
export function revealGridOnScroll(
  root: Element,
  cards: Element[] | NodeListOf<Element>
): gsap.core.Tween[] {
  ensureGsapRegistered();
  const reduced = prefersReducedMotion();
  const list = Array.from(cards);
  if (list.length === 0) return [];

  const scrollTrigger = {
    trigger: root,
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
      delay: i * CARD_REVEAL_STAGGER,
      ease: EASE_PRIMARY,
      scrollTrigger,
    });
  });
}

/**
 * Wires an experiment card's hover/focus interaction: card lifts slightly,
 * its visual area scales up a touch, and its title nudges sideways — all
 * driven by one paused timeline played forward on enter/focus and reversed
 * on leave/blur, matching the pattern used for Toolbox's tool-hover
 * timeline. Returns a cleanup function. No-op under reduced motion; the
 * card keeps CSS-only border/opacity hover states instead (see
 * lab.styles.ts), since transform-based movement is what reduced motion
 * asks to remove.
 */
export function bindCardHover(
  card: HTMLElement,
  parts: { visual?: Element | null; title?: Element | null }
): () => void {
  ensureGsapRegistered();
  if (prefersReducedMotion()) {
    return () => {};
  }

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: "power2.out", duration: CARD_HOVER_DURATION },
  });
  tl.to(card, { y: CARD_HOVER_LIFT_PX }, 0);
  if (parts.visual) {
    tl.to(parts.visual, { scale: CARD_HOVER_VISUAL_SCALE }, 0);
  }
  if (parts.title) {
    tl.to(parts.title, { x: CARD_HOVER_TITLE_SHIFT_PX }, 0);
  }

  const onEnter = () => tl.play();
  const onLeave = () => tl.reverse();

  card.addEventListener("pointerenter", onEnter);
  card.addEventListener("pointerleave", onLeave);
  card.addEventListener("focus", onEnter);
  card.addEventListener("blur", onLeave);

  return () => {
    card.removeEventListener("pointerenter", onEnter);
    card.removeEventListener("pointerleave", onLeave);
    card.removeEventListener("focus", onEnter);
    card.removeEventListener("blur", onLeave);
    tl.kill();
  };
}

/**
 * Plays the expand-into-detail-view animation: backdrop fades in, the
 * detail panel scales/fades up from its resting state, content follows a
 * touch behind. Returns the GSAP timeline so the caller can `.reverse()`
 * it for the close animation and reuse the exact same tween list — that's
 * what guarantees close is a true mirror of open with no separate,
 * potentially-mismatched close timeline to keep in sync.
 */
export function playDetailOpen(parts: {
  backdrop: HTMLElement;
  panel: HTMLElement;
  content?: Element[] | NodeListOf<Element>;
}): gsap.core.Timeline {
  ensureGsapRegistered();
  const reduced = prefersReducedMotion();
  const tl = gsap.timeline({
    defaults: {
      ease: EASE_PRIMARY,
      duration: reduced ? REDUCED_MOTION_FADE_DURATION : DETAIL_TRANSITION_DURATION,
    },
  });

  gsap.set(parts.backdrop, { display: "flex" });

  if (reduced) {
    tl.fromTo(parts.backdrop, { opacity: 0 }, { opacity: 1 }, 0);
    tl.fromTo(parts.panel, { opacity: 0 }, { opacity: 1 }, 0);
    if (parts.content) {
      tl.fromTo(Array.from(parts.content), { opacity: 0 }, { opacity: 1 }, 0);
    }
    return tl;
  }

  tl.fromTo(
    parts.backdrop,
    { opacity: 0 },
    { opacity: 1, duration: DETAIL_BACKDROP_DURATION, ease: "power1.out" },
    0
  );
  tl.fromTo(parts.panel, { opacity: 0, scale: 0.96, y: 16 }, { opacity: 1, scale: 1, y: 0 }, 0.05);
  if (parts.content) {
    tl.fromTo(
      Array.from(parts.content),
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 },
      0.2
    );
  }

  return tl;
}

/** Hides the backdrop after a reverse-play close tween finishes. */
export function hideDetailBackdrop(backdrop: HTMLElement) {
  gsap.set(backdrop, { display: "none" });
}