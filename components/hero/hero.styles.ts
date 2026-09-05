// Verbatim copy of the original hero <style> block. Kept as a template
// string (not CSS Modules) so zero selectors, cascade order, or specificity
// changes — pixel-identical output.
export const heroStyles = `
  .gh-hero {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    min-width: 320px;
    height: 100dvh;
    background: var(--paper);
  }

  .gh-layer {
    position: absolute;
    inset: 0;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    pointer-events: none;
  }

  .gh-base {
    z-index: 0;
    background-image: url("/images/Base_image_desktop.png");
  }

  /* Alternate/F1 portrait, revealed only where the SVG mask (see
     HeroImage.tsx + useHeroMaskReveal) is opaque. Left permanently at
     opacity/visibility "on" — the mask itself, not this layer, controls
     what's visible, since its default zero-area path already hides
     everything until the reveal hook actively grows it. */
  .gh-reveal {
    z-index: 1;
    background-image: url("/images/Reveal_image_desktop.png");
    mask-image: url(#gh-hero-mask);
    -webkit-mask-image: url(#gh-hero-mask);
  }

  /* Hidden host for the SVG <mask>/<filter> definitions — zero size,
     never painted itself; only referenced by .gh-reveal's mask-image. */
  .gh-mask-defs {
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
  }

  @media (max-width: 767px) {
    .gh-base {
      background-image: url("/images/Base_image_mobile.png");
    }
    /* useHeroMaskReveal never attaches on touch devices, so the mask
       path stays at its default zero-area "M 0 0 Z" and .gh-reveal
       already renders nothing — this is just a defensive belt-and-braces
       hide so no stray paint cost is spent on a layer that can never be
       visible here. */
    .gh-reveal {
      background-image: url("/images/Reveal_image_mobile.png");
      display: none;
    }
  }

  @media (max-width: 767px) and (orientation: landscape) {
    .gh-base {
      background-image: url("/images/Base_image_desktop.png");
    }
    .gh-reveal {
      background-image: url("/images/Reveal_image_desktop.png");
    }
  }

  .gh-grid-wrap {
    position: absolute;
    inset: 0;
    z-index: 20;
    pointer-events: none;
    overflow: hidden;
  }

  .gh-grid {
    position: absolute;
    inset: 0;
    --grid-cols: 12;
    --grid-rows: 4;
    opacity: 0.55;
    background-image: linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
      linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px);
    background-size: calc(100% / var(--grid-cols)) 100%, 100% calc(100% / var(--grid-rows));
  }

  .gh-circle {
    position: absolute;
    left: 8%;
    top: -36%;
    width: min(78vw, 72rem);
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    border: 1px solid var(--grid-line-strong);
  }

  @media (max-width: 767px) {
    .gh-grid {
      --grid-cols: 4;
      --grid-rows: 6;
      opacity: 0.35;
    }
    .gh-circle {
      left: -76%;
      top: -8%;
      width: 150vw;
    }
  }

  .gh-nav-wrap {
    position: absolute;
    top: max(2.5rem, env(safe-area-inset-top));
    left: 0;
    right: 0;
    z-index: 40;
    padding-inline: max(5.6vw, 2rem);
  }

  .gh-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    font-family: var(--font-mono);
  }

  .gh-brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    text-decoration: none;
    color: var(--ink);
  }

  .gh-brand-mark {
    width: 28px;
    height: 20px;
    flex-shrink: 0;
    display: block;
  }

  .gh-brand-name {
    font-size: 0.85rem;
    letter-spacing: 0.02em;
  }

  .gh-nav-links {
    display: flex;
    align-items: center;
    gap: 2.25rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .gh-nav-links a {
    position: relative;
    font-size: 0.78rem;
    text-decoration: none;
    color: var(--ink);
    letter-spacing: 0.02em;
    padding: 0.5rem 0.15rem;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    opacity: 0.72;
    transition: opacity 0.3s var(--ease-primary);
  }

  .gh-nav-links a::after {
    content: "";
    position: absolute;
    left: 0.15rem;
    right: 0.15rem;
    bottom: 0.4rem;
    height: 1px;
    background: var(--accent);
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.3s var(--ease-primary);
  }

  .gh-nav-links a:hover,
  .gh-nav-links a.is-active {
    opacity: 1;
  }

  .gh-nav-links a:hover::after,
  .gh-nav-links a.is-active::after {
    transform: scaleX(1);
  }

  @media (prefers-reduced-motion: reduce) {
    .gh-nav-links a,
    .gh-nav-links a::after {
      transition: none;
    }
  }

  .gh-nav-links a:focus-visible,
  .gh-brand:focus-visible,
  .gh-cta:focus-visible,
  .gh-explore-btn:focus-visible {
    outline: 2px solid var(--ink);
    outline-offset: 3px;
    border-radius: 2px;
  }

  .gh-cta {
    background: #fff;
    color: var(--ink);
    border-radius: 999px;
    padding: 0.75rem 1.4rem;
    font-size: 0.78rem;
    text-decoration: none;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    box-shadow: 0 1px 2px rgba(10, 20, 40, 0.08);
  }

  @media (max-width: 767px) {
    .gh-nav-links {
      display: none;
    }
  }

  .gh-copy {
    position: absolute;
    inset: 0;
    z-index: 30;
    pointer-events: none;
  }

  .gh-copy a {
    pointer-events: auto;
  }

  .gh-headline {
    position: absolute;
    top: 34%;
    left: max(5.6vw, 2rem);
    margin: 0;
    display: flex;
    flex-direction: column;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(5.4rem, 6.2vw, 6.8rem);
    line-height: 0.93;
    letter-spacing: -0.085em;
    color: var(--ink);
  }

  .gh-headline-line {
    display: block;
  }

  .gh-bottom-left {
    position: absolute;
    left: max(5.6vw, 2rem);
    bottom: max(3rem, env(safe-area-inset-bottom));
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.1rem;
    max-width: 26rem;
  }

  .gh-intro {
    margin: 0;
    font-family: var(--font-display);
    font-size: 1rem;
    line-height: 1.4;
    color: var(--ink);
  }

  .gh-explore-btn {
    background: #fff;
    color: var(--ink);
    border-radius: 999px;
    padding: 0.85rem 1.6rem;
    font-family: var(--font-mono);
    font-size: 0.78rem;
    text-decoration: none;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    box-shadow: 0 1px 2px rgba(10, 20, 40, 0.08);
  }

  .gh-tagline {
    position: absolute;
    top: 34%;
    right: max(5.6vw, 2rem);
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.2rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.06em;
    color: var(--ink);
    text-align: right;
  }

  @media (max-width: 767px) {
    .gh-hero {
      min-height: 42rem;
    }

    .gh-nav-wrap {
      padding-inline: max(1.25rem, env(safe-area-inset-left)) max(1.25rem, env(safe-area-inset-right));
    }

    .gh-headline {
      top: 15%;
      left: max(1.25rem, env(safe-area-inset-left));
      width: 62%;
      font-size: clamp(2.7rem, 12.5vw, 3.8rem);
      line-height: 0.87;
      color: #f6faff;
      text-shadow: 0 1px 12px rgba(10, 20, 40, 0.28);
    }

    .gh-bottom-left {
      left: max(1.25rem, env(safe-area-inset-left));
      right: max(1.25rem, env(safe-area-inset-right));
      bottom: max(2rem, env(safe-area-inset-bottom));
      max-width: none;
    }

    .gh-intro {
      color: #f6faff;
      text-shadow: 0 1px 12px rgba(10, 20, 40, 0.28);
    }

    .gh-tagline {
      top: 55%;
      right: max(1.25rem, env(safe-area-inset-right));
      color: #f6faff;
      text-shadow: 0 1px 12px rgba(10, 20, 40, 0.28);
    }
  }

  @media (max-width: 320px) {
    .gh-headline {
      width: 68%;
      font-size: clamp(2.3rem, 12vw, 3.2rem);
    }
  }
`;