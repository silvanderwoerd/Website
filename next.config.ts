import type { NextConfig } from "next";
import { getRedirects } from "./src/content/paths.mjs";

// Files named *.dev.ts / *.dev.tsx (the Inspector's save route and the test
// page) only exist while running `npm run dev`. A production build never sees
// them, so the Inspector is never part of the live site (CLAUDE.md).
const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  pageExtensions: isDev ? ["tsx", "ts", "dev.tsx", "dev.ts"] : ["tsx", "ts"],
  // Dev-only content (the Inspector test page) never ships with the site.
  outputFileTracingExcludes: { "*": ["content/dev/**", "design/originals/test-stripe.json"] },
  // The live site's redirects (content/redirects.json), kept permanent as on Webflow.
  async redirects() {
    return getRedirects().map((r) => ({ source: r.from, destination: r.to, permanent: true }));
  },
};

export default nextConfig;
