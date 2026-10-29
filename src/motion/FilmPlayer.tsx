"use client";

// The project film player (CLAUDE.md "Video player"), copied from the live
// page's Plyr setup: poster from the content, ratio per film, Plyr's control
// bar while paused, its own play button hidden in favour of a play circle that
// follows the pointer ±24px (IX2 "Scroll link mouse over") and fills white on
// hover. Plyr and the YouTube/Vimeo player start when the film comes within
// 200px of the screen, not with the page (decisions #17); until then the
// poster holds the player's exact box.

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./film-player.module.css";

export type Film = { provider: "youtube" | "vimeo" | "other"; id: string; poster: string; ratio: string };
type Player = { play(): void; destroy(): void; on(e: string, f: () => void): void; poster: string };

const embed = (f: Film) =>
  f.provider === "youtube"
    ? `https://www.youtube.com/embed/${f.id}?origin=${location.origin}&iv_load_policy=3&modestbranding=1&playsinline=1&showinfo=0&rel=0&enablejsapi=1`
    : f.provider === "vimeo"
      ? `https://player.vimeo.com/video/${f.id}?loop=false&byline=false&portrait=false&title=false&speed=true&transparent=0&gesture=media`
      : f.id;

export function FilmPlayer({ film, play, className }: { film: Film; play: string; className?: string }) {
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<Player | null>(null);
  const wantPlay = useRef(false);
  const [w, h] = film.ratio.split(":").map(Number);

  // Start the player when the film is about to scroll into view.
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const observer = new IntersectionObserver(([e]) => e.isIntersecting && (setNear(true), observer.disconnect()), { rootMargin: "200px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!near || !host.current) return;
    let cancelled = false;
    (async () => {
      const [{ default: Plyr }] = await Promise.all([import("plyr"), import("plyr/dist/plyr.css")]);
      if (cancelled || !host.current) return;
      const p = new Plyr(host.current.querySelector<HTMLElement>(".plyr__video-embed")!, { ratio: film.ratio }) as unknown as Player;
      p.poster = film.poster;
      p.on("play", () => setPlaying(true));
      p.on("pause", () => setPlaying(false));
      p.on("ready", () => wantPlay.current && p.play());
      player.current = p;
    })();
    return () => {
      cancelled = true;
      player.current?.destroy();
      player.current = null;
    };
  }, [near, film.ratio, film.poster]);

  const start = (e: React.MouseEvent) => {
    if (e.altKey) return; // the Inspector's Alt+click
    wantPlay.current = true;
    if (player.current) player.current.play();
    else setNear(true);
  };

  return (
    <div className={`${styles.video} ${className ?? ""}`}>
      <div ref={host} className={styles.embed}>
        {near ? (
          <div className="plyr__video-embed">
            <iframe src={embed(film)} allowFullScreen allow="autoplay" title="Film" />
          </div>
        ) : (
          <div className={styles.poster} style={{ backgroundImage: `url("${film.poster}")`, aspectRatio: `${w} / ${h}` } as CSSProperties} />
        )}
      </div>
      {!playing && (
        <div className={styles.playWrapper} data-follow="">
          <div className={`${styles.play} ts-button`} onClick={start} role="button" aria-label="Play film">
            {/* eslint-disable-next-line @next/next/no-img-element -- icon; media moves in step 7 */}
            <img src={play} alt="" width={24} className={styles.playIcon} />
          </div>
        </div>
      )}
    </div>
  );
}
