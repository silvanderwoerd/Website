import { resolveOriginal } from "../resolve";
import { marks } from "../marks";
import { Button } from "../button/Button";
import type { BlockInstance } from "../types";
import { AnimatedText } from "@/motion/AnimatedText";
import { ParallaxImage } from "@/motion/ParallaxImage";
import { stripeBase } from "@/stripes/base";
import type { StripeProps } from "@/stripes/types";
import styles from "./act-statement.module.css";

// Empower Children's has no photo, and a donate button where Act's has its closing space.
type Content = { image?: { src: string; alt: string }; text: string; button?: BlockInstance & { label: string; href: string; newTab?: boolean } };

export function ActStatement({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("act-statement", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  return (
    <section className={styles.section} style={base.style} {...marks("act-statement", instance)} {...attrs} {...base.attrs}>
      {base.top}
      {c.image && (
        <>
          <ParallaxImage src={c.image.src} alt={c.image.alt} className={styles.background} y={[[0, -25], [1, 0]]} />
          <div className={styles.overlay} />
        </>
      )}
      <div className={styles.space} aria-hidden="true" />
      <div className={styles.container}>
        <AnimatedText as="p" className={`${styles.text} ts-act-statement`} text={c.text} field="text" />
      </div>
      {c.button ? (
        <section className={styles.act}>
          <div className={styles.buttonBox}>
            <Button instance={`${instance}.button`} block={c.button} base={{ variant: "empower-children" }} />
          </div>
        </section>
      ) : (
        <div className={styles.space} aria-hidden="true" />
      )}
      {base.bottom}
    </section>
  );
}
