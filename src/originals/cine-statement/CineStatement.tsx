import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { BlurText, Reveal, WipeImage } from "@/motion/Cinematic";
import { stripeBase } from "@/stripes/base";
import type { StripeProps } from "@/stripes/types";
import { Chapter } from "./Chapter";
import styles from "./cine-statement.module.css";

type Content = { chapter: string; label: string; text: string; sub: string; image: string; caption: string };

// The sentence after the hero, beside a tall still that wipes open as it arrives.
export function CineStatement({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("cine-statement", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  return (
    <section className={styles.section} style={base.style} {...marks("cine-statement", instance)} {...attrs} {...base.attrs}>
      <div className={styles.wrap}>
        <div className={styles.copy}>
          <Reveal>
            <Chapter n={c.chapter} label={c.label} field={field("label")} />
          </Reveal>
          <BlurText as="p" className={`${styles.text} ts-cine-statement`} text={c.text} strong={styles.strong} field="text" />
          <Reveal delay={300}>
            <p className={`${styles.sub} ts-cine-body`} {...field("sub")}>
              {c.sub}
            </p>
          </Reveal>
        </div>
        <figure className={styles.figure}>
          <WipeImage src={c.image} className={styles.image} delay={150} />
          <Reveal delay={600}>
            <figcaption className={`${styles.caption} ts-cine-label`} {...field("caption")}>
              {c.caption}
            </figcaption>
          </Reveal>
        </figure>
      </div>
    </section>
  );
}
