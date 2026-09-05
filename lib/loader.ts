// Determines when the site is *actually* ready: document fonts loaded,
// window "load" fired (all images/scripts/stylesheets done), and every
// <img> currently in the DOM decoded. No artificial delay is added here —
// the loader stays alive for exactly as long as real loading takes.

/** Resolves once `document.fonts.ready` resolves, or immediately if unsupported. */
function waitForFonts(): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) {
    return Promise.resolve();
  }
  return document.fonts.ready.then(() => undefined).catch(() => undefined);
}

/** Resolves once the window "load" event has fired (or already has). */
function waitForWindowLoad(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (document.readyState === "complete") return Promise.resolve();
  return new Promise((resolve) => {
    window.addEventListener("load", () => resolve(), { once: true });
  });
}

/** Resolves once every <img> currently in the DOM has decoded (or errored). */
function waitForImages(): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  const images = Array.from(document.images);
  if (images.length === 0) return Promise.resolve();

  const pending = images
    .filter((img) => !img.complete)
    .map(
      (img) =>
        new Promise<void>((resolve) => {
          const done = () => resolve();
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
        })
    );

  return Promise.all(pending).then(() => undefined);
}

/**
 * Resolves when the page is genuinely ready to be shown. Runs all checks in
 * parallel — total wait is the slowest one, never an artificial sum.
 */
export function waitForPageReady(): Promise<void> {
  return Promise.all([waitForWindowLoad(), waitForFonts(), waitForImages()]).then(
    () => undefined
  );
}

/** True if the user has requested reduced motion at the OS/browser level. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * True only for devices that can actually hover with a precise pointer —
 * i.e. a real mouse/trackpad. False for touch (including large tablets
 * that would otherwise slip through a max-width check) and for any device
 * without a fine pointer. Used to gate the Hero's cursor-reveal effect,
 * which has no meaningful touch equivalent and must never fight native
 * touch scrolling.
 */
export function supportsHoverReveal(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

// Timing constants for the intro sequence (ms), kept out of components so
// nothing in the animation code is a bare magic number.
export const LOADER_TIMING = {
  /** Delay before the draw-in starts. */
  drawStartDelay: 250,
  /** Pause between outline finishing and fill starting. */
  outlineToFillPause: 200,
  /** Outline stroke-draw duration (s, GSAP unit). */
  drawDuration: 1.1,
  /** Fill fade-in duration (s). */
  fillDuration: 0.6,
  /** Soft glow fade-in duration (s). */
  glowDuration: 0.8,
  /** Reduced-motion fallback fade duration (s). */
  reducedMotionFadeDuration: 0.5,
  /** Idle breathing loop duration (s). */
  idleDuration: 2.5,
  /** Background fade-out duration on exit (s). */
  exitBackgroundDuration: 0.6,
  /** Logo hold time after background starts fading, before unmount (s). */
  exitLogoHold: 0.35,
} as const;