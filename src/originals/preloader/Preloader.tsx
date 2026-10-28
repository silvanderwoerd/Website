"use client";

// IX2 "Page Finishes Loading": once the page has loaded, the logo fill grows
// to 100% (600ms outQuad), the logo fades (200ms after 500ms), the top and
// bottom panels slide off (1300ms / 1600ms inOutExpo after 600ms), then the
// preloader is removed. Reduce motion and no-JS: no preloader.

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { animate } from "motion";
import { marks } from "../marks";
import styles from "./preloader.module.css";

const OUT_QUAD = [0.25, 0.46, 0.45, 0.94] as const;
const IN_OUT_EXPO = [0.87, 0, 0.13, 1] as const;

export function Preloader({ mask }: { mask: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return; // hidden by CSS
    const q = (c: string) => el.querySelector<HTMLElement>(`.${c}`)!;
    const run = () => {
      animate(q(styles.fill), { width: "100%" }, { duration: 0.6, ease: OUT_QUAD });
      animate(q(styles.progress), { opacity: 0 }, { duration: 0.2, delay: 0.5 });
      animate(q(styles.top), { y: "-100%" }, { duration: 1.3, delay: 0.6, ease: IN_OUT_EXPO });
      animate(q(styles.bottom), { y: "100%" }, { duration: 1.6, delay: 0.6, ease: IN_OUT_EXPO }).then(() => setGone(true));
    };
    if (document.readyState === "complete") run();
    else window.addEventListener("load", run, { once: true });
    return () => window.removeEventListener("load", run);
  }, []);

  if (gone) return null;
  return (
    <div ref={ref} className={styles.preloader} style={{ "--mask": `url("${mask}")` } as CSSProperties} {...marks("preloader", "site#preloader")}>
      <div className={styles.progress}>
        <div className={styles.fill} />
      </div>
      <div className={styles.top} />
      <div className={styles.bottom} />
    </div>
  );
}
