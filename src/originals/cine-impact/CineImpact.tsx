/* eslint-disable @next/next/no-img-element -- images copied as-is; media moves in step 7 */
import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { Chapter } from "../cine-statement/Chapter";
import { AnimatedText } from "@/motion/AnimatedText";
import { CountUp } from "@/motion/Cinematic";
import { stripeBase } from "@/stripes/base";
import type { StripeProps } from "@/stripes/types";
import styles from "./cine-impact.module.css";

type Stat = { value: number; decimals?: number; suffix: string; label: string };
type Proof = { kicker: string; title: string; text: string; link: { label: string; href: string }; image: string };
type Content = { chapter: string; label: string; heading: string; stats: Stat[]; proofs: Proof[] };

export function CineImpact({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("cine-impact", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  return (
    <section className={styles.section} style={base.style} {...marks("cine-impact", instance)} {...attrs} {...base.attrs}>
      <div className={styles.wrap}>
        <Chapter n={c.chapter} label={c.label} field={field("label")} />
        <AnimatedText as="h2" className={`${styles.heading} ts-cine-h2`} text={c.heading} strong={styles.strong} field="heading" />
        <div className={styles.stats}>
          {c.stats.map((s) => (
            <div key={s.label} className={styles.stat}>
              <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} className={`${styles.number} ts-cine-stat`} />
              <span className={`${styles.statLabel} ts-cine-body`}>{s.label}</span>
            </div>
          ))}
        </div>
        <div className={styles.proofs}>
          {c.proofs.map((p) => (
            <a key={p.title} href={p.link.href} className={styles.proof}>
              <div className={styles.frame}>
                <img src={p.image} alt="" className={styles.image} loading="lazy" />
              </div>
              <span className={`${styles.kicker} ts-cine-label`}>{p.kicker}</span>
              <h3 className={`${styles.title} ts-cine-card-title`}>{p.title}</h3>
              <p className={`${styles.text} ts-cine-body`}>{p.text}</p>
              <span className={`${styles.more} ts-cine-label`}>{p.link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
