"use client";

// A third-party widget script placed where its widget should appear, as the
// live site's Webflow embeds do (EmailOctopus newsletter, Tree-Nation counter).
// The same services and IDs as the live site; nothing new is connected.

import { useEffect, useRef } from "react";

export function EmbedScript({ src, attrs = {}, className, children }: { src: string; attrs?: Record<string, string>; className?: string; children?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = ref.current;
    if (!host || host.querySelector(`script[src="${src}"]`)) return;
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v);
    host.appendChild(s);
  }, [src, attrs]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
