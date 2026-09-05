"use client";

import { forwardRef } from "react";

/**
 * Small "available for opportunities" indicator with a gentle pulsing dot.
 * The pulse is a pure CSS keyframe animation (see .ct-availability-dot in
 * contact.styles.ts) rather than a GSAP loop — it's the one continuous
 * animation the brief allows, and CSS keyframes are cheaper than a running
 * GSAP timeline for something this small and long-lived. The keyframe
 * itself is disabled under prefers-reduced-motion via a plain CSS media
 * query, so there's no JS branching needed here at all.
 */
const Availability = forwardRef<HTMLDivElement>(function Availability(_props, ref) {
  return (
    <div ref={ref} className="ct-availability">
      <p className="ct-availability-status">
        <span className="ct-availability-dot" aria-hidden="true" />
        Available for opportunities
      </p>
      <ul className="ct-availability-roles">
        <li>Software Engineering</li>
        <li>AI Engineering</li>
        <li>Electronics Engineering</li>
      </ul>
    </div>
  );
});

export default Availability;