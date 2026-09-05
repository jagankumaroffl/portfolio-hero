"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { revealElementsIndividually } from "@/lib/animations/about";

type StatementProps = {
  children: ReactNode;
  /** HTML tag to render — defaults to a paragraph, use "h2"/"h3" for headings. */
  as?: ElementType;
  className?: string;
};

/**
 * A single statement/line that reveals itself (fade + upward drift) as it
 * scrolls into view, independently of any siblings — each Statement gets
 * its own ScrollTrigger so a list of them staggers naturally by scroll
 * position rather than firing all at once.
 */
export default function Statement({ children, as: Tag = "p", className }: StatementProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    revealElementsIndividually([el]);
  }, []);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}