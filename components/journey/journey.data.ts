// Journey milestone data, kept separate from presentation so JourneyLine /
// JourneyMilestone components stay pure render layers. Only content
// specified in the Journey section brief — nothing invented.

export type JourneyVisual = "code" | "hardware" | "ai" | "product";

export interface JourneyMilestoneData {
  id: string;
  year: string;
  title: string;
  description: string;
  visual: JourneyVisual;
  current?: boolean;
}

export const JOURNEY_MILESTONES: JourneyMilestoneData[] = [
  {
    id: "2023",
    year: "2023",
    title: "Learning to Build",
    description:
      "Started with programming fundamentals and began developing a strong foundation in C, Java and Python.",
    visual: "code",
  },
  {
    id: "2024",
    year: "2024",
    title: "Engineering in the Real World",
    description:
      "Explored embedded systems, PCB design, Arduino, ESP32 and hardware-oriented problem solving.",
    visual: "hardware",
  },
  {
    id: "2025",
    year: "2025",
    title: "Software & AI",
    description:
      "Moved deeper into Python, web development, APIs, computer vision and AI-powered applications.",
    visual: "ai",
  },
  {
    id: "2026",
    year: "2026",
    title: "Building Products",
    description:
      "Focused on creating software and AI experiences with thoughtful engineering, interaction and design.",
    visual: "product",
    current: true,
  },
];