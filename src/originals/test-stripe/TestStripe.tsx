import type { CSSProperties } from "react";
import { resolveOriginal } from "../resolve";
import { field, marks, textStyle } from "../marks";
import { Button } from "../button/Button";
import type { StripeProps } from "@/stripes/types";
import styles from "./test-stripe.module.css";

type Content = {
  eyebrow: string;
  title: string;
  text: string;
  button: { label: string; href: string };
};

export function TestStripe({ instance, stripe }: StripeProps) {
  const { settings, attrs, style } = resolveOriginal("test-stripe", stripe);
  const content = stripe.content as Content;
  return (
    <section className={styles.stripe} style={style as CSSProperties} {...marks("test-stripe", instance)} {...attrs}>
      <div className={styles.inner}>
        <p className={`${styles.eyebrow} ts-eyebrow`} {...field("eyebrow")}>{content.eyebrow}</p>
        <h2 className={`${styles.title} ${textStyle(settings.titleStyle)}`} {...field("title")}>{content.title}</h2>
        <p className={`${styles.text} ts-body`} {...field("text")}>{content.text}</p>
        <div className={styles.buttonWrap}>
          <Button instance={`${instance}.button`} block={content.button} />
        </div>
      </div>
    </section>
  );
}
