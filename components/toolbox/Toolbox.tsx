"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/loader";
import { ScrollTrigger, ensureGsapRegistered } from "@/lib/scroll/gsap";
import {
  bindToolHover,
  revealCategoryOnScroll,
  revealElementsIndividually,
  revealLinesOnScroll,
  spotlightTool,
} from "@/lib/animations/toolbox";
import ToolboxIntro from "./ToolboxIntro";
import ToolboxCategory from "./ToolboxCategory";
import ToolboxEnding from "./ToolboxEnding";
import { TOOLBOX_CATEGORIES } from "./toolbox.data";
import { toolboxStyles } from "./toolbox.styles";

/**
 * The complete Toolbox section: intro statement, section title, five
 * category rows that reveal sequentially as the user scrolls, and a
 * closing statement that hands off into the Lab section. Composition +
 * ref wiring only — the GSAP work lives in lib/animations/toolbox.ts,
 * matching the split used by Journey.tsx.
 */
export default function Toolbox() {
  const rootRef = useRef<HTMLElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const categoriesRef = useRef<HTMLDivElement | null>(null);
  const endingRef = useRef<HTMLDivElement | null>(null);

  const categoryRootRefs = useRef<Array<HTMLDivElement | null>>([]);
  const categoryHeadingRefs = useRef<Array<HTMLDivElement | null>>([]);
  const toolButtonRefs = useRef<Array<Array<HTMLButtonElement | null>>>(
    TOOLBOX_CATEGORIES.map((category) => category.tools.map(() => null))
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
    if (headingRef.current) {
      const split = revealLinesOnScroll(headingRef.current);
      cleanups.push(() => split.revert());
    }
    if (subtitleRef.current) {
      const split = revealLinesOnScroll(subtitleRef.current);
      cleanups.push(() => split.revert());
    }

    TOOLBOX_CATEGORIES.forEach((_category, index) => {
      const categoryRoot = categoryRootRefs.current[index];
      if (!categoryRoot) return;
      const tools = categoryRoot.querySelectorAll<HTMLElement>(".tb-tool");
      const tweens = revealCategoryOnScroll(categoryRoot, {
        heading: categoryHeadingRefs.current[index],
        tools,
      });
      cleanups.push(() => {
        tweens.forEach((t) => {
          t.scrollTrigger?.kill();
          t.kill();
        });
      });
    });

    if (!reduced) {
      const allButtons = toolButtonRefs.current.flat().filter((el): el is HTMLButtonElement =>
        Boolean(el)
      );

      toolButtonRefs.current.forEach((row) => {
        row.forEach((button) => {
          if (!button) return;
          const underline = button.querySelector(".tb-tool-underline");
          const unbindHover = bindToolHover(button, underline);

          let unspotlight: (() => void) | null = null;
          const onEnter = () => {
            unspotlight = spotlightTool(button, allButtons);
          };
          const onLeave = () => {
            unspotlight?.();
            unspotlight = null;
          };
          button.addEventListener("pointerenter", onEnter);
          button.addEventListener("pointerleave", onLeave);
          button.addEventListener("focus", onEnter);
          button.addEventListener("blur", onLeave);

          cleanups.push(() => {
            unbindHover();
            button.removeEventListener("pointerenter", onEnter);
            button.removeEventListener("pointerleave", onLeave);
            button.removeEventListener("focus", onEnter);
            button.removeEventListener("blur", onLeave);
            unspotlight?.();
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
    <section ref={rootRef} id="toolbox" className="tb-root" aria-label="The Toolbox">
      <ToolboxIntro ref={introRef} />

      <div className="tb-heading-scene">
        <h2 ref={headingRef} className="tb-heading">
          The Toolbox
        </h2>
        <p ref={subtitleRef} className="tb-subtitle">
          Tools I reach for to turn ideas into products.
        </p>
      </div>

      <div ref={categoriesRef} className="tb-categories">
        {TOOLBOX_CATEGORIES.map((category, index) => (
          <ToolboxCategory
            key={category.number}
            category={category}
            ref={(el) => {
              categoryRootRefs.current[index] = el;
            }}
            headingRef={(el) => {
              categoryHeadingRefs.current[index] = el;
            }}
            toolRef={(toolIndex, el) => {
              toolButtonRefs.current[index][toolIndex] = el;
            }}
          />
        ))}
      </div>

      <ToolboxEnding ref={endingRef} />

      <style>{toolboxStyles}</style>
    </section>
  );
}