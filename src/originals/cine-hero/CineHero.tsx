import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { BackgroundVideo, type VideoSource } from "@/motion/BackgroundVideo";
import { BlurText, GrainOverlay, ScrollStage } from "@/motion/Cinematic";
import { Lightbox } from "@/motion/Lightbox";
import { stripeBase } from "@/stripes/base";
import type { StripeProps } from "@/stripes/types";
import styles from "./cine-hero.module.css";

type Content = { title: string; text: string; reel: { label: string; href: string }; video: VideoSource };

// Phase 2 experiment: a title card. The showreel full screen with only the
// promise in the middle of it; as you start to scroll the shot holds, the
// promise rises and the intro and showreel come out of a blur below it; at
// the end the film sinks into black as the next band rises over it.
export function CineHero({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("cine-hero", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  return (
    <section className={styles.hero} style={base.style} {...marks("cine-hero", instance)} {...attrs} {...base.attrs}>
      <ScrollStage className={styles.frame}>
        <BackgroundVideo video={c.video} className={styles.video} />
        <div className={styles.shade} />
        <GrainOverlay />
        <div className={styles.card}>
          <div className={styles.titleBox}>
            <BlurText as="h1" className={`${styles.title} ts-cine-display`} text={c.title} strong={styles.strong} field="title" afterLoad />
            <div className={`${styles.after} ${styles.extra}`}>
              <p className={`${styles.text} ts-cine-lead`} {...field("text")}>
                {c.text}
              </p>
              <Lightbox url={c.reel.href} className={styles.reel}>
                <span className={styles.play} aria-hidden="true" />
                <span className={`${styles.reelLabel} ts-cine-credit`}>{c.reel.label}</span>
              </Lightbox>
            </div>
          </div>
        </div>
        <span className={styles.cue} aria-hidden="true" />
      </ScrollStage>
    </section>
  );
}
