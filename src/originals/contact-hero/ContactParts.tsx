"use client";

// Contact's moving parts.
// - ContactShade: IX2 "Contact BG Parallax". Its move acts on a box with no
//   height, so only the overlay changes: from its CSS darkness to 0.8 at a
//   quarter of the scroll through the page's top part, to 0.24 at the end.
// - ContactForm: the live page posts to Webflow's form service. Which service
//   replaces it is Sil's call (still open), so the form looks and behaves the
//   same but sends nothing yet. one-off: form service not chosen.

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { at, useScrollInView } from "@/motion/scroll";

export function ContactShade({ className, start }: { className: string; start: { base: number; xxl: number } }) {
  const shade = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  useEffect(() => {
    trigger.current = shade.current?.closest("[data-original]") ?? null;
  }, []);
  const onProgress = useCallback(
    (p: number) => {
      const first = matchMedia("(min-width: 1920px)").matches ? start.xxl : start.base;
      shade.current?.style.setProperty("--shade", String(at([[0, first], [0.25, 0.8], [1, 0.24]], p)));
    },
    [start],
  );
  useScrollInView(trigger, onProgress);
  return <div ref={shade} className={className} />;
}

export function ContactForm({ className, children }: { className: string; children: ReactNode }) {
  return (
    <form className={className} onSubmit={(e) => e.preventDefault()} aria-label="Contact form">
      {children}
    </form>
  );
}
