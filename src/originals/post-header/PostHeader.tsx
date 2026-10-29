/* eslint-disable @next/next/no-img-element -- images copied as-is; media moves in step 7 */
import { resolveOriginal } from "../resolve";
import { marks } from "../marks";
import { longDate } from "../news-list/NewsCard";
import { stripeBase } from "@/stripes/base";
import { categoryName, getPost, getSite } from "@/content";
import type { StripeProps } from "@/stripes/types";
import styles from "./post-header.module.css";

export function PostHeader({ instance, stripe, context }: StripeProps) {
  const { attrs } = resolveOriginal("post-header", stripe);
  const base = stripeBase(stripe);
  const post = getPost(context?.post ?? "");
  if (!post) return null;
  const { icons } = getSite();
  return (
    <header className={styles.section} style={base.style} {...marks("post-header", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <div className={styles.padding}>
        <div className={styles.container}>
          <div className={styles.top}>
            <h1 className={`${styles.title} ts-news-h1`}>{post.title}</h1>
            <div className={styles.metaSpace}>
              <div className={styles.row}>
                <div className={styles.tag}>{categoryName(post.category)}</div>
                <div className={styles.divider} />
                <div className={styles.row}>
                  <img src={icons.calendar} alt="Calendar Icon" className={styles.calendar} loading="lazy" />
                  <div className="ts-news-body">{longDate(post.date)}</div>
                </div>
              </div>
            </div>
            <div className={styles.imageSpace}>
              <div className={styles.image}>
                <img src={post.image} alt={post.title} className={styles.cover} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {base.bottom}
    </header>
  );
}
