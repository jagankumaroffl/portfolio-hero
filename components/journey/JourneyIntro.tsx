"use client";

import { forwardRef } from "react";

/**
 * The two-line intro statement that opens the Journey section, immediately
 * after Projects' closing transition. Lines are revealed independently by
 * the parent via revealLinesOnScroll — this component only renders markup.
 */
const JourneyIntro = forwardRef<HTMLDivElement>(function JourneyIntro(_props, ref) {
  return (
    <div ref={ref} className="jy-intro-scene">
      <p className="jy-intro-line">Every builder starts somewhere.</p>
      <p className="jy-intro-line">Here&apos;s mine.</p>
    </div>
  );
});

export default JourneyIntro;