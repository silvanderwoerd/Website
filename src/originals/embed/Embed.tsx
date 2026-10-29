import { resolveOriginal } from "../resolve";
import { marks } from "../marks";
import { stripeBase } from "@/stripes/base";
import type { StripeProps } from "@/stripes/types";
import { EmbedBridge } from "./EmbedBridge";
import styles from "./embed.module.css";

export function Embed({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("embed", stripe);
  const base = stripeBase(stripe);
  const { url } = stripe.content as { url: string };
  return (
    <section style={base.style} {...marks("embed", instance)} {...attrs} {...base.attrs}>
      <div>
        <iframe src={url} className={styles.frame} title="Embedded site" />
      </div>
      <EmbedBridge origin={new URL(url).origin} />
    </section>
  );
}
