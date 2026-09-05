import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The unexplained "diamond/ninja" symbol reported on mobile is Next.js's
  // own dev-mode route indicator badge (bottom-left, triangular logomark) —
  // not part of the portfolio. It only ever renders in `next dev`, never in
  // a production build, so it can't be "fixed" in the loader (which the
  // brief explicitly says not to touch). Disabling it here removes the
  // false alarm during local/mobile-forwarded dev testing.
  devIndicators: false,
};

export default nextConfig;