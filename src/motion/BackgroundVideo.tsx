"use client";

// BackgroundVideo (CLAUDE.md): muted, looping, inline; poster first so the
// first paint is never black; MP4 + WebM as Webflow serves them; plays only
// while on screen; Reduce motion shows the poster only. The parent's CSS
// places it (`className`): object-fit cover, filling its stripe.

import { useEffect, useRef } from "react";

export type VideoSource = { poster: string; mp4: string; webm: string };

export function BackgroundVideo({ video, className, active = true }: { video: VideoSource; className?: string; active?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still || !active) return void el.pause();
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.play().catch(() => {});
      else el.pause();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [active]);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload="metadata"
      poster={video.poster}
      style={{ backgroundImage: `url("${video.poster}")` }}
      aria-hidden="true"
    >
      <source src={video.mp4} type="video/mp4" />
      <source src={video.webm} type="video/webm" />
    </video>
  );
}
