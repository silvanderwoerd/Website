import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { Chapter } from "../cine-statement/Chapter";
import { longDate } from "../news-list/NewsCard";
import { stripeBase } from "@/stripes/base";
import { categoryName, getLatestPosts } from "@/content";
import type { StripeProps } from "@/stripes/types";
import styles from "./cine-news.module.css";

type Content = { chapter: string; label: string; count: number; all: { label: string; href: string } };

// The newest posts as a list of headlines, like end credits.
export function CineNews({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("cine-news", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  const posts = getLatestPosts(c.count);
  return (
    <section className={styles.section} style={base.style} {...marks("cine-news", instance)} {...attrs} {...base.attrs}>
      <div className={styles.wrap}>
        <Chapter n={c.chapter} label={c.label} field={field("label")} />
        <div className={styles.list}>
          {posts.map((p) => (
            <a key={p.slug} href={`/blog-posts/${p.slug}`} className={styles.row}>
              <span className={`${styles.meta} ts-cine-label`}>{categoryName(p.category)}</span>
              <strong className={`${styles.title} ts-cine-news`}>{p.title}</strong>
              <time className={`${styles.date} ts-cine-label`} dateTime={p.date}>
                {longDate(p.date)}
              </time>
            </a>
          ))}
        </div>
        <a href={c.all.href} className={`${styles.all} ts-cine-label`}>
          {c.all.label}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
