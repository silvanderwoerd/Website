/* eslint-disable @next/next/no-img-element -- images copied as-is; media moves in step 7 */
import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { stripeBase } from "@/stripes/base";
import { categoryName, getLatestPosts, getSite, type PostSummary } from "@/content";
import type { StripeProps } from "@/stripes/types";
import styles from "./latest-news.module.css";

type Content = { eyebrow: string; readNow: string; count: number };

// "2026-09-20" → "September 20, 2026", as Webflow writes dates.
const longDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

function Card({ post, main, readNow, calendar }: { post: PostSummary; main: boolean; readNow: string; calendar: string }) {
  const date = (
    <div className={styles.date}>
      <img src={calendar} alt="Calendar Icon" className={styles.calendar} />
      <div className="ts-news-body">{longDate(post.date)}</div>
    </div>
  );
  const picture = (
    <div className={`${styles.picture} ${main ? styles.mainPicture : styles.sidePicture}`}>
      <div className={styles.imageWrap}>
        <img src={post.image} alt={post.title} className={styles.image} loading="lazy" />
      </div>
      {post.category && <div className={styles.tag}>{categoryName(post.category)}</div>}
    </div>
  );
  return (
    <a href={`/blog-posts/${post.slug}`} className={styles.card}>
      {main ? (
        <>
          {picture}
          <div className={`${styles.body} ${styles.mainBody}`}>
            {date}
            <div className={styles.mainText}>
              <h2 className={`${styles.mainTitle} ts-news-h3`}>{post.title}</h2>
              <div className={styles.summaryBox}>
                <p className={`${styles.summary} ts-news-body-large`}>{post.summary}</p>
              </div>
            </div>
            <div className={`${styles.readNow} ts-news-small`}>{readNow}</div>
          </div>
        </>
      ) : (
        <div className={styles.side}>
          {picture}
          <div className={styles.body}>
            <h2 className={`${styles.sideTitle} ts-news-h4`}>{post.title}</h2>
            {date}
            <div className={`${styles.readNow} ts-news-small`}>{readNow}</div>
          </div>
        </div>
      )}
    </a>
  );
}

export function LatestNews({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("latest-news", stripe);
  const base = stripeBase(stripe);
  const content = stripe.content as Content;
  const [first, ...rest] = getLatestPosts(content.count);
  const { icons } = getSite();
  return (
    <header className={styles.section} style={base.style} {...marks("latest-news", instance)} {...attrs} {...base.attrs}>
      <div className={styles.padding}>
        <div className={styles.container}>
          <h2 className={`${styles.eyebrow} ts-eyebrow`} {...field("eyebrow")}>{content.eyebrow}</h2>
          <div className={styles.grid}>
            <div className={styles.mainColumn}>{first && <Card post={first} main readNow={content.readNow} calendar={icons.calendar} />}</div>
            <div className={styles.sideGrid}>
              {rest.map((p) => (
                <Card key={p.slug} post={p} main={false} readNow={content.readNow} calendar={icons.calendar} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
