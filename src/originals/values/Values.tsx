import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { AnimatedText } from "@/motion/AnimatedText";
import { stripeBase } from "@/stripes/base";
import type { StripeProps } from "@/stripes/types";
import { ValueItem } from "./ValueItem";
import styles from "./values.module.css";

type Content = { eyebrow: string; heading: string; items: { title: string; text: string }[] };

export function Values({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("values", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  return (
    <div className={styles.section} style={base.style} {...marks("values", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <div className={styles.before} aria-hidden="true" />
      <div className={styles.container}>
        <div className={`${styles.eyebrow} ts-news-eyebrow`} {...field("eyebrow")}>
          {c.eyebrow}
        </div>
        <div className={styles.headingSpace}>
          <AnimatedText as="h2" className={`${styles.heading} ts-news-h2`} text={c.heading} field="heading" />
        </div>
        <div className={styles.list}>
          {c.items.map((item, i) => (
            <div key={item.title} className={i < c.items.length - 1 ? styles.gap : undefined}>
              <ValueItem n={i + 1} title={item.title} text={item.text} />
            </div>
          ))}
        </div>
      </div>
      {base.bottom}
    </div>
  );
}
