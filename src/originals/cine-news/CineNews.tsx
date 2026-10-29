import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { Chapter } from "../cine-statement/Chapter";
import { longDate } from "../news-list/NewsCard";
import { CursorPreview, Reveal } from "@/motion/Cinematic";
import { stripeBase } from "@/stripes/base";
import { categoryName, getLatestPosts } from "@/content";
import type { StripeProps } from "@/stripes/types";
import styles from "./cine-news.module.css";

type Content = {
  chapter: string;
  label: string;
  count: number;
  all: { label: string; href: string };
};

// The newest posts as a list of headlines, like end credits; hovering one
// shows its image in a frame that follows the cursor.
export function CineNews({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("cine-news", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  const posts = getLatestPosts(c.count);
  return (
    <section className={styles.section} style={base.style} {...marks("cine-news", instance)} {...attrs} {...base.attrs}>
      <div className={styles.wrap}>
        <Chapter n={c.chapter} label={c.label} field={field("label")} />
        <CursorPreview images={posts.map((p) => p.image)} className={styles.list}>
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 120}>
              <a href={`/blog-posts/${p.slug}`} className={styles.row} data-row={i}>
                <span className={`${styles.meta} ts-cine-label`}>{categoryName(p.category)}</span>
                <strong className={`${styles.title} ts-cine-news`}>{p.title}</strong>
                <time className={`${styles.date} ts-cine-label`} dateTime={p.date}>
                  {longDate(p.date)}
                </time>
              </a>
            </Reveal>
          ))}
        </CursorPreview>
        <a href={c.all.href} className={`${styles.all} ts-cine-label`}>
          {c.all.label}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
