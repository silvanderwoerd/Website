/* eslint-disable @next/next/no-img-element -- icon copied as-is; media moves in step 7 */
import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import type { BlockInstance, Settings } from "../types";
import { Inline } from "@/lib/inline";
import styles from "./arrow-link.module.css";

// The label's **…** is its blue word (live .text-color-blue: "Our Real World **Action**").
// `arrow` is left out where the live page puts the arrow beside the link (About's awards).
type Props = { instance: string; block: BlockInstance & { label: string; href: string }; arrow?: string; base?: Settings };

export function ArrowLink({ instance, block, arrow, base }: Props) {
  const { attrs } = resolveOriginal("arrow-link", block, base);
  return (
    <a href={block.href} className={`${styles.link} ts-link-small`} {...marks("arrow-link", instance)} {...attrs}>
      <span className={styles.content}>
        <span {...field("label")} data-raw={block.label}>
          <Inline text={block.label} strong={styles.blue} />
        </span>
        {arrow && <img src={arrow} alt="" className={styles.arrow} />}
      </span>
      <span className={styles.line}>
        <span className={styles.progress} />
      </span>
    </a>
  );
}
