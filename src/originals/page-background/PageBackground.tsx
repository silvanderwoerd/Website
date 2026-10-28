"use client";

// IX2 "Background Gradient In / Out": the gradient fades in (500ms) while any
// stripe marked pageTone "gradient" is on screen, and out when none is.

import { useEffect, useState, type CSSProperties } from "react";
import { marks } from "../marks";
import styles from "./page-background.module.css";

export function PageBackground({ grain }: { grain: string }) {
  const [tone, setTone] = useState(false);

  useEffect(() => {
    const stripes = [...document.querySelectorAll("[data-page-tone='gradient']")];
    if (!stripes.length) return;
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target));
      setTone(visible.size > 0);
    });
    stripes.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.background} style={{ "--grain": `url("${grain}")` } as CSSProperties} {...marks("page-background", "site#page-background")}>
      <div className={styles.gradient} data-on={tone ? "" : undefined} />
    </div>
  );
}
