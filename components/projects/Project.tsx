"use client";

import { useEffect, useRef } from "react";
import { revealProjectOnScroll } from "@/lib/animations/projects";
import ProjectImage from "./ProjectImage";
import ProjectContent from "./ProjectContent";
import type { ProjectData } from "./projects.data";

type ProjectProps = {
  project: ProjectData;
  /** Odd (1st, 3rd, ...) projects show image-left/content-right; even projects mirror it. */
  index: number;
};

/**
 * One "Selected Work" case study: a large translucent number, the
 * screenshot (70% width), and the content column (title, description,
 * story, stack, buttons). Alternates image side by index on desktop —
 * odd projects image-left, even projects image-right — and stacks
 * image-first on mobile via CSS.
 *
 * Every part reveals as one cascade (number -> image -> title ->
 * description -> stack -> buttons) the moment this project scrolls into
 * view, independent of every other project on the page.
 */
export default function Project({ project, index }: ProjectProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const numberRef = useRef<HTMLParagraphElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const descriptionRef = useRef<HTMLDivElement | null>(null);
  const stackRef = useRef<HTMLDivElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const tweens = revealProjectOnScroll(root, {
      number: numberRef.current,
      image: imageRef.current,
      title: titleRef.current,
      description: descriptionRef.current,
      stack: stackRef.current,
      buttons: buttonsRef.current,
    });

    return () => {
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    };
  }, []);

  const isOdd = index % 2 === 0; // index is 0-based: project 1 (index 0) is "odd"

  return (
    <section
      ref={rootRef}
      className={`pw-project ${isOdd ? "pw-project--odd" : "pw-project--even"}`}
      aria-label={project.title}
    >
      <p ref={numberRef} className="pw-project-number" aria-hidden="true">
        {project.number}
      </p>

      <div className="pw-project-inner">
        <div className="pw-project-media">
          <ProjectImage
            alt={project.imageAlt}
            visual={project.visual}
            image={project.image}
            imageRef={imageRef}
          />
        </div>

        <ProjectContent
          project={project}
          titleRef={titleRef}
          descriptionRef={descriptionRef}
          stackRef={stackRef}
          buttonsRef={buttonsRef}
        />
      </div>
    </section>
  );
}