"use client";

// The live page's message bridge: the embedded Team Forest site asks the page
// to scroll when you scroll over it. (Its sign-up message fed analytics, which
// isn't connected yet: step 7, with a yes.)

import { useEffect } from "react";

export function EmbedBridge({ origin }: { origin: string }) {
  useEffect(() => {
    const allowed = [origin, "https://team-forest.lovable.app"];
    const onMessage = (e: MessageEvent) => {
      if (!allowed.includes(e.origin)) return;
      if (e.data?.type === "team-forest:wheel") window.scrollBy({ top: e.data.deltaY, left: 0, behavior: "instant" });
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [origin]);
  return null;
}
