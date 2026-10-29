/* eslint-disable @next/next/no-img-element -- images copied as-is; media moves in step 7 */
import { categoryName, getSite, type PostSummary } from "@/content";
import styles from "./news-card.module.css";

// "2026-09-20" → "September 20, 2026", as Webflow writes dates.
export const longDate = (iso: string) =>
  iso ? new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }) : "";

// One post card (live .link-content-blog), shared by the news list, the
// category pages and a post's More News. `light`: More News' titles
// (h2.text-weight-light). `date`: the date to show, the post's own by default.
// `wide`: the category pages' summary (.max-width-medium > .text-size-regular, no gap above).
export function NewsCard({ post, readNow, light, wide, date = post.date }: { post: PostSummary; readNow: string; light?: boolean; wide?: boolean; date?: string }) {
  const { icons } = getSite();
  // The outer div is Webflow's list item (.w-dyn-item): a grid sizes its columns
  // by what's inside it, which the card itself (overflow hidden) would hide.
  return (
    <div className={styles.item}>
      <a href={`/blog-posts/${post.slug}`} className={styles.card}>
        <div className={styles.picture}>
          <div className={styles.imageWrap}>
            <img src={post.image} alt={post.title} className={styles.image} loading="lazy" />
          </div>
          <div className={styles.tag}>
            <div>{categoryName(post.category)}</div>
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.date}>
            <img src={icons.calendar} alt="Calendar Icon" className={styles.calendar} loading="lazy" />
            <div className="ts-news-body">{longDate(date)}</div>
          </div>
          <div className={styles.space}>
            <h2 className={light ? "ts-news-card-title-light" : "ts-news-card-title"}>{post.title}</h2>
            <div className={wide ? styles.summaryWide : styles.space}>
              <p className={wide ? "ts-news-body-large" : "ts-news-body"}>{post.summary}</p>
            </div>
          </div>
          <div className={`${styles.readNow} ts-news-small`}>{readNow}</div>
        </div>
      </a>
    </div>
  );
}
