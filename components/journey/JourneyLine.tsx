"use client";

import { forwardRef } from "react";

/**
 * The single progress track that "draws itself" as the section scrolls.
 * Horizontal on desktop/tablet, vertical on mobile (CSS handles the axis
 * switch; the animation module scales along whichever axis is active via
 * the `axis` prop passed to drawJourneyLine by the parent). Purely a visual
 * track — actual scaleX/scaleY is applied imperatively by the animation
 * module, not by React state, to stay scrub-smooth.
 */
const JourneyLine = forwardRef<HTMLDivElement>(function JourneyLine(_props, ref) {
  return (
    <div className="jy-line-track" aria-hidden="true">
      <div ref={ref} className="jy-line-fill" />
    </div>
  );
});

export default JourneyLine;