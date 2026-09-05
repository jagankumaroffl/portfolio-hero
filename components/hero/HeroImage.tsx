import type { RefObject } from "react";
import {
  HERO_MASK_GOOEY_BLUR_STD_DEVIATION,
  HERO_MASK_GOOEY_MATRIX_INTERCEPT,
  HERO_MASK_GOOEY_MATRIX_SLOPE,
  HERO_MASK_MASS_COUNT,
} from "@/lib/animations/heroMaskConstants";

type HeroImageProps = {
  pathRefs: RefObject<(SVGPathElement | null)[]>;
};

/**
 * Base portrait, alternate ("reveal") portrait, and the hidden SVG mask
 * definition that reveals the latter through the former: a short chain of
 * irregular jelly-shaped `<path>` masses (see heroMaskGeometry.ts /
 * useHeroMaskReveal.ts) fused into one organic shape by a gooey filter.
 * Each mass's outline is built from large, low-frequency angular
 * deformation rather than being a circle, and a follower mass only grows
 * visible when it's stretched a meaningful distance from the mass it's
 * chasing — this combination is what makes the reveal read as one liquid
 * mass that occasionally divides, rather than a circle with a trail of
 * smaller circles behind it.
 *
 * Every path starts collapsed to a single point ("M 0 0 Z"), so the
 * reveal layer is fully hidden by default — before hydration, under
 * reduced motion, or on touch devices where useHeroMaskReveal never
 * attaches — with no failure mode that could leave the wrong layer
 * showing. Once mounted, useHeroMaskReveal writes a new `d` onto these
 * same path elements every frame directly via refs, so none of this
 * re-renders on pointer movement.
 *
 * The gooey filter itself (blur, then a steep alpha threshold) is
 * unchanged from the previous pass — that edge treatment was already
 * correct; only the shapes it's fusing changed from circles to irregular
 * outlines.
 *
 * The mask's `maskContentUnits="userSpaceOnUse"` means path coordinates
 * are plain CSS pixels relative to `.gh-reveal`'s own box — exactly the
 * coordinate space useHeroMaskReveal computes pointer positions in, so no
 * extra scaling/normalization is needed between the two.
 */
export default function HeroImage({ pathRefs }: HeroImageProps) {
  return (
    <>
      <div className="gh-layer gh-base anim-portrait" aria-hidden="true" />
      <div className="gh-layer gh-reveal" aria-hidden="true" />

      <svg width="0" height="0" className="gh-mask-defs" aria-hidden="true" focusable="false">
        <defs>
          {/*
            The filter region (x/y/width/height) only needs enough margin
            beyond each mass's own bounding box to hold the blur's actual
            visible spread — a Gaussian blur's contribution is negligible
            past roughly 3x its stdDeviation (9px here, so ~27px), and the
            feComponentTransfer threshold right after it clips off almost
            everything below full alpha anyway. 150%/-25% margin is already
            several times that reach. The browser must rasterize this
            filter region on every frame this mask's geometry changes (see
            useHeroMaskReveal.ts), so a tighter, correctly-sized region
            meaningfully cuts per-frame GPU/CPU work with zero visible
            difference — anything the previous, much larger 220%/-60%
            region added beyond this was already computing blur output for
            pixels that were fully transparent both before and after.
          */}
          <filter
            id="gh-hero-gooey"
            x="-25%"
            y="-25%"
            width="150%"
            height="150%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation={HERO_MASK_GOOEY_BLUR_STD_DEVIATION} result="blurred" />
            <feComponentTransfer in="blurred">
              <feFuncA
                type="linear"
                slope={HERO_MASK_GOOEY_MATRIX_SLOPE}
                intercept={HERO_MASK_GOOEY_MATRIX_INTERCEPT}
              />
            </feComponentTransfer>
          </filter>

          <mask id="gh-hero-mask" maskContentUnits="userSpaceOnUse">
            <g filter="url(#gh-hero-gooey)" fill="#fff">
              {Array.from({ length: HERO_MASK_MASS_COUNT }, (_, i) => (
                <path
                  key={i}
                  ref={(el) => {
                    pathRefs.current[i] = el;
                  }}
                  d="M 0 0 Z"
                />
              ))}
            </g>
          </mask>
        </defs>
      </svg>
    </>
  );
}