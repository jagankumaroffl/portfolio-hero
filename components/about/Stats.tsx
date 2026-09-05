"use client";

import { useEffect, useRef } from "react";
import { countUpStat, revealElementsIndividually } from "@/lib/animations/about";

type Stat = {
  key: string;
  value: string;
  numeric?: number;
  suffix?: string;
  label: string;
};

const STATS: Stat[] = [
  { key: "projects", value: "10+", numeric: 10, suffix: "+", label: "Projects" },
  { key: "ai", value: "AI", label: "Builder" },
  { key: "learning", value: "Always", label: "Learning" },
  { key: "open", value: "Open", label: "To Work" },
];

/**
 * Scene 6: minimal stats as four vertical columns, no cards. Numeric stats
 * count up from 0 as they scroll into view; non-numeric ones (AI, Always,
 * Open) get the same subtle fade-up as everything else in the section.
 */
export default function Stats() {
  const numberRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const columnRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    STATS.forEach((stat) => {
      if (stat.numeric === undefined) return;
      const el = numberRefs.current.get(stat.key);
      if (el) countUpStat(el, stat.numeric, stat.suffix ?? "");
    });

    revealElementsIndividually(columnRefs.current, { stagger: 0.08 });
  }, []);

  return (
    <section className="ab-scene ab-stats" aria-label="Stats">
      <div className="ab-stats-grid">
        {STATS.map((stat, i) => (
          <div
            key={stat.key}
            ref={(node) => {
              if (node) columnRefs.current[i] = node;
            }}
            className="ab-stats-column"
          >
            <p className="ab-stats-value">
              {stat.numeric !== undefined ? (
                <span
                  ref={(node) => {
                    if (node) numberRefs.current.set(stat.key, node);
                  }}
                >
                  0{stat.suffix ?? ""}
                </span>
              ) : (
                stat.value
              )}
            </p>
            <p className="ab-stats-label">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}