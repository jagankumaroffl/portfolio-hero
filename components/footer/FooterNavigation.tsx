const FOOTER_NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Journey", href: "#journey" },
  { label: "Lab", href: "#lab" },
  { label: "Contact", href: "#contact" },
] as const;

/**
 * Footer section navigation. Plain `<nav>` + `<a href="#slug">` anchors —
 * the exact same pattern HeroNav already uses for its nav links — so
 * clicks are handled by the Lenis instance's built-in anchor interception
 * (createSmoothScroll() doesn't pass `anchors: false`, so Lenis defaults
 * to handling same-page hash links automatically). No onClick handler, no
 * second smooth-scroll implementation: this component is pure markup.
 */
export default function FooterNavigation() {
  return (
    <nav className="ft-nav" aria-label="Section navigation">
      <ul className="ft-nav-list">
        {FOOTER_NAV_LINKS.map((link) => (
          <li key={link.label}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}