import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { AnimatedText } from "@/motion/AnimatedText";
import { stripeBase } from "@/stripes/base";
import type { StripeProps } from "@/stripes/types";
import styles from "./cine-cta.module.css";

type Content = { heading: string; button: { label: string; href: string }; mail: { label: string; href: string } };

// The last scene: one line, one door.
export function CineCta({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("cine-cta", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  return (
    <section className={styles.section} style={base.style} {...marks("cine-cta", instance)} {...attrs} {...base.attrs}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.wrap}>
        <AnimatedText as="h2" className={`${styles.heading} ts-cine-cta`} text={c.heading} strong={styles.strong} field="heading" />
        <div className={styles.actions}>
          <a href={c.button.href} className={`${styles.button} ts-cine-label`}>
            {c.button.label}
          </a>
          <a href={c.mail.href} className={`${styles.mail} ts-cine-body`}>
            {c.mail.label}
          </a>
        </div>
      </div>
    </section>
  );
}
