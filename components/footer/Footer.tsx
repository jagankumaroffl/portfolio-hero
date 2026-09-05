"use client";

import { useCallback } from "react";
import { FOOTER_COPY, SITE } from "@/lib/constants";
import { useLenis } from "@/components/providers/SmoothScrollProvider";
import FooterNavigation from "./FooterNavigation";
import { footerStyles } from "./footer.styles";
import JKMark from "@/components/hero/JKMark";

/**
 * Minimal site footer: brand mark/name on one side, section nav on the
 * other, a quiet bottom row, and a "Back to top" control. "Back to top"
 * calls the same shared Lenis instance's `scrollTo(0)` rather than
 * `window.scrollTo` or a new scroll library — when Lenis isn't mounted
 * (prefers-reduced-motion, per SmoothScrollProvider), `lenis` is null and
 * the link's plain `href="#top"` still moves focus/scroll natively via
 * the browser, so the control degrades gracefully either way.
 */
export default function Footer() {
  const lenis = useLenis();

  const handleBackToTop = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!lenis) return; // let the native #top anchor behavior handle it
      e.preventDefault();
      lenis.scrollTo(0);
    },
    [lenis]
  );

  return (
    <footer className="ft-root">
      <div className="ft-top">
        <div className="ft-brand">
          <JKMark className="ft-brand-mark" />
          <div className="ft-brand-text">
            <p className="ft-brand-name">{SITE.name}</p>
            <p className="ft-brand-role">{FOOTER_COPY.role}</p>
          </div>
          <span className="ft-brand-year">{FOOTER_COPY.year}</span>
        </div>

        <FooterNavigation />
      </div>

      <div className="ft-bottom">
        <p className="ft-bottom-line">Designed &amp; Built by {SITE.name}</p>
        <p className="ft-bottom-line">
          © {FOOTER_COPY.year} {SITE.name}
        </p>
        <a href="#top" className="ft-back-to-top" onClick={handleBackToTop}>
          Back to top ↑
        </a>
      </div>

      <style>{footerStyles}</style>
    </footer>
  );
}