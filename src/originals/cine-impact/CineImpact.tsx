import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { Chapter } from "../cine-statement/Chapter";
import { BlurText, CountUp, Reveal, WipeImage } from "@/motion/Cinematic";
import { stripeBase } from "@/stripes/base";
import type { StripeProps } from "@/stripes/types";
import styles from "./cine-impact.module.css";

type Stat = { value: number; decimals?: number; suffix: string; label: string };
type Content = { chapter: string; label: string; heading: string; background: string; stats: Stat[] };

// The numbers over a dimmed, drifting still, counting up once in view.
export function CineImpact({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("cine-impact", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  return (
    <section className={styles.section} style={base.style} {...marks("cine-impact", instance)} {...attrs} {...base.attrs}>
      <div className={styles.stage}>
        <WipeImage src={c.background} className={styles.backdrop} />
        <div className={styles.shade} />
        <div className={styles.wrap}>
          <Reveal>
            <Chapter n={c.chapter} label={c.label} field={field("label")} />
          </Reveal>
          <BlurText as="h2" className={`${styles.heading} ts-cine-h2`} text={c.heading} strong={styles.strong} field="heading" />
          <div className={styles.stats}>
            {c.stats.map((s, i) => (
              <Reveal key={s.label} className={styles.stat} delay={i * 140}>
                <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} className={`${styles.number} ts-cine-stat`} />
                <span className={`${styles.statLabel} ts-cine-body`}>{s.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
