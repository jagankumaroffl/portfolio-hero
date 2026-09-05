// About section styles. Scoped entirely under the `.ab-` prefix so nothing
// here can collide with Hero's `.gh-` classes or globals.css. Uses the same
// design tokens (--font-display, --font-mono, --ease-primary) already
// defined in globals.css — no new global tokens introduced.
export const aboutStyles = `
  .ab-root {
    position: relative;
    background: #f7f7f5;
    color: #0a0d12;
  }

  .ab-scene {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 6rem max(5.6vw, 2rem);
  }

  /* Scene 1 — huge single-sentence headline, masked line reveal */
  .ab-headline-scene {
    text-align: center;
  }

  .ab-headline {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(2.6rem, 7vw, 6.5rem);
    line-height: 1.05;
    letter-spacing: -0.03em;
  }

  .ab-headline span {
    display: block;
  }

  /* Scene 2 — identity */
  .ab-identity-scene {
    text-align: center;
    gap: 2.5rem;
  }

  .ab-identity-roles {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.25rem;
    font-family: var(--font-mono);
    font-size: clamp(0.95rem, 1.6vw, 1.15rem);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    opacity: 0.65;
  }

  .ab-identity-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.5;
  }

  .ab-identity-name {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(2.8rem, 6vw, 5rem);
    letter-spacing: -0.03em;
  }

  .ab-identity-education {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: center;
    gap: 0.6rem 1.5rem;
    margin: 0;
    padding: 0;
    list-style: none;
    font-family: var(--font-mono);
    font-size: 0.78rem;
    letter-spacing: 0.02em;
    opacity: 0.5;
  }

  .ab-identity-education-item {
    display: inline-flex;
    align-items: baseline;
    gap: 0.5rem;
  }

  .ab-identity-education-level {
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.75;
  }

  /* Scene 3 — philosophy statements */
  .ab-philosophy-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.75rem;
    text-align: center;
  }

  .ab-philosophy-line {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(1.6rem, 3.4vw, 2.75rem);
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  /* Scene 4 — portrait */
  .ab-portrait {
    flex-direction: row;
    align-items: center;
    gap: clamp(2rem, 6vw, 5rem);
    text-align: left;
  }

  .ab-portrait-image-wrap {
    width: 45%;
    aspect-ratio: 3 / 4;
    overflow: hidden;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .ab-portrait-image {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    will-change: transform;
  }

  .ab-portrait-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  .ab-portrait-fallback {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(160deg, #d8dde3 0%, #aab2bd 100%);
  }

  .ab-portrait-text {
    width: 55%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .ab-portrait-line {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(1.3rem, 2.4vw, 1.9rem);
    line-height: 1.4;
    letter-spacing: -0.01em;
    max-width: 28rem;
  }

  /* Scene 5 — quote */
  .ab-quote-scene {
    text-align: center;
  }

  .ab-quote {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 400;
    font-style: normal;
    font-size: clamp(2rem, 5vw, 4rem);
    line-height: 1.2;
    letter-spacing: -0.025em;
    max-width: 52rem;
  }

  .ab-quote span {
    display: block;
  }

  /* Scene 6 — stats */
  .ab-stats-grid {
    width: 100%;
    max-width: 68rem;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }

  .ab-stats-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    text-align: center;
  }

  .ab-stats-value {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(2rem, 4vw, 3.4rem);
    letter-spacing: -0.02em;
  }

  .ab-stats-label {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.78rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    opacity: 0.6;
  }

  /* Transition scene */
  .ab-transition-scene {
    text-align: center;
    gap: 1rem;
  }

  .ab-transition-eyebrow {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.55;
  }

  .ab-transition-line {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(2.2rem, 5vw, 3.8rem);
    letter-spacing: -0.03em;
  }

  @media (max-width: 1023px) {
    .ab-scene {
      padding: 4.5rem max(4vw, 1.5rem);
      min-height: 90vh;
    }
  }

  @media (max-width: 767px) {
    .ab-scene {
      min-height: auto;
      padding: 4rem 1.25rem;
    }

    .ab-identity-scene {
      gap: 1.75rem;
    }

    .ab-portrait {
      flex-direction: column;
      text-align: center;
    }

    .ab-portrait-image-wrap {
      width: 100%;
      max-width: 22rem;
      aspect-ratio: 4 / 5;
    }

    .ab-portrait-text {
      width: 100%;
      align-items: center;
    }

    .ab-portrait-line {
      max-width: none;
    }

    .ab-stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 2.5rem 1.5rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ab-portrait-image {
      will-change: auto;
    }
  }
`;