"use client";

/**
 * Editorial line-art diagrams used in place of real screenshots. Each
 * project has no product screenshot yet, so rather than an empty gray
 * rectangle these render a small, intentional diagram of what the project
 * actually does — a signal chain, a data flow, a feedback loop — in the
 * same restrained off-white linework used throughout the dark sections.
 *
 * All four share one visual language: thin currentColor-ish strokes at low
 * opacity, small mono-font labels, and exactly one accent-colored detail
 * per diagram (never a flooded/neon treatment). They fill their parent
 * `.pw-project-image` wrapper via absolute inset positioning — the
 * wrapper's existing aspect-ratio, border-radius, shadow, gloss overlay,
 * parallax and hover treatment all apply unchanged since this only adds a
 * child, not a new element type.
 */

const LINE = "rgba(245, 247, 250, 0.55)";
const LINE_FAINT = "rgba(245, 247, 250, 0.28)";
const FILL_FAINT = "rgba(245, 247, 250, 0.06)";
const LABEL = "rgba(245, 247, 250, 0.6)";
const ACCENT = "var(--accent)";

const wrapperStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "8px",
  letterSpacing: "0.08em",
  fill: LABEL,
};

/** Sansa — local AI companion: mic -> STT -> LLM -> TTS -> speaker, inside a desktop window frame. */
export function SansaVisual() {
  return (
    <svg
      viewBox="0 0 320 200"
      style={wrapperStyle}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* desktop window chrome */}
      <rect x="24" y="24" width="272" height="152" rx="6" fill="none" stroke={LINE_FAINT} strokeWidth="1" />
      <line x1="24" y1="42" x2="296" y2="42" stroke={LINE_FAINT} strokeWidth="1" />
      <circle cx="36" cy="33" r="2.5" fill={LINE_FAINT} />
      <circle cx="46" cy="33" r="2.5" fill={LINE_FAINT} />
      <circle cx="56" cy="33" r="2.5" fill={LINE_FAINT} />

      {/* pipeline: mic -> stt -> llm -> tts -> speaker */}
      <g>
        <circle cx="60" cy="118" r="14" fill="none" stroke={LINE} strokeWidth="1.2" />
        <path d="M60 111v10M55 121a5 5 0 0 0 10 0" stroke={LINE} strokeWidth="1.2" fill="none" strokeLinecap="round" />

        <rect x="98" y="104" width="46" height="28" rx="4" fill={FILL_FAINT} stroke={LINE} strokeWidth="1" />
        <text x="121" y="121" textAnchor="middle" style={labelStyle}>STT</text>

        <rect x="164" y="98" width="52" height="40" rx="4" fill={FILL_FAINT} stroke={LINE} strokeWidth="1" />
        <text x="190" y="121" textAnchor="middle" style={labelStyle}>LLM</text>
        <circle cx="205" cy="106" r="2" fill={ACCENT} />

        <rect x="236" y="104" width="46" height="28" rx="4" fill={FILL_FAINT} stroke={LINE} strokeWidth="1" />
        <text x="259" y="121" textAnchor="middle" style={labelStyle}>TTS</text>

        <path d="M74 118h24" stroke={LINE} strokeWidth="1" markerEnd="url(#sansa-arrow)" />
        <path d="M144 118h20" stroke={LINE} strokeWidth="1" markerEnd="url(#sansa-arrow)" />
        <path d="M216 118h20" stroke={LINE} strokeWidth="1" markerEnd="url(#sansa-arrow)" />

        <path
          d="M290 118c6 0 8 3 8 8s-4 8-8 8-6 3-6 7 3 7 6 7"
          fill="none"
          stroke={LINE}
          strokeWidth="1"
          strokeLinecap="round"
        />
      </g>

      <text x="32" y="160" style={{ ...labelStyle, fontSize: "7px", fill: LINE_FAINT }}>
        LOCAL · OFFLINE
      </text>

      <defs>
        <marker id="sansa-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0 0L6 3L0 6Z" fill={LINE} />
        </marker>
      </defs>
    </svg>
  );
}

/** Vestia — wardrobe assistant: garment thumbnails linked to a central match/embedding node. */
export function VestiaVisual() {
  const garments = [
    { x: 48, y: 52 },
    { x: 48, y: 108 },
    { x: 48, y: 148 },
    { x: 264, y: 52 },
    { x: 264, y: 108 },
    { x: 264, y: 148 },
  ];

  return (
    <svg
      viewBox="0 0 320 200"
      style={wrapperStyle}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {garments.map((g, i) => (
        <g key={i}>
          <rect x={g.x - 14} y={g.y - 14} width="28" height="28" rx="4" fill={FILL_FAINT} stroke={LINE_FAINT} strokeWidth="1" />
          {/* simple shirt glyph */}
          <path
            d={`M${g.x - 7} ${g.y - 6} L${g.x - 3} ${g.y - 10} L${g.x} ${g.y - 7} L${g.x + 3} ${g.y - 10} L${g.x + 7} ${g.y - 6} L${g.x + 4} ${g.y - 3} L${g.x + 4} ${g.y + 9} L${g.x - 4} ${g.y + 9} L${g.x - 4} ${g.y - 3} Z`}
            fill="none"
            stroke={LINE}
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <line
            x1={g.x + (g.x < 160 ? 14 : -14)}
            y1={g.y}
            x2="160"
            y2="100"
            stroke={LINE_FAINT}
            strokeWidth="0.75"
          />
        </g>
      ))}

      <circle cx="160" cy="100" r="20" fill={FILL_FAINT} stroke={LINE} strokeWidth="1.2" />
      <circle cx="160" cy="100" r="3" fill={ACCENT} />
      <text x="160" y="132" textAnchor="middle" style={labelStyle}>
        MATCH
      </text>
    </svg>
  );
}

/** Smart Attendance — camera to recognition bracket to attendance sheet. */
export function AttendanceVisual() {
  return (
    <svg
      viewBox="0 0 320 200"
      style={wrapperStyle}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* camera */}
      <g>
        <rect x="36" y="86" width="52" height="36" rx="4" fill={FILL_FAINT} stroke={LINE} strokeWidth="1.2" />
        <rect x="52" y="76" width="20" height="12" rx="2" fill={FILL_FAINT} stroke={LINE} strokeWidth="1" />
        <circle cx="62" cy="104" r="10" fill="none" stroke={LINE} strokeWidth="1.2" />
        <circle cx="62" cy="104" r="4" fill="none" stroke={LINE} strokeWidth="1" />
      </g>

      {/* recognition bracket around a simple face glyph */}
      <g>
        <circle cx="160" cy="100" r="16" fill="none" stroke={LINE_FAINT} strokeWidth="1" />
        <path d="M148 92c3-4 6-6 12-6s9 2 12 6" stroke={LINE_FAINT} strokeWidth="0.9" fill="none" />
        <circle cx="154" cy="98" r="1.4" fill={LINE_FAINT} />
        <circle cx="166" cy="98" r="1.4" fill={LINE_FAINT} />

        {/* corner brackets */}
        <path d="M134 76v-6h10M186 76v-6h-10M134 124v6h10M186 124v6h-10" stroke={ACCENT} strokeWidth="1.4" fill="none" />
      </g>

      <path d="M96 104h30" stroke={LINE} strokeWidth="1" markerEnd="url(#att-arrow)" />
      <path d="M182 104h26" stroke={LINE} strokeWidth="1" markerEnd="url(#att-arrow)" />

      {/* attendance sheet */}
      <g>
        <rect x="236" y="66" width="52" height="68" rx="3" fill={FILL_FAINT} stroke={LINE} strokeWidth="1.2" />
        <line x1="246" y1="82" x2="278" y2="82" stroke={LINE_FAINT} strokeWidth="1" />
        <line x1="246" y1="94" x2="278" y2="94" stroke={LINE_FAINT} strokeWidth="1" />
        <line x1="246" y1="106" x2="278" y2="106" stroke={LINE_FAINT} strokeWidth="1" />
        <path d="M244 118l4 4 8-9" stroke={ACCENT} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      <text x="36" y="150" style={{ ...labelStyle, fontSize: "7px", fill: LINE_FAINT }}>
        REAL-TIME RECOGNITION
      </text>

      <defs>
        <marker id="att-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0 0L6 3L0 6Z" fill={LINE} />
        </marker>
      </defs>
    </svg>
  );
}

/** Solar Tracking — sun, photodiode sensor, microcontroller, servo, panel, closing the feedback loop. */
export function SolarVisual() {
  return (
    <svg
      viewBox="0 0 320 200"
      style={wrapperStyle}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* sun */}
      <g>
        <circle cx="252" cy="46" r="12" fill="none" stroke={LINE} strokeWidth="1.2" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 252 + Math.cos(rad) * 18;
          const y1 = 46 + Math.sin(rad) * 18;
          const x2 = 252 + Math.cos(rad) * 24;
          const y2 = 46 + Math.sin(rad) * 24;
          return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={LINE_FAINT} strokeWidth="1" />;
        })}
      </g>

      {/* sensor */}
      <g>
        <rect x="212" y="86" width="24" height="16" rx="2" fill={FILL_FAINT} stroke={LINE} strokeWidth="1" />
        <text x="224" y="112" textAnchor="middle" style={{ ...labelStyle, fontSize: "6.5px" }}>
          SENSOR
        </text>
        <line x1="238" y1="88" x2="248" y2="60" stroke={LINE_FAINT} strokeWidth="0.9" strokeDasharray="2 2" />
      </g>

      {/* microcontroller */}
      <g>
        <rect x="130" y="86" width="36" height="28" rx="3" fill={FILL_FAINT} stroke={LINE} strokeWidth="1.2" />
        <line x1="136" y1="86" x2="136" y2="80" stroke={LINE_FAINT} strokeWidth="1" />
        <line x1="146" y1="86" x2="146" y2="80" stroke={LINE_FAINT} strokeWidth="1" />
        <line x1="156" y1="86" x2="156" y2="80" stroke={LINE_FAINT} strokeWidth="1" />
        <line x1="136" y1="114" x2="136" y2="120" stroke={LINE_FAINT} strokeWidth="1" />
        <line x1="146" y1="114" x2="146" y2="120" stroke={LINE_FAINT} strokeWidth="1" />
        <line x1="156" y1="114" x2="156" y2="120" stroke={LINE_FAINT} strokeWidth="1" />
        <text x="148" y="104" textAnchor="middle" style={{ ...labelStyle, fontSize: "6.5px" }}>
          MCU
        </text>
      </g>

      {/* servo */}
      <g>
        <rect x="70" y="90" width="28" height="20" rx="3" fill={FILL_FAINT} stroke={LINE} strokeWidth="1.2" />
        <circle cx="84" cy="100" r="4" fill="none" stroke={ACCENT} strokeWidth="1.2" />
        <text x="84" y="118" textAnchor="middle" style={{ ...labelStyle, fontSize: "6.5px" }}>
          SERVO
        </text>
      </g>

      {/* panel, tilted toward the sun */}
      <g transform="rotate(-18 44 150)">
        <rect x="24" y="130" width="40" height="26" rx="2" fill={FILL_FAINT} stroke={LINE} strokeWidth="1.2" />
        <line x1="24" y1="139" x2="64" y2="139" stroke={LINE_FAINT} strokeWidth="0.75" />
        <line x1="24" y1="148" x2="64" y2="148" stroke={LINE_FAINT} strokeWidth="0.75" />
        <line x1="37" y1="130" x2="37" y2="156" stroke={LINE_FAINT} strokeWidth="0.75" />
        <line x1="51" y1="130" x2="51" y2="156" stroke={LINE_FAINT} strokeWidth="0.75" />
      </g>

      {/* signal chain */}
      <path d="M212 96h-46" stroke={LINE} strokeWidth="1" markerEnd="url(#solar-arrow)" />
      <path d="M130 100h-32" stroke={LINE} strokeWidth="1" markerEnd="url(#solar-arrow)" />
      <path d="M84 110v18" stroke={LINE} strokeWidth="1" markerEnd="url(#solar-arrow)" />

      {/* closing feedback loop back to sensor */}
      <path
        d="M64 138C40 168 40 40 224 84"
        fill="none"
        stroke={LINE_FAINT}
        strokeWidth="0.9"
        strokeDasharray="3 3"
      />

      <defs>
        <marker id="solar-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0 0L6 3L0 6Z" fill={LINE} />
        </marker>
      </defs>
    </svg>
  );
}

export type ProjectVisualId = "sansa" | "vestia" | "attendance" | "solar";

export function ProjectVisual({ id }: { id: ProjectVisualId }) {
  switch (id) {
    case "sansa":
      return <SansaVisual />;
    case "vestia":
      return <VestiaVisual />;
    case "attendance":
      return <AttendanceVisual />;
    case "solar":
      return <SolarVisual />;
    default:
      return null;
  }
}