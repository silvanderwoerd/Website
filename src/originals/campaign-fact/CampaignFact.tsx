import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { Button } from "../button/Button";
import type { BlockInstance } from "../types";
import { Inline } from "@/lib/inline";
import { stripeBase } from "@/stripes/base";
import type { StripeProps } from "@/stripes/types";
import styles from "./campaign-fact.module.css";

type Content = { eyebrow?: string; text: string; spaceAbove?: boolean; button?: BlockInstance & { label: string; href: string } };

export function CampaignFact({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("campaign-fact", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  return (
    <section className={styles.section} style={base.style} {...marks("campaign-fact", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <div className={styles.fact}>
        <div className={styles.container}>
          <div className={styles.inner}>
            {c.spaceAbove && <div className={styles.space6} aria-hidden="true" />}
            {c.eyebrow && (
              <h2 className={`${styles.eyebrow} ts-eyebrow-large`} {...field("eyebrow")}>
                {c.eyebrow}
              </h2>
            )}
            <p className={`${styles.text} ts-statement-medium`} {...field("text")} data-raw={c.text}>
              <Inline text={c.text} strong={styles.strong} />
            </p>
          </div>
        </div>
      </div>
      {c.button && (
        <section className={styles.act}>
          <div className={styles.buttonBox}>
            <Button instance={`${instance}.button`} block={c.button} base={{ variant: "earth-defender" }} />
            <div className={styles.space3} aria-hidden="true" />
          </div>
        </section>
      )}
      {base.bottom}
    </section>
  );
}
