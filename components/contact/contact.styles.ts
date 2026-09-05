// Contact section styles. Scoped entirely under the `.ct-` prefix so
// nothing collides with any other section's classes. Uses the same design
// tokens already defined in globals.css (--font-display, --font-mono,
// --ease-primary) — no new global tokens. Continues the dark charcoal
// tone (#0b0d10) established by Journey/Toolbox/Lab, but deliberately
// calmer: no background grid, no borders-everywhere — just large
// whitespace and restrained typography, per the brief's "the website
// should slow down here". Accent is scoped locally (--ct-accent) matching
// the --tb-accent / --lb-accent pattern, and used in exactly two places:
// the "Let's build it." line and the availability dot.
export const contactStyles = `
  .ct-root {
    position: relative;
    background: #0b0d10;
    color: #f5f7fa;
    --ct-accent: var(--accent);
  }

  .ct-root ::selection {
    background: var(--ct-accent);
    color: #0b0d10;
  }

  .ct-root ::-moz-selection {
    background: var(--ct-accent);
    color: #0b0d10;
  }

  .ct-intro {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: clamp(3rem, 8vw, 6rem);
    padding: clamp(6rem, 14vw, 10rem) max(5.6vw, 1.5rem) clamp(4rem, 8vw, 6rem);
  }

  .ct-heading {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    opacity: 0.5;
  }

  .ct-statement {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .ct-statement-line {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(2.4rem, 7vw, 5.5rem);
    line-height: 1.05;
    letter-spacing: -0.03em;
  }

  .ct-statement-line:first-child {
    opacity: 0.6;
  }

  .ct-statement-accent {
    color: var(--ct-accent);
  }

  .ct-statement-line span {
    display: block;
  }

  /* -------------------------------------------------- */
  /* Links                                                */
  /* -------------------------------------------------- */

  .ct-links {
    list-style: none;
    margin: 0 auto;
    padding: 0 max(5.6vw, 1.5rem);
    max-width: 40rem;
    display: flex;
    flex-direction: column;
  }

  .ct-links-item {
    border-top: 1px solid rgba(245, 247, 250, 0.12);
  }

  .ct-links-item:last-child {
    border-bottom: 1px solid rgba(245, 247, 250, 0.12);
  }

  .ct-link {
    position: relative;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.5rem 0.25rem;
    min-height: 44px;
    color: inherit;
    text-decoration: none;
  }

  .ct-link-label {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(1.3rem, 2.4vw, 1.8rem);
    letter-spacing: -0.01em;
  }

  .ct-link-action {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--font-mono);
    font-size: 0.85rem;
    letter-spacing: 0.02em;
    opacity: 0.55;
  }

  .ct-link-arrow {
    display: inline-block;
  }

  .ct-link-underline {
    position: absolute;
    left: 0.25rem;
    right: 0.25rem;
    bottom: 0;
    height: 1px;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: left center;
  }

  .ct-link:focus-visible {
    outline: 2px solid var(--ct-accent);
    outline-offset: 4px;
    border-radius: 2px;
  }

  /* -------------------------------------------------- */
  /* Availability                                         */
  /* -------------------------------------------------- */

  .ct-availability {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.65rem;
    text-align: center;
    padding: clamp(3.5rem, 7vw, 5rem) max(5.6vw, 1.5rem) 0;
  }

  .ct-availability-status {
    margin: 0;
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    letter-spacing: 0.04em;
    opacity: 0.7;
  }

  .ct-availability-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--ct-accent);
    animation: ct-pulse 2.4s ease-in-out infinite;
  }

  @keyframes ct-pulse {
    0%, 100% {
      opacity: 0.55;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.3);
    }
  }

  .ct-availability-roles {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    opacity: 0.4;
  }

  .ct-availability-roles li {
    display: inline-flex;
  }

  .ct-availability-roles li:not(:last-child)::after {
    content: "/";
    margin-left: 0.75rem;
    opacity: 0.6;
  }

  /* -------------------------------------------------- */
  /* CTA                                                  */
  /* -------------------------------------------------- */

  .ct-cta-scene {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(3.5rem, 8vw, 6rem) max(5.6vw, 1.5rem) clamp(6rem, 12vw, 9rem);
  }

  .ct-cta {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    min-height: 44px;
    padding: 0.9rem 1.75rem;
    border: 1px solid rgba(245, 247, 250, 0.3);
    border-radius: 999px;
    color: inherit;
    text-decoration: none;
    font-family: var(--font-display);
    font-size: clamp(1rem, 1.6vw, 1.15rem);
    letter-spacing: -0.005em;
    transition: border-color 0.4s var(--ease-primary), background-color 0.4s var(--ease-primary);
  }

  .ct-cta:hover,
  .ct-cta:focus-visible {
    border-color: rgba(245, 247, 250, 0.6);
    background: rgba(245, 247, 250, 0.05);
  }

  .ct-cta:focus-visible {
    outline: 2px solid var(--ct-accent);
    outline-offset: 4px;
  }

  .ct-cta-arrow {
    transition: transform 0.4s var(--ease-primary);
  }

  .ct-cta:hover .ct-cta-arrow,
  .ct-cta:focus-visible .ct-cta-arrow {
    transform: translateX(4px);
  }

  /* -------------------------------------------------- */
  /* Tablet                                               */
  /* -------------------------------------------------- */

  @media (max-width: 1023px) {
    .ct-links {
      max-width: 34rem;
    }
  }

  /* -------------------------------------------------- */
  /* Mobile                                               */
  /* -------------------------------------------------- */

  @media (max-width: 767px) {
    .ct-intro {
      gap: 2.5rem;
      padding: 5rem 1.25rem 3rem;
    }

    .ct-links {
      padding: 0 1.25rem;
    }

    .ct-link {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.35rem;
      padding: 1.25rem 0.25rem;
    }

    .ct-availability {
      padding: 3rem 1.25rem 0;
    }

    .ct-cta-scene {
      padding: 3rem 1.25rem 5rem;
    }

    .ct-cta {
      width: 100%;
      justify-content: center;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ct-availability-dot {
      animation: none;
      opacity: 0.85;
    }

    .ct-cta {
      transition: none;
    }

    .ct-cta-arrow {
      transition: none;
    }
  }
`;