import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { Button } from "../button/Button";
import type { BlockInstance } from "../types";
import { AnimatedText } from "@/motion/AnimatedText";
import { stripeBase } from "@/stripes/base";
import type { StripeProps } from "@/stripes/types";
import styles from "./campaign-intro.module.css";

type Content = { background: string; heading: string; boxHeading: string; text: string; button: BlockInstance & { label: string; href: string } };

export function CampaignIntro({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("campaign-intro", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  return (
    <section className={styles.section} style={{ ...base.style, backgroundImage: `url("${c.background}")` }} {...marks("campaign-intro", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <div className={styles.container}>
        <AnimatedText as="h1" className={`${styles.heading} ts-act-title`} text={c.heading} strong={styles.strong} field="heading" afterLoad />
        <div className={styles.box}>
          <h2 className={`${styles.boxHeading} ts-h2`} {...field("boxHeading")}>
            {c.boxHeading}
          </h2>
          <div className={styles.space} aria-hidden="true" />
          <p className={`${styles.text} ts-cta-text`} {...field("text")}>
            {c.text}
          </p>
          <div className={styles.space} aria-hidden="true" />
          <Button instance={`${instance}.button`} block={c.button} base={{ variant: "empower-children" }} />
        </div>
      </div>
      {base.bottom}
    </section>
  );
}
