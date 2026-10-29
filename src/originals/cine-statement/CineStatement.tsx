import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { AnimatedText } from "@/motion/AnimatedText";
import { stripeBase } from "@/stripes/base";
import type { StripeProps } from "@/stripes/types";
import { Chapter } from "./Chapter";
import styles from "./cine-statement.module.css";

type Content = { chapter: string; label: string; text: string; sub: string };

export function CineStatement({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("cine-statement", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  return (
    <section className={styles.section} style={base.style} {...marks("cine-statement", instance)} {...attrs} {...base.attrs}>
      <div className={styles.wrap}>
        <Chapter n={c.chapter} label={c.label} field={field("label")} />
        <AnimatedText as="p" className={`${styles.text} ts-cine-statement`} text={c.text} strong={styles.strong} field="text" />
        <p className={`${styles.sub} ts-cine-body`} {...field("sub")}>
          {c.sub}
        </p>
      </div>
    </section>
  );
}
