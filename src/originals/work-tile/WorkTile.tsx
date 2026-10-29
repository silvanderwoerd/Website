/* eslint-disable @next/next/no-img-element -- images copied as-is; media moves in step 7 */
import { field, marks } from "../marks";
import { BackgroundVideo, type VideoSource } from "@/motion/BackgroundVideo";
import styles from "./work-tile.module.css";

export type WorkTileContent = { href: string; client: string; title: string; image: { src: string; alt: string }; video: VideoSource };

export function WorkTile({ instance, tile }: { instance: string; tile: WorkTileContent }) {
  return (
    <a href={tile.href} className={styles.tile} {...marks("work-tile", instance)}>
      <div className={styles.videoBox}>
        <BackgroundVideo video={tile.video} className={styles.video} />
        <div className="ts-work-tile-client" {...field("client")}>
          {tile.client}
        </div>
        <h2 className={`${styles.title} ts-work-tile-title`} {...field("title")}>
          {tile.title}
        </h2>
      </div>
      <div className={styles.cover}>
        <img src={tile.image.src} alt={tile.image.alt} className={styles.image} loading="lazy" />
      </div>
    </a>
  );
}
