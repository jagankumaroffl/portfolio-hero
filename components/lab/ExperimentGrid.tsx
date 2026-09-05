"use client";

import { forwardRef } from "react";
import type { ExperimentData } from "./lab.data";
import ExperimentCard from "./ExperimentCard";

interface ExperimentGridProps {
  experiments: ExperimentData[];
  cardRef?: (index: number, el: HTMLButtonElement | null) => void;
  visualRef?: (index: number, el: HTMLDivElement | null) => void;
  titleRef?: (index: number, el: HTMLHeadingElement | null) => void;
  onOpen: (index: number) => void;
}

/**
 * The editorial, irregular-but-intentional grid of experiment cards. Card
 * sizing (large/medium/small) comes from each experiment's `size` field in
 * lab.data.ts and is expressed purely through CSS grid spans in
 * lab.styles.ts — this component only maps data to cards in order, so the
 * "large, small, medium, large, small" rhythm the brief asks for lives in
 * the data + CSS, not in bespoke per-card markup here.
 */
const ExperimentGrid = forwardRef<HTMLDivElement, ExperimentGridProps>(
  function ExperimentGrid({ experiments, cardRef, visualRef, titleRef, onOpen }, ref) {
    return (
      <div ref={ref} className="lb-grid">
        {experiments.map((experiment, index) => (
          <ExperimentCard
            key={experiment.id}
            experiment={experiment}
            ref={(el) => cardRef?.(index, el)}
            visualRef={(el) => visualRef?.(index, el)}
            titleRef={(el) => titleRef?.(index, el)}
            onOpen={() => onOpen(index)}
          />
        ))}
      </div>
    );
  }
);

export default ExperimentGrid;