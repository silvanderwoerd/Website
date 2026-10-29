import { resolveOriginal } from "../resolve";
import { marks } from "../marks";
import { RichText } from "@/lib/RichText";
import { stripeBase } from "@/stripes/base";
import { getPost } from "@/content";
import type { StripeProps } from "@/stripes/types";
import styles from "./post-body.module.css";

// Figures keep their sizes as data in the content (decisions #15): an image's own
// width (data-max-width, px) and a film's ratio (data-ratio, % of its width).
const withFigureSizes = (markdown: string) =>
  markdown
    .replace(/data-max-width="(\d+)"/g, 'style="max-width:$1px"')
    .replace(/data-ratio="([\d.]+)"/g, 'style="padding-bottom:$1%"');

export function PostBody({ instance, stripe, context }: StripeProps) {
  const { attrs } = resolveOriginal("post-body", stripe);
  const base = stripeBase(stripe);
  const post = getPost(context?.post ?? "");
  if (!post) return null;
  return (
    <article className={styles.section} style={base.style} {...marks("post-body", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <div className={styles.padding}>
        <div className={styles.container}>
          <div className={styles.space}>
            <RichText markdown={withFigureSizes(post.body)} className={`${styles.text} ts-news-rich-text`} />
          </div>
        </div>
      </div>
      {base.bottom}
    </article>
  );
}
