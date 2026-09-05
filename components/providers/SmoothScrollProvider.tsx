"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type Lenis from "lenis";
import { createSmoothScroll } from "@/lib/scroll/lenis";
import { prefersReducedMotion } from "@/lib/loader";

const LenisContext = createContext<Lenis | null>(null);

/** Access the shared Lenis instance (null until the provider has mounted it). */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

type SmoothScrollProviderProps = {
  children: ReactNode;
  /** True while the loader is active — scrolling stays locked until this flips false. */
  locked: boolean;
};

/**
 * Mounts a single Lenis instance for the whole app and keeps it stopped
 * while `locked` is true (i.e. while the Loader is showing), starting it
 * the instant loading finishes. Cleans up the ticker + instance on unmount.
 *
 * Respects prefers-reduced-motion by skipping Lenis entirely and falling
 * back to native scrolling — smooth-scroll easing is itself a motion
 * effect some users want off.
 */
export default function SmoothScrollProvider({
  children,
  locked,
}: SmoothScrollProviderProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = prefersReducedMotion();
    if (reducedMotionRef.current) return;

    const { lenis: instance, destroy } = createSmoothScroll();
    instance.stop(); // stay locked until the loader tells us to start
    setLenis(instance);

    return () => {
      destroy();
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-scroll-locked",
      locked ? "true" : "false"
    );

    if (reducedMotionRef.current) {
      // Native scroll path: the CSS attribute above already locks scroll;
      // nothing else to drive.
      return;
    }
    if (!lenis) return;

    if (locked) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [locked, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}