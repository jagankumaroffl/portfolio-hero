"use client";

import { forwardRef } from "react";

/**
 * The two-line intro statement that opens the Lab section, immediately
 * after Toolbox's ending. Lines are revealed independently by the parent
 * via revealLinesOnScroll — this component only renders markup.
 */
const LabIntro = forwardRef<HTMLDivElement>(function LabIntro(_props, ref) {
  return (
    <div ref={ref} className="lb-intro-scene">
      <p className="lb-intro-line">Every polished product started as an experiment.</p>
      <p className="lb-intro-line">Welcome to the Lab.</p>
    </div>
  );
});

export default LabIntro;