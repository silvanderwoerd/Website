import { resolveOriginal } from "../resolve";
import { marks } from "../marks";
import { AnimatedText } from "@/motion/AnimatedText";
import { ParallaxImage } from "@/motion/ParallaxImage";
import { stripeBase } from "@/stripes/base";
import type { StripeProps } from "@/stripes/types";
import styles from "./act-statement.module.css";

type Content = { image: { src: string; alt: string }; text: string };

export function ActStatement({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("act-statement", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  return (
    <section className={styles.section} style={base.style} {...marks("act-statement", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <ParallaxImage src={c.image.src} alt={c.image.alt} className={styles.background} y={[[0, -25], [1, 0]]} />
      <div className={styles.overlay} />
      <div className={styles.space} aria-hidden="true" />
      <div className={styles.container}>
        <AnimatedText as="p" className={`${styles.text} ts-act-statement`} text={c.text} field="text" />
      </div>
      <div className={styles.space} aria-hidden="true" />
      {base.bottom}
    </section>
  );
}
