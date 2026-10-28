import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { AnimatedText } from "@/motion/AnimatedText";
import { stripeBase } from "@/stripes/base";
import { getCollection, getSite } from "@/content";
import type { StripeProps } from "@/stripes/types";
import { TestimonialSlider } from "./TestimonialSlider";
import styles from "./testimonials.module.css";

type Content = { eyebrow: string; heading: string; readMore: string; readLess: string };

export function Testimonials({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("testimonials", stripe);
  const base = stripeBase(stripe);
  const content = stripe.content as Content;
  const { icons } = getSite();
  return (
    <header className={styles.section} style={base.style} {...marks("testimonials", instance)} {...attrs} {...base.attrs}>
      <div className={styles.padding}>
        <div className={styles.container}>
          <h2 className={`${styles.eyebrow} ts-eyebrow`} {...field("eyebrow")}>{content.eyebrow}</h2>
          <div className={styles.spacer} aria-hidden="true" />
          <div className={styles.headingRow}>
            <AnimatedText className={`${styles.heading} ts-statement-large`} text={content.heading} field="heading" />
          </div>
        </div>
      </div>
      <TestimonialSlider
        items={getCollection("testimonials")}
        readMore={content.readMore}
        readLess={content.readLess}
        icons={{ plus: icons.plus, left: icons.arrowLeft, right: icons.arrowRight }}
      />
    </header>
  );
}
