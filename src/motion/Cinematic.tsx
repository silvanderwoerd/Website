"use client";

/* eslint-disable @next/next/no-img-element -- images copied as-is; media moves in step 7 */
// Motion for the cinematic landing experiment (phase 2, /landing-alt).
// - FadeOpening: the page fades up from black (the hero film pulls focus with it).
// - CountUp: a number that counts up once in view; the final value is in the HTML.
// - HoverClip: a still that wakes into its clip on hover (the clip plays only then).
// Reduce motion shows everything at once and keeps clips still.

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { BackgroundVideo, type VideoSource } from "./BackgroundVideo";
import { Words } from "@/lib/inline";
import { scroll } from "motion";
import { at, useScrollInView } from "./scroll";
import motion from "./cinematic.module.css";

const still = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

// The page opens like a film: black over everything with the whale on it, a
// light sweeping through it while the page loads. Once loaded the whale lights
// up, blurs and fades, and the black lifts. Marks <html> data-opening, then
// data-opened, so a hero can bring its film up out of the dark with it.
export function FadeOpening({ mask }: { mask: string }) {
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
    const go = () => {
      el.setAttribute("data-loaded", "");
      t = setTimeout(open, 450);
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("load", go);
    };
  }, []);
  return (
    <div ref={ref} className={motion.blackout} aria-hidden="true">
      {/* the blur sits outside the whale's shape, so the shape itself goes soft */}
      <div className={motion.whale}>
        <div className={motion.shape} style={{ "--mask": `url("${mask}")` } as CSSProperties}>
          <span className={motion.sweep} />
          <span className={motion.lit} />
        </div>
      </div>
    </div>
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
// (afterLoad: once the page has loaded and its opening is under way, for the hero).
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
      // once the opening's whale has gone and the black begins to lift
      let t: ReturnType<typeof setTimeout> | undefined;
      const show = () => (t = setTimeout(() => el.setAttribute("data-in", ""), 1200));
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

// A frame that holds still (sticky) while its band scrolls past it, and tells
// its CSS how far along that is as --p (0 at the band's top, 1 at its end),
// gliding rather than jumping.
// Reduce motion: --p stays at 0.5, the still middle of it.
export function ScrollStage({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    const band = el?.closest("section");
    if (!el || !band) return;
    if (still()) return void el.style.setProperty("--p", "0.5");
    // the value glides toward the scroll position, so moves stay soft even on a
    // stepping mouse wheel
    let target = 0;
    let shown = 0;
    let frame = 0;
    const glide = () => {
      shown += (target - shown) * 0.09;
      if (Math.abs(target - shown) < 0.0005) shown = target;
      el.style.setProperty("--p", shown.toFixed(4));
      frame = shown === target ? 0 : requestAnimationFrame(glide);
    };
    const stop = scroll(
      (p: number) => {
        target = p;
        if (!frame) frame = requestAnimationFrame(glide);
      },
      { target: band, offset: ["start start", "end end"] },
    );
    return () => {
      stop();
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

