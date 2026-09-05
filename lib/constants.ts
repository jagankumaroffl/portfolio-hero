// Static text and links for the site. Keep all copy here so components
// stay presentational and content edits never touch markup/styles.

export const SITE = {
  name: "Jagan Kumar",
  ctaLink: "mailto:jagankumaroffl@gmail.com",
} as const;

// Centralized contact info for the Contact section and Footer. Email is
// the real address already used by SITE.ctaLink above. LinkedIn and GitHub
// have no real profile URL anywhere in the project yet, so they're left as
// clearly marked placeholders — replace both with real profile URLs, then
// remove the `isPlaceholder` flags.
export const CONTACT = {
  email: "jagankumaroffl@gmail.com",
  linkedin: {
    url: "https://linkedin.com/in/jagankumaroffl", // TODO: replace with real LinkedIn URL
    isPlaceholder: true,
  },
  github: {
    url: "https://github.com/jagankumaroffl", // TODO: replace with real GitHub URL
    isPlaceholder: true,
  },
} as const;

export const HERO_COPY = {
  headlineLines: ["Building", "Beyond", "Possible."],
  introLine: "I build AI-native products — fast, from idea to shipped.",
  taglineLines: ["BUILDING THE", "NEXT VERSION", "IN PUBLIC"],
  exploreLabel: "Explore my work",
} as const;

export const NAV_LINKS = ["About", "Work", "Journey", "Lab", "Contact"] as const;

export const NAV_COPY = {
  ctaLabel: "Let\u2019s talk",
} as const;

// Hero background images. Desktop/mobile pairs swap via CSS media queries;
// landscape phones fall back to the desktop pair.
export const HERO_IMAGES = {
  baseDesktop: "/public/images/Base_image_desktop.png",
  baseMobile: "/public/images/Base_image_mobile.png",
  revealDesktop: "/public/images/Reveal_image_desktop.png",
  revealMobile: "/public/images/Reveal_image_mobile.png",
} as const;

export const FOOTER_COPY = {
  role: "Software Engineer \u2022 AI Builder",
  year: "2026",
} as const;