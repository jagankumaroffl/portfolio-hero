"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLoader } from "@/hooks/useLoader";

/**
 * JKLoader
 * 
 * yellow green -> #9dcd01
 * black -> #101010
 *
 * Full-screen portfolio preloader, rebuilt from the reference video's
 * actual physics:
 *
 *   - Each letter is ONE filled vector shape (not multiple fragments),
 *     traced from the reference footage and corner-rounded to match the
 *     source mark's soft internal bends while keeping its sharp tips.
 *   - Each letter is revealed by ONE continuous stroke growing along its
 *     own centerline (a classic mask "draw-on" technique: an animated
 *     stroke-dashoffset path acts as a mask over the filled shape), which
 *     is what makes the reference draw so smoothly in a single unbroken
 *     motion rather than popping in as separate pieces.
 *   - Deconstruction is the same motion in reverse: the stroke retracts
 *     back toward its own start point, so the part drawn last (K, then
 *     J's hook) disappears first and the part drawn first (J's top bar)
 *     is the last thing on screen before the loop resets - exactly the
 *     order visible in the reference video.
 *
 * Two intentional deviations from the reference, per spec:
 *   1. The mark is rendered smaller (~80% of the reference scale).
 *   2. The loading bars under the mark are removed entirely.
 *
 * ---------------------------------------------------------------------
 * Integration into the site's loading lifecycle (added on top of the
 * supplied animation — the animation itself, SVG geometry, and keyframes
 * below are unmodified):
 *
 * The draw/hold/retract/reset motion above loops forever on its own and
 * has no built-in "finished" state to unmount on, so real page readiness
 * (tracked by useLoader()/waitForPageReady(), same as before) is layered
 * on top rather than baked into the keyframes:
 *
 *   - `loading` (prop, or useLoader() internally if omitted — same
 *     fallback API the previous Loader had) keeps the mark looping for
 *     as long as the page genuinely isn't ready.
 *   - Once `loading` flips false, the loop is not cut off mid-stroke.
 *     Exit waits for the animation's own natural loop boundary — the
 *     `animationiteration` event on one of the stroke paths, which fires
 *     exactly when a cycle completes and the next one restarts — the
 *     same "tie exit to a natural cycle boundary rather than an
 *     arbitrary timer" approach already used for this site's video
 *     loader. Only then does the whole loader fade out (opacity
 *     transition, never a hard display:none) and unmount.
 *   - Under prefers-reduced-motion the keyframes are disabled entirely
 *     (see the `@media (prefers-reduced-motion: reduce)` block below,
 *     unchanged from the supplied file), so no `animationiteration`
 *     event will ever fire; that case exits immediately once `loading`
 *     is false instead of waiting for a boundary that will never come.
 *
 * Scroll locking is untouched: SmoothScrollProvider already reads the
 * same `loading` value independently for its Lenis stop()/start()
 * lifecycle, so nothing here needs to know about Lenis at all.
 * 
 * 
 * 
.jk-loader__mark {
  width: clamp(108px, 13vw, 188px);
  height: auto;
  display: block;
  overflow: visible;
}
 */

const CYCLE_SECONDS = 1.4;
const FADE_MS = 400;

const styles = `
.jk-loader {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #101010;
  overflow: hidden;
  z-index: 9999;
  opacity: 1;
  transition: opacity ${FADE_MS}ms ease;
}

.jk-loader--exiting {
  opacity: 0;
}


.jk-loader__mark {
  width: 3.52vw;
  height: 6.63vh;
  display: block;
  overflow: visible;
}

@media (max-width: 767px) {
  /* On desktop's wide/short viewports, an independent vw width + vh
     height happen to land close enough to this mark's real aspect ratio
     (viewBox 320x230) that the mismatch isn't noticeable. On mobile's
     narrow/tall viewports the same formula produces wildly different
     numbers from two unrelated axes - a few px wide by tens of px tall -
     forcing the SVG into a thin, stretched sliver instead of its actual
     letterform, and shrinking it near the point of being unreadable.
     Sizing from width alone (with height: auto deriving from the SVG's
     own viewBox) keeps the correct proportions at any size. Scoped to
     mobile only so desktop's current sizing is untouched. */
  .jk-loader__mark {
    width: clamp(64px, 22vw, 120px);
    height: auto;
  }
}

.jk-loader__stroke {
  will-change: stroke-dashoffset;
  animation-duration: ${CYCLE_SECONDS}s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

.jk-loader__stroke--j {
  animation-name: jkDrawJ;
}

.jk-loader__stroke--k {
  animation-name: jkDrawK;
}

.jk-loader__sparkle {
  position: absolute;
  right: 8%;
  bottom: 12%;
  width: clamp(10px, 1.4vw, 18px);
  height: auto;
  fill: #ffffff;
  opacity: 0.92;
}

/* J starts drawing first (its stroke begins at the top bar), completes
   quickly, holds for 0.5s, then retracts back toward that same starting
   point - so the bar is the last visible fragment, matching the
   reference. Draw speed mirrors the retract speed (both fast, mechanical
   snaps); only the hold in the middle is a full pause. */
@keyframes jkDrawJ {
  0%,
  5% {
    stroke-dashoffset: 1;
  }
  26% {
    stroke-dashoffset: 0;
  }
  77% {
    stroke-dashoffset: 0;
  }
  98% {
    stroke-dashoffset: 1;
  }
  100% {
    stroke-dashoffset: 1;
  }
}

/* K begins while J is still finishing (matching the reference overlap),
   holds, then retracts and fully disappears before J starts retracting. */
@keyframes jkDrawK {
  0%,
  19% {
    stroke-dashoffset: 1;
  }
  33% {
    stroke-dashoffset: 0;
  }
  62% {
    stroke-dashoffset: 0;
  }
  77% {
    stroke-dashoffset: 1;
  }
  100% {
    stroke-dashoffset: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .jk-loader__stroke {
    animation: none !important;
    stroke-dashoffset: 0 !important;
  }
}
`;

type LoaderProps = {
  /**
   * Optional externally-tracked loading state. When provided, this is used
   * instead of calling useLoader() internally — lets a parent (e.g. the
   * page root) share one readiness check with SmoothScrollProvider instead
   * of running waitForPageReady() twice. Falls back to its own useLoader()
   * call if omitted, so <Loader /> still works standalone.
   */
  loading?: boolean;
  /** Optional extra class applied to the fixed full-screen root. */
  className?: string;
};

export default function Loader({ loading: loadingProp, className }: LoaderProps = {}) {
  const internalLoading = useLoader();
  const loading = loadingProp ?? internalLoading;

  const [exiting, setExiting] = useState(false);
  const [removed, setRemoved] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const jStrokeRef = useRef<SVGPathElement | null>(null);
  const exitRequested = useRef(false);
  const unmounted = useRef(false);

  // Begin the fade-out + eventual unmount. Called either immediately
  // (reduced motion, where the loop keyframes never run) or from the
  // animationiteration listener below (normal motion, at a clean loop
  // boundary).
  function beginExit() {
    if (unmounted.current) return;
    setExiting(true);
    window.setTimeout(() => {
      if (!unmounted.current) setRemoved(true);
    }, FADE_MS);
  }

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      exitRequested.current = true;

      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        // The draw/retract keyframes are disabled under reduced motion, so
        // there is no loop boundary to wait for — exit right away.
        beginExit();
        return;
      }

      const stroke = jStrokeRef.current;
      if (!stroke) {
        beginExit();
        return;
      }

      const onIteration = () => {
        if (exitRequested.current) beginExit();
      };
      stroke.addEventListener("animationiteration", onIteration);

      return () => {
        stroke.removeEventListener("animationiteration", onIteration);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  if (removed) return null;

  return (
    <div
      ref={rootRef}
      className={`jk-loader${exiting ? " jk-loader--exiting" : ""}${className ? ` ${className}` : ""}`}
      role="status"
      aria-live="polite"
      aria-busy={loading}
    >
      {/*
        Rendered directly in JSX (same pattern as Hero's <style>{heroStyles}</style>)
        instead of injected via a useEffect + document.createElement side
        effect. That side-effect approach only ran after the component
        mounted client-side, leaving a real gap - before it ran, this div
        had none of the rules below applied: no `position: fixed`/`inset:0`
        (so it sat in normal document flow, sized to its own content,
        instead of covering the screen), no black background, no flex
        centering, and the raw unmasked J/K stroke paths visible at full
        opacity (since the mask-driven "start collapsed" keyframes hadn't
        applied either). On fast desktop hydration that gap is a sub-frame
        flicker, invisible in practice. On slower mobile hydration it's a
        real, visible flash matching exactly what gets reported here: odd
        unmasked letter shapes, the Hero peeking through below an
        undersized loader box, content appearing off-center. A plain
        <style> element in the render output is part of the server-rendered
        HTML for the very first paint, on every device — no gap to see.
      */}
      <style>{styles}</style>

      <svg
        className="jk-loader__mark"
        viewBox="0 0 320 230"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Each mask is ONE continuous stroke following the letter's own
              centerline. Animating its dashoffset "draws" the whole letter
              in a single unbroken motion, then retracts it the same way. */}
          <mask id="jk-loader-mask-j" maskUnits="userSpaceOnUse">
            <path
              ref={jStrokeRef}
              className="jk-loader__stroke jk-loader__stroke--j"
              d="M77,51 L89,47 L101,41 L113,37 L125,36 L137,36 L149,37 L161,37
                 L162,49 L160,61 L158,73 L154,85 L150,97 L145,109 L141,121 L137,133
                 L133,145 L129,157 L125,169 L120,181 L116,193 L104,199 L92,200
                 L80,200 L68,200 L56,200 L44,200 L39,191 L40,179 L43,167 L52,155
                 L64,146 L65,145"
              fill="none"
              stroke="#ffffff"
              strokeWidth="62"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="1"
            />
          </mask>
          <mask id="jk-loader-mask-k" maskUnits="userSpaceOnUse">
            <path
              className="jk-loader__stroke jk-loader__stroke--k"
              d="M302,22 L295,24 L288,27 L281,29 L274,31 L267,37 L261,44 L254,51
                 L248,58 L242,65 L235,72 L229,79 L223,86 L216,93 L210,100 L207,107
                 L204,114 L206,121 L207,128 L210,135 L213,142 L216,149 L219,156
                 L222,163 L225,170 L228,177 L232,184 L235,191 L240,197 L247,203
                 L254,209 L261,215"
              fill="none"
              stroke="#ffffff"
              strokeWidth="56"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="1"
            />
          </mask>
        </defs>

        {/* J: a single accurate, corner-rounded silhouette, revealed by
            jk-loader-mask-j. */}
        <path
          fill="#9dcd01"
          mask="url(#jk-loader-mask-j)"
          d="M183.6,30.8 Q182.0,24.0 175.0,23.8 L107.0,22.2 Q100.0,22.0 95.5,27.4
             L80.5,45.6 Q76.0,51.0 83.0,51.3 L140.0,53.7 Q147.0,54.0 144.8,60.6
             L107.4,173.8 Q106.0,178.0 102.8,181.2 L102.2,181.8 Q99.0,185.0 94.5,185.0
             L60.9,185.0 Q58.0,185.0 56.2,182.8 L55.8,182.2 Q54.0,180.0 54.9,177.3
             L63.7,151.6 Q66.0,145.0 59.0,145.6 L49.0,146.4 Q42.0,147.0 36.6,151.5
             L35.4,152.5 Q30.0,157.0 27.7,163.6 L18.3,191.4 Q16.0,198.0 18.2,204.6
             L18.8,206.4 Q21.0,213.0 28.0,213.2 L105.4,214.9 Q112.0,215.0 117.8,211.8
             L119.2,211.2 Q125.0,208.0 127.3,201.8 L183.6,47.6 Q186.0,41.0 184.4,34.2
             L183.6,30.8 Z"
        />

        {/* K: a single accurate, corner-rounded silhouette, revealed by
            jk-loader-mask-k. */}
        <path
          fill="#9dcd01"
          mask="url(#jk-loader-mask-k)"
          d="M297.3,27.1 Q302.0,22.0 295.0,22.0 L266.6,22.0 Q263.0,22.0 259.9,23.8
             L259.1,24.2 Q256.0,26.0 253.6,28.7 L178.0,114.4 Q174.0,119.0 172.2,124.8
             L171.8,126.2 Q170.0,132.0 176.1,132.0 L186.1,132.0 Q189.0,132.0 191.2,133.8
             L191.8,134.2 Q194.0,136.0 195.2,138.6 L222.2,199.6 Q225.0,206.0 231.8,207.8
             L256.2,214.2 Q263.0,216.0 260.3,209.6 L221.7,118.4 Q219.0,112.0 223.7,106.9
             L297.3,27.1 Z"
        />
      </svg>

      <svg
        className="jk-loader__sparkle"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 0 L14.4 9.6 L24 12 L14.4 14.4 L12 24 L9.6 14.4 L0 12 L9.6 9.6 Z" />
      </svg>

      <span
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        Loading
      </span>
    </div>
  );
}