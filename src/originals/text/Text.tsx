import { resolveOriginal } from "../resolve";
import { marks } from "../marks";
import { stripeBase } from "@/stripes/base";
import { getSite } from "@/content";
import type { StripeProps } from "@/stripes/types";
import { TextPair, type TextContent } from "./TextPair";
import styles from "./text.module.css";

export function Text({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("text", stripe);
  const base = stripeBase(stripe);
  const { icons } = getSite();
  return (
    <section className={styles.section} style={base.style} {...marks("text", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <TextPair instance={instance} content={stripe.content as TextContent} arrow={icons.arrow} />
      {base.bottom}
    </section>
  );
}
