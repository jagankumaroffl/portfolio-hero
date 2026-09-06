"use client";

import { useEffect, useState } from "react";
import { waitForPageReady } from "@/lib/loader";
import { ScrollTrigger } from "@/lib/scroll/gsap";

/**
 * Tracks real page readiness. Waits for actual load signals (see
 * lib/loader.ts) — never a fixed timer — so it stays true exactly as long
 * as the page needs.
 *
 * Scroll locking is NOT handled here: SmoothScrollProvider reads this same
 * signal and owns the Lenis stop()/start() lifecycle, so there is a single
 * source of truth for "is scrolling allowed" instead of two competing locks.
 *
 * const loading = useLoader();
 */
export function useLoader(): boolean {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    waitForPageReady().then(() => {
      if (cancelled) return;
      setLoading(false);

      // Every section's ScrollTrigger is created as soon as that section
      // mounts, which can happen well before fonts finish swapping in or
      // late-loading images settle their final layout — each of those can
      // reflow content below/around it. A trigger's percentage-based
      // `start`/`end` (e.g. "top 80%") is still computed from the actual
      // DOM box position at the moment it was created, so if that box
      // later shifts, the trigger doesn't move with it until something
      // tells ScrollTrigger to recalculate. Refreshing once, right as the
      // page becomes interactive and all of that settling has finished,
      // re-measures every trigger against final layout — this is standard
      // GSAP guidance for exactly this symptom ("content only reveals
      // after scrolling well past where it should"), and a harmless no-op
      // for any trigger whose position didn't actually move.
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return loading;
}