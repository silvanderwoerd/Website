/* eslint-disable @next/next/no-img-element -- logos copied as-is; media moves in step 7 */
import { resolveOriginal } from "../resolve";
import { marks } from "../marks";
import { ArrowLink } from "../arrow-link/ArrowLink";
import { AnimatedText } from "@/motion/AnimatedText";
import { stripeBase } from "@/stripes/base";
import { getCollection, getSite } from "@/content";
import type { StripeProps } from "@/stripes/types";
import styles from "./partners.module.css";

type Content = { heading: string; link: { label: string; href: string } };

export function Partners({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("partners", stripe);
  const base = stripeBase(stripe);
  const content = stripe.content as Content;
  const logos = getCollection("partners");
  const { icons } = getSite();
  return (
    <section className={styles.section} style={base.style} {...marks("partners", instance)} {...attrs} {...base.attrs}>
      <div className={styles.split}>
        <div>
          <AnimatedText className={`${styles.heading} ts-statement-large`} text={content.heading} strong={styles.strong} field="heading" />
          <ArrowLink instance={`${instance}.link`} block={content.link} arrow={icons.arrow} base={{ variant: "partners" }} />
        </div>
        <div className={styles.logos}>
          {logos.map((p) => (
            <img key={p.logo} src={p.logo} alt={p.name} loading="lazy" className={styles.logo} />
          ))}
        </div>
      </div>
    </section>
  );
}
