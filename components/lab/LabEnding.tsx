"use client";

import { forwardRef } from "react";

/**
 * Closing statement for the Lab section — a single large line, revealed
 * independently by the parent via revealElementsIndividually, matching the
 * ending pattern used by Journey and Toolbox.
 */
const LabEnding = forwardRef<HTMLDivElement>(function LabEnding(_props, ref) {
  return (
    <div ref={ref} className="lb-ending-scene">
      <p className="lb-ending-line">Curiosity is my favorite framework.</p>
    </div>
  );
});

export default LabEnding;