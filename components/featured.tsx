"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { useInView } from "motion/react";
import * as m from "motion/react-m";
import { CarouselCards, type RailSlide } from "./kokonutui/carousel-cards";
import { useReducedPreference } from "./motion/settings";
import { gestureTransition } from "./motion/transitions";

export function Featured({ slides }: { slides: RailSlide[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState<boolean | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const featuredRef = useRef<HTMLElement>(null);
  const inView = useInView(featuredRef, { amount: 0.25 });
  const reducedMotion = useReducedPreference();
  const slide = slides[index];
  const automatic = playing ?? !reducedMotion;
  const rotating = automatic && inView && !hovered && !focused;
  const duration = slide?.video ? 12000 : 5500;
  useEffect(() => {
    if (!rotating || slides.length < 2) return;
    let timer: number;
    const restart = () => {
      window.clearTimeout(timer);
      if (!document.hidden)
        timer = window.setTimeout(() => {
          setIndex((current) => (current + 1) % slides.length);
        }, duration);
    };
    restart();
    document.addEventListener("visibilitychange", restart);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", restart);
    };
  }, [rotating, index, slides.length, duration]);
  if (!slide) return null;
  const move = (offset: number) =>
    setIndex((current) => (current + offset + slides.length) % slides.length);
  const tap = reducedMotion ? undefined : { scale: 0.95 };
  return (
    <section
      ref={featuredRef}
      aria-roledescription="carosello"
      aria-label="Progetti in evidenza"
      className="featured"
      onPointerEnter={(event) =>
        event.pointerType === "mouse" && setHovered(true)
      }
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
    >
      <CarouselCards
        slides={slides}
        index={index}
        onIndexChange={setIndex}
        onVideoPlay={() => setPlaying(false)}
      />
      <div className="caption featured-caption">
        <span className="sr-only" aria-live={rotating ? "off" : "polite"}>
          {slide.title}
        </span>
        {slides.length > 1 && (
          <div className="slider-controls">
            <span aria-live="off">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(slides.length).padStart(2, "0")}
            </span>
            <m.button
              className="icon"
              type="button"
              aria-label={
                automatic ? "Metti in pausa il carosello" : "Avvia il carosello"
              }
              onClick={() => setPlaying(!automatic)}
              whileTap={tap}
              transition={gestureTransition}
            >
              {automatic ? <Pause size={17} /> : <Play size={17} />}
            </m.button>
            <m.button
              className="icon"
              aria-label="Progetto precedente"
              type="button"
              onClick={() => move(-1)}
              whileTap={tap}
              transition={gestureTransition}
            >
              <ArrowLeft size={19} />
            </m.button>
            <m.button
              className="icon"
              aria-label="Progetto successivo"
              type="button"
              onClick={() => move(1)}
              whileTap={tap}
              transition={gestureTransition}
            >
              <ArrowRight size={19} />
            </m.button>
          </div>
        )}
      </div>
      {slides.length > 1 && (
        <div
          className="slide-index"
          role="group"
          aria-label="Seleziona una foto o un video"
        >
          {slides.map((item, position) => (
            <button
              type="button"
              key={item.video ? item.src : item.href}
              aria-label={"Mostra " + item.title}
              aria-pressed={position === index}
              onClick={() => setIndex(position)}
            >
              <span aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
