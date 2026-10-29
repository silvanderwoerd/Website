"use client";

/* eslint-disable @next/next/no-img-element -- images copied as-is; media moves in step 7 */
// About's awards logos, copied from the live page's Swiper setup: an endless
// column (vertical from 991px up), free mode, slides at their own size, autoplay
// with no pause (speed 6000), shrinking to 0.9 while dragged. Reduce motion: still.

import { useEffect, useRef } from "react";
import Swiper from "swiper";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";

export function LogoColumn({ logos, className, wrapperClass, logoClass }: { logos: { src: string; alt: string }[]; className: string; wrapperClass: string; logoClass: string }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!track.current) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const swiper = new Swiper(track.current, {
      modules: [Autoplay, FreeMode],
      direction: "horizontal",
      slidesPerView: "auto",
      freeMode: true,
      loop: true,
      spaceBetween: 0,
      speed: 6000,
      autoplay: still ? false : { delay: 0, disableOnInteraction: false },
      breakpoints: { 991: { direction: "vertical" } },
    });
    const press = (scale: string) => swiper.slides.forEach((s) => (s.style.transform = `scale(${scale})`));
    swiper.on("touchMove", () => press("0.9"));
    swiper.on("touchEnd", () => press("1"));
    return () => swiper.destroy();
  }, []);

  return (
    <div ref={track} className={`${className} swiper`}>
      <div className={`${wrapperClass} swiper-wrapper`}>
        {logos.map((l, i) => (
          <img key={`${l.src}-${i}`} src={l.src} alt={l.alt} className={`${logoClass} swiper-slide`} loading="eager" />
        ))}
      </div>
    </div>
  );
}
