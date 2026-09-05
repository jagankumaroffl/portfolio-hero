"use client";

import { useEffect, useState } from "react";
import { NAV_COPY, NAV_LINKS, SITE } from "@/lib/constants";
import { ensureGsapRegistered, ScrollTrigger } from "@/lib/scroll/gsap";
import { prefersReducedMotion } from "@/lib/loader";
import JKMark from "./JKMark";

/**
 * Fixed top navigation: brand mark, link list, and "let's talk" CTA.
 *
 * Each link points at a real section id (#about, #work, #journey, #lab,
 * #contact) and relies on the existing shared Lenis instance's built-in
 * anchor interception for smooth scrolling — no second scroll library, no
 * custom onClick handler needed.
 *
 * A lightweight ScrollTrigger per section reports which one is currently
 * in view so the matching link can get a subtle accent underline. Triggers
 * only fire on section-boundary crossings (not every scroll frame), and
 * are skipped entirely under prefers-reduced-motion.
 */
export default function HeroNav() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    ensureGsapRegistered();

    const triggers = NAV_LINKS.map((link) => {
      const slug = link.toLowerCase();
      const el = document.getElementById(slug);
      if (!el) return null;

      return ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) setActiveSlug(slug);
        },
      });
    });

    return () => {
      triggers.forEach((trigger) => trigger?.kill());
    };
  }, []);

  return (
    <header className="gh-nav-wrap anim-nav">
      <nav className="gh-nav">
        <a href="#top" className="gh-brand" aria-label={SITE.name}>
          <JKMark className="gh-brand-mark" />
          <span className="gh-brand-name">{SITE.name}</span>
        </a>

        <ul className="gh-nav-links">
          {NAV_LINKS.map((link) => {
            const slug = link.toLowerCase();
            const isActive = activeSlug === slug;
            const linkClassName = isActive ? "is-active" : "";

            return (
              <li key={link}>
                <a href={`#${slug}`} className={linkClassName} aria-current={isActive}>
                  {link}
                </a>
              </li>
            );
          })}
        </ul>

        <a className="gh-cta" href={SITE.ctaLink} target="_blank" rel="noreferrer">
          {NAV_COPY.ctaLabel}
        </a>
      </nav>
    </header>
  );
}