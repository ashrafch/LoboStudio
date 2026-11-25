"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { useReducedPreference } from "./motion/settings";
import * as m from "motion/react-m";
import { instant, revealEase } from "./motion/transitions";

export function FilmIntro({ src, title }: { src: string; title: string }) {
  const player = useRef<HTMLVideoElement>(null);
  const intro = useRef<HTMLElement>(null);
  const [pastIntro, setPastIntro] = useState(false);
  const [ready, setReady] = useState(false);
  const reduced = useReducedPreference();

  useEffect(() => {
    const video = player.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let autoplayAttempted = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        video.pause();
      } else if (!autoplayAttempted && !motion.matches) {
        autoplayAttempted = true;
        void video.play().catch(() => {});
      }
    });
    observer.observe(video);
    const headerObserver = new IntersectionObserver(
      ([entry]) =>
        setPastIntro(
          !entry.isIntersecting && entry.boundingClientRect.bottom <= 80,
        ),
      { rootMargin: "-80px 0px 0px" },
    );
    if (intro.current) headerObserver.observe(intro.current);
    return () => {
      observer.disconnect();
      headerObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (reduced) player.current?.pause();
  }, [reduced]);

  return (
    <section
      ref={intro}
      className="opening-film"
      aria-label={title}
      data-past-intro={pastIntro}
    >
      <div className="opening-film-sticky">
        <div className="opening-film-stage">
          <m.video
            ref={player}
            src={src}
            aria-label={title}
            muted
            loop
            playsInline
            controls
            preload="metadata"
            onLoadedData={() => setReady(true)}
            initial={false}
            animate={{ opacity: ready && reduced === false ? [0.78, 1] : 1 }}
            transition={
              reduced ? instant : { duration: 0.55, ease: revealEase }
            }
          />
          <a className="film-skip" href="#inizio-home">
            Esplora lo studio
            <ArrowDown size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
