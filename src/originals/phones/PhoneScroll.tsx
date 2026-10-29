"use client";

// IX2 "Phone Side Scroll": while the band scrolls through the window, each
// screenshot moves up from 0 to −3em between 20% and 80% (easeInOut).

import { useCallback, useRef, type ReactNode } from "react";
import { at, useScrollInView, type Keyframes } from "@/motion/scroll";

const Y: Keyframes = [[0.2, 0], [0.8, -3]];
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

export function PhoneScroll({ className, screenClass, children }: { className: string; screenClass: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const band = useRef<HTMLElement | null>(null);
  const setRef = useCallback((el: HTMLDivElement | null) => {
    ref.current = el;
    band.current = el?.closest("section") ?? null;
  }, []);
  const onProgress = useCallback(
    (p: number) => {
      const t = easeInOut(Math.min(1, Math.max(0, (p - 0.2) / 0.6)));
      const y = at(Y, 0.2 + t * 0.6);
      ref.current?.querySelectorAll<HTMLElement>(`.${screenClass}`).forEach((s) => (s.style.transform = `translateY(${y}em)`));
    },
    [screenClass],
  );
  useScrollInView(band, onProgress);
  return (
    <div ref={setRef} className={className}>
      {children}
    </div>
  );
}
