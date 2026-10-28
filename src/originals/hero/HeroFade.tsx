"use client";

// IX2 "Home Hero Hide Text" (while the hero scrolls): from 50% to 100% the
// content moves down to 30svh; it stays visible until 70% and is gone by 80%.

import { useCallback, useRef, type ReactNode } from "react";
import { at, useScrollInView, type Keyframes } from "@/motion/scroll";

const Y: Keyframes = [[0.5, 0], [1, 30]];
const OPACITY: Keyframes = [[0.7, 1], [0.8, 0]];

export function HeroFade({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement | null>(null);
  const setHero = useCallback((el: HTMLDivElement | null) => {
    ref.current = el;
    hero.current = el?.closest("header") ?? null;
  }, []);
  const onProgress = useCallback((p: number) => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `translateY(${at(Y, p)}svh)`;
    el.style.opacity = String(at(OPACITY, p));
  }, []);
  useScrollInView(hero, onProgress);
  return (
    <div ref={setHero} className={className}>
      {children}
    </div>
  );
}
