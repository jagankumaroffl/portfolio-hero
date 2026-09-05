import SplitType from "split-type";
import { ensureGsapRegistered, gsap, ScrollTrigger } from "@/lib/scroll/gsap";
import { prefersReducedMotion } from "@/lib/loader";
import {
  EASE_PRIMARY,
  FADE_UP_DURATION,
  FADE_UP_TRAVEL_PX,
  IMAGE_HOVER_BRIGHTNESS,
  IMAGE_HOVER_DURATION,
  IMAGE_HOVER_LIFT_PX,
  IMAGE_PARALLAX_TRAVEL_PX,
  IMAGE_SCALE_RANGE,
  LINE_REVEAL_DURATION,
  LINE_REVEAL_STAGGER,
  LINE_REVEAL_START_Y_PERCENT,
  PROJECT_REVEAL_STAGGER,
  REDUCED_MOTION_FADE_DURATION,
  SCENE_TRIGGER_START,
} from "./projectsConstants";

/**
 * Splits an element's text into lines and animates them upward from behind
 * a mask as the element scrolls into view. Used for the section heading and
 * subtitle. Returns the SplitType instance so the caller can `.revert()` it
 * on cleanup.
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
 * scroll into view, each with its own ScrollTrigger — used for the
 * transition statement's lines and the Journey placeholder title.
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
 * Reveals a single project's parts in a cascade — number, then screenshot,
 * then title/description, then tech stack, then buttons — each offset by
 * PROJECT_REVEAL_STAGGER so the project assembles itself rather than
 * fading in all at once. All parts share one ScrollTrigger tied to the
 * project root, so the whole cascade fires together as the project enters
 * view (not staggered by each part's own scroll position).
 */
export function revealProjectOnScroll(
  root: Element,
  parts: {
    number?: Element | null;
    image?: Element | null;
    title?: Element | null;
    description?: Element | null;
    stack?: Element | null;
    buttons?: Element | null;
  }
): gsap.core.Tween[] {
  ensureGsapRegistered();
  const reduced = prefersReducedMotion();

  const ordered = [
    parts.number,
    parts.image,
    parts.title,
    parts.description,
    parts.stack,
    parts.buttons,
  ].filter((el): el is Element => Boolean(el));

  if (ordered.length === 0) return [];

  const scrollTrigger = {
    trigger: root,
    start: SCENE_TRIGGER_START,
    toggleActions: "play none none reverse",
  } as const;

  if (reduced) {
    return ordered.map((el, i) => {
      gsap.set(el, { opacity: 1, y: 0 });
      return gsap.from(el, {
        opacity: 0,
        duration: REDUCED_MOTION_FADE_DURATION,
        delay: i * 0.05,
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
      delay: i * PROJECT_REVEAL_STAGGER,
      ease: EASE_PRIMARY,
      scrollTrigger,
    });
  });
}

/**
 * Subtle scroll-linked parallax + scale on a project screenshot — the image
 * drifts upward and scales very slightly as it moves through the viewport.
 * Transform only, no layout impact. Disabled (returns null) under reduced
 * motion.
 */
export function parallaxImageOnScroll(target: Element): ScrollTrigger | null {
  ensureGsapRegistered();
  if (prefersReducedMotion()) return null;

  const [scaleFrom, scaleTo] = IMAGE_SCALE_RANGE;
  gsap.set(target, { scale: scaleFrom, y: 0 });

  return ScrollTrigger.create({
    trigger: target,
    start: "top bottom",
    end: "bottom top",
    scrub: 1,
    onUpdate: (self) => {
      const scale = scaleFrom + (scaleTo - scaleFrom) * self.progress;
      const y = IMAGE_PARALLAX_TRAVEL_PX * self.progress;
      gsap.set(target, { scale, y });
    },
  });
}

/**
 * Wires the screenshot hover effect: brightness lift + tiny translateY +
 * soft shadow on enter, reverting on leave. Returns a cleanup function that
 * removes the listeners. No-op (but still returns a cleanup) under reduced
 * motion, since this is a visual nicety, not information.
 */
export function bindImageHover(target: HTMLElement): () => void {
  ensureGsapRegistered();
  const reduced = prefersReducedMotion();
  const [brightnessFrom, brightnessTo] = IMAGE_HOVER_BRIGHTNESS;

  if (reduced) {
    return () => {};
  }

  const tl = gsap.timeline({ paused: true }).to(target, {
    filter: `brightness(${brightnessTo})`,
    y: IMAGE_HOVER_LIFT_PX,
    boxShadow: "0 24px 48px -20px rgba(0,0,0,0.35)",
    duration: IMAGE_HOVER_DURATION,
    ease: "power2.out",
  });

  gsap.set(target, { filter: `brightness(${brightnessFrom})` });

  const onEnter = () => tl.play();
  const onLeave = () => tl.reverse();

  target.addEventListener("pointerenter", onEnter);
  target.addEventListener("pointerleave", onLeave);

  return () => {
    target.removeEventListener("pointerenter", onEnter);
    target.removeEventListener("pointerleave", onLeave);
    tl.kill();
  };
}

/**
 * Scrubs the section's background color from the light About tone to the
 * dark charcoal final tone across the section's own scroll distance, so the
 * light -> dark shift reads as one continuous wash instead of a cut at the
 * section boundary. Disabled under reduced motion (falls back to the CSS
 * gradient already set on the root — no JS scroll-linking).
 */
export function scrubBackgroundOnScroll(
  root: HTMLElement,
  fromColor: string,
  toColor: string
): ScrollTrigger | null {
  ensureGsapRegistered();
  if (prefersReducedMotion()) return null;

  return ScrollTrigger.create({
    trigger: root,
    start: "top bottom",
    end: "top top",
    scrub: 1,
    onUpdate: (self) => {
      gsap.set(root, {
        backgroundColor: gsap.utils.interpolate(fromColor, toColor, self.progress),
      });
    },
  });
}