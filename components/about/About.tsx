"use client";

import { forwardRef, useEffect, useRef } from "react";
import { revealElementsIndividually, revealLinesOnScroll } from "@/lib/animations/about";
import Philosophy from "./Philosophy";
import Portrait from "./Portrait";
import Stats from "./Stats";
import { EDUCATION } from "./education.data";
import { aboutStyles } from "./about.styles";

/**
 * The complete About section: a sequence of independently-revealing scenes
 * (headline, identity, philosophy, portrait, quote, stats, transition) that
 * discover who I am as the visitor scrolls, in the spirit of an Apple
 * product page rather than a traditional About Me block.
 *
 * Every reveal is scroll-triggered and scoped to its own scene — nothing
 * animates until it's actually in view, so scenes never compete for
 * attention. Matches the same forwardRef<HTMLElement> contract the Hero's
 * nextSectionRef expects, so this drops in as a straight replacement for
 * the previous placeholder.
 */
const About = forwardRef<HTMLElement>(function About(_props, ref) {
  const rootRef = useRef<HTMLElement | null>(null);

  const setRootRef = (node: HTMLElement | null) => {
    rootRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const rolesRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLHeadingElement | null>(null);
  const quoteRef = useRef<HTMLParagraphElement | null>(null);
  const transitionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cleanups: Array<() => void> = [];

    if (headlineRef.current) {
      const split = revealLinesOnScroll(headlineRef.current);
      cleanups.push(() => split.revert());
    }

    if (rolesRef.current) {
      revealElementsIndividually([rolesRef.current]);
    }
    if (nameRef.current) {
      revealElementsIndividually([nameRef.current], { stagger: 0.1 });
    }

    if (quoteRef.current) {
      const split = revealLinesOnScroll(quoteRef.current);
      cleanups.push(() => split.revert());
    }

    if (transitionRef.current) {
      const children = Array.from(transitionRef.current.children);
      revealElementsIndividually(children, { stagger: 0.12 });
    }

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <section ref={setRootRef} id="about" className="ab-root" aria-label="About">
      {/* Scene 1 — single-sentence headline, masked line reveal */}
      <div className="ab-scene ab-headline-scene">
        <h2 ref={headlineRef} className="ab-headline">
          I build experiences. Not just applications.
        </h2>
      </div>

      {/* Scene 2 — identity */}
      <div className="ab-scene ab-identity-scene">
        <div ref={rolesRef} className="ab-identity-roles">
          <span>Software Engineer</span>
          <span className="ab-identity-dot" aria-hidden="true" />
          <span>AI Builder</span>
        </div>
        <h3 ref={nameRef} className="ab-identity-name">
          Jagan Kumar R
        </h3>

        <ul className="ab-identity-education">
          {EDUCATION.map((entry) => (
            <li key={entry.level} className="ab-identity-education-item">
              <span className="ab-identity-education-level">{entry.level}</span>
              <span className="ab-identity-education-program">{entry.program}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Scene 3 — philosophy */}
      <Philosophy />

      {/* Scene 4 — portrait */}
      <Portrait />

      {/* Scene 5 — builder mindset quote */}
      <div className="ab-scene ab-quote-scene">
        <p ref={quoteRef} className="ab-quote">
          I don&rsquo;t build projects to fill a portfolio. I build products to solve problems.
        </p>
      </div>

      {/* Scene 6 — stats */}
      <Stats />

      {/* Transition into Projects */}
      <div className="ab-scene ab-transition-scene">
        <div ref={transitionRef}>
          <p className="ab-transition-eyebrow">Enough about me.</p>
          <p className="ab-transition-line">Let&rsquo;s look at the work.</p>
        </div>
      </div>

      <style>{aboutStyles}</style>
    </section>
  );
});

export default About;