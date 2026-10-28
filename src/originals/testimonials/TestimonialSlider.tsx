"use client";

/* eslint-disable @next/next/no-img-element -- logos and icons copied as-is; media moves in step 7 */
// The live page's Swiper setup, copied: free mode, 1.2 cards per view (20px gap),
// 2.3 from 768px (40px), 3.3 from 1024px (50px); arrows; cards shrink to 0.9
// while dragged. IX2 "Read More / Read Less": the quote opens from 6.5em to its
// full height (300ms outQuint), the plus turns 45° (500ms easeInOut).

import { useEffect, useRef, useState } from "react";
import Swiper from "swiper";
import { FreeMode, Navigation } from "swiper/modules";
import "swiper/css";
import { animate } from "motion";
import { Inline } from "@/lib/inline";
import type { Testimonial } from "@/content";
import styles from "./testimonials.module.css";

const OUT_QUINT = [0.23, 1, 0.32, 1] as const;

type Icons = { plus: string; left: string; right: string };

function Card({ item, readMore, readLess, plus }: { item: Testimonial; readMore: string; readLess: string; plus: string }) {
  const [open, setOpen] = useState(false);
  const quote = useRef<HTMLQuoteElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) return void (first.current = false);
    const el = quote.current;
    if (!el) return;
    const from = el.getBoundingClientRect().height;
    if (open) {
      el.style.height = "auto";
      const to = el.getBoundingClientRect().height;
      el.style.height = `${from}px`;
      animate(el, { height: [`${from}px`, `${to}px`] }, { duration: 0.3, ease: OUT_QUINT }).then(() => (el.style.height = "auto"));
    } else {
      animate(el, { height: [`${from}px`, "6.5em"] }, { duration: 0.3, ease: OUT_QUINT });
    }
  }, [open]);

  return (
    <div className={`${styles.card} swiper-slide`}>
      <blockquote ref={quote} className={`${styles.quote} ts-testimonial`}>
        <Inline text={item.quote} />
      </blockquote>
      <a
        href="#"
        className={`${styles.readMore} ts-read-more`}
        onClick={(e) => {
          if (e.altKey) return;
          e.preventDefault();
          setOpen(!open);
        }}
        aria-expanded={open}
      >
        <img src={plus} alt="" className={styles.plus} data-open={open ? "" : undefined} />
        <span>{open ? readLess : readMore}</span>
      </a>
      <div className={styles.cite}>
        <div>
          <div className={`${styles.name} ts-testimonial`}>{item.name}</div>
          <div className={`${styles.role} ts-testimonial-role`}>
            <Inline text={item.role} />
          </div>
        </div>
        {item.logo && <img src={item.logo} alt="" width={136} className={styles.logo} />}
      </div>
    </div>
  );
}

export function TestimonialSlider({ items, readMore, readLess, icons }: { items: Testimonial[]; readMore: string; readLess: string; icons: Icons }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const swiper = new Swiper(el.querySelector<HTMLElement>(".swiper")!, {
      modules: [FreeMode, Navigation],
      direction: "horizontal",
      freeMode: true,
      slidesPerView: 1.2,
      spaceBetween: 20,
      navigation: { nextEl: el.querySelector<HTMLElement>(`.${styles.next}`), prevEl: el.querySelector<HTMLElement>(`.${styles.prev}`) },
      breakpoints: {
        640: { slidesPerView: 1.2, spaceBetween: 20 },
        768: { slidesPerView: 2.3, spaceBetween: 40 },
        1024: { slidesPerView: 3.3, spaceBetween: 50 },
      },
    });
    const scale = (s: string) => swiper.slides.forEach((slide) => (slide.style.transform = `scale(${s})`));
    swiper.on("touchMove", () => scale("0.9"));
    swiper.on("touchEnd", () => scale("1"));
    return () => swiper.destroy();
  }, []);

  return (
    <div ref={root} className={styles.slider}>
      <div className={`${styles.swiper} swiper`}>
        <div className="swiper-wrapper">
          {items.map((item) => (
            <Card key={item.name} item={item} readMore={readMore} readLess={readLess} plus={icons.plus} />
          ))}
        </div>
      </div>
      <div className={styles.prev} role="button" aria-label="Previous">
        <img src={icons.left} alt="" />
      </div>
      <div className={styles.next} role="button" aria-label="Next">
        <img src={icons.right} alt="" />
      </div>
    </div>
  );
}
