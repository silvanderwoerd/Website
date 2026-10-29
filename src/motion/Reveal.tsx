"use client";

/* eslint-disable @next/next/no-img-element -- images copied as-is; media moves in step 7 */
// Webflow's built-in scroll effects "Fade in" + "Slide in from bottom", as About's
// photos use them: once in view, after 700ms, the image rises 100px and fades in
// (1000ms outQuart). Reduce motion and no-JS show it at once.

import { useEffect, useRef } from "react";
import { animate } from "motion";

const OUT_QUART = [0.165, 0.84, 0.44, 1] as const;

export function RevealImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(100px)";
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      animate(el, { opacity: 1, y: 0 }, { duration: 1, delay: 0.7, ease: OUT_QUART });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <img ref={ref} src={src} alt={alt} className={className} loading="lazy" />;
}
