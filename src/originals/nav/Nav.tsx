"use client";

// IX2 "Open Menu": the menu panel drops in from the top while its content
// rises (1500ms, cubic-bezier(.425,.005,0,1)), the link texts rise 250ms later,
// and the two lines turn into a cross (600ms inOutBack). "Close Menu" reverses.

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { animate } from "motion";
import { marks } from "../marks";
import type { Site } from "@/content";
import styles from "./nav.module.css";

const MENU = [0.425, 0.005, 0, 1] as const;
const BACK = [0.68, -0.55, 0.265, 1.55] as const;

type Props = Pick<Site, "logo" | "email" | "socials" | "nav"> & { mail: string };

export function Nav({ logo, email, socials, nav, mail }: Props) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false); // menu in the page (display) while open or closing
  const panel = useRef<HTMLElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) return void (first.current = false);
    const el = panel.current;
    if (!el) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const d = (s: number) => (still ? 0 : s);
    const rows = el.querySelectorAll<HTMLElement>(`.${styles.rise}`);
    const component = el.querySelector<HTMLElement>(`.${styles.menu}`)!;
    const lines = el.parentElement!.querySelectorAll<HTMLElement>(`.${styles.line}`);
    if (open) {
      animate(el, { y: ["-100%", "0%"] }, { duration: d(1.5), ease: MENU });
      animate(component, { y: ["100%", "0%"] }, { duration: d(1.5), ease: MENU });
      animate(rows, { y: ["120%", "0%"] }, { duration: d(1.5), delay: d(0.25), ease: MENU });
      animate(lines[0], { rotate: 45, y: 6 }, { duration: d(0.6), ease: BACK });
      animate(lines[1], { rotate: -45, y: -6 }, { duration: d(0.6), ease: BACK });
    } else {
      animate(rows, { y: "120%" }, { duration: d(1.5), ease: MENU });
      animate(lines[0], { rotate: 0, y: 0 }, { duration: d(0.6), ease: BACK });
      animate(lines[1], { rotate: 0, y: 0 }, { duration: d(0.6), ease: BACK });
      animate(component, { y: "100%" }, { duration: d(1.5), delay: d(0.25), ease: MENU });
      animate(el, { y: "-100%" }, { duration: d(1.5), delay: d(0.25), ease: MENU }).then(() => setShown(false));
    }
  }, [open]);

  const toggle = () => {
    if (!open) setShown(true);
    setOpen(!open);
  };

  return (
    <div className={styles.navbar} role="banner" {...marks("nav", "site#nav")}>
      <div className={styles.grid}>
        <a href="/" className={`${styles.logoLink} ${path === "/" ? styles.current : ""}`} aria-current={path === "/" ? "page" : undefined} data-follow="">
          {/* eslint-disable-next-line @next/next/no-img-element -- copied as-is; media moves in step 7 */}
          <img src={logo.src} alt={logo.alt} className={styles.logo} />
        </a>
        <div className={styles.menuContent}>
          <nav ref={panel} className={styles.panel} data-shown={shown ? "" : undefined} aria-hidden={!open}>
            <div className={styles.menu}>
              <div className={styles.links}>
                <div className={styles.linkClip}>
                  <a href="/" className={styles.link} aria-label="Home" tabIndex={open ? 0 : -1}>
                    <div className={styles.linkWindow}>
                      <div className={`${styles.rise} ${styles.riseBox}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logo.src} alt="" className={`${styles.text} ts-nav`} />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logo.src} alt="" className={`${styles.text} ts-nav`} />
                      </div>
                    </div>
                  </a>
                </div>
                {nav.map((l) => (
                  <div key={l.href} className={styles.linkClip}>
                    <a href={l.href} className={styles.link} tabIndex={open ? 0 : -1}>
                      <div className={styles.linkWindow}>
                        <div className={`${styles.rise} ${styles.riseBox}`}>
                          <div className={`${styles.text} ts-nav`}>{l.label}</div>
                          <div className={`${styles.text} ts-nav`} aria-hidden="true">{l.label}</div>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
              <div className={styles.email}>
                <div className={`${styles.rise} ${styles.riseBox}`}>
                  <a href={`mailto:${email}`} className={styles.emailLink} tabIndex={open ? 0 : -1}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={mail} alt="" className={styles.mailIcon} />
                    <span className="ts-news-small">{email}</span>
                  </a>
                </div>
              </div>
              <div className={styles.socials}>
                <div className={`${styles.rise} ${styles.riseBox}`}>
                  <div className={styles.socialRow}>
                    {socials.map((s) => (
                      <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className={styles.social} aria-label={s.label} tabIndex={open ? 0 : -1}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.icon} alt="" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <button type="button" className={styles.hamburger} onClick={toggle} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            <span className={styles.lines}>
              <span className={`${styles.line} ${styles.top}`} />
              <span className={`${styles.line} ${styles.bottom}`} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
