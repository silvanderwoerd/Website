import { resolveOriginal } from "../resolve";
import { marks } from "../marks";
import { AnimatedText } from "@/motion/AnimatedText";
import { GallerySlider, StrayArrows, type GalleryImage } from "@/motion/GallerySlider";
import { Quote } from "../quote/Quote";
import { stripeBase } from "@/stripes/base";
import { getSite } from "@/content";
import type { StripeProps } from "@/stripes/types";
import styles from "./gallery.module.css";

// Image classes by setting value, shared with text-on-image's galleries.
export const galleryImage = (size: string) => styles[`image-${size}`] ?? styles["image-campaign"];

export function Gallery({ instance, stripe }: StripeProps) {
  const { settings, attrs } = resolveOriginal("gallery", stripe);
  const base = stripeBase(stripe);
  // quote / strayArrows: Earth Defender's COP29 band (a gallery nested in a gallery, the quote inside its slider box).
  const { heading, spaceAboveHeading, images, quote, strayArrows } = stripe.content as { heading?: string; spaceAboveHeading?: boolean; images: GalleryImage[]; quote?: { quote: string; cite: string; padTop?: string; padBottom?: string }; strayArrows?: boolean };
  const { icons } = getSite();
  return (
    <section className={styles.gallery} style={base.style} {...marks("gallery", instance)} {...attrs} {...base.attrs}>
      {base.top}
      {heading && (
        <div className={styles.headingBox}>
          {spaceAboveHeading && <div className={styles.headingSpace} aria-hidden="true" />}
          <AnimatedText as="h2" className={`${styles.heading} ts-h2`} text={heading} field="heading" />
          <div className={styles.headingSpace} aria-hidden="true" />
        </div>
      )}
      {strayArrows && <StrayArrows arrows={{ left: icons.arrowLeft, right: icons.arrowRight }} />}
      <GallerySlider
        images={images}
        imageClass={galleryImage(String(settings.image))}
        centre={settings.align === "center"}
        arrows={{ left: icons.arrowLeft, right: icons.arrowRight }}
      >
        {quote && <Quote instance={`${instance}.quote`} stripe={{ id: "quote", type: "quote", padTop: quote.padTop, padBottom: quote.padBottom, content: quote }} />}
      </GallerySlider>
      {base.bottom}
    </section>
  );
}
