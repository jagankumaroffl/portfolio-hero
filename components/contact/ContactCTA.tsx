"use client";

import { forwardRef } from "react";
import { SITE } from "@/lib/constants";

/**
 * The single primary action: "Start a conversation →". Reuses
 * SITE.ctaLink (the same mailto: link HeroNav's CTA already points to)
 * rather than building a second contact mechanism — this is the one real
 * contact channel configured in the project, so both CTAs stay in sync by
 * construction if the email ever changes in lib/constants.ts.
 */
const ContactCTA = forwardRef<HTMLAnchorElement>(function ContactCTA(_props, ref) {
  return (
    <a ref={ref} href={SITE.ctaLink} className="ct-cta">
      Start a conversation
      <span className="ct-cta-arrow" aria-hidden="true">
        →
      </span>
    </a>
  );
});

export default ContactCTA;