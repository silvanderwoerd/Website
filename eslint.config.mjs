import next from "eslint-config-next";

const config = [
  ...next,
  { ignores: ["reference/**", "looks/**", ".next/**", "src/design/tokens.css", "next-env.d.ts"] },
  {
    rules: {
      // Phase 1 copies the live site's full page loads between pages (the
      // preloader plays on each), so internal links are plain <a>, not <Link>.
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];

export default config;
