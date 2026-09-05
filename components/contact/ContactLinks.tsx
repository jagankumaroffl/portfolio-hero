"use client";

import { forwardRef } from "react";
import { CONTACT } from "@/lib/constants";

interface ContactLinkItem {
  label: string;
  actionText: string;
  href: string;
  external: boolean;
}

const LINKS: ContactLinkItem[] = [
  {
    label: "Email",
    actionText: "Say hello",
    href: `mailto:${CONTACT.email}`,
    external: false,
  },
  {
    label: "LinkedIn",
    actionText: "Let's connect",
    href: CONTACT.linkedin.url,
    external: true,
  },
  {
    label: "GitHub",
    actionText: "See my code",
    href: CONTACT.github.url,
    external: true,
  },
];

interface ContactLinksProps {
  linkRef?: (index: number, el: HTMLAnchorElement | null) => void;
  arrowRef?: (index: number, el: HTMLSpanElement | null) => void;
  underlineRef?: (index: number, el: HTMLSpanElement | null) => void;
}

/**
 * The three primary contact actions, presented as plain typography links
 * rather than social-media cards — "Email / Say hello →" etc, exactly the
 * label/action-text pairing the brief specifies. Real `<a>` tags (mailto:
 * for email, target="_blank" for the two external profiles) so every link
 * works with a bare click, Enter, or Space with zero JS required for the
 * navigation itself; the hover lift/arrow-shift/underline-draw wired by
 * the parent via bindLinkHover is a progressive enhancement on top.
 */
const ContactLinks = forwardRef<HTMLUListElement, ContactLinksProps>(function ContactLinks(
  { linkRef, arrowRef, underlineRef },
  ref
) {
  return (
    <ul ref={ref} className="ct-links">
      {LINKS.map((link, index) => (
        <li key={link.label} className="ct-links-item">
          <a
            ref={(el) => linkRef?.(index, el)}
            href={link.href}
            className="ct-link"
            {...(link.external
              ? { target: "_blank", rel: "noreferrer" }
              : {})}
          >
            <span className="ct-link-label">{link.label}</span>

            <span className="ct-link-action">
              {link.actionText}

              <span
                ref={(el) => arrowRef?.(index, el)}
                className="ct-link-arrow"
                aria-hidden="true"
              >
                →
              </span>
            </span>

            <span
              ref={(el) => underlineRef?.(index, el)}
              className="ct-link-underline"
              aria-hidden="true"
            />
          </a>
        </li>
      ))}
    </ul>
  );
});

export default ContactLinks;