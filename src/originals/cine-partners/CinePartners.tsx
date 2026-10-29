/* eslint-disable @next/next/no-img-element -- images copied as-is; media moves in step 7 */
import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { Chapter } from "../cine-statement/Chapter";
import { BlurText, Reveal } from "@/motion/Cinematic";
import { stripeBase } from "@/stripes/base";
import { getCollection } from "@/content";
import type { StripeProps } from "@/stripes/types";
import type { CSSProperties } from "react";
import styles from "./cine-partners.module.css";

type Content = { chapter: string; label: string; heading: string; link: { label: string; href: string } };

// The partners' logos, loose on the page, drifting in and out of focus one
// after another like a lens racking focus; pointing at one brings it sharp.
export function CinePartners({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("cine-partners", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  const partners = getCollection("partners");
  return (
    <section className={styles.section} style={base.style} {...marks("cine-partners", instance)} {...attrs} {...base.attrs}>
      <div className={styles.wrap}>
        <Reveal>
          <Chapter n={c.chapter} label={c.label} field={field("label")} />
        </Reveal>
        <div className={styles.head}>
          <BlurText as="h2" className={`${styles.heading} ts-cine-h2`} text={c.heading} strong={styles.strong} field="heading" />
          <Reveal delay={400}>
            <a href={c.link.href} className={`${styles.link} ts-cine-label`} {...field("link")}>
              {c.link.label}
              <span aria-hidden="true">→</span>
            </a>
          </Reveal>
        </div>
        <div className={styles.wall}>
          {partners.map((p, i) => (
            <Reveal key={p.name} className={styles.cell} delay={(i % 6) * 90 + Math.floor(i / 6) * 160}>
              <span className={styles.logo} style={{ "--i": i } as CSSProperties}>
                <img src={p.logo} alt="" className={styles.soft} loading="lazy" />
                <img src={p.logo} alt={p.name} className={styles.sharp} loading="lazy" />
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
