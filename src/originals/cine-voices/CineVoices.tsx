/* eslint-disable @next/next/no-img-element -- images copied as-is; media moves in step 7 */
import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { Chapter } from "../cine-statement/Chapter";
import { AnimatedText } from "@/motion/AnimatedText";
import { stripeBase } from "@/stripes/base";
import { getCollection } from "@/content";
import type { StripeProps } from "@/stripes/types";
import styles from "./cine-voices.module.css";

type Content = { chapter: string; label: string; quote: string; name: string; role: string };

// One partner's words, large; the partners' logos drift past underneath.
export function CineVoices({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("cine-voices", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  const partners = getCollection("partners");
  return (
    <section className={styles.section} style={base.style} {...marks("cine-voices", instance)} {...attrs} {...base.attrs}>
      <div className={styles.wrap}>
        <Chapter n={c.chapter} label={c.label} field={field("label")} />
        <figure className={styles.figure}>
          <span className={styles.mark} aria-hidden="true">
            “
          </span>
          <AnimatedText as="blockquote" className={`${styles.quote} ts-cine-quote`} text={c.quote} field="quote" />
          <figcaption className={styles.cite}>
            <span className="ts-cine-label" {...field("name")}>
              {c.name}
            </span>
            <span className={`${styles.role} ts-cine-body`} {...field("role")}>
              {c.role}
            </span>
          </figcaption>
        </figure>
      </div>
      <div className={styles.marquee} aria-label="Partners">
        <div className={styles.track}>
          {[...partners, ...partners].map((p, i) => (
            <img key={`${p.name}-${i}`} src={p.logo} alt={i < partners.length ? p.name : ""} className={styles.logo} loading="lazy" />
          ))}
        </div>
      </div>
    </section>
  );
}
