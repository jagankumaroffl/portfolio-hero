"use client";

import { forwardRef } from "react";
import type { JourneyMilestoneData, JourneyVisual } from "./journey.data";

interface JourneyMilestoneProps {
  milestone: JourneyMilestoneData;
  index: number;
  nodeRef?: (el: HTMLDivElement | null) => void;
  yearRef?: (el: HTMLParagraphElement | null) => void;
  titleRef?: (el: HTMLHeadingElement | null) => void;
  descriptionRef?: (el: HTMLParagraphElement | null) => void;
}

/**
 * Minimal geometric placeholder per milestone visual category. Kept simple
 * (stroke-only, currentColor) so it reads as "structure, not stock imagery"
 * and can be swapped for real artwork later without touching layout.
 */
function VisualPlaceholder({ kind }: { kind: JourneyVisual }) {
  switch (kind) {
    case "code":
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <path d="M17 15 8 24l9 9M31 15l9 9-9 9M27 12l-6 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "hardware":
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect x="14" y="14" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M20 14V8M28 14V8M20 40v-6M28 40v-6M14 20H8M14 28H8M40 20h-6M40 28h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "ai":
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <circle cx="24" cy="24" r="4" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="24" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="38" cy="31" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="10" cy="31" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M24 20v-6M27.5 26.5l8-3.5M20.5 26.5l-8-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "product":
    default:
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <path d="M24 8 40 16.5v15L24 40 8 31.5v-15z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M24 24v16M24 24 8 16.5M24 24l16-7.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
  }
}

/**
 * A single stop along the journey line. Renders in its hidden/subtle
 * resting state by default (opacity handled by the animation module via
 * setMilestoneInitialState) — the parent activates it once the drawn line
 * reaches this node's position along the track.
 */
const JourneyMilestone = forwardRef<HTMLDivElement, JourneyMilestoneProps>(
  function JourneyMilestone(
    { milestone, index, nodeRef, yearRef, titleRef, descriptionRef },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={`jy-milestone${milestone.current ? " jy-milestone--current" : ""}`}
        style={{ ["--jy-index" as string]: index }}
      >
        <div ref={nodeRef} className="jy-node">
          <span className="jy-node-dot" />
        </div>

        <div className="jy-milestone-visual">
          <VisualPlaceholder kind={milestone.visual} />
        </div>

        <p ref={yearRef} className="jy-milestone-year">
          {milestone.year}
        </p>
        <h3 ref={titleRef} className="jy-milestone-title">
          {milestone.title}
        </h3>
        <p ref={descriptionRef} className="jy-milestone-description">
          {milestone.description}
        </p>
      </div>
    );
  }
);

export default JourneyMilestone;