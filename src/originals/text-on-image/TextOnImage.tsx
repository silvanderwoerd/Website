/* eslint-disable @next/next/no-img-element -- images copied as-is; media moves in step 7 */
import { resolveOriginal } from "../resolve";
import { marks } from "../marks";
import { TextPair, type TextContent } from "../text/TextPair";
import { galleryImage } from "../gallery/Gallery";
import { AnimatedText } from "@/motion/AnimatedText";
import { FilmPlayer, type Film } from "@/motion/FilmPlayer";
import { GallerySlider, type GalleryImage } from "@/motion/GallerySlider";
import { stripeBase } from "@/stripes/base";
import { getSite } from "@/content";
import type { StripeProps } from "@/stripes/types";
import styles from "./text-on-image.module.css";

type Part =
  | ({ kind: "text"; dark?: boolean } & TextContent)
  | { kind: "film"; film: Film }
  | { kind: "gallery"; image: string; images: GalleryImage[] };

export function TextOnImage({ instance, stripe }: StripeProps) {
  const { settings, attrs } = resolveOriginal("text-on-image", stripe);
  const base = stripeBase(stripe);
  const { image, parts } = stripe.content as { image: { src: string; alt: string }; parts: Part[] };
  const { icons } = getSite();
  const campaign = settings.panel === "campaign";
  return (
    <section className={styles.section} style={base.style} {...marks("text-on-image", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <div className={styles.bg}>
        <img src={image.src} alt="" aria-hidden="true" className={styles.bgImage} />
      </div>
      <div className={styles.space} aria-hidden="true" />
      {parts.map((part, i) => {
        if (part.kind === "text" && campaign) {
          return (
            <div key={i} className={styles.heading}>
              <AnimatedText as="h2" className={`${styles.headingText} ts-h2`} text={part.heading} field="heading" />
              <div className={styles.headingSpace} aria-hidden="true" />
            </div>
          );
        }
        if (part.kind === "text") {
          return (
            <div key={i}>
              <TextPair instance={instance} content={part} arrow={icons.arrow} dark={part.dark} />
              <div className={styles.space} aria-hidden="true" />
            </div>
          );
        }
        if (part.kind === "film") {
          return (
            <div key={i} className={styles.film}>
              <FilmPlayer film={part.film} play={icons.play} />
            </div>
          );
        }
        return (
          <GallerySlider key={i} images={part.images} imageClass={galleryImage(part.image)} arrows={{ left: icons.arrowLeft, right: icons.arrowRight }} />
        );
      })}
      {base.bottom}
    </section>
  );
}
