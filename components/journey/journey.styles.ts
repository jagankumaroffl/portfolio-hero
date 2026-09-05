// Journey section styles. Scoped entirely under the `.jy-` prefix so
// nothing collides with Hero's `.gh-`, About's `.ab-`, or Projects' `.pw-`
// classes. Uses the same design tokens already defined in globals.css
// (--font-display, --font-mono, --ease-primary) — no new global tokens.
// Continues Projects' dark charcoal tone (#0b0d10) so the section reads as
// one continuous scene rather than a cut.
export const journeyStyles = `
  .jy-root {
    position: relative;
    background: #0b0d10;
    color: #f5f7fa;
    --jy-accent: var(--accent);
  }

  .jy-root ::selection {
    background: var(--jy-accent);
    color: #0b0d10;
  }

  .jy-root ::-moz-selection {
    background: var(--jy-accent);
    color: #0b0d10;
  }

  .jy-intro-scene {
    min-height: 55vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 0.25rem;
    padding: 8rem max(5.6vw, 2rem) 4rem;
  }

  .jy-intro-line {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(2rem, 4.6vw, 3.6rem);
    line-height: 1.15;
    letter-spacing: -0.02em;
  }

  .jy-intro-line:last-child {
    opacity: 0.6;
  }

  .jy-intro-line span {
    display: block;
  }

  /* -------------------------------------------------- */
  /* Line scene: pinned track + milestones               */
  /* -------------------------------------------------- */

  .jy-line-scene {
    position: relative;
    height: 200vh;
  }

  .jy-line-pin {
    position: relative;
    height: 100vh;
    display: flex;
    align-items: center;
    padding: 0 max(6vw, 2.5rem);
    overflow: clip;
  }

  .jy-line-track {
    position: relative;
    width: 100%;
    height: 1px;
    background: rgba(245, 247, 250, 0.14);
  }

  .jy-line-fill {
    position: absolute;
    inset: 0;
    background: #f5f7fa;
    transform: scaleX(0);
    transform-origin: left center;
  }

  .jy-milestones {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .jy-milestone {
    position: relative;
    width: 22%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  /* Alternate milestones above/below the line for breathing room. */
  .jy-milestone:nth-child(odd) {
    transform: translateY(-9rem);
  }

  .jy-milestone:nth-child(even) {
    transform: translateY(9rem);
  }

  .jy-node {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    background: #f5f7fa;
    transform: translate(-50%, calc(-50% + var(--jy-node-offset, 0px)));
  }

  .jy-milestone:nth-child(odd) .jy-node {
    --jy-node-offset: 9rem;
  }

  .jy-milestone:nth-child(even) .jy-node {
    --jy-node-offset: -9rem;
  }

  .jy-node-dot {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: currentColor;
  }

  .jy-milestone--current .jy-node {
    background: var(--jy-accent, #f5f7fa);
    box-shadow: 0 0 0 4px rgba(245, 247, 250, 0.12);
  }

  .jy-milestone-visual {
    width: 2.75rem;
    height: 2.75rem;
    margin-bottom: 0.85rem;
    color: #f5f7fa;
    opacity: 0.85;
  }

  .jy-milestone-visual svg {
    width: 100%;
    height: 100%;
  }

  .jy-milestone-year {
    margin: 0 0 0.35rem;
    font-family: var(--font-mono);
    font-size: 0.78rem;
    letter-spacing: 0.1em;
    opacity: 0.55;
  }

  .jy-milestone-title {
    margin: 0 0 0.6rem;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(1.05rem, 1.5vw, 1.3rem);
    line-height: 1.2;
    letter-spacing: -0.01em;
  }

  .jy-milestone-description {
    margin: 0;
    max-width: 15rem;
    font-family: var(--font-display);
    font-size: 0.88rem;
    line-height: 1.55;
    opacity: 0.65;
  }

  .jy-milestone--current .jy-milestone-title {
    opacity: 1;
  }

  /* -------------------------------------------------- */
  /* Ending + Toolbox transition                         */
  /* -------------------------------------------------- */

  .jy-ending-scene {
    min-height: 55vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 0.5rem;
    padding: 6rem max(5.6vw, 2rem);
  }

  .jy-ending-line {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(1.8rem, 3.8vw, 3rem);
    line-height: 1.25;
    letter-spacing: -0.02em;
    opacity: 0.9;
  }

  .jy-toolbox-scene {
    min-height: 30vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem max(5.6vw, 2rem) 8rem;
  }

  .jy-toolbox-title {
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
    .jy-milestone:nth-child(odd) {
      transform: translateY(-6.5rem);
    }
    .jy-milestone:nth-child(even) {
      transform: translateY(6.5rem);
    }
    .jy-milestone:nth-child(odd) .jy-node {
      --jy-node-offset: 6.5rem;
    }
    .jy-milestone:nth-child(even) .jy-node {
      --jy-node-offset: -6.5rem;
    }
    .jy-milestone-description {
      max-width: 12rem;
    }
  }

  /* -------------------------------------------------- */
  /* Mobile: vertical journey                             */
  /* -------------------------------------------------- */

  @media (max-width: 767px) {
    .jy-intro-scene {
      padding: 6rem 1.25rem 3rem;
      min-height: auto;
    }

    .jy-line-scene {
      height: auto;
    }

    .jy-line-pin {
      position: static;
      height: auto;
      flex-direction: row;
      padding: 3rem 1.25rem;
      overflow: visible;
    }

    .jy-line-track {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 2.4rem;
      width: 1px;
      height: auto;
    }

    .jy-milestones {
      position: static;
      flex-direction: column;
      align-items: stretch;
      gap: 3.5rem;
      width: 100%;
      padding-left: 4.5rem;
    }

    .jy-milestone,
    .jy-milestone:nth-child(odd),
    .jy-milestone:nth-child(even) {
      width: 100%;
      align-items: flex-start;
      text-align: left;
      transform: none;
    }

    .jy-node,
    .jy-milestone:nth-child(odd) .jy-node,
    .jy-milestone:nth-child(even) .jy-node {
      --jy-node-offset: 0px;
      top: 0.4rem;
      left: -2.85rem;
      transform: translate(-50%, 0);
    }

    .jy-milestone-visual {
      width: 2.25rem;
      height: 2.25rem;
    }

    .jy-milestone-description {
      max-width: none;
    }

    .jy-ending-scene,
    .jy-toolbox-scene {
      padding-left: 1.25rem;
      padding-right: 1.25rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .jy-line-fill {
      transform: scaleX(1);
    }

    .jy-node,
    .jy-milestone-year,
    .jy-milestone-title,
    .jy-milestone-description {
      opacity: 1 !important;
      transform: none !important;
    }
  }
`;