/* eslint-disable @next/next/no-img-element -- images copied as-is; media moves in step 7 */
import { marks } from "../marks";
import { EmbedScript } from "@/lib/EmbedScript";
import type { Site } from "@/content";
import styles from "./footer.module.css";

type Props = Pick<Site, "logo" | "socials" | "footer"> & { path: string };

const TREE_NATION = "https://widgets.tree-nation.com/js/widgets/v3/widgets.min.js";

export function Footer({ logo, socials, footer, path }: Props) {
  const { columns, newsletter, treeNation, commitments, copyright } = footer;
  return (
    <footer {...marks("footer", "site#footer")}>
      <div className={styles.footer}>
        <div className={styles.padding}>
          <div className={styles.container}>
            <div className={styles.grid}>
              <div className={styles.brand}>
                <a href="/" className={`${styles.logoLink} ${path === "/" ? styles.current : ""}`} aria-current={path === "/" ? "page" : undefined}>
                  <img src={logo.src} alt={logo.alt} className={styles.logo} />
                </a>
                <div className={styles.intro} />
                <div className={styles.socials}>
                  {socials.map((s) => (
                    <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className={styles.social} aria-label={s.label}>
                      <img src={s.icon} alt="" />
                    </a>
                  ))}
                </div>
                <EmbedScript src={TREE_NATION}>
                  <div data-widget-type="tree-counter" data-tree-nation-code={treeNation.code} data-lang="en" data-theme="dark" />
                </EmbedScript>
                <div className={styles.spacer} />
                <div className={styles.commitments}>
                  <img src={commitments.src} alt={commitments.alt} className={styles.commitmentsImage} />
                </div>
              </div>
              {columns.map((groups, i) => (
                <div key={i} className={styles.column}>
                  {groups.map((g) => (
                    <div key={g.title}>
                      <div className={`${styles.title} ts-footer-title`}>{g.title}</div>
                      <ul role="list" className={styles.list}>
                        {g.links.map((l) => (
                          <li key={l.href} className={styles.item}>
                            <a href={l.href} className={styles.link}>
                              <div className={`${styles.linkText} ts-footer-link`}>{l.label}</div>
                              <div className={styles.underline} />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
              <div className={styles.column}>
                <div className={`${styles.title} ts-footer-title`}>{newsletter.title}</div>
                <EmbedScript
                  className={styles.newsletter}
                  src={`https://eocampaign1.com/form/${newsletter.emailOctopusForm}.js`}
                  attrs={{ "data-form": newsletter.emailOctopusForm }}
                />
              </div>
            </div>
            <div className={styles.bottom}>
              <div className={`${styles.copyright} ts-news-body`}>{copyright}</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
