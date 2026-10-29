/* eslint-disable @next/next/no-img-element -- images copied as-is; media moves in step 7 */
import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { Button } from "../button/Button";
import { BackgroundVideo, type VideoSource } from "@/motion/BackgroundVideo";
import { AnimatedText } from "@/motion/AnimatedText";
import { Inline } from "@/lib/inline";
import { stripeBase } from "@/stripes/base";
import { getSite } from "@/content";
import type { StripeProps } from "@/stripes/types";
import { HeroFade, HeroParallax } from "./HeroFade";
import styles from "./hero.module.css";

type HomeContent = { title: string; video: VideoSource; button: { label: string; href: string; lightbox?: boolean } };
type ProjectContent = { eyebrow: string; client: string; title: string; image: { src: string; alt: string } };

export function Hero({ instance, stripe }: StripeProps) {
  const { settings, attrs } = resolveOriginal("hero", stripe);
  const base = stripeBase(stripe);
  const root = { style: base.style, ...marks("hero", instance), ...attrs, ...base.attrs };

  if (settings.variant === "project") {
    const c = stripe.content as ProjectContent;
    return (
      <section className={styles.project} {...root}>
        <img src={c.image.src} alt={c.image.alt} className={styles.cover} />
        <HeroParallax className={styles.projectText}>
          <div className={`${styles.projectEyebrow} ts-eyebrow-project`} {...field("eyebrow")}>{c.eyebrow}</div>
          <div className={styles.space15} aria-hidden="true" />
          <p className={`${styles.client} ts-hero-client`} {...field("client")}>{c.client}</p>
          <div className={styles.space05} aria-hidden="true" />
          <div className={styles.titleBox}>
            <AnimatedText as="h1" className={`${styles.projectTitle} ts-project-title`} text={c.title} field="title" afterLoad />
          </div>
        </HeroParallax>
      </section>
    );
  }

  const content = stripe.content as HomeContent;
  const { socials } = getSite();
  return (
    <header className={styles.hero} {...root}>
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
