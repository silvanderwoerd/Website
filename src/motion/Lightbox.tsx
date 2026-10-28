"use client";

// Webflow's video lightbox (the Home showreel): a dark full-screen layer with
// the YouTube or Vimeo film, closed by the ✕, a click outside or Esc.

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "./lightbox.module.css";

export function embedUrl(url: string) {
  const yt = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/.exec(url);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0`;
  const vimeo = /vimeo\.com\/(\d+)/.exec(url);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`;
  return url;
}

export function Lightbox({ url, className, children, ...rest }: { url: string; className?: string; children: ReactNode } & Record<`data-${string}`, string>) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open]);

  return (
    <>
      <a
        href={url}
        className={className}
        {...rest}
        onClick={(e) => {
          if (e.altKey) return; // the Inspector's Alt+click
          e.preventDefault();
          setOpen(true);
        }}
      >
        {children}
      </a>
      {open &&
        createPortal(
          <div className={styles.backdrop} role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
            <button className={styles.close} aria-label="Close" onClick={() => setOpen(false)} />
            <div className={styles.frame} onClick={(e) => e.stopPropagation()}>
              <iframe src={embedUrl(url)} allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowFullScreen title="Video" />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
