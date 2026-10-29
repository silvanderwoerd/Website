"use client";

/* eslint-disable @next/next/no-img-element -- images copied as-is; media moves in step 7 */
// IX2 "Act Hero": while the title's screen scrolls through the window, the odd
// photo columns move from −5em to 0 and the even ones from 0 to −5em.

import { useCallback, useRef, type ReactNode } from "react";
import { at, useScrollInView, type Keyframes } from "@/motion/scroll";
import styles from "./act-hero.module.css";

const ODD: Keyframes = [[0, -5], [1, 0]];
const EVEN: Keyframes = [[0, 0], [1, -5]];

export function ActHeroColumns({ columns, children }: { columns: { src: string; alt: string }[][]; children: ReactNode }) {
  const layout = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLDivElement>(null);
  const onProgress = useCallback((p: number) => {
    layout.current?.querySelectorAll<HTMLElement>(`.${styles.column}`).forEach((col, i) => {
      col.style.transform = `translateY(${at(i % 2 ? EVEN : ODD, p)}em)`;
    });
  }, []);
  useScrollInView(trigger, onProgress);
  return (
    <>
      <div className={styles.sticky}>
        <div className={styles.background}>
          <div ref={layout} className={styles.layout}>
            {columns.map((col, i) => (
              <div key={i} className={styles.column} style={{ transform: `translateY(${(i % 2 ? EVEN : ODD)[0][1]}em)` }}>
                {col.map((p) => (
                  <img key={p.src} src={p.src} alt={p.alt} loading="lazy" />
                ))}
              </div>
            ))}
          </div>
          <div className={styles.overlay} />
        </div>
      </div>
      <div ref={trigger} className={styles.screen}>
        {children}
      </div>
    </>
  );
}
