"use client";

// Webflow's popup modal (credits, media features), with IX2 "Modal - Open":
// the backdrop fades in (400ms ease), then the panel rises 20px into place
// (400ms outQuart, after 400ms). "Modal - Close": the panel drops and fades
// (200ms easeIn), the backdrop fades (300ms), then it's removed.
// `trigger` is the link that opens it (an arrow link, drawn by its original).

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { animate } from "motion";
import styles from "./modal.module.css";

const OUT_QUART = [0.165, 0.84, 0.44, 1] as const;
const EASE_IN = [0.42, 0, 1, 1] as const;

export function Modal({ trigger, children }: { trigger: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !wrapper.current) return;
    const w = wrapper.current;
    const panel = w.querySelector<HTMLElement>(`.${styles.container}`)!;
    animate(w, { opacity: [0, 1] }, { duration: 0.4, ease: "easeInOut" });
    animate(panel, { y: [20, 0], opacity: [0, 1] }, { duration: 0.4, delay: 0.4, ease: OUT_QUART });
    const key = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open]);

  function close() {
    const w = wrapper.current;
    if (!w) return setOpen(false);
    const panel = w.querySelector<HTMLElement>(`.${styles.container}`)!;
    animate(panel, { y: 20, opacity: 0 }, { duration: 0.2, ease: EASE_IN });
    animate(w, { opacity: 0 }, { duration: 0.3, ease: EASE_IN }).then(() => setOpen(false));
  }

  return (
    <div className={styles.component}>
      <div
        onClickCapture={(e) => {
          if (e.altKey) return; // the Inspector's Alt+click
          e.preventDefault();
          setOpen(true);
        }}
      >
        {trigger}
      </div>
      {open &&
        createPortal(
          <div ref={wrapper} className={styles.wrapper} role="dialog" aria-modal="true">
            <div className={styles.container}>
              {children}
              <a role="button" href="#" className={styles.close} onClick={(e) => (e.preventDefault(), close())}>
                <span className={styles.srOnly}>Close Modal</span>
                <span aria-hidden="true">×</span>
              </a>
            </div>
            <div aria-hidden="true" tabIndex={-1} className={styles.closeArea} onClick={close} />
          </div>,
          document.body,
        )}
    </div>
  );
}
