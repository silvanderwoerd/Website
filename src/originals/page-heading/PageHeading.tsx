import { resolveOriginal } from "../resolve";
import { marks } from "../marks";
import { AnimatedText } from "@/motion/AnimatedText";
import { stripeBase } from "@/stripes/base";
import type { StripeProps } from "@/stripes/types";
import styles from "./page-heading.module.css";

export function PageHeading({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("page-heading", stripe);
  const base = stripeBase(stripe);
  const { heading } = stripe.content as { heading: string };
  return (
    <section className={styles.section} style={base.style} {...marks("page-heading", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <div className={styles.before} aria-hidden="true" />
      <div className={styles.container}>
        <AnimatedText as="h1" className={`${styles.heading} ts-page-title`} text={heading} field="heading" afterLoad />
      </div>
      <div className={styles.after} aria-hidden="true" />
      {base.bottom}
    </section>
  );
}
