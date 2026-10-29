import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { Lightbox } from "@/motion/Lightbox";
import type { BlockInstance, Settings } from "../types";
import styles from "./button.module.css";

type Props = {
  instance: string;
  // current: the page this button leads to is the one shown (a category page's own button)
  // newTab: opens in a new tab (the campaigns' donate links, as on live)
  block: BlockInstance & { label: string; href: string; lightbox?: boolean; current?: boolean; newTab?: boolean };
  base?: Settings; // the containing original's choice, e.g. { variant: "cta" }
};

export function Button({ instance, block, base }: Props) {
  const { settings, attrs } = resolveOriginal("button", block, base);
  const news = settings.variant === "news";
  const className = `${styles.button} ${news ? "ts-news-button" : "ts-button"}`;
  const props = { ...marks("button", instance), ...attrs, "data-follow": "" };
  const label = (
    <span className={`${styles.label} ${news ? "" : "ts-button-label"}`} {...field("label")}>
      {block.label}
    </span>
  );
  // A film link opens in the lightbox (the Home showreel), as on the live site.
  if (block.lightbox) {
    return (
      <Lightbox url={block.href} className={className} {...props}>
        {label}
      </Lightbox>
    );
  }
  return (
    <a href={block.href} className={className} aria-current={block.current ? "page" : undefined} {...(block.newTab ? { target: "_blank", rel: "noreferrer" } : {})} {...props}>
      {label}
    </a>
  );
}
