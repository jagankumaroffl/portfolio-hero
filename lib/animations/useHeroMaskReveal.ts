import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { gsap, ensureGsapRegistered } from "@/lib/scroll/gsap";
import { prefersReducedMotion, supportsHoverReveal } from "@/lib/loader";
import {
  buildHeroMassPath,
  createHeroMaskState,
  isHeroMaskCollapsed,
  seedHeroMaskEntry,
  stepHeroMaskState,
  type HeroMaskState,
} from "./heroMaskGeometry";
import { HERO_MASK_MAX_DT_SECONDS } from "./heroMaskConstants";

type HeroMaskRevealHandlers = {
  onPointerEnter: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerLeave: (e: React.PointerEvent<HTMLElement>) => void;
};

/**
 * Drives the Hero's organic cursor-mask reveal: a short chain of
 * irregular jelly-shaped SVG `<path>` masses (see heroMaskGeometry.ts)
 * fused by a gooey filter that CSS `mask-image` uses to reveal the
 * alternate portrait through the base one. Runs off GSAP's ticker — the
 * project's existing animation heartbeat — rather than a second
 * independent requestAnimationFrame loop, and writes each mass's `d`
 * attribute directly via refs every tick, so nothing here triggers a
 * React re-render.
 *
 * Desktop-only (hover-capable, fine pointer) and disabled under
 * `prefers-reduced-motion`, matching every other pointer-driven Hero
 * behavior in this codebase — under either condition the hook no-ops
 * entirely and every mass stays collapsed to a point, so the base
 * portrait is the only thing ever visible.
 */
export function useHeroMaskReveal(
  rootRef: RefObject<HTMLElement | null>,
  pathRefs: RefObject<(SVGPathElement | null)[]>
): HeroMaskRevealHandlers {
  const stateRef = useRef<HeroMaskState | null>(null);
  const enabledRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    const paths = pathRefs.current;
    if (!root || !paths || paths.length === 0) return;
    if (!supportsHoverReveal() || prefersReducedMotion()) return;

    ensureGsapRegistered();
    enabledRef.current = true;

    const state = createHeroMaskState();
    stateRef.current = state;

    let lastTime = gsap.ticker.time;

    const tick = () => {
      const now = gsap.ticker.time;
      const dt = Math.min(Math.max(now - lastTime, 0), HERO_MASK_MAX_DT_SECONDS);
      lastTime = now;

      stepHeroMaskState(state, dt);

      for (let i = 0; i < state.masses.length; i += 1) {
        const pathEl = paths[i];
        if (!pathEl) continue;
        pathEl.setAttribute("d", buildHeroMassPath(state, i));
      }
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      stateRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootRef, pathRefs]);

  const toLocalPoint = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerEnter = (e: React.PointerEvent<HTMLElement>) => {
    if (!enabledRef.current || e.pointerType !== "mouse") return;
    const state = stateRef.current;
    if (!state) return;
    const { x, y } = toLocalPoint(e);
    if (isHeroMaskCollapsed(state)) {
      seedHeroMaskEntry(state, x, y);
    }
    state.active = true;
    state.targetX = x;
    state.targetY = y;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!enabledRef.current || e.pointerType !== "mouse") return;
    const state = stateRef.current;
    if (!state) return;
    const { x, y } = toLocalPoint(e);
    // Movement resuming after the mass fully dissipated should read as
    // fluid reforming near the new point, not a leftover collapsed mass
    // sliding in from wherever it last was.
    if (isHeroMaskCollapsed(state)) {
      seedHeroMaskEntry(state, x, y);
    }
    state.active = true;
    state.targetX = x;
    state.targetY = y;
  };

  const onPointerLeave = (e: React.PointerEvent<HTMLElement>) => {
    if (!enabledRef.current || e.pointerType !== "mouse") return;
    const state = stateRef.current;
    if (!state) return;
    // Freeze the target at the last known point and let the dissipation
    // timer (see stepHeroMaskState) fast-forward toward zero — the mass
    // eases away rather than sliding somewhere unrelated on the way out.
    state.active = false;
  };

  return { onPointerEnter, onPointerMove, onPointerLeave };
}