import { resolveOriginal } from "../resolve";
import { marks } from "../marks";
import { AnimatedText } from "@/motion/AnimatedText";
import { RevealImage } from "@/motion/Reveal";
import { stripeBase } from "@/stripes/base";
import type { StripeProps } from "@/stripes/types";
import styles from "./life-with.module.css";

type Content = { heading: string; photos: { src: string; alt: string }[] };

// Two live bands in one stripe: the heading band and the photo wall below it.
export function LifeWith({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("life-with", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  return (
    <div className={styles.stripe} style={base.style} {...marks("life-with", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <section className={styles.head}>
        <div className={styles.headInner}>
          <AnimatedText as="h2" className={`${styles.heading} ts-section-heading`} text={c.heading} strong={styles.strong} field="heading" />
        </div>
      </section>
      <div className={styles.photos}>
        {c.photos.map((p) => (
          <RevealImage key={p.src} src={p.src} alt={p.alt} className={styles.photo} />
        ))}
      </div>
      {base.bottom}
    </div>
  );
}
