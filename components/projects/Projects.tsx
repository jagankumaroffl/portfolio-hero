"use client";

import { useEffect, useRef } from "react";
import {
  revealElementsIndividually,
  revealLinesOnScroll,
  scrubBackgroundOnScroll,
} from "@/lib/animations/projects";
import Project from "./Project";
import { PROJECTS } from "./projects.data";
import { projectsStyles } from "./projects.styles";

const BACKGROUND_FROM = "#f7f7f5"; // matches About's root background
const BACKGROUND_TO = "#0b0d10"; // matches the Loader's dark charcoal

function killTweens(tweens: gsap.core.Tween[]) {
  tweens.forEach((tween) => {
    tween.scrollTrigger?.kill();
    tween.kill();
  });
}

/**
 * The complete "Selected Work" section: heading + subtitle, three
 * independently-revealing project case studies, and a centered transition
 * statement that hands off into the Journey section.
 *
 * The section's background scrubs from About's light tone to the dark
 * charcoal tone used elsewhere (matching the Loader) across its own scroll
 * distance, so light -> dark reads as one continuous wash rather than a cut
 * at the section boundary. A CSS gradient on the root is always present as
 * the reduced-motion / pre-hydration fallback; JS scrubbing (when enabled)
 * overrides it via inline background-color once mounted.
 */
export default function Projects() {
  const rootRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const transitionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cleanups: Array<() => void> = [];

    if (headingRef.current) {
      const split = revealLinesOnScroll(headingRef.current);
      cleanups.push(() => split.revert());
    }
    if (subtitleRef.current) {
      const split = revealLinesOnScroll(subtitleRef.current);
      cleanups.push(() => split.revert());
    }

    if (transitionRef.current) {
      const children = Array.from(transitionRef.current.children);
      const tweens = revealElementsIndividually(children, { stagger: 0.12 });
      cleanups.push(() => killTweens(tweens));
    }

    const backgroundTrigger = scrubBackgroundOnScroll(root, BACKGROUND_FROM, BACKGROUND_TO);
    if (backgroundTrigger) {
      cleanups.push(() => backgroundTrigger.kill());
    }

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <section ref={rootRef} id="work" className="pw-root" aria-label="Selected Work">
      <div className="pw-heading-scene">
        <h2 ref={headingRef} className="pw-heading">
          Selected Work
        </h2>
        <p ref={subtitleRef} className="pw-subtitle">
          Projects that challenged me, made me grow, and shaped the way I build software.
        </p>
      </div>

      {PROJECTS.map((project, index) => (
        <Project key={project.id} project={project} index={index} />
      ))}

      <div className="pw-transition-scene">
        <div ref={transitionRef}>
          <p className="pw-transition-line">Every project taught me something.</p>
          <p className="pw-transition-line">The next one could be yours.</p>
        </div>
      </div>

      <style>{projectsStyles}</style>
    </section>
  );
}