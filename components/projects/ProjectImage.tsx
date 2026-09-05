"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import { bindImageHover, parallaxImageOnScroll } from "@/lib/animations/projects";
import { ProjectVisual, type ProjectVisualId } from "./ProjectVisuals";

type ProjectImageProps = {
  alt: string;
  /** Which editorial line-art diagram to render if there's no real image. */
  visual: ProjectVisualId;
  /** Real screenshot path from projects.data.ts, e.g. "/images/projects/sansa_image.png". */
  image: string;
  /** Exposes the mounted image element to the parent's reveal cascade. */
  imageRef?: RefObject<HTMLDivElement | null>;
};

/**
 * Project visual wrapper: renders the real screenshot at `image` when it
 * loads successfully, and falls back to the editorial line-art doodle
 * (`visual`) when the file is missing, the path is wrong, or the image
 * otherwise fails to load. The doodle asset is never removed from the
 * bundle — it's the permanent fallback, decided independently per project.
 *
 * Loaded eagerly, not lazily: this page's loader (`waitForPageReady`)
 * waits for every <img> in the DOM to fire load/error, while scroll stays
 * locked. A lazy image below the fold never even starts fetching in that
 * state, so the loader would hang forever.
 *
 * A same-origin 404 often resolves before hydration attaches the onError
 * listener, so the failure is double-checked directly on the element
 * after mount (`complete` + zero `naturalWidth`).
 *
 * The wrapper div keeps the same class, ref, parallax, and hover wiring
 * regardless of which child renders, so none of that behavior changes.
 */
export default function ProjectImage({ alt, visual, image, imageRef }: ProjectImageProps) {
  const localRef = useRef<HTMLDivElement | null>(null);
  const imgElRef = useRef<HTMLImageElement | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const showRealImage = Boolean(image) && !imageFailed;

  useEffect(() => {
    const el = imageRef?.current ?? localRef.current;
    if (!el) return;

    const trigger = parallaxImageOnScroll(el);
    const unbindHover = bindImageHover(el);

    return () => {
      trigger?.kill();
      unbindHover();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A 404/broken image often resolves before React finishes hydrating (the
  // server-rendered <img> starts fetching immediately, well before the
  // onError listener attaches), so the error event fires and is missed.
  // Once mounted, check the element directly: `complete` with a zero
  // `naturalWidth` means it already failed to load.
  useEffect(() => {
    const img = imgElRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setImageFailed(true);
    }
  }, [image]);

  return (
    <div
      ref={(node) => {
        localRef.current = node;
        if (imageRef) imageRef.current = node;
      }}
      className="pw-project-image"
      role="img"
      aria-label={alt}
    >
      {showRealImage ? (
        <Image
          ref={imgElRef}
          src={image}
          alt={alt}
          fill
          loading="eager"
          sizes="(max-width: 767px) 100vw, 70vw"
          style={{ objectFit: "cover" }}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <ProjectVisual id={visual} />
      )}
    </div>
  );
}