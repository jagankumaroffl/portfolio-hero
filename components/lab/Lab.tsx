"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/loader";
import { ScrollTrigger, ensureGsapRegistered, gsap } from "@/lib/scroll/gsap";
import { useLenis } from "@/components/providers/SmoothScrollProvider";
import {
  bindCardHover,
  hideDetailBackdrop,
  playDetailOpen,
  revealElementsIndividually,
  revealGridOnScroll,
  revealLinesOnScroll,
} from "@/lib/animations/lab";
import LabIntro from "./LabIntro";
import ExperimentGrid from "./ExperimentGrid";
import ExperimentDetail from "./ExperimentDetail";
import LabEnding from "./LabEnding";
import { EXPERIMENTS } from "./lab.data";
import { labStyles } from "./lab.styles";

/**
 * The complete Lab section: intro statement, an editorial grid of
 * experiment cards that expand into an accessible detail overlay on
 * click/Enter/Space, and a closing statement. Composition + state + ref
 * wiring only — the GSAP work lives in lib/animations/lab.ts, matching the
 * split used by Journey.tsx and Toolbox.tsx.
 *
 * The section used to also render its own "Let's Build Together" line
 * right before the Contact section's real heading of the same text —
 * removed, since Contact already owns that heading and having it twice in
 * a row read as a duplicate.
 *
 * Scroll lock while the detail overlay is open reuses the exact mechanism
 * the Loader already relies on (SmoothScrollProvider's `useLenis()` +
 * the global `html[data-scroll-locked="true"]` CSS rule in globals.css) —
 * no new lock logic, no change to either of those files. Because the
 * overlay is `position: fixed` and closing never touches window.scrollY,
 * the page never jumps; the scroll position simply becomes interactive
 * again the instant the lock lifts.
 */
export default function Lab() {
  const rootRef = useRef<HTMLElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const endingRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const detailContentRef = useRef<HTMLDivElement | null>(null);
  const openTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const visualRefs = useRef<Array<HTMLDivElement | null>>([]);
  const titleRefs = useRef<Array<HTMLHeadingElement | null>>([]);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const lenis = useLenis();

  const handleOpen = useCallback((index: number) => {
    lastTriggerRef.current = cardRefs.current[index] ?? null;
    setOpenIndex(index);
  }, []);

  const handleClose = useCallback(() => {
    setOpenIndex(null);
  }, []);

  // Scroll-lock + open/close animation + focus return, driven by
  // openIndex. Reuses the global data-scroll-locked attribute and the
  // shared Lenis instance rather than introducing a second lock mechanism.
  useEffect(() => {
    const backdrop = backdropRef.current;
    if (!backdrop) return;

    if (openIndex === null) {
      const tl = openTimelineRef.current;
      if (tl) {
        tl.eventCallback("onReverseComplete", () => hideDetailBackdrop(backdrop));
        tl.reverse();
      }
      document.documentElement.setAttribute("data-scroll-locked", "false");
      lenis?.start();
      lastTriggerRef.current?.focus();
      return;
    }

    document.documentElement.setAttribute("data-scroll-locked", "true");
    lenis?.stop();

    const panel = backdrop.querySelector<HTMLElement>(".lb-detail-panel");
    if (!panel) return;

    const tl = playDetailOpen({
      backdrop,
      panel,
      content: detailContentRef.current ? Array.from(detailContentRef.current.children) : undefined,
    });
    openTimelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [openIndex, lenis]);

  // Belt-and-braces cleanup: if the component unmounts while the overlay
  // is open, don't leave scroll permanently locked.
  useEffect(() => {
    return () => {
      if (openIndex !== null) {
        document.documentElement.setAttribute("data-scroll-locked", "false");
        lenis?.start();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    if (gridRef.current) {
      const cards = Array.from(gridRef.current.children);
      const tweens = revealGridOnScroll(gridRef.current, cards);
      cleanups.push(() => {
        tweens.forEach((t) => {
          t.scrollTrigger?.kill();
          t.kill();
        });
      });
    }

    if (!reduced) {
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const unbind = bindCardHover(card, {
          visual: visualRefs.current[i],
          title: titleRefs.current[i],
        });
        cleanups.push(unbind);
      });
    }

    if (endingRef.current) {
      const children = Array.from(endingRef.current.children);
      const tweens = revealElementsIndividually(children);
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

  const openExperiment = openIndex !== null ? EXPERIMENTS[openIndex] : null;

  return (
    <section ref={rootRef} id="lab" className="lb-root" aria-label="The Lab">
      <div className="lb-grid-backdrop" aria-hidden="true" />
      <span className="lb-grid-label lb-grid-label--tl" aria-hidden="true">
        LAB / 05
      </span>
      <span className="lb-grid-label lb-grid-label--br" aria-hidden="true">
        IN PROGRESS
      </span>

      <LabIntro ref={introRef} />

      <ExperimentGrid
        ref={gridRef}
        experiments={EXPERIMENTS}
        cardRef={(index, el) => {
          cardRefs.current[index] = el;
        }}
        visualRef={(index, el) => {
          visualRefs.current[index] = el;
        }}
        titleRef={(index, el) => {
          titleRefs.current[index] = el;
        }}
        onOpen={handleOpen}
      />

      <ExperimentDetail
        ref={backdropRef}
        experiment={openExperiment}
        onClose={handleClose}
        contentRef={(el) => {
          detailContentRef.current = el;
        }}
      />

      <LabEnding ref={endingRef} />

      <style>{labStyles}</style>
    </section>
  );
}