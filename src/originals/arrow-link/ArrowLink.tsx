/* eslint-disable @next/next/no-img-element -- icon copied as-is; media moves in step 7 */
import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import type { BlockInstance, Settings } from "../types";
import styles from "./arrow-link.module.css";

type Props = { instance: string; block: BlockInstance & { label: string; href: string }; arrow: string; base?: Settings };

export function ArrowLink({ instance, block, arrow, base }: Props) {
  const { attrs } = resolveOriginal("arrow-link", block, base);
  return (
    <a href={block.href} className={`${styles.link} ts-link-small`} {...marks("arrow-link", instance)} {...attrs}>
      <span className={styles.content}>
        <span {...field("label")}>{block.label}</span>
        <img src={arrow} alt="" className={styles.arrow} />
      </span>
      <span className={styles.line}>
        <span className={styles.progress} />
      </span>
    </a>
  );
}
