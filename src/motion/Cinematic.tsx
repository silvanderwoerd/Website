"use client";

/* eslint-disable @next/next/no-img-element -- images copied as-is; media moves in step 7 */
// Motion for the cinematic landing experiment (phase 2, /landing-alt).
// - FadeOpening: the page fades up from black (the hero film pulls focus with it).
// - CountUp: a number that counts up once in view; the final value is in the HTML.
// - HoverClip: a still that wakes into its clip on hover (the clip plays only then).
// - Parallax: content that drifts and fades as its band scrolls away.
// Reduce motion shows everything at once and keeps clips still.

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { BackgroundVideo, type VideoSource } from "./BackgroundVideo";
import { Words } from "@/lib/inline";
import { at, useScrollInView } from "./scroll";
import motion from "./cinematic.module.css";

const still = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

// The page opens like a film: black over everything, fading away once the page
// has loaded. Marks <html> data-opening, then data-opened, so a hero can bring
// its film up out of the dark with it.
export function FadeOpening() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    document.documentElement.setAttribute("data-opening", "");
    const open = () => {
      el.setAttribute("data-open", "");
      document.documentElement.setAttribute("data-opened", "");
    };
    if (still()) return open();
    let t: ReturnType<typeof setTimeout> | undefined;
    const go = () => (t = setTimeout(open, 200));
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("load", go);
    };
  }, []);
  return <div ref={ref} className={motion.blackout} aria-hidden="true" />;
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

// Fades its children up out of a soft blur once in view (delay in ms for a stagger).
export function Reveal({ children, className, delay = 0, as: Tag = "div" }: { children: ReactNode; className?: string; delay?: number; as?: "div" | "p" | "li" }) {
  const ref = useRef<HTMLDivElement>(null);
  useInView(ref);
  return (
    <Tag ref={ref as never} className={`${motion.reveal} ${className ?? ""}`} style={{ "--d": `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}

// Large text whose words come out of a deep blur one after another, once in view
// (afterLoad: once the page has loaded and the preloader is gone, for the hero).
export function BlurText({ text, as: Tag = "p", className, strong, field, delay = 0, afterLoad }: { text: string; as?: "p" | "h1" | "h2" | "h3" | "blockquote"; className?: string; strong?: string; field?: string; delay?: number; afterLoad?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    ref.current?.querySelectorAll<HTMLElement>(`.${motion.blurWord}`).forEach((w, i) => w.style.setProperty("--i", String(i)));
  }, [text]);
  useInView(ref, afterLoad);
  return (
    <Tag ref={ref as never} className={`${motion.blurText} ${className ?? ""}`} style={{ "--d": `${delay}ms` } as CSSProperties} {...(field ? { "data-field": field, "data-raw": text } : {})}>
      <Words text={text} word={motion.blurWord} strong={strong} />
    </Tag>
  );
}

// A photo in a frame that opens from the bottom, the photo settling in and then
// drifting slowly with the scroll.
export function WipeImage({ src, alt = "", className, delay = 0 }: { src: string; alt?: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  useInView(ref);
  const onProgress = useCallback((p: number) => {
    if (img.current) img.current.style.translate = `0 ${at([[0, -6], [1, 6]], p)}%`;
  }, []);
  useScrollInView(ref, onProgress);
  return (
    <div ref={ref} className={`${motion.frame} ${className ?? ""}`} style={{ "--d": `${delay}ms` } as CSSProperties}>
      {/* The clip sits on an inner curtain: a fully clipped element never counts as in view. */}
      <div className={motion.curtain}>
        <img ref={img} src={src} alt={alt} className={motion.frameImage} loading="lazy" />
      </div>
    </div>
  );
}

// Extra film grain over a band's own film (the site's own grain image).
export function GrainOverlay() {
  return <div className={motion.grain} aria-hidden="true" />;
}

// A list whose rows show their image in a frame that follows the cursor.
export function CursorPreview({ images, children, className }: { images: string[]; children: ReactNode; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState<number | null>(null);
  const move = (e: React.MouseEvent) => {
    box.current?.style.setProperty("--x", `${e.clientX + 24}px`);
    box.current?.style.setProperty("--y", `${e.clientY - 120}px`);
    const row = (e.target as HTMLElement).closest<HTMLElement>("[data-row]");
    setCurrent(row ? Number(row.dataset.row) : null);
  };
  return (
    <div className={className} onMouseMove={move} onMouseLeave={() => setCurrent(null)}>
      {children}
      <div ref={box} className={motion.preview} data-on={current !== null ? "" : undefined} aria-hidden="true">
        {images.map((src, i) => (
          <img key={src + i} src={src} alt="" loading="lazy" data-current={i === current ? "" : undefined} />
        ))}
      </div>
    </div>
  );
}

// Marks an element data-in once it scrolls into view (CSS does the rest).
function useInView(ref: React.RefObject<HTMLElement | null>, afterLoad = false) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (still()) return void el.setAttribute("data-in", "");
    if (afterLoad) {
      // the preloader lifts about 1300ms after load (as AnimatedText afterLoad)
      let t: ReturnType<typeof setTimeout> | undefined;
      const show = () => (t = setTimeout(() => el.setAttribute("data-in", ""), 1300));
      if (document.readyState === "complete") show();
      else window.addEventListener("load", show, { once: true });
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      el.setAttribute("data-in", "");
      io.disconnect();
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, afterLoad]);
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
