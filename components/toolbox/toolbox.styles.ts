// Toolbox section styles. Scoped entirely under the `.tb-` prefix so
// nothing collides with Hero's `.gh-`, About's `.ab-`, Projects' `.pw-`, or
// Journey's `.jy-` classes. Uses the same design tokens already defined in
// globals.css (--font-display, --font-mono, --ease-primary) — no new
// global tokens. Continues Journey's dark charcoal tone (#0b0d10) so the
// section reads as one continuous scene rather than a cut. The accent used
// for "used in a project" indicators is scoped locally (--tb-accent) the
// same way Journey scopes --jy-accent, rather than adding a global token.
export const toolboxStyles = `
  .tb-root {
    position: relative;
    background: #0b0d10;
    color: #f5f7fa;
    --tb-accent: var(--accent);
  }

  .tb-root ::selection {
    background: var(--tb-accent);
    color: #0b0d10;
  }

  .tb-root ::-moz-selection {
    background: var(--tb-accent);
    color: #0b0d10;
  }

  .tb-intro-scene {
    min-height: 55vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 0.25rem;
    padding: 8rem max(5.6vw, 2rem) 4rem;
  }

  .tb-intro-line {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(2rem, 4.6vw, 3.6rem);
    line-height: 1.15;
    letter-spacing: -0.02em;
  }

  .tb-intro-line:last-child {
    opacity: 0.6;
  }

  .tb-intro-line span {
    display: block;
  }

  /* -------------------------------------------------- */
  /* Section title                                        */
  /* -------------------------------------------------- */

  .tb-heading-scene {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.25rem;
    padding: 2rem max(5.6vw, 2rem) 6rem;
  }

  .tb-heading {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(2.4rem, 5.5vw, 4.5rem);
    line-height: 1.05;
    letter-spacing: -0.03em;
  }

  .tb-subtitle {
    margin: 0;
    max-width: 30rem;
    font-family: var(--font-display);
    font-size: clamp(1rem, 1.6vw, 1.15rem);
    line-height: 1.55;
    opacity: 0.65;
  }

  /* -------------------------------------------------- */
  /* Categories                                           */
  /* -------------------------------------------------- */

  .tb-categories {
    display: flex;
    flex-direction: column;
    max-width: 74rem;
    margin: 0 auto;
    padding: 0 max(5.6vw, 2rem) 6rem;
  }

  .tb-category {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
    gap: clamp(2rem, 5vw, 5rem);
    align-items: baseline;
    padding: clamp(3rem, 6vw, 5rem) 0;
    border-top: 1px solid rgba(245, 247, 250, 0.12);
  }

  .tb-category:first-child {
    border-top: 1px solid rgba(245, 247, 250, 0.12);
  }

  .tb-category-heading {
    display: flex;
    align-items: baseline;
    gap: 1rem;
  }

  .tb-category-number {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    letter-spacing: 0.06em;
    opacity: 0.45;
  }

  .tb-category-title {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(1.5rem, 2.6vw, 2.2rem);
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  .tb-category-tools {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 0.5rem 2.5rem;
  }

  /* -------------------------------------------------- */
  /* Tool items                                           */
  /* -------------------------------------------------- */

  .tb-tool {
    position: relative;
    display: inline-flex;
  }

  .tb-tool-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    padding: 0.2rem 0;
    margin: 0;
    cursor: pointer;
    font-family: var(--font-display);
    font-size: clamp(1.05rem, 1.6vw, 1.3rem);
    line-height: 1.3;
    color: #f5f7fa;
    opacity: 0.62;
    transition: opacity 0.3s var(--ease-primary);
  }

  .tb-tool-button:hover,
  .tb-tool-button:focus-visible {
    opacity: 1;
  }

  .tb-tool-button:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 4px;
    border-radius: 2px;
  }

  .tb-tool-name {
    position: relative;
  }

  .tb-tool-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--tb-accent);
    flex-shrink: 0;
  }

  .tb-tool-underline {
    position: absolute;
    left: 0;
    bottom: -0.05rem;
    width: 100%;
    height: 1px;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: left center;
  }

  .tb-tool-usage {
    position: absolute;
    left: 0;
    bottom: calc(100% + 0.5rem);
    white-space: nowrap;
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.02em;
    color: #0b0d10;
    background: var(--tb-accent);
    padding: 0.3rem 0.55rem;
    border-radius: 4px;
    opacity: 0;
    pointer-events: none;
    transform: translateY(4px);
    transition: opacity 0.25s var(--ease-primary), transform 0.25s var(--ease-primary);
    z-index: 1;
  }

  .tb-tool-button:hover + .tb-tool-usage,
  .tb-tool-button:focus-visible + .tb-tool-usage {
    opacity: 1;
    transform: translateY(0);
  }

  /* -------------------------------------------------- */
  /* Ending + Lab transition                              */
  /* -------------------------------------------------- */

  .tb-ending-scene {
    min-height: 45vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 0.5rem;
    padding: 6rem max(5.6vw, 2rem);
  }

  .tb-ending-line {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(1.6rem, 3.4vw, 2.7rem);
    line-height: 1.3;
    letter-spacing: -0.02em;
    opacity: 0.9;
  }

  .tb-lab-scene {
    min-height: 30vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem max(5.6vw, 2rem) 8rem;
  }

  .tb-lab-title {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.85rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    opacity: 0.5;
  }

  /* -------------------------------------------------- */
  /* Tablet                                               */
  /* -------------------------------------------------- */

  @media (max-width: 1023px) {
    .tb-category {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr);
      gap: 2rem;
    }
  }

  /* -------------------------------------------------- */
  /* Mobile: stacked                                      */
  /* -------------------------------------------------- */

  @media (max-width: 767px) {
    .tb-intro-scene {
      padding: 6rem 1.25rem 3rem;
      min-height: auto;
    }

    .tb-heading-scene {
      padding: 1.5rem 1.25rem 3rem;
    }

    .tb-categories {
      padding: 0 1.25rem 3rem;
    }

    .tb-category {
      grid-template-columns: 1fr;
      gap: 1.25rem;
      padding: 2.5rem 0;
    }

    .tb-category-tools {
      gap: 0.5rem 1.75rem;
    }

    .tb-ending-scene,
    .tb-lab-scene {
      padding-left: 1.25rem;
      padding-right: 1.25rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .tb-tool-button {
      opacity: 0.85;
    }

    .tb-tool-underline {
      transition: none;
    }
  }
`;