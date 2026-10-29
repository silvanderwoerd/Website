import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { Chapter } from "../cine-statement/Chapter";
import { AnimatedText } from "@/motion/AnimatedText";
import { HoverClip } from "@/motion/Cinematic";
import type { VideoSource } from "@/motion/BackgroundVideo";
import { stripeBase } from "@/stripes/base";
import type { StripeProps } from "@/stripes/types";
import styles from "./cine-work.module.css";

type Card = { href: string; client: string; title: string; line: string; image: string; video?: VideoSource };
type Content = { chapter: string; label: string; heading: string; all: { label: string; href: string }; cards: Card[] };

// Four films: the first wide as a cinema screen (2.39:1), three tall below.
// Each still wakes into its clip on hover.
export function CineWork({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("cine-work", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  return (
    <section className={styles.section} style={base.style} {...marks("cine-work", instance)} {...attrs} {...base.attrs}>
      <div className={styles.wrap}>
        <Chapter n={c.chapter} label={c.label} field={field("label")} />
        <div className={styles.head}>
          <AnimatedText as="h2" className={`${styles.heading} ts-cine-h2`} text={c.heading} strong={styles.strong} field="heading" />
          <a href={c.all.href} className={`${styles.all} ts-cine-label`}>
            {c.all.label}
            <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className={styles.grid}>
          {c.cards.map((card, i) => (
            <HoverClip key={card.href} href={card.href} image={card.image} video={card.video} className={`${styles.card} ${i === 0 ? styles.wide : ""}`} stillClass={styles.still} videoClass={styles.clip}>
              <div className={styles.caption}>
                <span className={`${styles.client} ts-cine-label`}>{card.client}</span>
                <h3 className={`${styles.title} ts-cine-card-title`}>{card.title}</h3>
                <p className={`${styles.line} ts-cine-body`}>{card.line}</p>
              </div>
            </HoverClip>
          ))}
        </div>
      </div>
    </section>
  );
}
