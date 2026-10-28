import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { Button } from "../button/Button";
import { stripeBase } from "@/stripes/base";
import type { StripeProps } from "@/stripes/types";
import styles from "./closing-cta.module.css";

type Content = { heading: string; button: { label: string; href: string } };

// The heading's second line is the big one: "line one\nline two" in content.
export function ClosingCta({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("closing-cta", stripe);
  const base = stripeBase(stripe);
  const content = stripe.content as Content;
  const [first, ...more] = content.heading.split("\n");
  return (
    <section className={styles.section} style={base.style} {...marks("closing-cta", instance)} {...attrs} {...base.attrs}>
      <div className={styles.centre}>
        <h2 className={`${styles.heading} ts-closing`} {...field("heading")} data-raw={content.heading}>
          {first}
          <br />
          <span className="ts-closing-strong">{more.join(" ")}</span>
        </h2>
        <div>
          <Button instance={`${instance}.button`} block={content.button} base={{ variant: "cta" }} />
        </div>
      </div>
    </section>
  );
}
