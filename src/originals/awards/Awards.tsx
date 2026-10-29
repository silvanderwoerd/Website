/* eslint-disable @next/next/no-img-element -- icon copied as-is; media moves in step 7 */
import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { ArrowLink } from "../arrow-link/ArrowLink";
import type { BlockInstance } from "../types";
import { AnimatedText } from "@/motion/AnimatedText";
import { LogoColumn } from "@/motion/LogoColumn";
import { Modal } from "@/motion/Modal";
import { ParallaxImage } from "@/motion/ParallaxImage";
import { RichText } from "@/lib/RichText";
import { stripeBase } from "@/stripes/base";
import { getSite } from "@/content";
import type { StripeProps } from "@/stripes/types";
import styles from "./awards.module.css";

type Img = { src: string; alt: string };
type Content = { background: Img; eyebrow: string; heading: string; link: BlockInstance & { label: string; href: string }; listTitle: string; list: string; text: string; logos: Img[] };

export function Awards({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("awards", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  const { icons } = getSite();
  return (
    <section className={styles.section} style={base.style} {...marks("awards", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <ParallaxImage src={c.background.src} alt={c.background.alt} className={styles.background} y={[[0, -20], [1, 0]]} />
      <div className={styles.text}>
        <p className={`${styles.eyebrow} ts-eyebrow-large`} {...field("eyebrow")}>
          {c.eyebrow}
        </p>
        <AnimatedText as="h2" className={`${styles.heading} ts-section-heading`} text={c.heading} field="heading" />
        {/* The live page puts the arrow beside the link here, at full strength. */}
        <Modal
          trigger={
            <>
              <ArrowLink instance={`${instance}.link`} block={c.link} />
              <img src={icons.arrow} alt="" className={styles.arrow} />
            </>
          }
        >
          <h2 className={`${styles.listTitle} ts-eyebrow-project`}>{c.listTitle}</h2>
          <div className={styles.listSpace} />
          <RichText markdown={c.list} className={styles.list} />
        </Modal>
        <p className={`${styles.paragraph} ts-body-medium`} {...field("text")}>
          {c.text}
        </p>
      </div>
      <div className={styles.logos}>
        <LogoColumn logos={c.logos} className={styles.track} wrapperClass={styles.group} logoClass={styles.logo} />
      </div>
      {base.bottom}
    </section>
  );
}
