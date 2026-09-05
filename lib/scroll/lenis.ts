import Lenis from "lenis";
import { ensureGsapRegistered, gsap, ScrollTrigger } from "./gsap";

/**
 * Creates a Lenis instance and wires it to GSAP's ticker + ScrollTrigger so
 * smooth scroll and pinned/scrubbed animations stay perfectly in sync (both
 * driven by the same requestAnimationFrame loop, no double-rAF drift).
 *
 * Caller owns the returned instance's lifecycle — call `destroy()` to tear
 * everything down (removes the ticker callback and kills the Lenis
 * instance). Safe to call once per mounted provider.
 */
export function createSmoothScroll(): { lenis: Lenis; destroy: () => void } {
  ensureGsapRegistered();

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t: number) => 1 - Math.pow(1 - t, 3), // easeOutCubic — smooth but responsive
    smoothWheel: true,
    syncTouch: false, // keep native touch feel on mobile, avoid input lag
  });

  lenis.on("scroll", ScrollTrigger.update);

  const tick = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  const destroy = () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
  };

  return { lenis, destroy };
}