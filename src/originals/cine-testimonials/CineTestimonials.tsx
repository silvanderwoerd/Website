import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { Chapter } from "../cine-statement/Chapter";
import { BlurText, Reveal } from "@/motion/Cinematic";
import { stripeBase } from "@/stripes/base";
import { getCollection } from "@/content";
import type { StripeProps } from "@/stripes/types";
import styles from "./cine-testimonials.module.css";

type Film = { film: string; line: string };
type Content = { chapter: string; label: string; heading: string; films: Record<string, Film> };

// The partners' words, quietly: the heading on the left, and on the right one
// line from each partner's quote, signed, between hairlines. Pointing at one
// brings it forward while the others fall back.
export function CineTestimonials({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("cine-testimonials", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  const items = getCollection("testimonials").map((t) => {
    const role = t.role.split("\n");
    const film = c.films[t.name];
    return { name: t.name, source: [role[role.length - 1], film?.film].filter(Boolean).join(" · "), line: film?.line ?? "" };
  });
  return (
    <section className={styles.section} style={base.style} {...marks("cine-testimonials", instance)} {...attrs} {...base.attrs}>
      <div className={styles.wrap}>
        <div className={styles.side}>
          <Reveal>
            <Chapter n={c.chapter} label={c.label} field={field("label")} />
          </Reveal>
          <BlurText as="h2" className={`${styles.heading} ts-cine-h2`} text={c.heading} strong={styles.strong} field="heading" />
        </div>
        <ul className={styles.list}>
          {items.map((t, i) => (
            <Reveal as="li" key={t.name} className={styles.row} delay={i * 110}>
              <blockquote className={`${styles.line} ts-cine-body`}>“{t.line}”</blockquote>
              <span className={styles.cite}>
                <span className={`${styles.name} ts-cine-label`}>{t.name}</span>
                <span className={`${styles.source} ts-cine-label`}>{t.source}</span>
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
