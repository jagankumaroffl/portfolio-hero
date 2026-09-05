import { forwardRef } from "react";

/**
 * Placeholder About section, just enough content to verify the Hero → About
 * scroll transition. Not a final design — will be replaced later.
 */
const AboutSection = forwardRef<HTMLElement>(function AboutSection(_props, ref) {
  return (
    <section
      ref={ref}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "8rem 2rem",
        background: "var(--paper)",
        color: "var(--ink)",
      }}
    >
      <div style={{ maxWidth: "40rem" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.78rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            opacity: 0.6,
            marginBottom: "1.5rem",
          }}
        >
          About
        </p>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          This is a placeholder for the About section.
        </h2>
      </div>
    </section>
  );
});

export default AboutSection;