import next from "eslint-config-next";

const config = [
  ...next,
  { ignores: ["reference/**", "looks/**", ".next/**", "src/design/tokens.css", "next-env.d.ts"] },
];

export default config;
