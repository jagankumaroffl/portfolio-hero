"use client";

import { forwardRef, useEffect, useId, useRef, useState } from "react";
import type { ExperimentData } from "./lab.data";

interface ExperimentDetailProps {
  experiment: ExperimentData | null;
  onClose: () => void;
  contentRef?: (el: HTMLDivElement | null) => void;
}

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * The expanded detail overlay for a single experiment — an accessible
 * modal dialog, not a page navigation. Always mounted (so its GSAP
 * open/close timeline in lab.ts has stable elements to animate); visibility
 * and interactivity are controlled by `experiment` being non-null rather
 * than by mounting/unmounting, so open/close never causes a layout jump.
 *
 * The visual area mirrors ExperimentCard: shows the real screenshot at
 * `experiment.image` when it loads, falling back to the same geometric
 * doodle style otherwise. Per-experiment failure state resets whenever the
 * open card changes, so a previous card's failure/success doesn't leak
 * into the next one.
 *
 * Accessibility:
 * - `role="dialog"` + `aria-modal="true"` + labelled by the title.
 * - Escape closes (bound only while open).
 * - Focus moves to the close button on open and is trapped within the
 *   panel via a Tab/Shift+Tab handler; the parent (Lab.tsx) is responsible
 *   for returning focus to the trigger card on close.
 * - The backdrop is inert to pointer users only when closed (display:none
 *   is applied by the GSAP close timeline itself in lab.ts), so it never
 *   sits in the accessibility tree while hidden.
 *
 * `data-lenis-prevent` on the panel tells Lenis (which otherwise intercepts
 * wheel/touch globally for its smooth-scroll virtualization) to leave this
 * element's native scrolling alone — without it, Lenis was swallowing wheel
 * input over the panel, leaving only scrollbar-dragging as a way to scroll
 * the detail content.
 */
const ExperimentDetail = forwardRef<HTMLDivElement, ExperimentDetailProps>(
  function ExperimentDetail({ experiment, onClose, contentRef }, backdropRef
  ) {
    const panelRef = useRef<HTMLDivElement | null>(null);
    const closeButtonRef = useRef<HTMLButtonElement | null>(null);
    const imgElRef = useRef<HTMLImageElement | null>(null);
    const titleId = useId();
    const [imageFailed, setImageFailed] = useState(false);
    const showRealImage = Boolean(experiment?.image) && !imageFailed;

    // Reset per experiment, so switching cards while the modal is mounted
    // doesn't carry over a previous card's failed/succeeded state.
    useEffect(() => {
      setImageFailed(false);
    }, [experiment?.id]);

    // Same SSR/hydration race as ExperimentCard: a 404 can resolve before
    // the onError listener attaches, so double-check on mount.
    useEffect(() => {
      const img = imgElRef.current;
      if (img && img.complete && img.naturalWidth === 0) {
        setImageFailed(true);
      }
    }, [experiment?.image]);

    useEffect(() => {
      if (!experiment) return;

      closeButtonRef.current?.focus();

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
          return;
        }
        if (e.key !== "Tab") return;

        const panel = panelRef.current;
        if (!panel) return;
        const focusable = Array.from(
          panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter((el) => !el.hasAttribute("disabled"));
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;

        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      };

      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, [experiment, onClose]);

    return (
      <div
        ref={backdropRef}
        className="lb-detail-backdrop"
        role="presentation"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {experiment && (
          <div
            ref={panelRef}
            className="lb-detail-panel"
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="lb-detail-close"
              onClick={onClose}
              aria-label="Close experiment detail"
            >
              Close
            </button>

            <div ref={contentRef} className="lb-detail-content">
              <div className="lb-detail-meta">
                <span className="lb-detail-number">{experiment.number}</span>
                <span className="lb-detail-status">
                  <span className="lb-detail-status-dot" aria-hidden="true" />
                  {experiment.status}
                </span>
              </div>

              <h3 id={titleId} className="lb-detail-title">
                {experiment.title}
              </h3>
              <p className="lb-detail-category">{experiment.category}</p>

              <div className="lb-detail-visual" aria-hidden={!showRealImage}>
                {showRealImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    ref={imgElRef}
                    src={experiment.image}
                    alt={experiment.title}
                    className="lb-detail-visual-image"
                    loading="eager"
                    onError={() => setImageFailed(true)}
                  />
                ) : (
                  <svg viewBox="0 0 240 140" fill="none" className="lb-detail-visual-svg">
                    <rect x="10" y="10" width="220" height="120" rx="3" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1" />
                    <circle cx="70" cy="70" r="26" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1" />
                    <path d="M120 70 L210 70" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="4 5" />
                    <circle cx="70" cy="70" r="3" fill="currentColor" fillOpacity="0.6" />
                  </svg>
                )}
              </div>

              <p className="lb-detail-description">{experiment.description}</p>

              <div className="lb-detail-section">
                <p className="lb-detail-label">Why I&apos;m exploring this</p>
                <p className="lb-detail-text">{experiment.why}</p>
              </div>

              <div className="lb-detail-section">
                <p className="lb-detail-label">Current direction</p>
                <p className="lb-detail-text">{experiment.currentDirection}</p>
              </div>

              {experiment.attribution && (
                <div className="lb-detail-section">
                  <p className="lb-detail-label">Credit</p>
                  <p className="lb-detail-text">{experiment.attribution}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default ExperimentDetail;