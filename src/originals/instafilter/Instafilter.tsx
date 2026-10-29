import { resolveOriginal } from "../resolve";
import { marks } from "../marks";
import { BackgroundVideo, type VideoSource } from "@/motion/BackgroundVideo";
import { stripeBase } from "@/stripes/base";
import type { StripeProps } from "@/stripes/types";
import styles from "./instafilter.module.css";

export function Instafilter({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("instafilter", stripe);
  const base = stripeBase(stripe);
  const { video } = stripe.content as { video: VideoSource };
  return (
    <section style={base.style} {...marks("instafilter", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <div className={styles.container}>
        <div className={styles.box}>
          <BackgroundVideo video={video} className={styles.video} />
        </div>
      </div>
      {base.bottom}
    </section>
  );
}
