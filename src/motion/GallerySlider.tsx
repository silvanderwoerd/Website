"use client";

/* eslint-disable @next/next/no-img-element -- images copied as-is; media moves in step 7 */
// The project galleries, copied from the live page's Swiper setup: free mode,
// slides at their own width, 24px apart, arrows; slides shrink to 0.9 while
// dragged. IX2 "Gallery Side Scroll": the whole strip slides from 0 to −30vw
// while its band scrolls through the window.

import { useCallback, useEffect, useRef } from "react";
import Swiper from "swiper";
import { FreeMode, Navigation } from "swiper/modules";
import "swiper/css";
import { at, useScrollInView, type Keyframes } from "./scroll";
import styles from "./gallery-slider.module.css";

const SLIDE: Keyframes = [[0, 0], [1, -30]];

export type GalleryImage = { src: string; alt: string };

export function GallerySlider({ images, imageClass, arrows, centre }: { images: GalleryImage[]; imageClass: string; arrows: { left: string; right: string }; centre?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const band = useRef<HTMLElement | null>(null);
  const track = useRef<HTMLDivElement>(null);

  const setRoot = useCallback((el: HTMLDivElement | null) => {
    root.current = el;
    band.current = el?.closest("section") ?? null;
  }, []);

  const onProgress = useCallback((p: number) => {
    if (track.current) track.current.style.transform = `translateX(${at(SLIDE, p)}vw)`;
  }, []);
  useScrollInView(band, onProgress);

  useEffect(() => {
    const el = root.current;
    if (!el || !track.current) return;
    const swiper = new Swiper(track.current, {
      modules: [FreeMode, Navigation],
      freeMode: true,
      slidesPerView: "auto",
      spaceBetween: 24,
      navigation: { nextEl: el.querySelector<HTMLElement>(`.${styles.next}`), prevEl: el.querySelector<HTMLElement>(`.${styles.prev}`) },
    });
    const press = (scale: string, cursor: string) =>
      swiper.slides.forEach((s) => {
        s.style.transform = `scale(${scale})`;
        s.style.cursor = cursor;
      });
    swiper.on("touchMove", () => press("0.9", "grabbing"));
    swiper.on("touchEnd", () => press("1", "grab"));
    return () => swiper.destroy();
  }, []);

  return (
    <div ref={setRoot} className={styles.container}>
      <div ref={track} className={`${styles.swiper} swiper`}>
        <div className="swiper-wrapper" style={centre ? { alignItems: "center" } : undefined}>
          {images.map((img, i) => (
            <div key={`${img.src}-${i}`} className={`${styles.slide} swiper-slide`}>
              <img src={img.src} alt={img.alt} loading="lazy" className={imageClass} />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.prev} role="button" aria-label="Previous">
        <img src={arrows.left} alt="" />
      </div>
      <div className={styles.next} role="button" aria-label="Next">
        <img src={arrows.right} alt="" />
      </div>
    </div>
  );
}
