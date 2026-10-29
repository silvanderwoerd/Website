import { resolveOriginal } from "../resolve";
import { marks } from "../marks";
import { AnimatedText } from "@/motion/AnimatedText";
import { Inline } from "@/lib/inline";
import { stripeBase } from "@/stripes/base";
import type { StripeProps } from "@/stripes/types";
import styles from "./stats.module.css";

type Content = { title: string; items: { number: string; label: string }[] };

// The numbers are plain text, as on the live site: its count-in animation
// targets an element that only exists on a template page, so nothing moves.
export function Stats({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("stats", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  return (
    <section style={base.style} {...marks("stats", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.titleBox}>
            <AnimatedText as="h2" className={`${styles.title} ts-display-strong`} text={c.title} field="title" />
          </div>
          {c.items.map((item, i) => (
            <div key={i} className={styles.item}>
              <p className={`${styles.number} ts-stat-number`}>{item.number}</p>
              <p className={`${styles.label} ts-stat-label`}>
                <Inline text={item.label} />
              </p>
            </div>
          ))}
        </div>
      </div>
      {base.bottom}
    </section>
  );
}
