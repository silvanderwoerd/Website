"use client";

/* eslint-disable @next/next/no-img-element -- images copied as-is; media moves in step 7 */
// IX2 on .project-link, copied:
// - "Reveal": a black cover drops to 0% height (2000ms inOutQuint) when it scrolls into view;
// - "Project Scale Poster": the poster goes from 1.3× and 10px blur to 1× and sharp (3000ms outQuint, after 500ms);
// - "Project Video Reveal": in view or hovered, the clip shows and the poster fades (500ms); out of view or
//   on mouse out, the poster comes back;
// - "Hover In / Out Button" + "View Project Hover": a play circle opens (120px, 1000ms outQuint) and follows the pointer.

import { useEffect, useRef, useState } from "react";
import { animate } from "motion";
import { BackgroundVideo, type VideoSource } from "@/motion/BackgroundVideo";
import { field, marks } from "../marks";
import styles from "./project-tile.module.css";

export type Tile = { href: string; client: string; title: string; poster: string; video: VideoSource };

const IN_OUT_QUINT = [0.86, 0, 0.07, 1] as const;
const OUT_QUINT = [0.23, 1, 0.32, 1] as const;

export function ProjectTile({ instance, tile, play }: { instance: string; tile: Tile; play: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [video, setVideo] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cover = el.querySelector<HTMLElement>(`.${styles.cover}`)!;
    const poster = el.querySelector<HTMLElement>(`.${styles.poster}`)!;
    let revealed = false;
    const observer = new IntersectionObserver(([entry]) => {
      setVideo(entry.isIntersecting);
      if (!entry.isIntersecting || revealed) return;
      revealed = true;
      if (still) return;
      animate(cover, { height: ["100%", "0%"] }, { duration: 2, ease: IN_OUT_QUINT });
      animate(poster, { scale: [1.3, 1], filter: ["blur(10px)", "blur(0px)"] }, { duration: 3, delay: 0.5, ease: OUT_QUINT });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.ratio}>
      <a
        ref={ref}
        href={tile.href}
        className={styles.tile}
        data-follow=""
        onMouseEnter={() => setVideo(true)}
        onMouseLeave={() => setVideo(false)}
        {...marks("project-tile", instance)}
      >
        <div className={styles.reveal}>
          <div className={styles.content}>
            <div className={styles.videoBox} data-on={video ? "" : undefined}>
              <BackgroundVideo video={tile.video} className={styles.video} active={video} />
            </div>
            <img src={tile.poster} alt="" className={styles.poster} data-hidden={video ? "" : undefined} />
            <div className={styles.overlay} />
            <div className={styles.text}>
              <p className={`${styles.client} ts-h3`} {...field("client")}>{tile.client}</p>
              <h3 className={`${styles.title} ts-h1`} {...field("title")}>{tile.title}</h3>
            </div>
          </div>
          <div className={styles.hoverButton}>
            <div className={styles.circle}>
              <div className={`${styles.play} ts-button`}>
                <img src={play} alt="" width={24} className={styles.playIcon} />
              </div>
            </div>
          </div>
          <div className={styles.cover} />
        </div>
      </a>
    </div>
  );
}
