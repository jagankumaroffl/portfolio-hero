"use client";

import { forwardRef } from "react";
import type { ToolboxCategoryData } from "./toolbox.data";
import ToolboxItem from "./ToolboxItem";

interface ToolboxCategoryProps {
  category: ToolboxCategoryData;
  headingRef?: (el: HTMLDivElement | null) => void;
  toolRef?: (index: number, el: HTMLButtonElement | null) => void;
  onToolHoverChange?: (index: number, hovered: boolean) => void;
}

/**
 * One category "row" of the toolbox: number/title on one side, its
 * technologies on the other (desktop editorial layout; stacks naturally on
 * mobile via CSS). Typography-only — no cards, no badges, no progress
 * bars. The parent reveals this row's heading + tools together via
 * revealCategoryOnScroll, so it needs individual refs for both.
 */
const ToolboxCategory = forwardRef<HTMLDivElement, ToolboxCategoryProps>(
  function ToolboxCategory({ category, headingRef, toolRef, onToolHoverChange }, ref) {
    return (
      <div ref={ref} className="tb-category">
        <div ref={headingRef} className="tb-category-heading">
          <span className="tb-category-number">{category.number}</span>
          <h3 className="tb-category-title">{category.title}</h3>
        </div>
        <ul className="tb-category-tools">
          {category.tools.map((tool, index) => (
            <li key={tool.name}>
              <ToolboxItem
                tool={tool}
                ref={(el) => toolRef?.(index, el)}
                onHoverChange={(hovered) => onToolHoverChange?.(index, hovered)}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

export default ToolboxCategory;