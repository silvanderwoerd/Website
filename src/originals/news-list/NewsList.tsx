import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { Button } from "../button/Button";
import type { BlockInstance } from "../types";
import { stripeBase } from "@/stripes/base";
import { categoryName, getCategories, getPosts } from "@/content";
import type { StripeProps } from "@/stripes/types";
import { NewsCard } from "./NewsCard";
import styles from "./news-list.module.css";

type Content = { eyebrow?: string; heading?: string; readNow: string; categoryButton: BlockInstance };

// News (layout "sidebar") and the category pages (layout "category", the
// template passes the category). Webflow's hidden "all" buttons are left out.
export function NewsList({ instance, stripe, context }: StripeProps) {
  const { settings, attrs } = resolveOriginal("news-list", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  const current = context?.category;
  const posts = getPosts({ category: current });
  const category = settings.layout === "category";

  const buttons = getCategories().map((cat) => (
    <div key={cat.slug} className={styles.buttonItem}>
      <Button
        instance={`${instance}.categoryButton`}
        block={{ ...c.categoryButton, label: cat.name, href: `/blog-categories/${cat.slug}`, current: cat.slug === current }}
        base={{ variant: "news" }}
      />
    </div>
  ));
  const cards = (
    <div className={styles.cards}>
      {posts.map((p) => (
        <NewsCard key={p.slug} post={p} readNow={c.readNow} wide={category} />
      ))}
    </div>
  );

  return (
    <section className={styles.section} style={base.style} {...marks("news-list", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <div className={styles.padding}>
        <div className={styles.container}>
          <div className={styles.vertical}>
            {category ? (
              <>
                <div className={styles.titleRow}>
                  <h1 className={`${styles.heading} ts-news-h1`}>{categoryName(current ?? "")}</h1>
                </div>
                <div className={styles.chipsSpace}>
                  <div className={styles.chips}>{buttons}</div>
                </div>
                <div className={styles.cardsSpace}>{cards}</div>
              </>
            ) : (
              <>
                <div className={styles.eyebrowBox}>
                  <div className={`${styles.eyebrow} ts-news-eyebrow`} {...field("eyebrow")}>
                    {c.eyebrow}
                  </div>
                </div>
                <div className={styles.headingBox}>
                  <div className={styles.headingWidth}>
                    <h1 className={`${styles.heading} ts-news-h1`} {...field("heading")}>
                      {c.heading}
                    </h1>
                  </div>
                </div>
                <div className={styles.layout}>
                  <div className={styles.sidebar}>
                    <div className={styles.sidebarSpace}>
                      <div className={styles.sidebarButtons}>
                        <div className={styles.sidebarList}>{buttons}</div>
                      </div>
                    </div>
                  </div>
                  {cards}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {base.bottom}
    </section>
  );
}
