import { resolveOriginal } from "../resolve";
import { marks } from "../marks";
import { AnimatedText } from "@/motion/AnimatedText";
import { GallerySlider, type GalleryImage } from "@/motion/GallerySlider";
import { stripeBase } from "@/stripes/base";
import { getSite } from "@/content";
import type { StripeProps } from "@/stripes/types";
import styles from "./gallery.module.css";

// Image classes by setting value, shared with text-on-image's galleries.
export const galleryImage = (size: string) => styles[`image-${size}`] ?? styles["image-campaign"];

export function Gallery({ instance, stripe }: StripeProps) {
  const { settings, attrs } = resolveOriginal("gallery", stripe);
  const base = stripeBase(stripe);
  const { heading, images } = stripe.content as { heading?: string; images: GalleryImage[] };
  const { icons } = getSite();
  return (
    <section className={styles.gallery} style={base.style} {...marks("gallery", instance)} {...attrs} {...base.attrs}>
      {base.top}
      {heading && (
        <div className={styles.headingBox}>
          <AnimatedText as="h2" className={`${styles.heading} ts-h2`} text={heading} field="heading" />
          <div className={styles.headingSpace} aria-hidden="true" />
        </div>
      )}
      <GallerySlider
        images={images}
        imageClass={galleryImage(String(settings.image))}
        centre={settings.align === "center"}
        arrows={{ left: icons.arrowLeft, right: icons.arrowRight }}
      />
      {base.bottom}
    </section>
  );
}
