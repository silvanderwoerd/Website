"use client";

import dynamic from "next/dynamic";

// Only loaded under `npm run dev`. In a production build this whole branch is
// removed, so the Inspector is never part of the live site.
const Inspector =
  process.env.NODE_ENV === "development" ? dynamic(() => import("./Inspector"), { ssr: false }) : () => null;

export function InspectorMount() {
  return <Inspector />;
}
