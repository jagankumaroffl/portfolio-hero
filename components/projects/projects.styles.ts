// Selected Work section styles. Scoped entirely under the `.pw-` prefix so
// nothing here can collide with Hero's `.gh-` classes or About's `.ab-`
// classes. Uses the same design tokens (--font-display, --font-mono,
// --ease-primary) already defined in globals.css — no new global tokens
// introduced. Background starts at About's light tone and is driven toward
// the dark charcoal tone by JS (see scrubBackgroundOnScroll); the gradient
// below is the no-JS / reduced-motion fallback so the shift is never a hard
// cut even without scroll-linked color scrubbing.
export const projectsStyles = `
  .pw-root {
    position: relative;
    background: linear-gradient(
      to bottom,
      #f7f7f5 0%,
      #7d7f83 22%,
      #2a2c30 55%,
      #0b0d10 85%,
      #0b0d10 100%
    );
    color: #f5f7fa;
  }

  .pw-root ::selection {
    background: var(--accent);
    color: #0b0d10;
  }

  .pw-root ::-moz-selection {
    background: var(--accent);
    color: #0b0d10;
  }

  .pw-heading-scene {
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 8rem max(5.6vw, 2rem) 4rem;
  }

  .pw-heading {
    margin: 0 0 1.75rem;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(2.8rem, 6.5vw, 5.5rem);
    line-height: 1.02;
    letter-spacing: -0.03em;
  }

  .pw-heading span {
    display: block;
  }

  .pw-subtitle {
    margin: 0;
    max-width: 32rem;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(1rem, 1.6vw, 1.2rem);
    line-height: 1.55;
    opacity: 0.7;
  }

  .pw-subtitle span {
    display: block;
  }

  .pw-project {
    position: relative;
    min-height: 92vh;
    display: flex;
    align-items: center;
    padding: 6rem max(5.6vw, 2rem);
    overflow: clip;
  }

  .pw-project-inner {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 84rem;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: clamp(2.5rem, 5vw, 5rem);
  }

  /* Odd projects (1, 3): image left, content right. */
  .pw-project--odd .pw-project-inner {
    flex-direction: row;
  }

  /* Even projects (2): image right, content left. */
  .pw-project--even .pw-project-inner {
    flex-direction: row-reverse;
  }

  .pw-project-number {
    position: absolute;
    top: -2vw;
    left: 50%;
    transform: translateX(-50%);
    z-index: 0;
    margin: 0;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(9rem, 22vw, 18rem);
    line-height: 1;
    letter-spacing: -0.04em;
    color: #f5f7fa;
    opacity: 0.08;
    pointer-events: none;
    user-select: none;
  }

  .pw-project-media {
    width: 70%;
    flex-shrink: 0;
  }

  .pw-project-image {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 10;
    border-radius: 10px;
    overflow: hidden;
    background: linear-gradient(150deg, #3a3d42 0%, #1c1e22 100%);
    box-shadow: 0 16px 40px -24px rgba(0, 0, 0, 0.5);
    cursor: pointer;
    will-change: transform, filter;
  }

  .pw-project-image::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.06) 0%,
      rgba(255, 255, 255, 0) 40%
    );
  }

  .pw-project-content {
    width: 30%;
    min-width: 18rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .pw-project-category {
    margin: 0 0 -0.75rem;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.45;
  }

  .pw-project-title {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(1.7rem, 2.6vw, 2.4rem);
    line-height: 1.12;
    letter-spacing: -0.02em;
  }

  .pw-project-description {
    margin: 0;
    font-family: var(--font-display);
    font-size: 1rem;
    line-height: 1.6;
    opacity: 0.72;
  }

  .pw-project-story {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    padding-top: 0.25rem;
  }

  .pw-story-row {
    display: flex;
    gap: 0.75rem;
    align-items: baseline;
  }

  .pw-story-label {
    flex-shrink: 0;
    width: 5.5rem;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    opacity: 0.5;
  }

  .pw-story-value {
    margin: 0;
    font-family: var(--font-display);
    font-size: 0.92rem;
    line-height: 1.5;
    opacity: 0.78;
  }

  .pw-stack {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .pw-stack-label {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    opacity: 0.5;
  }

  .pw-stack-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0 1rem;
    margin: 0;
    padding: 0;
    list-style: none;
    font-family: var(--font-mono);
    font-size: 0.85rem;
    letter-spacing: 0.01em;
  }

  .pw-stack-list li {
    opacity: 0.75;
  }

  .pw-stack-list li:not(:last-child)::after {
    content: "/";
    margin-left: 1rem;
    opacity: 0.35;
  }

  .pw-buttons {
    display: flex;
    gap: 1.75rem;
    padding-top: 0.5rem;
  }

  .pw-button {
    position: relative;
    font-family: var(--font-mono);
    font-size: 0.82rem;
    letter-spacing: 0.02em;
    color: inherit;
    text-decoration: none;
    padding-bottom: 0.2rem;
  }

  .pw-button::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.35s var(--ease-primary);
  }

  .pw-button:hover::after,
  .pw-button:focus-visible::after {
    transform: scaleX(1);
  }

  .pw-button:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 4px;
    border-radius: 2px;
  }

  .pw-transition-scene {
    min-height: 70vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 0.5rem;
    padding: 6rem max(5.6vw, 2rem);
  }

  .pw-transition-line {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(1.9rem, 4vw, 3.2rem);
    line-height: 1.25;
    letter-spacing: -0.02em;
    opacity: 0.9;
  }

  @media (max-width: 1023px) {
    .pw-project {
      min-height: auto;
      padding: 5rem max(4vw, 1.5rem);
    }

    .pw-project-inner {
      gap: 2rem;
    }

    .pw-project-media {
      width: 60%;
    }

    .pw-project-content {
      width: 40%;
      min-width: 14rem;
    }
  }

  @media (max-width: 767px) {
    .pw-heading-scene {
      padding: 6rem 1.25rem 3rem;
      min-height: auto;
    }

    .pw-project {
      padding: 4rem 1.25rem;
    }

    .pw-project-inner,
    .pw-project--odd .pw-project-inner,
    .pw-project--even .pw-project-inner {
      flex-direction: column;
      align-items: flex-start;
      gap: 2rem;
    }

    .pw-project-media,
    .pw-project-content {
      width: 100%;
      min-width: 0;
    }

    .pw-project-number {
      top: -1rem;
      font-size: clamp(5rem, 26vw, 8rem);
    }

    .pw-transition-scene {
      padding-left: 1.25rem;
      padding-right: 1.25rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .pw-project-image {
      will-change: auto;
    }
  }
`;