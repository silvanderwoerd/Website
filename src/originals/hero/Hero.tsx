/* eslint-disable @next/next/no-img-element -- icons copied as-is; media moves in step 7 */
import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { Button } from "../button/Button";
import { BackgroundVideo, type VideoSource } from "@/motion/BackgroundVideo";
import { Inline } from "@/lib/inline";
import { stripeBase } from "@/stripes/base";
import { getSite } from "@/content";
import type { StripeProps } from "@/stripes/types";
import { HeroFade } from "./HeroFade";
import styles from "./hero.module.css";

type Content = { title: string; video: VideoSource; button: { label: string; href: string; lightbox?: boolean } };

export function Hero({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("hero", stripe);
  const base = stripeBase(stripe);
  const content = stripe.content as Content;
  const { socials } = getSite();
  return (
    <header className={styles.hero} style={base.style} {...marks("hero", instance)} {...attrs} {...base.attrs}>
      <div className={styles.media}>
        <BackgroundVideo video={content.video} className={styles.video} />
      </div>
      <div className={styles.overlay} />
      <div className={styles.inner}>
        <div className={styles.padding}>
          <div className={styles.container}>
            <HeroFade className={styles.content}>
              <div />
              <div className={styles.centre}>
                <h1 className={`${styles.title} ts-hero-title`} {...field("title")} data-raw={content.title}>
                  <Inline text={content.title} strong={styles.strong} />
                </h1>
                <div>
                  <Button instance={`${instance}.button`} block={content.button} />
                </div>
              </div>
              <div className={styles.socials}>
                <div className={styles.socialRow}>
                  {socials.map((s) => (
                    <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className={styles.social} aria-label={s.label}>
                      <img src={s.icon} alt="" />
                    </a>
                  ))}
                </div>
              </div>
            </HeroFade>
          </div>
        </div>
      </div>
    </header>
  );
}
