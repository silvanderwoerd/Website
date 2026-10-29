import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { FilmPlayer, type Film } from "@/motion/FilmPlayer";
import { RichText } from "@/lib/RichText";
import { stripeBase } from "@/stripes/base";
import { getSite } from "@/content";
import type { StripeProps } from "@/stripes/types";
import styles from "./episode.module.css";

type Content = { heading: string; body: string; film: Film | null };

export function Episode({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("episode", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  const { icons } = getSite();
  return (
    <div className={styles.row} style={base.style} {...marks("episode", instance)} {...attrs} {...base.attrs}>
      <div className={`${styles.col} ${styles.text}`}>
        <h2 className={styles.heading} {...field("heading")}>{c.heading}</h2>
        <RichText markdown={c.body} className={`${styles.body} ts-body`} />
      </div>
      <div className={`${styles.col} ${styles.media}`}>
        <div className={styles.space} aria-hidden="true" />
        {c.film && (
          <div className={styles.filmBox}>
            <FilmPlayer film={c.film} play={icons.play} />
          </div>
        )}
      </div>
    </div>
  );
}
