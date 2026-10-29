import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { ArrowLink } from "../arrow-link/ArrowLink";
import type { BlockInstance } from "../types";
import { FilmPlayer, type Film } from "@/motion/FilmPlayer";
import { Inline } from "@/lib/inline";
import { stripeBase } from "@/stripes/base";
import { getSite } from "@/content";
import type { StripeProps } from "@/stripes/types";
import styles from "./about-statement.module.css";

type Content = { eyebrow: string; text: string; body: string; link: BlockInstance & { label: string; href: string }; film: Film };

export function AboutStatement({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("about-statement", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  const { icons } = getSite();
  return (
    <section className={styles.section} style={base.style} {...marks("about-statement", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <div className={styles.split}>
        <div className={styles.container}>
          <div className={styles.inner}>
            <h2 className={`${styles.eyebrow} ts-eyebrow-large`} {...field("eyebrow")}>
              {c.eyebrow}
            </h2>
            <p className={`${styles.large} ts-statement-medium`} {...field("text")} data-raw={c.text}>
              <Inline text={c.text} strong={styles.strong} />
            </p>
            <p className={`${styles.body} ts-mission-body`} {...field("body")}>
              {c.body}
            </p>
            <ArrowLink instance={`${instance}.link`} block={c.link} arrow={icons.arrow} base={{ variant: "partners" }} />
          </div>
        </div>
      </div>
      <div className={styles.videoRow}>
        <div className={styles.film}>
          <FilmPlayer film={c.film} play={icons.play} />
        </div>
      </div>
      {base.bottom}
    </section>
  );
}
