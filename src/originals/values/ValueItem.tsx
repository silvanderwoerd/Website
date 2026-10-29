"use client";

// One value row, with IX2 "Open Faq 2": the answer shows, then rises from 100%,
// grows from 0.95 and fades in while its height opens (500ms ease); the plus
// turns into a minus (its upright bar rotates 90°, 600ms) and both bars go grey:
// those two are CSS transitions on [data-open], so the colours stay tokens.
// A second click closes it the same way back (500ms) and hides the answer.

import { useRef, useState } from "react";
import { animate } from "motion";
import { Inline } from "@/lib/inline";
import styles from "./values.module.css";

export function ValueItem({ n, title, text }: { n: number; title: string; text: string }) {
  const answer = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  function toggle(e: React.MouseEvent) {
    if (e.altKey) return; // the Inspector's Alt+click
    const el = answer.current;
    if (!el) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = (s: number) => (still ? 0 : s);
    if (!open) {
      el.style.display = "block";
      const full = el.scrollHeight;
      animate(el, { y: ["100%", "0%"], scale: [0.95, 1], opacity: [0, 1], height: [0, full] }, { duration: t(0.5), ease: "easeInOut" }).then(() => (el.style.height = "auto"));
    } else {
      el.style.height = `${el.scrollHeight}px`;
      animate(el, { y: "100%", scale: 0.95, opacity: 0, height: 0 }, { duration: t(0.5), ease: "easeInOut" }).then(() => (el.style.display = "none"));
    }
    setOpen(!open);
  }

  return (
    <div className={styles.item} onClick={toggle} aria-expanded={open} role="button" tabIndex={0} data-open={open ? "" : undefined}>
      <div className={styles.row}>
        <div className={styles.titleRow}>
          <div className={`${styles.number} ts-faq-number`}>{n}</div>
          <h3 className={`${styles.title} ts-news-h4`}>{title}</h3>
        </div>
        <div className={styles.plus}>
          <div className={styles.bar1} />
          <div className={styles.bar2} />
        </div>
      </div>
      <div ref={answer} className={styles.answer}>
        <div className={styles.answerSpace} />
        <p className={`${styles.text} ts-faq-answer`}>
          <Inline text={text} />
        </p>
      </div>
    </div>
  );
}
