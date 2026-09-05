// Toolbox data, kept separate from presentation. Categories and tools are
// exactly the list specified in the Toolbox section brief — nothing added.
//
// `usedIn` links a tool to the featured projects that actually list it in
// their `stack` (see components/projects/projects.data.ts) — every entry
// here is a real cross-reference, not an invented one. Tools with no match
// in any project's stack simply have no `usedIn` and render without an
// indicator.

export interface ToolboxUsage {
  projectTitle: string;
}

export interface ToolboxTool {
  name: string;
  usedIn?: ToolboxUsage[];
}

export interface ToolboxCategoryData {
  number: string;
  title: string;
  tools: ToolboxTool[];
}

export const TOOLBOX_CATEGORIES: ToolboxCategoryData[] = [
  {
    number: "01",
    title: "Languages",
    tools: [
      {
        name: "Python",
        usedIn: [
          { projectTitle: "Personal AI Companion" },
          { projectTitle: "Smart Attendance System" },
        ],
      },
      { 
        name: "Java",
        usedIn: [{ projectTitle: "Springboot projects and Problem Solving" }],
      },
      { name: "C" },
      {
        name: "JavaScript",
        usedIn: [
          { projectTitle: "Personal AI Companion" },
          { projectTitle: "Smart Attendance System" },
        ],
      },
      { name: "SQL" },
    ],
  },
  {
    number: "02",
    title: "Frontend",
    tools: [
      {
        name: "React",
        usedIn: [
          { projectTitle: "Personal AI Companion" },
          { projectTitle: "Portfolio-hero"}
        ],
      },
      { 
        name: "Next.js",
        usedIn: [{ projectTitle: "Portfolio-hero" }],
      },
      { 
        name: "Tailwind CSS", 
        usedIn: [{ projectTitle: "Portfolio-hero" }],
      },
      { 
        name: "GSAP", 
        usedIn: [{ projectTitle: "Portfolio-hero" }],
      },
      { 
        name: "Framer Motion",
        usedIn: [{ projectTitle: "Portfolio-hero" }],
      },
    ],
  },
  {
    number: "03",
    title: "Backend",
    tools: [
      {
        name: "FastAPI",
        usedIn: [
          { projectTitle: "Smart Attendance System" },
        ],
      },
      { name: "Spring Boot" },
      { name: "REST APIs" },
      { name: "WebSockets" },
    ],
  },
  {
    number: "04",
    title: "AI",
    tools: [
      {
        name: "Ollama",
        usedIn: [{ projectTitle: "Personal AI Companion" }],
      },
      { 
        name: "TinyLlama",
        usedIn: [{ projectTitle: "Personal AI Companion" }],
      },
      { name: "OpenAI APIs" },
      { name: "Prompt Engineering", 
        usedIn: [{ projectTitle: "Brainstorming" },
          { projectTitle: "Idea generation"},
          { projectTitle: "Image, Video generation"},
          { projectTitle: "Learning"},
          { projectTitle: "Building"},
        ],
      },
      { 
        name: "Computer Vision",
        usedIn: [{ projectTitle: "Smart Attendance System" }],
      },
    ],
  },
  {
    number: "05",
    title: "Hardware & Engineering",
    tools: [
      { name: "ESP32" },
      { name: "Arduino" },
      { name: "KiCad" },
      { name: "Verilog" },
      { name: "Cadence" },
    ],
  },
];