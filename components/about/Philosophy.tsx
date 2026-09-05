import Statement from "./Statement";

const PHILOSOPHY_LINES = [
  "Clean Design.",
  "Smooth Motion.",
  "Thoughtful Engineering.",
  "Building products people enjoy using.",
] as const;

/**
 * Scene 3: philosophy expressed as independent statements rather than a
 * paragraph. Each line reveals on its own as it scrolls into view.
 */
export default function Philosophy() {
  return (
    <section className="ab-scene ab-philosophy" aria-label="Philosophy">
      <div className="ab-philosophy-list">
        {PHILOSOPHY_LINES.map((line) => (
          <Statement key={line} as="p" className="ab-philosophy-line">
            {line}
          </Statement>
        ))}
      </div>
    </section>
  );
}