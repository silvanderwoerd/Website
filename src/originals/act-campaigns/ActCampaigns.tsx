/* eslint-disable @next/next/no-img-element -- images copied as-is; media moves in step 7 */
import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { ArrowLink } from "../arrow-link/ArrowLink";
import type { BlockInstance } from "../types";
import { AnimatedText } from "@/motion/AnimatedText";
import { stripeBase } from "@/stripes/base";
import { getSite } from "@/content";
import type { StripeProps } from "@/stripes/types";
import styles from "./act-campaigns.module.css";

type Img = { src: string; alt: string };
type Card = BlockInstance & { href: string; newTab?: boolean; image: Img; logo: Img; text: string; title: string; label: string };
type Content = { eyebrow: string; heading: string; cards: Card[] };

export function ActCampaigns({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("act-campaigns", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  const { icons } = getSite();
  return (
    <section className={styles.section} style={base.style} {...marks("act-campaigns", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <div className={styles.before} aria-hidden="true" />
      <div className={styles.container}>
        <div className={`${styles.eyebrow} ts-eyebrow-project`} {...field("eyebrow")}>
          {c.eyebrow}
        </div>
        <div className={styles.space2} aria-hidden="true" />
        <AnimatedText as="h2" className={`${styles.heading} ts-act-title`} text={c.heading} strong={styles.strong} field="heading" afterLoad />
        <div className={styles.space3} aria-hidden="true" />
        <div className={styles.cards}>
          {c.cards.map((card, i) => (
            <a key={card.href} href={card.href} className={styles.card} {...(card.newTab ? { target: "_blank", rel: "noreferrer" } : {})}>
              <img src={card.image.src} alt={card.image.alt} className={styles.cover} loading="lazy" />
              <div className={styles.shade} />
              <div className={styles.content}>
                <img src={card.logo.src} alt={card.logo.alt} className={styles.logo} loading="lazy" />
                <div className={styles.column}>
                  <p className={`${styles.text} ts-act-card-text`}>{card.text}</p>
                  <h3 className={`${styles.title} ts-h4`}>{card.title}</h3>
                  <ArrowLink as="div" instance={`${instance}.cards.${i}`} block={card} arrow={icons.arrow} className={styles.link} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
      <div className={styles.after} aria-hidden="true" />
      <div className={styles.after} aria-hidden="true" />
      {base.bottom}
    </section>
  );
}
