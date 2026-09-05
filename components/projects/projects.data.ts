export type ProjectData = {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  problem: string;
  solution: string;
  outcome: string;
  stack: string[];
  liveUrl?: string;
  githubUrl?: string;
  /** Selects which editorial line-art diagram to render in place of a screenshot. */
  visual: "sansa" | "vestia" | "attendance" | "solar";
  imageAlt: string;
  /**
   * Path to the real project screenshot, checked from `/public` at
   * `public/images/projects/<id>_image.png`. Rendered when the file
   * exists and loads; falls back to the `visual` doodle otherwise
   * (missing file, bad path, or a failed image load all fall back the
   * same way — see ProjectImage.tsx).
   */
  image: string;
};

export const PROJECTS: ProjectData[] = [
  {
    id: "sansa",
    number: "01",
    title: " Project Sansa — AI Companion",
    category: "AI / Desktop",
    description:
      "A fully local, CPU-only AI desktop companion with real-time voice interaction, persistent memory, personality and a native Electron interface.",
    problem:
      "Most AI companions depend heavily on cloud services, external APIs and persistent internet connectivity, making the experience less private and less controllable.",
    solution:
      "Built an end-to-end local AI system combining LLM inference, speech recognition, speech synthesis, memory, emotion state and a desktop interface.",
    outcome:
      "Whisper speech-to-text, Ollama local inference and Kokoro-ONNX text-to-speech run together over an async FastAPI WebSocket backend, with an eight-axis emotion engine and persistent SQLite memory for conversation history, summaries and user profile — entirely offline, with real-time token streaming into a push-to-talk Electron shell.",
    stack: ["Python", "FastAPI", "WebSockets", "Ollama", "ONNX", "SQLite", "Electron"],
    liveUrl: undefined,
    githubUrl: undefined,
    visual: "sansa",
    imageAlt: "Diagram of Sansa's local voice pipeline: microphone through speech-to-text, local LLM, and text-to-speech to speaker, inside a desktop window",
    image: "/images/projects/sansa_image.png",
  },
  {
    id: "vestia",
    number: "02",
    title: "Vestia — AI Wardrobe Assistant",
    category: "AI / Computer Vision",
    description:
      "A full-stack AI wardrobe assistant combining visual understanding, semantic outfit matching and deterministic recommendation logic.",
    problem:
      "Wardrobe recommendation becomes difficult when clothing collections grow and recommendations need to account for color, style, occasion, season and repetition.",
    solution:
      "Built an AI-assisted wardrobe platform using FashionCLIP embeddings, FAISS vector search, computer vision and a deterministic scoring engine.",
    outcome:
      "A deterministic scorer (color 0.35, style 0.30, occasion 0.20, season 0.10, repetition 0.05) sits on top of FashionCLIP embeddings, FAISS semantic search and K-Means color extraction via OpenCV, backed by MySQL with Alembic migrations, a fully typed Axios service layer, and 174 passing tests across the API, CV pipeline and recommendation logic.",
    stack: ["Next.js", "FastAPI", "FashionCLIP", "FAISS", "OpenCV", "MySQL", "Zustand", "Axios"],
    liveUrl: undefined,
    githubUrl: "https://github.com/jagankumaroffl/vestia",
    visual: "vestia",
    imageAlt: "Diagram of Vestia matching garment thumbnails to a central embedding-based match node",
    image: "/images/projects/vestia_image.png",
  },
  {
    id: "smart-attendance",
    number: "03",
    title: "Smart Attendance System",
    category: "Computer Vision / AI",
    description:
      "A real-time AI attendance system using facial detection and recognition to automate attendance recording.",
    problem:
      "Manual attendance entry is slow and can introduce significant data-entry errors.",
    solution:
      "Built a computer-vision attendance workflow that detects and recognizes students in real time and stores attendance information persistently.",
    outcome:
      "Real-time facial detection and recognition feed a SQL-backed store with audit logging and reporting, handling 50+ student records with privacy-conscious data handling and roughly a 95% reduction in manual entry errors.",
    stack: ["Python", "OpenCV", "SQL"],
    liveUrl: undefined,
    githubUrl: "https://github.com/jagankumaroffl/vision_based_attendance",
    visual: "attendance",
    imageAlt: "Diagram of the attendance pipeline: camera to face recognition bracket to attendance sheet",
    image: "/images/projects/smart-attendance_image.png",
  },
  {
    id: "solar-tracking",
    number: "04",
    title: "Solar Tracking System",
    category: "Embedded Systems",
    description:
      "A closed-loop solar tracking system that dynamically adjusts panel orientation using photodiode sensors and servo control.",
    problem:
      "A fixed solar panel does not continuously maintain its optimal orientation relative to incoming sunlight.",
    solution:
      "Built a feedback-controlled embedded system that continuously senses light direction and adjusts panel orientation in real time.",
    outcome:
      "Photodiode-based sensing feeds real-time sensor fusion and closed-loop control on a constrained microcontroller, driving a servo to reposition the panel and yielding roughly a 25% improvement in energy capture efficiency.",
    stack: ["Embedded C", "Microcontroller", "Sensor Fusion", "Servo Control"],
    liveUrl: undefined,
    githubUrl: undefined,
    visual: "solar",
    imageAlt: "Diagram of the solar tracking feedback loop: sensor to microcontroller to servo to tilted panel",
    image: "/images/projects/solar-tracking_image.png",
  },
];