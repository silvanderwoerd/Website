import { ArrowLink } from "../arrow-link/ArrowLink";
import { AnimatedText } from "@/motion/AnimatedText";
import { RichText } from "@/lib/RichText";
import styles from "./text.module.css";

export type TextContent = { heading: string; body: string; link?: { label: string; href: string } };

// The heading + rich text pair, shared by the text and text-on-image stripes.
// `dark`: the text-on-image panel's rich text (.fl-split-small-rich-text-dark-bg).
export function TextPair({ instance, content, arrow, dark }: { instance: string; content: TextContent; arrow: string; dark?: boolean }) {
  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <div>
          {content.heading && <AnimatedText as="h2" className={`${styles.heading} ts-h2`} text={content.heading} field="heading" />}
        </div>
        <div>
          <RichText markdown={content.body} className={`${dark ? styles.bodyDark : styles.body} ts-body`} />
          {content.link && (
            <div>
              <ArrowLink instance={`${instance}.link`} block={content.link} arrow={arrow} base={{ variant: "partners" }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
