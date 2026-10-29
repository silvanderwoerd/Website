import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { AnimatedText } from "@/motion/AnimatedText";
import { stripeBase } from "@/stripes/base";
import type { StripeProps } from "@/stripes/types";
import { ActHeroColumns } from "./ActHeroColumns";
import styles from "./act-hero.module.css";

type Content = { eyebrow: string; heading: string; columns: { src: string; alt: string }[][] };

export function ActHero({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("act-hero", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  return (
    <section className={styles.section} style={base.style} {...marks("act-hero", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <ActHeroColumns columns={c.columns}>
        <div className={styles.container}>
          <div className={`${styles.eyebrow} ts-eyebrow-project`} {...field("eyebrow")}>
            {c.eyebrow}
          </div>
          <div className={styles.space} aria-hidden="true" />
          <AnimatedText as="h1" className={`${styles.heading} ts-act-title`} text={c.heading} strong={styles.strong} field="heading" afterLoad />
        </div>
      </ActHeroColumns>
      {base.bottom}
    </section>
  );
}
