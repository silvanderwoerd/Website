/* eslint-disable @next/next/no-img-element -- images copied as-is; media moves in step 7 */
import { resolveOriginal } from "../resolve";
import { field, marks } from "../marks";
import { AnimatedText } from "@/motion/AnimatedText";
import { Inline } from "@/lib/inline";
import { stripeBase } from "@/stripes/base";
import { getSite } from "@/content";
import type { StripeProps } from "@/stripes/types";
import { ContactForm, ContactShade } from "./ContactParts";
import styles from "./contact-hero.module.css";

type Img = { src: string; alt: string };
type Content = {
  background: Img;
  map: Img;
  pins: { id: string; label: string }[];
  eyebrow: string;
  heading: string;
  formEyebrow: string;
  title: string;
  text: string;
  mailIcon: Img;
  contacts: { email: string; href: string; label: string }[];
  quickContact: string;
  fields: { name: string; email: string; message: string };
  send: string;
};

export function ContactHero({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("contact-hero", stripe);
  const base = stripeBase(stripe);
  const c = stripe.content as Content;
  const { socials } = getSite();
  return (
    <div className={styles.wrapper} style={base.style} {...marks("contact-hero", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <div className={styles.bgWrapper}>
        <img src={c.background.src} alt={c.background.alt} className={styles.bgImage} loading="lazy" />
        <ContactShade className={styles.shade} start={{ base: 0.87, xxl: 0.76 }} />
      </div>
      <div className={styles.hero}>
        <div className={styles.map}>
          <img src={c.map.src} alt={c.map.alt} className={styles.mapImage} loading="lazy" />
          {c.pins.map((pin) => (
            <div key={pin.id} className={styles.pin} data-pin={pin.id}>
              <div className={styles.pinDot}>
                <div className={styles.pulse} />
              </div>
              <div className={styles.lineWrapper}>
                <div className={styles.lineMask}>
                  <div className={styles.line} />
                </div>
              </div>
              <div className={styles.pinText}>
                <p className={`${styles.pinLabel} ts-pin-label`}>
                  <Inline text={pin.label} strong={styles.strong} />
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.heroText}>
          <p className={`${styles.eyebrow} ts-eyebrow-large`} {...field("eyebrow")}>
            {c.eyebrow}
          </p>
          <h1 className={`${styles.heading} ts-section-heading`} {...field("heading")} data-raw={c.heading}>
            <Inline text={c.heading} strong={styles.strong} />
          </h1>
        </div>
      </div>
      <section className={styles.section}>
        <div className={styles.space5} aria-hidden="true" />
        <div className={styles.container}>
          <div className={styles.layout}>
            <div>
              <p className={`${styles.label} ts-eyebrow-project`} {...field("formEyebrow")}>
                {c.formEyebrow}
              </p>
              <div className={styles.space2} aria-hidden="true" />
              <AnimatedText as="h2" className={`${styles.title} ts-display-strong`} text={c.title} field="title" />
              <div className={styles.space0875} aria-hidden="true" />
              <p className={`${styles.text} ts-cta-text`} {...field("text")} data-raw={c.text}>
                <Inline text={c.text} strong={styles.white} />
              </p>
              <div className={styles.space2} aria-hidden="true" />
              <div className={styles.socialsBox}>
                <div className={styles.socials}>
                  {socials.map((s) => (
                    <div key={s.href} className={styles.socialItem}>
                      <a href={s.href} target="_blank" rel="noreferrer" className={styles.social} aria-label={s.label}>
                        <img src={s.icon} alt="" loading="lazy" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
              {c.contacts.map((ct, i) => (
                <div key={ct.email}>
                  <div className={i === 0 ? styles.space3375 : i === 1 ? styles.space3375 : styles.space2} aria-hidden="true" />
                  <div className={styles.detail}>
                    <div className={styles.iconBox}>
                      <a href={`mailto:${ct.email}`} className={styles.social} aria-label={ct.email}>
                        <img src={c.mailIcon.src} alt="" loading="lazy" />
                      </a>
                    </div>
                    <div className={styles.detailText}>
                      <a href={ct.href} className={styles.emailLink}>
                        <div className={`${styles.email} ts-contact-email`}>{ct.email}</div>
                      </a>
                      <div className={`${styles.note} ts-contact-note`}>{ct.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.formBlock}>
              <p className={`${styles.label} ts-eyebrow-project`} {...field("quickContact")}>
                {c.quickContact}
              </p>
              <div className={styles.space2} aria-hidden="true" />
              <div className={styles.space2} aria-hidden="true" />
              <ContactForm className={styles.form}>
                <div>
                  <input className={`${styles.input} ts-form-input`} maxLength={256} name="name" placeholder={c.fields.name} type="text" required />
                </div>
                <div>
                  <input className={`${styles.input} ts-form-input`} maxLength={256} name="email" placeholder={c.fields.email} type="email" required />
                </div>
                <div>
                  <textarea className={`${styles.input} ${styles.textarea} ts-form-input`} maxLength={5000} name="message" placeholder={c.fields.message} />
                </div>
                {/* The live form's reCAPTCHA box: empty (its key is invalid), but a row of the grid. */}
                <div className={styles.captcha} aria-hidden="true" />
                <div>
                  <input type="submit" className={`${styles.submit} ts-news-button`} value={c.send} />
                </div>
              </ContactForm>
            </div>
          </div>
        </div>
        <div className={styles.space5} aria-hidden="true" />
      </section>
      {base.bottom}
    </div>
  );
}
