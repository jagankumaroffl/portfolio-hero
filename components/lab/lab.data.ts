// Lab experiment data, kept separate from presentation. Content reflects
// what's actually explored/built — small learning projects, running and
// studying other people's working code, and personal experiments — rather
// than polished portfolio pieces. Nothing invented, no claimed outcomes,
// no fabricated URLs. Layout size ("large" | "medium" | "small") drives the
// editorial grid rhythm in lab.styles.ts without affecting card order or
// content.

export type ExperimentStatus = "Building" | "Experiment" | "Research" | "Exploring" | "Learning";
export type ExperimentSize = "large" | "medium" | "small";

export interface ExperimentData {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  status: ExperimentStatus;
  size: ExperimentSize;
  why: string;
  currentDirection: string;
  /**
   * Plain-text credit for work that isn't mine — rendered as text, never
   * as a link, since no real source URL exists in this project yet and one
   * should never be invented.
   */
  attribution?: string;
  /**
   * Path to the real experiment screenshot, checked from `/public` at
   * `public/images/lab/<id>_image.png`. Rendered when the file exists
   * and loads; falls back to the geometric doodle otherwise (missing
   * file, bad path, or a failed image load all fall back the same way
   * — see ExperimentCard.tsx).
   */
  image: string;
}

export const EXPERIMENTS: ExperimentData[] = [
  {
    id: "github-exploration",
    number: "01",
    title: "Running Other People's Code",
    category: "Exploration",
    description:
      "Regularly pulling projects off GitHub just to see how they actually work under the hood.",
    status: "Exploring",
    size: "large",
    why:
      "I like taking things apart. Reading a working system is one thing — running it, poking at it and watching it break teaches you far more than the README does.",
    currentDirection:
      "Run it, observe how it behaves, break something on purpose, understand why it broke, then modify it.",
    image: "/images/lab/github-exploration_image.png",
  },
  {
    id: "f1-race-replay",
    number: "02",
    title: "F1 Race Replay",
    category: "Data / Motorsport",
    description:
      "Exploring how an entire F1 race weekend — practice, qualifying and the race — can be replayed from timing and telemetry data using Python and FastF1.",
    status: "Exploring",
    size: "medium",
    why:
      "I ran this project to understand how session data, lap timing and telemetry come together into a replayable race weekend.",
    currentDirection:
      "Working through race sessions, qualifying, practice sessions and telemetry data to see how the replay is put together.",
    attribution: "Original F1 race replay concept by Tomshaw, explored using Python and FastF1.",
    image: "/images/lab/f1-race-replay_image.png",
  },
  {
    id: "learning-projects",
    number: "03",
    title: "Small Learning Projects",
    category: "Fundamentals",
    description:
      "Small, focused builds — a banking system, an expense tracker, a password validator — made purely to nail down a concept.",
    status: "Learning",
    size: "small",
    why:
      "Not every project needs to be a product. Some are just there to lock in a specific idea — state management, validation logic, basic CRUD — before using it somewhere bigger.",
    currentDirection: "Banking System, Expense Tracker, Password Validator.",
    image: "/images/lab/learning-projects_image.png",
  },
  {
    id: "hardware-lab",
    number: "04",
    title: "Hardware Lab",
    category: "Embedded",
    description: "Experiments with sensors, microcontrollers and connected systems.",
    status: "Exploring",
    size: "large",
    why: "Exploring the connection between physical systems and software.",
    currentDirection: "Sensors, microcontrollers and connected systems.",
    image: "/images/lab/hardware-lab_image.png",
  },
];