"use client";

// AnimatedText (CLAUDE.md motion original), copied from the live ".tricks"
// script: every word in a 1.07em-tall window rises in and fades up, 1500ms
// easeOutExpo, 300ms + 30ms per word, once the whole text is in view.
// Reduce motion and no-JS show the text at once.

import { useEffect, useRef, type ElementType } from "react";
import { animate } from "motion";
import { Words } from "@/lib/inline";
import styles from "./animated-text.module.css";

type Props = {
  as?: ElementType;
  text: string;
  className?: string;
  strong?: string;
  field?: string; // data-field, for the Inspector
  afterLoad?: boolean; // Webflow's .u-show-on-load: hidden until 1300ms after the page loads
};

const EASE_OUT_EXPO = [0.19, 1, 0.22, 1] as const;

export function AnimatedText({ as: Tag = "p", text, className, strong, field, afterLoad }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = [...el.querySelectorAll<HTMLElement>(`.${styles.word}`)];
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => (w.style.opacity = "1"));
      if (afterLoad) el.style.display = "block";
      return;
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (afterLoad) {
      // IX2 "Page Finishes Loading": .u-show-on-load appears 1300ms after load.
      const show = () => (timer = setTimeout(() => (el.style.display = "block"), 1300));
      if (document.readyState === "complete") show();
      else window.addEventListener("load", show, { once: true });
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        words.forEach((w, i) =>
          animate(w, { opacity: [0, 1], paddingTop: ["1.07em", "0em"] }, { duration: 1.5, ease: EASE_OUT_EXPO, delay: 0.3 + 0.03 * i }),
        );
      },
      { threshold: 1 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [text, afterLoad]);

  return (
    <Tag
      ref={ref}
      className={`${className ?? ""} ${afterLoad ? styles.afterLoad : ""}`}
      {...(field ? { "data-field": field, "data-raw": text } : {})}
    >
      <Words text={text} word={styles.word} strong={strong} />
    </Tag>
  );
}
