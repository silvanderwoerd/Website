"use client";

/* eslint-disable @next/next/no-img-element -- icon copied as-is; media moves in step 7 */
// One sustainability card, as Act's scripts run it:
// - countUp.js with scroll spy: once the number is in view (after 200ms) it counts
//   from 0 over 2s (easeOutExpo); scrolled back above it, it resets and counts again.
//   The final number is in the HTML (search engines, no-JS, Reduce motion).
// - IX2 "Sustainability Card Open / Close": "Read more" opens the extra text
//   (height 0 → auto, 500ms outQuad) and becomes "Read Less"; a second click closes it.

import { useEffect, useRef, useState } from "react";
import { animate } from "motion";
import { RichText } from "@/lib/RichText";
import styles from "./sustainability.module.css";

const OUT_QUAD = [0.25, 0.46, 0.45, 0.94] as const;
const format = (n: number, decimals: number) => n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
const easeOutExpo = (t: number) => (t === 1 ? 1 : (1 - 2 ** (-10 * t)) * (1024 / 1023));

export type Stat = { value: number; decimals: number; label: string; more: string };

export function StatCard({ stat, readMore, readLess, icon }: { stat: Stat; readMore: string; readLess: string; icon: string }) {
  const number = useRef<HTMLParagraphElement>(null);
  const extra = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = number.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.textContent = format(0, stat.decimals);
    let paused = true;
    let frame = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 2000);
        el.textContent = format(stat.value * easeOutExpo(t), stat.decimals);
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const check = () => {
      const r = el.getBoundingClientRect();
      if (paused && r.top >= 0 && r.bottom <= window.innerHeight) {
        paused = false;
        timer = setTimeout(run, 200);
      } else if (!paused && r.bottom < 0) {
        paused = true;
        cancelAnimationFrame(frame);
        el.textContent = format(0, stat.decimals);
      }
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => {
      window.removeEventListener("scroll", check);
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [stat.value, stat.decimals]);

  function toggle(e: React.MouseEvent) {
    if (e.altKey) return; // the Inspector's Alt+click
    e.preventDefault();
    const el = extra.current;
    if (!el) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const full = el.scrollHeight;
    if (open) {
      el.style.height = `${full}px`;
      if (still) el.style.height = "0px";
      else animate(el, { height: 0 }, { duration: 0.5, ease: OUT_QUAD });
    } else if (still) {
      el.style.height = "auto";
    } else {
      animate(el, { height: [0, full] }, { duration: 0.5, ease: OUT_QUAD }).then(() => (el.style.height = "auto"));
    }
    setOpen(!open);
  }

  return (
    <div className={styles.card}>
      <p ref={number} className={`${styles.number} ts-stat-big`}>
        {format(stat.value, stat.decimals)}
      </p>
      <p className={`${styles.cardText} ts-card-text`}>{stat.label}</p>
      <div className={styles.space} aria-hidden="true" />
      <div ref={extra} className={styles.extra} style={{ height: 0 }}>
        <RichText markdown={stat.more} className={`${styles.cardText} ${styles.rich} ts-card-text`} />
      </div>
      <a href="#" className={`${styles.readMore} ts-read-more`} onClick={toggle} aria-expanded={open}>
        <img src={icon} alt="" loading="lazy" />
        <div>{open ? readLess : readMore}</div>
      </a>
    </div>
  );
}
