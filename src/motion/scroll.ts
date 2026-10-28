"use client";

// Webflow's "while scrolling in view" (IX2 SCROLLING_IN_VIEW): progress runs
// 0 → 1 from the element's top entering the bottom of the window to its bottom
// leaving the top. Keyframes map that progress to values, as IX2's did.

import { useEffect, type RefObject } from "react";
import { scroll } from "motion";

export type Keyframes = [progress: number, value: number][];

// Linear interpolation through keyframes; flat before the first and after the last.
export function at(frames: Keyframes, p: number) {
  if (p <= frames[0][0]) return frames[0][1];
  for (let i = 1; i < frames.length; i++) {
    const [p1, v1] = frames[i];
    const [p0, v0] = frames[i - 1];
    if (p <= p1) return v0 + ((v1 - v0) * (p - p0)) / (p1 - p0);
  }
  return frames[frames.length - 1][1];
}

export function useScrollInView(target: RefObject<HTMLElement | null>, onProgress: (p: number) => void) {
  useEffect(() => {
    const el = target.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return scroll((p: number) => onProgress(p), { target: el, offset: ["start end", "end start"] });
  }, [target, onProgress]);
}
