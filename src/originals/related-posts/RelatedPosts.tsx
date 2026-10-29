import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { Button } from "../button/Button";
import type { BlockInstance } from "../types";
import { NewsCard } from "../news-list/NewsCard";
import { stripeBase } from "@/stripes/base";
import { getPosts } from "@/content";
import type { StripeProps } from "@/stripes/types";
import styles from "./related-posts.module.css";

type Content = { heading: string; text: string; button: BlockInstance & { label: string; href: string }; readNow: string; count: number };

// The cards show a post's cardDate where it has one: the live list reads an
// older date field than the post itself (a Webflow content glitch, phase 1).
export function RelatedPosts({ instance, stripe, context }: StripeProps) {
  const { attrs } = resolveOriginal("related-posts", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  const posts = getPosts()
    .filter((p) => p.slug !== context?.post)
    .slice(0, c.count);
  return (
    <section className={styles.section} style={base.style} {...marks("related-posts", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <div className={styles.padding}>
        <div className={styles.container}>
          <div className={styles.vertical}>
            <div className={styles.top}>
              <div className={styles.inner}>
                <h2 className={`${styles.heading} ts-news-h2`} {...field("heading")}>
                  {c.heading}
                </h2>
                <div className={styles.textSpace}>
                  <div className={styles.textWidth}>
                    <p className="ts-news-body-large" {...field("text")}>
                      {c.text}
                    </p>
                  </div>
                </div>
              </div>
              <div className={`${styles.inner} ${styles.buttonBox}`}>
                <Button instance={`${instance}.button`} block={c.button} base={{ variant: "news" }} />
              </div>
            </div>
            <div className={styles.cardsSpace}>
              <div className={styles.cards}>
                {posts.map((p) => (
                  <NewsCard key={p.slug} post={p} readNow={c.readNow} light date={p.cardDate ?? p.date} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {base.bottom}
    </section>
  );
}
