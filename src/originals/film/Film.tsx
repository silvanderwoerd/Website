import { resolveOriginal } from "../resolve";
import { marks } from "../marks";
import { FilmPlayer, type Film as FilmData } from "@/motion/FilmPlayer";
import { stripeBase } from "@/stripes/base";
import { getSite } from "@/content";
import type { StripeProps } from "@/stripes/types";
import styles from "./film.module.css";

export function Film({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("film", stripe);
  const base = stripeBase(stripe);
  const { film } = stripe.content as { film: FilmData };
  const { icons } = getSite();
  return (
    <section className={styles.film} style={base.style} {...marks("film", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <div className={styles.container}>
        <FilmPlayer film={film} play={icons.play} />
      </div>
      {base.bottom}
    </section>
  );
}
