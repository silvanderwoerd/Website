import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { ArrowLink } from "../arrow-link/ArrowLink";
import { AnimatedText } from "@/motion/AnimatedText";
import { Modal } from "@/motion/Modal";
import { Inline } from "@/lib/inline";
import { stripeBase } from "@/stripes/base";
import { getSite } from "@/content";
import type { StripeProps } from "@/stripes/types";
import styles from "./campaign.module.css";

type Content = {
  heading: string;
  text: string;
  press?: { label: string; href: string }[];
  pressLabel?: string;
  link?: { label: string; href: string };
};

export function Campaign({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("campaign", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  const { icons } = getSite();
  return (
    <section className={styles.section} style={base.style} {...marks("campaign", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <div className={styles.container}>
        <AnimatedText as="h2" className={`${styles.heading} ts-display-strong`} text={c.heading} field="heading" />
        <div className={styles.space} aria-hidden="true" />
        <div className={styles.layout}>
          <div className={styles.paragraph}>
            <p className={`${styles.text} ts-cta-text`} {...field("text")} data-raw={c.text}>
              <Inline text={c.text} />
            </p>
          </div>
          <div>
            {c.press && c.press.length > 0 && (
              <Modal trigger={<ArrowLink instance={`${instance}.pressLink`} block={{ label: c.pressLabel ?? "View Media Features", href: "#" }} arrow={icons.arrow} />}>
                <h2 className={`${styles.modalTitle} ts-eyebrow-project`}>Media Features</h2>
                <div className={styles.modalSpace} />
                <div className={styles.press}>
                  {c.press.map((p) => (
                    <p key={p.href + p.label}>
                      <a href={p.href}>{p.label}</a>
                    </p>
                  ))}
                </div>
              </Modal>
            )}
            {c.link && (
              <>
                <div className={styles.linkSpace} aria-hidden="true" />
                <div>
                  <ArrowLink instance={`${instance}.link`} block={c.link} arrow={icons.arrow} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {base.bottom}
    </section>
  );
}
