/* eslint-disable @next/next/no-img-element -- images copied as-is; media moves in step 7 */
import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { Button } from "../button/Button";
import { Inline } from "@/lib/inline";
import { stripeBase } from "@/stripes/base";
import type { BlockInstance } from "../types";
import type { StripeProps } from "@/stripes/types";
import styles from "./cta.module.css";

type Content = { image: { src: string; alt: string }; heading: string; text: string; button?: BlockInstance & { label: string; href: string } };

export function Cta({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("cta", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  return (
    <section className={styles.section} style={base.style} {...marks("cta", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.imageBox}>
            <img src={c.image.src} alt={c.image.alt} className={styles.image} />
          </div>
          <div className={styles.content}>
            <h2 className={`${styles.heading} ts-h2`} {...field("heading")} data-raw={c.heading}>
              <Inline text={c.heading} />
            </h2>
            <div className={styles.space} aria-hidden="true" />
            <p className={`${styles.text} ts-cta-text`} {...field("text")} data-raw={c.text}>
              <Inline text={c.text} />
            </p>
            <div className={styles.spaceAfter} aria-hidden="true" />
            {c.button && <Button instance={`${instance}.button`} block={c.button} />}
          </div>
        </div>
      </div>
      {base.bottom}
    </section>
  );
}
