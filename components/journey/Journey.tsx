"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/loader";
import { ensureGsapRegistered, ScrollTrigger } from "@/lib/scroll/gsap";
import {
  activateMilestone,
  deactivateMilestone,
  drawJourneyLine,
  revealElementsIndividually,
  revealLinesOnScroll,
  setMilestoneInitialState,
} from "@/lib/animations/journey";
import { LINE_SCENE_SCROLL_VH } from "@/lib/animations/journeyConstants";
import JourneyIntro from "./JourneyIntro";
import JourneyLine from "./JourneyLine";
import JourneyMilestone from "./JourneyMilestone";
import JourneyEnding from "./JourneyEnding";
import { JOURNEY_MILESTONES } from "./journey.data";
import { journeyStyles } from "./journey.styles";

const MOBILE_BREAKPOINT = "(max-width: 767px)";

interface MilestoneRefs {
  root: HTMLDivElement | null;
  node: HTMLDivElement | null;
  year: HTMLParagraphElement | null;
  title: HTMLHeadingElement | null;
  description: HTMLParagraphElement | null;
}

/**
 * The complete Journey section: intro statement, a scroll-drawn progress
 * line with four milestones (horizontal + pinned on desktop, vertical +
 * unpinned on mobile), and a closing statement that hands off into the
 * Toolbox section. Composition only — the actual GSAP work lives in
 * lib/animations/journey.ts so this component stays about wiring refs to
 * that module and cleaning up on unmount.
 */
export default function Journey() {
  const rootRef = useRef<HTMLElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const lineSceneRef = useRef<HTMLDivElement | null>(null);
  const linePinRef = useRef<HTMLDivElement | null>(null);
  const lineFillRef = useRef<HTMLDivElement | null>(null);
  const endingRef = useRef<HTMLDivElement | null>(null);

  const milestoneRefs = useRef<MilestoneRefs[]>(
    JOURNEY_MILESTONES.map(() => ({
      root: null,
      node: null,
      year: null,
      title: null,
      description: null,
    }))
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    ensureGsapRegistered();
    const reduced = prefersReducedMotion();
    const cleanups: Array<() => void> = [];

    if (introRef.current) {
      const lines = Array.from(introRef.current.children) as HTMLElement[];
      lines.forEach((line) => {
        const split = revealLinesOnScroll(line);
        cleanups.push(() => split.revert());
      });
    }

    const milestones = milestoneRefs.current;
    const isMobile =
      typeof window !== "undefined" && window.matchMedia(MOBILE_BREAKPOINT).matches;

    if (!reduced) {
      milestones.forEach((m) => {
        setMilestoneInitialState({
          node: m.node,
          year: m.year,
          title: m.title,
          description: m.description,
        });
      });
    }

    if (!reduced && !isMobile && lineFillRef.current && lineSceneRef.current) {
      const total = milestones.length;
      let activeIndex = -1;

      const trigger = drawJourneyLine(lineFillRef.current, {
        trigger: lineSceneRef.current,
        axis: "x",
        scrollDistance: `${LINE_SCENE_SCROLL_VH - 100}%`,
        pin: linePinRef.current ?? undefined,
        onProgress: (progress) => {
          const threshold = Math.floor(progress * total);
          const targetIndex = Math.min(threshold, total - 1);

          if (targetIndex > activeIndex) {
            for (let i = activeIndex + 1; i <= targetIndex; i += 1) {
              const m = milestones[i];
              if (m) {
                activateMilestone({
                  node: m.node,
                  year: m.year,
                  title: m.title,
                  description: m.description,
                });
              }
            }
            activeIndex = targetIndex;
          } else if (targetIndex < activeIndex) {
            for (let i = activeIndex; i > targetIndex; i -= 1) {
              const m = milestones[i];
              if (m) {
                deactivateMilestone({
                  node: m.node,
                  year: m.year,
                  title: m.title,
                  description: m.description,
                });
              }
            }
            activeIndex = targetIndex;
          }
        },
      });

      if (trigger) {
        cleanups.push(() => trigger.kill());
      }
    } else if (!reduced && isMobile) {
      // Mobile: no pinned scrub, no drawn line — each milestone reveals
      // independently as it enters the viewport, same visual language
      // (node -> year -> title -> description) via its own ScrollTrigger.
      milestones.forEach((m) => {
        if (!m.root) return;
        const parts: HTMLElement[] = [m.node, m.year, m.title, m.description].filter(
          (el): el is NonNullable<typeof el> => el !== null
        );
        const tweens = revealElementsIndividually(parts, { stagger: 0.1 });
        cleanups.push(() => {
          tweens.forEach((t) => {
            t.scrollTrigger?.kill();
            t.kill();
          });
        });
      });
    }

    if (endingRef.current) {
      const children = Array.from(endingRef.current.children);
      const tweens = revealElementsIndividually(children, { stagger: 0.15 });
      cleanups.push(() => {
        tweens.forEach((t) => {
          t.scrollTrigger?.kill();
          t.kill();
        });
      });
    }

    return () => {
      cleanups.forEach((fn) => fn());
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger && root.contains(st.trigger as Node)) {
          st.kill();
        }
      });
    };
  }, []);

  return (
    <section ref={rootRef} id="journey" className="jy-root" aria-label="Journey">
      <JourneyIntro ref={introRef} />

      <div ref={lineSceneRef} className="jy-line-scene">
        <div ref={linePinRef} className="jy-line-pin">
          <JourneyLine ref={lineFillRef} />
          <div className="jy-milestones">
            {JOURNEY_MILESTONES.map((milestone, index) => (
              <JourneyMilestone
                key={milestone.id}
                milestone={milestone}
                index={index}
                ref={(el) => {
                  milestoneRefs.current[index].root = el;
                }}
                nodeRef={(el) => {
                  milestoneRefs.current[index].node = el;
                }}
                yearRef={(el) => {
                  milestoneRefs.current[index].year = el;
                }}
                titleRef={(el) => {
                  milestoneRefs.current[index].title = el;
                }}
                descriptionRef={(el) => {
                  milestoneRefs.current[index].description = el;
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <JourneyEnding ref={endingRef} />

      <style>{journeyStyles}</style>
    </section>
  );
}