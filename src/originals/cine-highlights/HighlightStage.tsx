"use client";

import { useState, type ReactNode } from "react";
import { BackgroundVideo, type VideoSource } from "@/motion/BackgroundVideo";
import { GrainOverlay } from "@/motion/Cinematic";
import styles from "./cine-highlights.module.css";

export type Highlight = { kicker: string; title: string; text: string; link: { label: string; href: string }; video: VideoSource };

// The films stacked full screen (only the chosen one plays), the chosen story
// over them, and the index of campaigns along the bottom: pointing at one, or
// tapping it, makes it the chosen one.
export function HighlightStage({ highlights, children }: { highlights: Highlight[]; children: ReactNode }) {
  const [current, setCurrent] = useState(0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className={styles.stage}>
      {highlights.map((h, i) => (
        <div key={h.title} className={styles.film} data-on={i === current ? "" : undefined} aria-hidden="true">
          <BackgroundVideo video={h.video} className={styles.video} active={i === current} />
        </div>
      ))}
      <div className={styles.shade} />
      <GrainOverlay />
      <div className={styles.wrap}>
        <div>{children}</div>
        <div className={styles.stories} aria-live="polite">
          {highlights.map((h, i) => (
            <div key={h.title} className={styles.story} data-on={i === current ? "" : undefined} aria-hidden={i !== current}>
              <span className={`${styles.kicker} ts-cine-label`}>{h.kicker}</span>
              <h3 className={`${styles.title} ts-cine-cta`}>{h.title}</h3>
              <p className={`${styles.text} ts-cine-body`}>{h.text}</p>
              <a href={h.link.href} className={`${styles.more} ts-cine-label`} tabIndex={i === current ? 0 : -1}>
                {h.link.label}
                <span aria-hidden="true">→</span>
              </a>
            </div>
          ))}
        </div>
        <ol className={styles.index}>
          {highlights.map((h, i) => (
            <li key={h.title}>
              <button type="button" className={styles.entry} data-on={i === current ? "" : undefined} onMouseEnter={() => setCurrent(i)} onFocus={() => setCurrent(i)} onClick={() => setCurrent(i)}>
                <span className={`${styles.n} ts-cine-label`}>{pad(i + 1)}</span>
                <span className="ts-cine-label">
                  {h.kicker} · {h.title}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
