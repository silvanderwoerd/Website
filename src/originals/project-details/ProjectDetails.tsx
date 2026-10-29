import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { ArrowLink } from "../arrow-link/ArrowLink";
import { AnimatedText } from "@/motion/AnimatedText";
import { Modal } from "@/motion/Modal";
import { RichText } from "@/lib/RichText";
import { stripeBase } from "@/stripes/base";
import { getSite } from "@/content";
import type { StripeProps } from "@/stripes/types";
import styles from "./project-details.module.css";

type Content = {
  eyebrow: string;
  about: string;
  credits: { role: string; name: string }[];
  fullCredits?: string;
  creditsNote?: string;
  press?: { label: string; href: string }[];
  creditsLabel?: string;
  pressLabel?: string;
  logo?: { src: string; alt: string; href: string | null };
};

export function ProjectDetails({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("project-details", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  const { icons } = getSite();
  return (
    <section className={styles.section} style={base.style} {...marks("project-details", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <div className={styles.container}>
        <AnimatedText as="div" className={`${styles.eyebrow} ts-eyebrow-project`} text={c.eyebrow} field="eyebrow" />
        <div className={styles.space2875} aria-hidden="true" />
        <div className={styles.layout}>
          <div className={styles.about}>
            <RichText markdown={c.about} className={styles.aboutText} />
          </div>
          <div>
            {c.credits.map((cr) => (
              <div key={cr.role + cr.name}>
                <h2 className={`${styles.creditTitle} ts-label`}>{cr.role}</h2>
                <p className={`${styles.creditName} ts-caption`}>{cr.name}</p>
              </div>
            ))}
            <div className={styles.space25} aria-hidden="true" />
            {c.fullCredits && (
              <Modal trigger={<ArrowLink instance={`${instance}.creditsLink`} block={{ label: c.creditsLabel ?? "View Full Credits", href: "#" }} arrow={icons.arrow} />}>
                <h2 className={`${styles.modalTitle} ts-eyebrow-project`}>Credits</h2>
                <div className={styles.space2} />
                <RichText markdown={c.fullCredits} className={styles.credits} />
                <div className={styles.space2875} />
                {c.creditsNote && <p className={styles.note}>{c.creditsNote}</p>}
              </Modal>
            )}
            <div className={styles.space1} aria-hidden="true" />
            {c.press && c.press.length > 0 && (
              <Modal trigger={<ArrowLink instance={`${instance}.pressLink`} block={{ label: c.pressLabel ?? "View Media Features", href: "#" }} arrow={icons.arrow} />}>
                <h2 className={`${styles.modalTitle} ts-eyebrow-project`}>Media Features</h2>
                <div className={styles.space2} />
                <div className={styles.press}>
                  {c.press.map((p) => (
                    <p key={p.href + p.label}>
                      <a href={p.href}>{p.label}</a>
                    </p>
                  ))}
                </div>
              </Modal>
            )}
            {c.logo && (
              <>
                <div className={styles.space35} aria-hidden="true" />
                <a href={c.logo.href ?? undefined} target="_blank" rel="noreferrer" className={styles.logoLink}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- logo copied as-is; media moves in step 7 */}
                  <img src={c.logo.src} alt={c.logo.alt} className={styles.logo} />
                </a>
              </>
            )}
          </div>
        </div>
      </div>
      {base.bottom}
    </section>
  );
}
