"use client";

import { type RefObject } from "react";
import type { ProjectData } from "./projects.data";

type ProjectContentProps = {
  project: ProjectData;
  titleRef?: RefObject<HTMLHeadingElement | null>;
  descriptionRef?: RefObject<HTMLDivElement | null>;
  stackRef?: RefObject<HTMLDivElement | null>;
  buttonsRef?: RefObject<HTMLDivElement | null>;
};

/**
 * Title, short description, problem/solution/outcome story, tech stack
 * (plain typography, no colorful badges), and action buttons for one
 * project. Refs are exposed so the parent Project component can drive a
 * single cascading reveal timeline across all of this content together.
 */
export default function ProjectContent({
  project,
  titleRef,
  descriptionRef,
  stackRef,
  buttonsRef,
}: ProjectContentProps) {
  return (
    <div className="pw-project-content">
      <p className="pw-project-category">{project.category}</p>

      <h3 ref={titleRef} className="pw-project-title">
        {project.title}
      </h3>

      <div ref={descriptionRef}>
        <p className="pw-project-description">{project.description}</p>

        <div className="pw-project-story">
          <div className="pw-story-row">
            <span className="pw-story-label">Problem</span>
            <p className="pw-story-value">{project.problem}</p>
          </div>
          <div className="pw-story-row">
            <span className="pw-story-label">Solution</span>
            <p className="pw-story-value">{project.solution}</p>
          </div>
          <div className="pw-story-row">
            <span className="pw-story-label">Outcome</span>
            <p className="pw-story-value">{project.outcome}</p>
          </div>
        </div>
      </div>

      <div ref={stackRef} className="pw-stack">
        <p className="pw-stack-label">Built with</p>
        <ul className="pw-stack-list">
          {project.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </div>

      <div ref={buttonsRef} className="pw-buttons">
        {project.liveUrl && (
          <a className="pw-button" href={project.liveUrl} target="_blank" rel="noreferrer">
            Live Demo
          </a>
        )}
        {project.githubUrl && (
          <a className="pw-button" href={project.githubUrl} target="_blank" rel="noreferrer">
            GitHub
          </a>
        )}
      </div>
    </div>
  );
}