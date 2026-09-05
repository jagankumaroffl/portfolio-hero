import { HERO_COPY } from "@/lib/constants";

/** Headline, intro line + CTA, and side tagline overlaid on the hero imagery. */
export default function HeroContent() {
  return (
    <section className="gh-copy">
      <h1 className="gh-headline">
        {HERO_COPY.headlineLines.map((line, i) => (
          <span key={line} className={`gh-headline-line anim-line anim-line-${i + 1}`}>
            {line}
          </span>
        ))}
      </h1>

      <div className="gh-bottom-left">
        <p className="gh-intro anim-intro">{HERO_COPY.introLine}</p>
        <a className="gh-explore-btn anim-intro" href="#work">
          {HERO_COPY.exploreLabel}
        </a>
      </div>

      <p className="gh-tagline anim-tagline" aria-hidden="true">
        {HERO_COPY.taglineLines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </p>
    </section>
  );
}