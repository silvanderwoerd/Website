/* eslint-disable @next/next/no-img-element -- stamp copied as-is; media moves in step 7 */
import { resolveOriginal } from "../resolve";
import { marks } from "../marks";
import { ArrowLink } from "../arrow-link/ArrowLink";
import { AnimatedText } from "@/motion/AnimatedText";
import { stripeBase } from "@/stripes/base";
import { getSite } from "@/content";
import type { StripeProps } from "@/stripes/types";
import styles from "./statement.module.css";

type Content = { text: string; sub: string; links: { label: string; href: string }[]; stamp?: { src: string; alt: string } };

export function Statement({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("statement", stripe);
  const base = stripeBase(stripe);
  const content = stripe.content as Content;
  const { icons } = getSite();
  return (
    <section className={styles.statement} style={base.style} {...marks("statement", instance)} {...attrs} {...base.attrs}>
      <div className={styles.layout}>
        <div className={styles.copy}>
          <AnimatedText className={`${styles.text} ts-statement-large`} text={content.text} field="text" />
          <AnimatedText as="div" className={`${styles.sub} ts-statement-sub`} text={content.sub} field="sub" />
          <div className={styles.links}>
            {content.links.map((l, i) => (
              <ArrowLink key={l.href} instance={`${instance}.links.${i}`} block={l} arrow={icons.arrow} base={{ variant: "partners" }} />
            ))}
          </div>
        </div>
        {content.stamp && <img src={content.stamp.src} alt={content.stamp.alt} className={styles.stamp} />}
      </div>
    </section>
  );
}
