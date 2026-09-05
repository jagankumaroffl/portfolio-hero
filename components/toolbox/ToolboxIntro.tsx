"use client";

import { forwardRef } from "react";

/**
 * The two-line intro statement that opens the Toolbox section, immediately
 * after Journey's ending. Lines are revealed independently by the parent
 * via revealLinesOnScroll — this component only renders markup.
 */
const ToolboxIntro = forwardRef<HTMLDivElement>(function ToolboxIntro(_props, ref) {
  return (
    <div ref={ref} className="tb-intro-scene">
      <p className="tb-intro-line">Every builder has a toolbox.</p>
      <p className="tb-intro-line">Here&apos;s mine.</p>
    </div>
  );
});

export default ToolboxIntro;