/* eslint-disable @next/next/no-img-element -- images copied as-is; media moves in step 7 */
import { resolveOriginal } from "../resolve";
import { marks } from "../marks";
import { stripeBase } from "@/stripes/base";
import type { StripeProps } from "@/stripes/types";
import styles from "./logo-row.module.css";

type Logo = { src: string; alt: string; href?: string };

export function LogoRow({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("logo-row", stripe);
  const base = stripeBase(stripe);
  const { logos } = stripe.content as { logos: Logo[] };
  return (
    <section className={styles.section} style={base.style} {...marks("logo-row", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <div className={styles.space} aria-hidden="true" />
      <div className={styles.row}>
        {logos.map((l) =>
          l.href ? (
            <a key={l.src} href={l.href} target="_blank" rel="noreferrer" className={styles.link}>
              <img src={l.src} alt={l.alt} loading="lazy" />
            </a>
          ) : (
            <img key={l.src} src={l.src} alt={l.alt} loading="lazy" />
          ),
        )}
      </div>
      {base.bottom}
    </section>
  );
}
