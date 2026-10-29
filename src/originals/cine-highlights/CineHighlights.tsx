import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { Chapter } from "../cine-statement/Chapter";
import { BlurText, Reveal } from "@/motion/Cinematic";
import { stripeBase } from "@/stripes/base";
import type { StripeProps } from "@/stripes/types";
import { HighlightStage, type Highlight } from "./HighlightStage";
import styles from "./cine-highlights.module.css";

type Content = { chapter: string; label: string; heading: string; highlights: Highlight[] };

// Campaign highlights the way the page opens: the chosen campaign's film fills
// the screen, its story large over it; pointing at another campaign in the
// index below brings its film in.
export function CineHighlights({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("cine-highlights", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  return (
    <section className={styles.section} style={base.style} {...marks("cine-highlights", instance)} {...attrs} {...base.attrs}>
      <HighlightStage highlights={c.highlights}>
        <Reveal>
          <Chapter n={c.chapter} label={c.label} field={field("label")} />
        </Reveal>
        <BlurText as="h2" className={`${styles.heading} ts-cine-h2`} text={c.heading} strong={styles.strong} field="heading" />
      </HighlightStage>
    </section>
  );
}
