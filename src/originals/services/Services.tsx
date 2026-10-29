import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { ArrowLink } from "../arrow-link/ArrowLink";
import type { BlockInstance } from "../types";
import { AnimatedText } from "@/motion/AnimatedText";
import { stripeBase } from "@/stripes/base";
import { getSite } from "@/content";
import type { StripeProps } from "@/stripes/types";
import { ServiceTabs, type Tab } from "./ServiceTabs";
import styles from "./services.module.css";

type Content = { eyebrow: string; heading: string; tabs: Tab[]; link: BlockInstance & { label: string; href: string } };

export function Services({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("services", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  const { icons } = getSite();
  return (
    <section className={styles.section} style={base.style} {...marks("services", instance)} {...attrs} {...base.attrs}>
      {base.top}
      {c.tabs.map((t, i) => (
        <div key={t.label} className={styles.background} style={{ backgroundImage: `url("${t.background}")`, opacity: i === 0 ? 1 : 0 }} />
      ))}
      <div className={styles.container}>
        <p className={`${styles.eyebrow} ts-label-large`} {...field("eyebrow")}>
          {c.eyebrow}
        </p>
        <AnimatedText as="h2" className={`${styles.heading} ts-section-title`} text={c.heading} strong={styles.strong} field="heading" />
        <ServiceTabs tabs={c.tabs} />
        <ArrowLink instance={`${instance}.link`} block={c.link} arrow={icons.arrow} base={{ variant: "partners" }} />
      </div>
      {base.bottom}
    </section>
  );
}
