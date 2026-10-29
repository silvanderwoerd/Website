"use client";

// IX2 "Home Hero Hide Text" (while the hero scrolls): from 50% to 100% the
// content moves down to 30svh; it stays visible until 70% and is gone by 80%.

import { useCallback, useRef, type ReactNode } from "react";
import { at, useScrollInView, type Keyframes } from "@/motion/scroll";

function ScrollOut({ className, children, y, unit, opacity }: { className: string; children: ReactNode; y: Keyframes; unit: string; opacity: Keyframes }) {
  const ref = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement | null>(null);
  const setHero = useCallback((el: HTMLDivElement | null) => {
    ref.current = el;
    hero.current = el?.closest("header, section") ?? null;
  }, []);
  const onProgress = useCallback(
    (p: number) => {
      const el = ref.current;
      if (!el) return;
      el.style.transform = `translateY(${at(y, p)}${unit})`;
      el.style.opacity = String(at(opacity, p));
    },
    [y, unit, opacity],
  );
  useScrollInView(hero, onProgress);
  return (
    <div ref={setHero} className={className}>
      {children}
    </div>
  );
}

const HOME_Y: Keyframes = [[0.5, 0], [1, 30]];
const HOME_OPACITY: Keyframes = [[0.7, 1], [0.8, 0]];
export const HeroFade = (p: { className: string; children: ReactNode }) => <ScrollOut {...p} y={HOME_Y} unit="svh" opacity={HOME_OPACITY} />;

// IX2 "Hero Text Parallax" (project heroes): 50% → 100%: down to 20vh; visible until 60%, gone by 80%.
const PROJECT_Y: Keyframes = [[0.5, 0], [1, 20]];
const PROJECT_OPACITY: Keyframes = [[0.6, 1], [0.8, 0]];
export const HeroParallax = (p: { className: string; children: ReactNode }) => <ScrollOut {...p} y={PROJECT_Y} unit="vh" opacity={PROJECT_OPACITY} />;
