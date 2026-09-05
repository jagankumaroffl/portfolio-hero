"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import type { ExperimentData } from "./lab.data";

interface ExperimentCardProps {
  experiment: ExperimentData;
  visualRef?: (el: HTMLDivElement | null) => void;
  titleRef?: (el: HTMLHeadingElement | null) => void;
  onOpen: () => void;
}

/**
 * Tasteful abstract placeholder for an experiment's visual area — a small
 * set of geometric marks that read as "workshop sketch", not stock
 * imagery. Deterministic per experiment id (no randomness) so the same
 * card always renders the same placeholder, and easy to swap for a real
 * GIF/screenshot/video later without touching layout.
 */
function VisualPlaceholder({ id }: { id: string }) {
  const seed = id.length + id.charCodeAt(0);
  const rotate = (seed % 5) - 2;
  return (
    <svg viewBox="0 0 120 80" fill="none" aria-hidden="true" className="lb-card-visual-svg">
      <rect x="8" y="8" width="104" height="64" rx="2" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />
      <circle cx="34" cy="40" r="14" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1" />
      <path
        d={`M60 ${40 - rotate * 4} L104 ${40 + rotate * 4}`}
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1"
        strokeDasharray="3 4"
      />
      <circle cx="34" cy="40" r="2" fill="currentColor" fillOpacity="0.6" />
    </svg>
  );
}

/**
 * A single experiment entry in the grid. Rendered as a `<button>` — not a
 * clickable `<div>` — so it's natively keyboard-operable (Enter/Space)
 * and reachable by Tab, with `aria-haspopup="dialog"` signaling that
 * activating it opens the detail overlay. Card-level hover animation
 * (lift/visual-scale/title-shift) is wired imperatively by the parent via
 * bindCardHover against the visual/title refs this component exposes.
 *
 * The visual area shows the real screenshot at `experiment.image` when it
 * loads, falling back to the geometric doodle placeholder when the file
 * is missing or fails to load — decided independently per card, doodle
 * never removed. Loaded eagerly for the loader-deadlock reason noted
 * below, and double-checked after mount because a same-origin 404 often
 * resolves before hydration attaches the onError listener.
 */
const ExperimentCard = forwardRef<HTMLButtonElement, ExperimentCardProps>(
  function ExperimentCard({ experiment, visualRef, titleRef, onOpen }, ref) {
    const [imageFailed, setImageFailed] = useState(false);
    const imgElRef = useRef<HTMLImageElement | null>(null);
    const showRealImage = Boolean(experiment.image) && !imageFailed;

    // A 404/broken image often resolves before React finishes hydrating
    // (the server-rendered <img> starts fetching immediately, well before
    // the onError listener attaches), so the error event fires and is
    // missed. Once mounted, check the element directly: `complete` with a
    // zero `naturalWidth` means it already failed to load.
    useEffect(() => {
      const img = imgElRef.current;
      if (img && img.complete && img.naturalWidth === 0) {
        setImageFailed(true);
      }
    }, [experiment.image]);

    return (
      <button
        ref={ref}
        type="button"
        className={`lb-card lb-card--${experiment.size}`}
        aria-haspopup="dialog"
        onClick={onOpen}
      >
        <div className="lb-card-top">
          <span className="lb-card-number">{experiment.number}</span>
          <span className="lb-card-status">
            <span className="lb-card-status-dot" aria-hidden="true" />
            {experiment.status}
          </span>
        </div>

        <div ref={visualRef} className="lb-card-visual">
          {showRealImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imgElRef}
              src={experiment.image}
              alt={experiment.title}
              className="lb-card-visual-image"
              loading="eager"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <VisualPlaceholder id={experiment.id} />
          )}
        </div>

        <div className="lb-card-body">
          <h3 ref={titleRef} className="lb-card-title">
            {experiment.title}
          </h3>
          <p className="lb-card-category">{experiment.category}</p>
          <p className="lb-card-description">{experiment.description}</p>
        </div>

        <span className="lb-card-open" aria-hidden="true">
          Open
        </span>
      </button>
    );
  }
);

export default ExperimentCard;