import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { BackgroundVideo, type VideoSource } from "@/motion/BackgroundVideo";
import { BlurText, GrainOverlay, Parallax } from "@/motion/Cinematic";
import { Lightbox } from "@/motion/Lightbox";
import { stripeBase } from "@/stripes/base";
import type { StripeProps } from "@/stripes/types";
import styles from "./cine-hero.module.css";

type Content = { label: string; title: string; text: string; reel: { label: string; href: string }; scroll: string; video: VideoSource };

// Phase 2 experiment: the showreel full-bleed, letterbox bars drawing apart,
// the promise rising in line by line, and a quiet credit line like a film's.
export function CineHero({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("cine-hero", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  return (
    <section className={styles.hero} style={base.style} {...marks("cine-hero", instance)} {...attrs} {...base.attrs}>
      <BackgroundVideo video={c.video} className={styles.video} />
      <div className={styles.shade} />
      <GrainOverlay />
      <div className={styles.top}>
        <span className={`${styles.label} ts-cine-label`} {...field("label")}>
          {c.label}
        </span>
      </div>
      <Parallax className={styles.inner}>
        <BlurText as="h1" className={`${styles.title} ts-cine-display`} text={c.title} strong={styles.strong} field="title" afterLoad />
        <div className={styles.foot}>
          <p className={`${styles.text} ts-cine-body`} {...field("text")}>
            {c.text}
          </p>
          <Lightbox url={c.reel.href} className={styles.reel}>
            <span className={styles.play} aria-hidden="true" />
            <span className="ts-cine-label">{c.reel.label}</span>
          </Lightbox>
        </div>
      </Parallax>
      <span className={`${styles.scroll} ts-cine-label`} aria-hidden="true">
        {c.scroll}
      </span>
    </section>
  );
}
