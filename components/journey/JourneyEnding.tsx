"use client";

import { forwardRef } from "react";

/**
 * Closing statement for the Journey section, three lines revealed
 * independently, followed by a minimal "Toolbox" transition placeholder.
 * The Toolbox section itself is not built here — only enough structure to
 * verify the transition reads correctly.
 */
const JourneyEnding = forwardRef<HTMLDivElement>(function JourneyEnding(_props, ref) {
  return (
    <div ref={ref} className="jy-ending-scene">
      <p className="jy-ending-line">Still building.</p>
      <p className="jy-ending-line">Still learning.</p>
      <p className="jy-ending-line">Always curious.</p>
    </div>
  );
});

export default JourneyEnding;