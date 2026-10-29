"use client";

/* eslint-disable @next/next/no-img-element -- images copied as-is; media moves in step 7 */
// Motion for the cinematic landing experiment (phase 2, /landing-alt).
// - Letterbox: two black bars that draw apart once the page has loaded (1.6s).
// - CountUp: a number that counts up once in view; the final value is in the HTML.
// - HoverClip: a still that wakes into its clip on hover (the clip plays only then).
// - Parallax: content that drifts and fades as its band scrolls away.
// Reduce motion shows everything at once and keeps clips still.

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { BackgroundVideo, type VideoSource } from "./BackgroundVideo";
import { at, useScrollInView } from "./scroll";

const still = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Letterbox({ className, open }: { className: string; open: string }) {
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOpened(true), still() ? 0 : 250);
    return () => clearTimeout(t);
  }, []);
  return (
    <>
      <div className={`${className} ${opened ? open : ""}`} data-bar="top" aria-hidden="true" />
      <div className={`${className} ${opened ? open : ""}`} data-bar="bottom" aria-hidden="true" />
    </>
  );
}

export function CountUp({ value, decimals = 0, suffix = "", className }: { value: number; decimals?: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
  useEffect(() => {
    const el = ref.current;
    if (!el || still()) return;
    el.textContent = fmt(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - t0) / 2200, 1);
        el.textContent = fmt(value * (1 - Math.pow(1 - p, 4)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, decimals, suffix]);
  return (
    <span ref={ref} className={className}>
      {fmt(value)}
    </span>
  );
}

export function HoverClip({ href, image, video, className, stillClass, videoClass, children }: { href: string; image: string; video?: VideoSource; className: string; stillClass: string; videoClass: string; children: ReactNode }) {
  const [on, setOn] = useState(false);
  return (
    <a href={href} className={className} onMouseEnter={() => setOn(true)} onMouseLeave={() => setOn(false)} data-on={on ? "" : undefined}>
      <img src={image} alt="" className={stillClass} loading="lazy" />
      {video && <BackgroundVideo video={video} className={videoClass} active={on} />}
      {children}
    </a>
  );
}

// Drifts its children up (to −12vh) and fades them (to 0) as the band scrolls out.
export function Parallax({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const band = useRef<HTMLElement | null>(null);
  const set = useCallback((el: HTMLDivElement | null) => {
    ref.current = el;
    band.current = el?.closest("section") ?? null;
  }, []);
  const onProgress = useCallback((p: number) => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `translateY(${at([[0.5, 0], [1, -12]], p)}vh)`;
    el.style.opacity = String(at([[0.5, 1], [0.9, 0]], p));
  }, []);
  useScrollInView(band, onProgress);
  return (
    <div ref={set} className={className} style={{ willChange: "transform, opacity" } as CSSProperties}>
      {children}
    </div>
  );
}
