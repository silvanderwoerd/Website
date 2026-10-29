/* eslint-disable @next/next/no-img-element -- images copied as-is; media moves in step 7 */
import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { AnimatedText } from "@/motion/AnimatedText";
import { stripeBase } from "@/stripes/base";
import { getCollection, type TeamMember } from "@/content";
import type { StripeProps } from "@/stripes/types";
import styles from "./team.module.css";

type Content = { heading: string; coreLabel: string; collectiveLabel: string };

function Member({ m }: { m: TeamMember }) {
  return (
    <div>
      <div className={styles.member}>
        <img src={m.photo.src} alt={m.photo.alt} className={styles.photo} loading="lazy" />
        <div className={styles.shade} />
        <div className={styles.caption}>
          <p className={`${styles.name} ts-member-name`}>{m.name}</p>
          <p className={`${styles.role} ts-member-role`}>{m.role}</p>
        </div>
      </div>
    </div>
  );
}

export function Team({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("team", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  const team = getCollection("team");
  const list = (g: TeamMember["group"]) => (
    <div className={styles.listBox}>
      <div className={styles.grid}>
        {team
          .filter((m) => m.group === g)
          .map((m) => (
            <Member key={m.name} m={m} />
          ))}
      </div>
    </div>
  );
  return (
    <section className={styles.section} style={base.style} {...marks("team", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <div className={styles.head}>
        <div>
          <AnimatedText as="h2" className={`${styles.heading} ts-section-heading`} text={c.heading} strong={styles.strong} field="heading" />
        </div>
      </div>
      <div className={styles.groups}>
        <p className={`${styles.label} ts-label-large`} {...field("coreLabel")}>
          {c.coreLabel}
        </p>
        {list("core")}
        <p className={`${styles.label} ts-label-large`} {...field("collectiveLabel")}>
          {c.collectiveLabel}
        </p>
        {list("collective")}
      </div>
      {base.bottom}
    </section>
  );
}
