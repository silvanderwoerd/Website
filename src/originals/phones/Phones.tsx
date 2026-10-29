/* eslint-disable @next/next/no-img-element -- images copied as-is; media moves in step 7 */
import type { CSSProperties } from "react";
import { resolveOriginal } from "../resolve";
import { marks } from "../marks";
import { stripeBase } from "@/stripes/base";
import type { StripeProps } from "@/stripes/types";
import { PhoneScroll } from "./PhoneScroll";
import styles from "./phones.module.css";

type Content = { screens: { src: string; alt: string }[]; frame: string; background?: { src: string; srcXXL?: string } };

export function Phones({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("phones", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  const bg = c.background
    ? ({ "--bg": `url("${c.background.src}")`, "--bg-xxl": `url("${c.background.srcXXL ?? c.background.src}")` } as CSSProperties)
    : {};
  return (
    <section
      className={`${styles.section} ${c.background ? styles.withBg : ""}`}
      style={{ ...base.style, ...bg }}
      {...marks("phones", instance)}
      {...attrs}
      {...base.attrs}
    >
      {base.top}
      <PhoneScroll className={styles.track} screenClass={styles.screen}>
        {c.screens.map((s, i) => (
          <div key={i} className={styles.phone}>
            <div className={styles.scrollTrack}>
              <img src={s.src} alt={s.alt} className={styles.screen} />
            </div>
            <img src={c.frame} alt="" className={styles.frame} />
          </div>
        ))}
      </PhoneScroll>
      {base.bottom}
    </section>
  );
}
