import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import type { BlockInstance } from "../types";
import styles from "./button.module.css";

type Props = { instance: string; block: BlockInstance & { label: string; href: string } };

export function Button({ instance, block }: Props) {
  const { settings, attrs } = resolveOriginal("button", block);
  const news = settings.variant === "news";
  return (
    <a
      href={block.href}
      className={`${styles.button} ${news ? "ts-news-button" : "ts-button"}`}
      {...marks("button", instance)}
      {...attrs}
    >
      <span className={`${styles.label} ${news ? "" : "ts-button-label"}`} {...field("label")}>
        {block.label}
      </span>
    </a>
  );
}
