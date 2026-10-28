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
};

const EASE_OUT_EXPO = [0.19, 1, 0.22, 1] as const;

export function AnimatedText({ as: Tag = "p", text, className, strong, field }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = [...el.querySelectorAll<HTMLElement>(`.${styles.word}`)];
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => (w.style.opacity = "1"));
      return;
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
    return () => observer.disconnect();
  }, [text]);

  return (
    <Tag ref={ref} className={className} {...(field ? { "data-field": field, "data-raw": text } : {})}>
      <Words text={text} word={styles.word} strong={strong} />
    </Tag>
  );
}
