"use client";

import { useEffect, useState } from "react";
import { waitForPageReady } from "@/lib/loader";

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
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return loading;
}