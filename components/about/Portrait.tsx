"use client";

import { useEffect, useRef, useState } from "react";
import { scalePortraitOnScroll } from "@/lib/animations/about";
import { PORTRAIT_SCALE_RANGE } from "@/lib/animations/aboutConstants";
import Statement from "./Statement";

/**
 * Expected real portrait path. Save the final image here as exactly this
 * filename and it renders automatically — nothing else needs to change.
 * Until that file exists, the request 404s once and this falls back to the
 * existing gradient placeholder rather than showing broken-image UI or any
 * "placeholder" text on the live site.
 */
const PORTRAIT_SRC = "/images/about/portrait.png";

/**
 * Scene 4: portrait image at ~45% width beside supporting text at ~55%.
 * The image scales very subtly as it scrolls through the viewport —
 * transform only, no rotation, no other effects. `object-fit: cover`
 * inside the existing fixed-aspect-ratio wrapper keeps the crop
 * intentional and prevents distortion or overflow on any screen size.
 *
 * Loaded eagerly (no `loading="lazy"`) on purpose: the site's loader
 * gates its own exit on every <img> in the DOM firing load/error
 * (see waitForImages() in lib/loader.ts). A lazy image below the fold
 * never starts its fetch until scrolled near — but scrolling is exactly
 * what's locked while the loader is up — so lazy-loading this image
 * would deadlock the loader forever.
 */
export default function Portrait() {
  const imageRef = useRef<HTMLDivElement | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const el = imageRef.current;
    if (!el) return;
    const trigger = scalePortraitOnScroll(el, PORTRAIT_SCALE_RANGE);
    return () => {
      trigger?.kill();
    };
  }, []);

  return (
    <section className="ab-scene ab-portrait" aria-label="Portrait">
      <div className="ab-portrait-image-wrap">
        <div ref={imageRef} className="ab-portrait-image">
          {hasError ? (
            <div className="ab-portrait-fallback" role="img" aria-label="Portrait of Jagan" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={PORTRAIT_SRC}
              alt="Portrait of Jagan Kumar"
              className="ab-portrait-img"
              onError={() => setHasError(true)}
            />
          )}
        </div>
      </div>
      <div className="ab-portrait-text">
        <Statement as="p" className="ab-portrait-line">
          I care about the details most people scroll past.
        </Statement>
        <Statement as="p" className="ab-portrait-line">
          Every interaction is a chance to make something feel considered.
        </Statement>
      </div>
    </section>
  );
}