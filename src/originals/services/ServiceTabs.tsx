"use client";

// Webflow tabs as About uses them: a click shows that tab's text (the old one
// fades out in 100ms, the new one in over 300ms ease) and IX2 "Services Tab N"
// cross-fades the background photos (500ms linear).

import { useEffect, useRef, useState } from "react";
import { animate } from "motion";
import styles from "./services.module.css";

export type Tab = { label: string; text: string; background: string };

export function ServiceTabs({ tabs }: { tabs: Tab[] }) {
  const [current, setCurrent] = useState(0);
  const root = useRef<HTMLDivElement>(null);

  // The switch runs on a timer, not on the fade's end, so it never waits on a frame.
  const fadeIn = useRef(false);
  useEffect(() => {
    if (!fadeIn.current) return;
    const next = root.current?.querySelector<HTMLElement>(`.${styles.pane}[data-active]`);
    if (next) animate(next, { opacity: [0, 1] }, { duration: 0.3, ease: "easeInOut" });
  }, [current]);

  function show(i: number) {
    if (i === current || !root.current) return;
    const section = root.current.closest("section")!;
    const backgrounds = [...section.querySelectorAll<HTMLElement>(`.${styles.background}`)];
    backgrounds.forEach((b, j) => animate(b, { opacity: j === i ? 1 : 0 }, { duration: 0.5, ease: "linear" }));
    const pane = root.current.querySelector<HTMLElement>(`.${styles.pane}[data-active]`);
    if (pane) animate(pane, { opacity: 0 }, { duration: 0.1, ease: "easeInOut" });
    fadeIn.current = true;
    setTimeout(() => setCurrent(i), 100);
  }

  return (
    <div ref={root} className={styles.tabs}>
      <div className={styles.menu} role="tablist">
        {tabs.map((t, i) => (
          <a
            key={t.label}
            href="#"
            role="tab"
            aria-selected={i === current}
            className={`${styles.tab} ${i === current ? "ts-tab-current" : "ts-tab"}`}
            data-current={i === current ? "" : undefined}
            onClick={(e) => {
              if (e.altKey) return; // the Inspector's Alt+click
              e.preventDefault();
              show(i);
            }}
          >
            <div>{t.label}</div>
          </a>
        ))}
      </div>
      <div className={styles.content}>
        {tabs.map((t, i) => (
          <div key={t.label} role="tabpanel" className={styles.pane} data-active={i === current ? "" : undefined}>
            <p className={`${styles.text} ts-tab-text`}>{t.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
