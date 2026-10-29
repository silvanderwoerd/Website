import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { Inline } from "@/lib/inline";
import { stripeBase } from "@/stripes/base";
import type { StripeProps } from "@/stripes/types";
import styles from "./quote.module.css";

export function Quote({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("quote", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as { quote: string; cite: string };
  return (
    <section style={base.style} {...marks("quote", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <div className={styles.container}>
        <figure className={styles.wrapper}>
          <div className={styles.bar} />
          <blockquote className={`${styles.quote} ts-quote`} {...field("quote")} data-raw={c.quote}>
            <Inline text={c.quote} />
          </blockquote>
          <figcaption>
            <cite>
              <p className={`${styles.cite} ts-body`} {...field("cite")}>{c.cite}</p>
            </cite>
          </figcaption>
        </figure>
      </div>
      {base.bottom}
    </section>
  );
}
