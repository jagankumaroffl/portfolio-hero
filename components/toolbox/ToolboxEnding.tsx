"use client";

import { forwardRef } from "react";

/**
 * Closing statement for the Toolbox section, two lines revealed
 * independently. The Lab transition placeholder is rendered separately by
 * the parent (Toolbox.tsx), matching how Journey.tsx keeps its own ending
 * statement and the next section's placeholder as siblings rather than
 * nesting one inside the other.
 */
const ToolboxEnding = forwardRef<HTMLDivElement>(function ToolboxEnding(_props, ref) {
  return (
    <div ref={ref} className="tb-ending-scene">
      <p className="tb-ending-line">The right tools matter.</p>
      <p className="tb-ending-line">Knowing when to use them matters more.</p>
    </div>
  );
});

export default ToolboxEnding;