"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/loader";
import { ScrollTrigger, ensureGsapRegistered } from "@/lib/scroll/gsap";
import { bindLinkHover, revealGroupOnScroll, revealLinesOnScroll } from "@/lib/animations/contact";
import ContactIntro from "./ContactIntro";
import ContactLinks from "./ContactLinks";
import Availability from "./Availability";
import ContactCTA from "./ContactCTA";
import { contactStyles } from "./contact.styles";

const LINK_COUNT = 3;

/**
 * The final major scene: "Let's Build Together". Composition + ref wiring
 * only — the GSAP work lives in lib/animations/contact.ts, matching the
 * split used by Journey.tsx, Toolbox.tsx, and Lab.tsx. Deliberately calmer
 * than those sections: fewer moving parts, a single shared reveal
 * sequence (heading -> statement -> links -> availability -> CTA) instead
 * of per-item ScrollTriggers, and no continuous GSAP loop — the
 * availability dot's pulse is pure CSS (see contact.styles.ts).
 */
export default function Contact() {
  const rootRef = useRef<HTMLElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const statementRef = useRef<HTMLDivElement | null>(null);
  const linksRef = useRef<HTMLUListElement | null>(null);
  const availabilityRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);

  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const arrowRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const underlineRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    ensureGsapRegistered();
    const reduced = prefersReducedMotion();
    const cleanups: Array<() => void> = [];

    // Sequence: 1. heading reveals, 2/3. "Have an idea?" / "Let's build
    // it." reveal, 4. links appear, 5. availability appears, 6. CTA
    // becomes interactive (visually — it's always keyboard/click operable,
    // the fade is a visual cue, not a functional gate).
    if (headingRef.current) {
      const split = revealLinesOnScroll(headingRef.current);
      cleanups.push(() => split.revert());
    }
    if (statementRef.current) {
      const lines = Array.from(statementRef.current.children) as HTMLElement[];
      lines.forEach((line) => {
        const split = revealLinesOnScroll(line);
        cleanups.push(() => split.revert());
      });
    }
    if (linksRef.current) {
      const items = Array.from(linksRef.current.children);
      const tweens = revealGroupOnScroll(linksRef.current, items);
      cleanups.push(() => {
        tweens.forEach((t) => {
          t.scrollTrigger?.kill();
          t.kill();
        });
      });
    }
    if (availabilityRef.current) {
      const tweens = revealGroupOnScroll(availabilityRef.current, [availabilityRef.current]);
      cleanups.push(() => {
        tweens.forEach((t) => {
          t.scrollTrigger?.kill();
          t.kill();
        });
      });
    }
    if (ctaRef.current) {
      const tweens = revealGroupOnScroll(ctaRef.current, [ctaRef.current]);
      cleanups.push(() => {
        tweens.forEach((t) => {
          t.scrollTrigger?.kill();
          t.kill();
        });
      });
    }

    if (!reduced) {
      for (let i = 0; i < LINK_COUNT; i += 1) {
        const link = linkRefs.current[i];
        if (!link) continue;
        const unbind = bindLinkHover(link, {
          arrow: arrowRefs.current[i],
          underline: underlineRefs.current[i],
        });
        cleanups.push(unbind);
      }
    }

    return () => {
      cleanups.forEach((fn) => fn());
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger && root.contains(st.trigger as Node)) {
          st.kill();
        }
      });
    };
  }, []);

  return (
    <section id="contact" ref={rootRef} className="ct-root" aria-label="Let's Build Together">
      <ContactIntro
        ref={introRef}
        headingRef={(el) => {
          headingRef.current = el;
        }}
        statementRef={(el) => {
          statementRef.current = el;
        }}
      />

      <ContactLinks
        ref={linksRef}
        linkRef={(index, el) => {
          linkRefs.current[index] = el;
        }}
        arrowRef={(index, el) => {
          arrowRefs.current[index] = el;
        }}
        underlineRef={(index, el) => {
          underlineRefs.current[index] = el;
        }}
      />

      <Availability ref={availabilityRef} />

      <div className="ct-cta-scene">
        <ContactCTA ref={ctaRef} />
      </div>

      <style>{contactStyles}</style>
    </section>
  );
}