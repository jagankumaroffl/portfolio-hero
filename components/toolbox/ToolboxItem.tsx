"use client";

import { forwardRef, useId } from "react";
import type { ToolboxTool } from "./toolbox.data";

interface ToolboxItemProps {
  tool: ToolboxTool;
  onHoverChange?: (hovered: boolean) => void;
}

/**
 * A single technology within a category. Plain, focusable text — not a
 * card — so the hover/focus interaction (brighten, lift, underline) reads
 * as typography coming alive rather than a UI control. Keyboard users get
 * the identical interaction via focus/blur (see bindToolHover), and the
 * "used in" indicator's label is exposed to assistive tech via
 * aria-describedby rather than being hover-only information.
 */
const ToolboxItem = forwardRef<HTMLButtonElement, ToolboxItemProps>(function ToolboxItem(
  { tool, onHoverChange },
  ref
) {
  const labelId = useId();
  const hasUsage = Boolean(tool.usedIn && tool.usedIn.length > 0);
  const usageText = hasUsage
    ? `Used in ${tool.usedIn!.map((u) => u.projectTitle).join(", ")}`
    : undefined;

  return (
    <span className="tb-tool">
      <button
        ref={ref}
        type="button"
        className="tb-tool-button"
        aria-describedby={hasUsage ? labelId : undefined}
        onPointerEnter={() => onHoverChange?.(true)}
        onPointerLeave={() => onHoverChange?.(false)}
        onFocus={() => onHoverChange?.(true)}
        onBlur={() => onHoverChange?.(false)}
      >
        <span className="tb-tool-name">{tool.name}</span>
        {hasUsage && <span className="tb-tool-dot" aria-hidden="true" />}
        <span className="tb-tool-underline" aria-hidden="true" />
      </button>
      {hasUsage && (
        <span id={labelId} className="tb-tool-usage" role="tooltip">
          {usageText}
        </span>
      )}
    </span>
  );
});

export default ToolboxItem;