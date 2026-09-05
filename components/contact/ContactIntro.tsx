"use client";

import { forwardRef } from "react";

interface ContactIntroProps {
  headingRef?: (el: HTMLHeadingElement | null) => void;
  statementRef?: (el: HTMLDivElement | null) => void;
}

/**
 * The section heading ("Let's Build Together" — the visual title, never
 * "Contact") plus the large centered "Have an idea? / Let's build it."
 * statement. Two separately-revealed pieces sharing one wrapper so the
 * parent can trigger each with revealLinesOnScroll in sequence per the
 * brief's "1. heading reveals, 2. 'Have an idea?' reveals, 3. 'Let's build
 * it.' reveals" order. The second line carries the section's only heavy
 * use of the accent color, applied subtly via the .ct-statement-accent
 * class in contact.styles.ts.
 */
const ContactIntro = forwardRef<HTMLDivElement, ContactIntroProps>(function ContactIntro(
  { headingRef, statementRef },
  ref
) {
  return (
    <div ref={ref} className="ct-intro">
      <h2 ref={headingRef} className="ct-heading">
        Let&apos;s Build Together
      </h2>

      <div ref={statementRef} className="ct-statement">
        <p className="ct-statement-line">Have an idea?</p>
        <p className="ct-statement-line ct-statement-accent">Let&apos;s build it.</p>
      </div>
    </div>
  );
});

export default ContactIntro;