import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { AnimatedText } from "@/motion/AnimatedText";
import { stripeBase } from "@/stripes/base";
import { getSite } from "@/content";
import type { StripeProps } from "@/stripes/types";
import { StatCard, type Stat } from "./StatCard";
import styles from "./sustainability.module.css";

type Content = { eyebrow: string; heading: string; text: string; stats: Stat[]; readMore: string; readLess: string };

export function Sustainability({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("sustainability", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  const { icons } = getSite();
  return (
    <section className={styles.section} style={base.style} {...marks("sustainability", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <div className={styles.container}>
        <div className={`${styles.eyebrow} ts-eyebrow-project`} {...field("eyebrow")}>
          {c.eyebrow}
        </div>
        <div className={styles.space2} aria-hidden="true" />
        <AnimatedText as="h2" className={`${styles.heading} ts-act-title`} text={c.heading} strong={styles.strong} field="heading" afterLoad />
        <div className={styles.space} aria-hidden="true" />
        <div className={styles.textWidth}>
          <p className={`${styles.text} ts-act-intro`} {...field("text")}>
            {c.text}
          </p>
        </div>
        <div className={styles.space3} aria-hidden="true" />
        <div className={styles.cards}>
          {c.stats.map((s) => (
            <StatCard key={s.label} stat={s} readMore={c.readMore} readLess={c.readLess} icon={icons.plus} />
          ))}
        </div>
      </div>
      <div className={styles.after} aria-hidden="true" />
      {base.bottom}
    </section>
  );
}
