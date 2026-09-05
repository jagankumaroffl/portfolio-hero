// Footer styles. Scoped entirely under the `.ft-` prefix. Uses the same
// design tokens already defined in globals.css — no new global tokens.
// Continues the dark charcoal tone from Contact so the footer reads as
// the natural close of the page rather than a new surface.
export const footerStyles = `
  .ft-root {
    background: #0b0d10;
    color: #f5f7fa;
    border-top: 1px solid rgba(245, 247, 250, 0.1);
  }

  .ft-root ::selection {
    background: var(--accent);
    color: #0b0d10;
  }

  .ft-root ::-moz-selection {
    background: var(--accent);
    color: #0b0d10;
  }

  .ft-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 2.5rem;
    max-width: 80rem;
    margin: 0 auto;
    padding: clamp(3rem, 6vw, 4.5rem) max(5.6vw, 1.5rem) 2.5rem;
  }

  .ft-brand {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .ft-brand-mark {
    width: 40px;
    height: 28px;
    flex-shrink: 0;
    display: block;
    border: 1px solid rgba(245, 247, 250, 0.25);
    border-radius: 4px;
    padding: 5px 7px;
    opacity: 0.85;
    color: #f5f7fa;
  }

  .ft-brand-text {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .ft-brand-name {
    margin: 0;
    font-family: var(--font-display);
    font-size: 1rem;
    letter-spacing: -0.005em;
  }

  .ft-brand-role {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.04em;
    opacity: 0.5;
  }

  .ft-brand-year {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.04em;
    opacity: 0.35;
    align-self: center;
  }

  .ft-nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 1.25rem 1.75rem;
  }

  .ft-nav-list a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    font-family: var(--font-mono);
    font-size: 0.78rem;
    letter-spacing: 0.04em;
    color: inherit;
    text-decoration: none;
    opacity: 0.6;
    transition: opacity 0.3s var(--ease-primary);
  }

  .ft-nav-list a:hover,
  .ft-nav-list a:focus-visible {
    opacity: 1;
  }

  .ft-nav-list a:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 3px;
    border-radius: 2px;
  }

  .ft-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem 1.5rem;
    max-width: 80rem;
    margin: 0 auto;
    padding: 1.5rem max(5.6vw, 1.5rem) 2.5rem;
    border-top: 1px solid rgba(245, 247, 250, 0.08);
  }

  .ft-bottom-line {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.03em;
    opacity: 0.4;
  }

  .ft-back-to-top {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.04em;
    color: inherit;
    text-decoration: none;
    opacity: 0.45;
    transition: opacity 0.3s var(--ease-primary);
  }

  .ft-back-to-top:hover,
  .ft-back-to-top:focus-visible {
    opacity: 0.9;
  }

  .ft-back-to-top:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 3px;
    border-radius: 2px;
  }

  @media (max-width: 767px) {
    .ft-top {
      flex-direction: column;
      gap: 2rem;
    }

    .ft-brand {
      flex-wrap: wrap;
    }

    .ft-bottom {
      flex-direction: column;
      align-items: flex-start;
    }

    .ft-back-to-top {
      margin-left: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ft-nav-list a,
    .ft-back-to-top {
      transition: none;
    }
  }
`;