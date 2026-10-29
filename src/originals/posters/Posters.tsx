/* eslint-disable @next/next/no-img-element -- images copied as-is; media moves in step 7 */
import { resolveOriginal } from "../resolve";
import { marks } from "../marks";
import { FilmPlayer, type Film } from "@/motion/FilmPlayer";
import { stripeBase } from "@/stripes/base";
import { getSite } from "@/content";
import type { StripeProps } from "@/stripes/types";
import styles from "./posters.module.css";

type Content = { images?: { src: string; alt: string }[]; films?: Film[] };

export function Posters({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("posters", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  const { icons } = getSite();
  return (
    <section className={styles.section} style={base.style} {...marks("posters", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <div className={styles.container}>
        <div className={styles.layout}>
          {c.films?.map((f, i) => (
            <div key={i} className={styles.filmBox}>
              <FilmPlayer film={f} play={icons.play} />
            </div>
          ))}
          {c.images?.map((img, i) => (
            <img key={i} src={img.src} alt={img.alt} className={`${styles.image} ${i > 0 ? styles.second : ""}`} />
          ))}
        </div>
      </div>
      {base.bottom}
    </section>
  );
}
