"use client";

import { useRef } from "react";
import { useHeroMaskReveal } from "@/lib/animations/useHeroMaskReveal";
import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";
import HeroNav from "./HeroNav";
import { heroStyles } from "./hero.styles";

/**
 * Full-viewport hero: portrait imagery with a cursor-driven organic
 * jelly-mass metaball reveal on hover-capable devices (see
 * useHeroMaskReveal + heroMaskGeometry.ts — a chain of irregular,
 * non-circular masses fused by a gooey SVG filter, where a follower only
 * becomes visible once genuinely stretched away from its parent),
 * decorative grid backdrop, nav, and headline/intro/tagline copy.
 *
 * The reveal is desktop-only (mouse/trackpad with a fine pointer).
 * useHeroMaskReveal's handlers are no-ops for any other pointer type, and
 * the hook's effect never attaches on a touch device or under reduced
 * motion, so nothing here drives the mask or interferes with scrolling on
 * a phone or touch tablet — the Hero just participates in normal document
 * flow.
 */
export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  const { onPointerEnter, onPointerMove, onPointerLeave } = useHeroMaskReveal(heroRef, pathRefs);

  return (
    <main
      ref={heroRef}
      className="gh-hero"
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <HeroImage pathRefs={pathRefs} />
      <HeroBackground />
      <HeroContent />
      <HeroNav />

      <style>{heroStyles}</style>
    </main>
  );
}