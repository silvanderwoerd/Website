"use client";

// Webflow's "mouse move in element" effects (IX2 MOUSE_MOVE), done once for
// the whole page: any element with data-follow gets --fx / --fy from -1 to 1
// (pointer position across it, 0 at rest), and its own CSS decides what moves
// and how far (button labels ±6px, the project tile's play circle ±50%, the
// nav logo ±1vw). Reduce motion: nothing moves.

import { useEffect } from "react";

export function PointerEffects() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let current: HTMLElement | null = null;
    const reset = (el: HTMLElement) => {
      el.style.setProperty("--fx", "0");
      el.style.setProperty("--fy", "0");
    };
    const move = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-follow]") ?? null;
      if (current && current !== el) reset(current);
      current = el;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--fx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      el.style.setProperty("--fy", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    };
    document.addEventListener("pointermove", move, { passive: true });
    return () => document.removeEventListener("pointermove", move);
  }, []);
  return null;
}
