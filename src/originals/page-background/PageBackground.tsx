"use client";

// IX2 "Background Gradient In / Out": the gradient fades in (500ms) while any
// stripe marked pageTone "gradient" is on screen, and out when none is.
// Phase 2 (/landing-alt only): a page that also has pageTone "black" stripes
// takes the tone of the stripe across the middle of the screen instead, so
// the black and the gradient hand over to each other as you scroll.

import { useEffect, useState, type CSSProperties } from "react";
import { marks } from "../marks";
import styles from "./page-background.module.css";

type Tone = "gradient" | "black" | null;

export function PageBackground({ grain }: { grain: string }) {
  const [tone, setTone] = useState<Tone>(null);

  useEffect(() => {
    const stripes = [...document.querySelectorAll<HTMLElement>("[data-page-tone]")];
    if (!stripes.length) return;
    if (stripes.some((s) => s.dataset.pageTone === "black")) {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const e of entries) if (e.isIntersecting) setTone((e.target as HTMLElement).dataset.pageTone as Tone);
        },
        { rootMargin: "-50% 0px -50% 0px" },
      );
      stripes.forEach((s) => observer.observe(s));
      return () => observer.disconnect();
    }
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target));
      setTone(visible.size > 0 ? "gradient" : null);
    });
    stripes.filter((s) => s.dataset.pageTone === "gradient").forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.background} style={{ "--grain": `url("${grain}")` } as CSSProperties} {...marks("page-background", "site#page-background")}>
      <div className={styles.gradient} data-on={tone === "gradient" ? "" : undefined} />
    </div>
  );
}
