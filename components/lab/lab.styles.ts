// Lab section styles. Scoped entirely under the `.lb-` prefix so nothing
// collides with Hero/`.gh-`, About/`.ab-`, Projects/`.pw-`, Journey/`.jy-`,
// or Toolbox/`.tb-` classes. Uses the same design tokens already defined
// in globals.css (--font-display, --font-mono, --ease-primary) — no new
// global tokens. Continues the dark charcoal tone (#0b0d10) established by
// Journey/Toolbox. The accent used for status dots and the detail overlay
// is scoped locally (--lb-accent), matching Toolbox's --tb-accent pattern.
export const labStyles = `
  .lb-root {
    position: relative;
    background: #0b0d10;
    color: #f5f7fa;
    --lb-accent: var(--accent);
  }

  .lb-root ::selection {
    background: var(--lb-accent);
    color: #0b0d10;
  }

  .lb-root ::-moz-selection {
    background: var(--lb-accent);
    color: #0b0d10;
  }

  /* Faint workshop-grid backdrop: a subtle repeating grid plus a couple of
     tiny coordinate labels. Decorative only (aria-hidden), never competes
     with content. */
  .lb-grid-backdrop {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(245, 247, 250, 0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(245, 247, 250, 0.035) 1px, transparent 1px);
    background-size: 64px 64px;
    -webkit-mask-image: linear-gradient(to bottom, black, black 70%, transparent 100%);
    mask-image: linear-gradient(to bottom, black, black 70%, transparent 100%);
  }

  .lb-grid-label {
    position: absolute;
    font-family: var(--font-mono);
    font-size: 0.65rem;
    letter-spacing: 0.08em;
    color: #f5f7fa;
    opacity: 0.18;
  }

  .lb-grid-label--tl {
    top: 1.5rem;
    left: max(5.6vw, 2rem);
  }

  .lb-grid-label--br {
    bottom: 1.5rem;
    right: max(5.6vw, 2rem);
  }

  .lb-intro-scene {
    position: relative;
    z-index: 1;
    min-height: 55vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 0.25rem;
    padding: 8rem max(5.6vw, 2rem) 4rem;
  }

  .lb-intro-line {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(1.8rem, 4.2vw, 3.3rem);
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  .lb-intro-line:last-child {
    opacity: 0.6;
  }

  .lb-intro-line span {
    display: block;
  }

  /* -------------------------------------------------- */
  /* Experiment grid                                      */
  /* -------------------------------------------------- */

  .lb-grid {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: clamp(1.25rem, 2.5vw, 2rem);
    max-width: 80rem;
    margin: 0 auto;
    padding: 2rem max(5.6vw, 2rem) 6rem;
  }

  /* Editorial rhythm: large / small / medium / large, on an underlying
     6-column grid so every card still lines up intentionally rather than
     looking scattered. */
  .lb-card--large {
    grid-column: span 4;
    min-height: 22rem;
  }

  .lb-card--medium {
    grid-column: span 3;
    min-height: 18rem;
  }

  .lb-card--small {
    grid-column: span 2;
    min-height: 15rem;
  }

  .lb-grid > .lb-card:nth-child(2) {
    grid-column: span 2;
    justify-self: end;
    width: 100%;
  }

  .lb-grid > .lb-card:nth-child(4) {
    grid-column: span 4;
  }

  /* -------------------------------------------------- */
  /* Experiment card                                      */
  /* -------------------------------------------------- */

  .lb-card {
    position: relative;
    display: flex;
    flex-direction: column;
    text-align: left;
    background: rgba(245, 247, 250, 0.02);
    border: 1px solid rgba(245, 247, 250, 0.14);
    border-radius: 6px;
    padding: 1.5rem;
    cursor: pointer;
    color: inherit;
    font-family: inherit;
    transition: border-color 0.4s var(--ease-primary), background-color 0.4s var(--ease-primary);
  }

  .lb-card:hover,
  .lb-card:focus-visible {
    border-color: rgba(245, 247, 250, 0.32);
    background: rgba(245, 247, 250, 0.045);
  }

  .lb-card:focus-visible {
    outline: 2px solid var(--lb-accent);
    outline-offset: 3px;
  }

  .lb-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .lb-card-number {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    letter-spacing: 0.08em;
    opacity: 0.4;
  }

  .lb-card-status {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.55;
  }

  .lb-card-status-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--lb-accent);
    opacity: 0.85;
  }

  .lb-card-visual {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1.25rem 0;
    min-height: 5rem;
    color: #f5f7fa;
  }

  .lb-card-visual-svg {
    width: 70%;
    max-width: 9rem;
    height: auto;
  }

  .lb-card-visual-image {
    width: 70%;
    max-width: 9rem;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    border-radius: 6px;
  }

  .lb-card-body {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .lb-card-title {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(1.2rem, 1.8vw, 1.5rem);
    line-height: 1.2;
    letter-spacing: -0.01em;
  }

  .lb-card-category {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    opacity: 0.45;
  }

  .lb-card-description {
    margin: 0.35rem 0 0;
    font-family: var(--font-display);
    font-size: 0.88rem;
    line-height: 1.5;
    opacity: 0.62;
  }

  .lb-card-open {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    font-family: var(--font-mono);
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    opacity: 0;
    transition: opacity 0.3s var(--ease-primary);
  }

  .lb-card:hover .lb-card-open,
  .lb-card:focus-visible .lb-card-open {
    opacity: 0.55;
  }

  /* -------------------------------------------------- */
  /* Detail overlay                                       */
  /* -------------------------------------------------- */

  .lb-detail-backdrop {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 60;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: rgba(6, 7, 9, 0.72);
    backdrop-filter: blur(6px);
  }

  .lb-detail-panel {
    position: relative;
    width: min(38rem, 100%);
    max-height: min(42rem, 90vh);
    overflow-y: auto;
    background: #101215;
    border: 1px solid rgba(245, 247, 250, 0.14);
    border-radius: 8px;
    padding: clamp(1.75rem, 4vw, 3rem);
  }

  .lb-detail-close {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    background: none;
    border: 1px solid rgba(245, 247, 250, 0.22);
    border-radius: 4px;
    padding: 0.4rem 0.75rem;
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #f5f7fa;
    cursor: pointer;
    transition: border-color 0.3s var(--ease-primary), opacity 0.3s var(--ease-primary);
    opacity: 0.7;
  }

  .lb-detail-close:hover,
  .lb-detail-close:focus-visible {
    opacity: 1;
    border-color: rgba(245, 247, 250, 0.5);
  }

  .lb-detail-close:focus-visible {
    outline: 2px solid var(--lb-accent);
    outline-offset: 2px;
  }

  .lb-detail-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-right: 2.5rem;
  }

  .lb-detail-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .lb-detail-number {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    letter-spacing: 0.08em;
    opacity: 0.4;
  }

  .lb-detail-status {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.6;
  }

  .lb-detail-status-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--lb-accent);
  }

  .lb-detail-title {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(1.6rem, 3vw, 2.1rem);
    line-height: 1.15;
    letter-spacing: -0.02em;
  }

  .lb-detail-category {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    opacity: 0.45;
  }

  .lb-detail-visual-svg {
    width: 100%;
    max-width: 16rem;
    height: auto;
  }

  .lb-detail-visual-image {
    width: 100%;
    max-width: 24rem;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    border-radius: 6px;
  }

  .lb-detail-description {
    margin: 0;
    font-family: var(--font-display);
    font-size: 0.95rem;
    line-height: 1.6;
    opacity: 0.75;
  }

  .lb-detail-section {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(245, 247, 250, 0.1);
  }

  .lb-detail-label {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.45;
  }

  .lb-detail-text {
    margin: 0;
    font-family: var(--font-display);
    font-size: 0.92rem;
    line-height: 1.55;
    opacity: 0.75;
  }

  /* -------------------------------------------------- */
  /* Ending                                               */
  /* -------------------------------------------------- */

  .lb-ending-scene {
    position: relative;
    z-index: 1;
    min-height: 45vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 6rem max(5.6vw, 2rem);
  }

  .lb-ending-line {
    margin: 0;
    max-width: 44rem;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(2rem, 4.6vw, 3.6rem);
    line-height: 1.15;
    letter-spacing: -0.02em;
  }

  /* -------------------------------------------------- */
  /* Tablet                                               */
  /* -------------------------------------------------- */

  @media (max-width: 1023px) {
    .lb-card--large {
      grid-column: span 6;
    }
    .lb-card--medium {
      grid-column: span 3;
    }
    .lb-card--small {
      grid-column: span 3;
    }
    .lb-grid > .lb-card:nth-child(2) {
      grid-column: span 3;
    }
    .lb-grid > .lb-card:nth-child(4) {
      grid-column: span 6;
    }
  }

  /* -------------------------------------------------- */
  /* Mobile: single column, fullscreen-style overlay      */
  /* -------------------------------------------------- */

  @media (max-width: 767px) {
    .lb-intro-scene {
      padding: 6rem 1.25rem 3rem;
      min-height: auto;
    }

    .lb-grid {
      grid-template-columns: 1fr;
      padding: 1rem 1.25rem 4rem;
      gap: 1.5rem;
    }

    .lb-card--large,
    .lb-card--medium,
    .lb-card--small,
    .lb-grid > .lb-card:nth-child(2),
    .lb-grid > .lb-card:nth-child(4) {
      grid-column: 1;
      min-height: 16rem;
    }

    .lb-detail-backdrop {
      padding: 0;
    }

    .lb-detail-panel {
      width: 100%;
      height: 100%;
      max-height: 100%;
      border-radius: 0;
      padding: 5rem 1.5rem 2rem;
    }

    .lb-detail-close {
      top: 1rem;
      right: 1rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 44px;
      min-height: 44px;
      padding: 0.55rem 0.9rem;
    }

    .lb-ending-scene {
      padding-left: 1.25rem;
      padding-right: 1.25rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .lb-card {
      transition: none;
    }
  }
`;