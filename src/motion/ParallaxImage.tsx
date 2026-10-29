"use client";

/* eslint-disable @next/next/no-img-element -- images copied as-is; media moves in step 7 */
// An image that moves while its band scrolls through the window (IX2
// "while scrolling in view", e.g. About's "Awards Parallax": y −20% → 0%).

import { useCallback, useRef } from "react";
import { at, useScrollInView, type Keyframes } from "./scroll";

export function ParallaxImage({ src, alt, className, y }: { src: string; alt: string; className?: string; y: Keyframes }) {
  const img = useRef<HTMLImageElement>(null);
  const band = useRef<HTMLElement | null>(null);
  const setImg = useCallback((el: HTMLImageElement | null) => {
    img.current = el;
    band.current = el?.closest("section") ?? null;
  }, []);
  const onProgress = useCallback((p: number) => {
    if (img.current) img.current.style.transform = `translateY(${at(y, p)}%)`;
  }, [y]);
  useScrollInView(band, onProgress);
  return <img ref={setImg} src={src} alt={alt} className={className} loading="lazy" style={{ transform: `translateY(${y[0][1]}%)` }} />;
}
