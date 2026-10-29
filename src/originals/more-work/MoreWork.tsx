import { resolveOriginal } from "../resolve";
import { marks } from "../marks";
import { Button } from "../button/Button";
import { stripeBase } from "@/stripes/base";
import type { StripeProps } from "@/stripes/types";
import styles from "./more-work.module.css";

export function MoreWork({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("more-work", stripe);
  const base = stripeBase(stripe);
  const { button } = stripe.content as { button: { label: string; href: string } };
  return (
    <section className={styles.section} style={base.style} {...marks("more-work", instance)} {...attrs} {...base.attrs}>
      <div className={styles.container}>
        <Button instance={`${instance}.button`} block={button} />
      </div>
    </section>
  );
}
