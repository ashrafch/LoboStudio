"use client";

/**
 * Adapted from Kokonut UI Momentum Rail v2.0.0 by @dorianbaffier (MIT).
 * https://kokonutui.com/docs/cards/carousel-cards
 */
import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import * as m from "motion/react-m";
import { type RefObject, useCallback, useEffect, useId, useRef } from "react";
import { useReducedPreference } from "../motion/settings";
import { gestureTransition, instant, revealEase } from "../motion/transitions";
import { ProjectImage } from "../project-image";
import styles from "./carousel-cards.module.css";

const ProjectLink = m.create(Link);
const imageVariants = { rest: { scale: 1 }, engaged: { scale: 1.028 } };

export type RailSlide = { title: string; src: string } & (
  | { video: true }
  | {
      video?: false;
      href: string;
      alt: string;
      category?: string;
      location?: string;
    }
);

const STIFFNESS = 170;
const DAMPING = 26; // about 2·√170: critically damped, so no bounce at the card
const DECELERATION = 0.997; // UIScrollView's normal rate, per ms
const DRAG_THRESHOLD = 4;

const rubber = (overshoot: number, size: number) =>
  Math.sign(overshoot) *
  (1 - 1 / ((Math.abs(overshoot) * 0.55) / size + 1)) *
  size;

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

interface RailState {
  mode: "idle" | "pressing" | "dragging" | "spring";
  pointerId: number;
  startX: number;
  startPos: number;
  pos: number;
  vel: number;
  target: number;
  samples: { t: number; x: number }[];
  raf: number;
  last: number;
  width: number;
  maxScroll: number;
  suppressClick: boolean;
  /** The press caught a moving rail, so letting go must settle it. */
  caught: boolean;
}

const maxScroll = (scroller: HTMLElement) =>
  scroller.scrollWidth - scroller.clientWidth;

const snapPoints = (scroller: HTMLElement, track: HTMLUListElement) => {
  const max = maxScroll(scroller);
  return Array.from(track.children, (child) => {
    const card = child as HTMLElement;
    const center = track.offsetLeft + card.offsetLeft + card.offsetWidth / 2;
    return clamp(center - scroller.clientWidth / 2, 0, max);
  });
};

const nearestIndex = (points: number[], pos: number) => {
  let best = 0;
  for (let i = 1; i < points.length; i++) {
    if (Math.abs(points[i] - pos) < Math.abs(points[best] - pos)) {
      best = i;
    }
  }
  return best;
};

// Release velocity in px/ms from the last 100ms of samples; a pause before
// letting go means no flick.
const releaseVelocity = (samples: RailState["samples"], now: number) => {
  const first = samples[0];
  const last = samples.at(-1) ?? first;
  const dt = last.t - first.t;
  if (dt <= 0 || now - last.t > 60) {
    return 0;
  }
  return -(last.x - first.x) / dt;
};

function useMomentumRail(
  scrollerRef: RefObject<HTMLElement | null>,
  trackRef: RefObject<HTMLUListElement | null>,
  onIndex: (index: number) => void,
) {
  const state = useRef<RailState>({
    mode: "idle",
    pointerId: -1,
    startX: 0,
    startPos: 0,
    pos: 0,
    vel: 0,
    target: 0,
    samples: [],
    raf: 0,
    last: 0,
    width: 0,
    maxScroll: 0,
    suppressClick: false,
    caught: false,
  });
  const observedIndex = useRef(0);
  const select = useCallback(
    (index: number) => {
      observedIndex.current = index;
      onIndex(index);
    },
    [onIndex],
  );

  // Write a virtual position: the in-range part scrolls natively, the rest
  // becomes a damped translate on the track (the rubber band).
  const apply = useCallback(
    (pos: number) => {
      const scroller = scrollerRef.current;
      const track = trackRef.current;
      if (!(scroller && track)) {
        return;
      }
      const { width, maxScroll } = state.current;
      const inRange = clamp(pos, 0, maxScroll);
      scroller.scrollLeft = inRange;
      const over = pos - inRange;
      track.style.transform =
        Math.abs(over) > 0.1
          ? `translate3d(${(-rubber(over, width)).toFixed(2)}px,0,0)`
          : "";
    },
    [scrollerRef, trackRef],
  );

  // Native scroll snap is off while JS owns the position.
  const setFree = useCallback(
    (free: boolean) => {
      const scroller = scrollerRef.current;
      if (scroller) {
        scroller.dataset.free = String(free);
      }
    },
    [scrollerRef],
  );

  const step = useCallback(
    function advance(now: number) {
      const s = state.current;
      const dt = Math.min((now - s.last) / 1000, 1 / 30);
      s.last = now;
      // Semi-implicit Euler substeps keep the spring stable at any frame rate.
      const h = dt / 4;
      for (let i = 0; i < 4; i++) {
        const accel = -STIFFNESS * (s.pos - s.target) - DAMPING * s.vel;
        s.vel += accel * h;
        s.pos += s.vel * h;
      }
      if (Math.abs(s.pos - s.target) < 0.5 && Math.abs(s.vel) < 8) {
        s.pos = s.target;
        s.vel = 0;
        s.mode = "idle";
        apply(s.target);
        setFree(false);
        return;
      }
      apply(s.pos);
      s.raf = requestAnimationFrame(advance);
    },
    [apply, setFree],
  );

  const springTo = useCallback(
    (target: number, velocity: number) => {
      const s = state.current;
      const scroller = scrollerRef.current;
      if (!scroller) {
        return;
      }
      cancelAnimationFrame(s.raf);
      // A spring, drag or caught press carries its own virtual position,
      // overshoot included.
      if (s.mode === "idle") {
        s.pos = scroller.scrollLeft;
      }
      s.width = scroller.clientWidth;
      s.maxScroll = maxScroll(scroller);
      s.target = target;
      s.vel = velocity;
      if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
        s.mode = "idle";
        s.pos = target;
        apply(target);
        setFree(false);
        return;
      }
      s.mode = "spring";
      setFree(true);
      s.last = performance.now();
      s.raf = requestAnimationFrame(step);
    },
    [apply, scrollerRef, setFree, step],
  );

  const goTo = useCallback(
    (index: number) => {
      const scroller = scrollerRef.current;
      const track = trackRef.current;
      if (!(scroller && track)) {
        return;
      }
      const s = state.current;
      const points = snapPoints(scroller, track);
      const i = clamp(index, 0, points.length - 1);
      springTo(points[i], s.mode === "spring" ? s.vel : 0);
      observedIndex.current = i;
    },
    [scrollerRef, springTo, trackRef],
  );

  useEffect(() => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!(scroller && track)) {
      return;
    }
    const s = state.current;
    let scrollRaf = 0;

    const onScroll = () => {
      cancelAnimationFrame(scrollRaf);
      scrollRaf = requestAnimationFrame(() => {
        if (s.mode !== "idle") return;
        const index = nearestIndex(
          snapPoints(scroller, track),
          scroller.scrollLeft,
        );
        if (index !== observedIndex.current) select(index);
      });
    };

    const suppressNextClick = () => {
      s.suppressClick = true;
      setTimeout(() => {
        s.suppressClick = false;
      }, 0);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) {
        return;
      }
      if ((e.target as Element).closest("video, button")) {
        return;
      }
      cancelAnimationFrame(s.raf);
      // Catching a moving rail keeps its virtual position, overshoot included.
      s.caught = s.mode === "spring";
      s.pos = s.caught ? s.pos : scroller.scrollLeft;
      s.mode = "pressing";
      s.pointerId = e.pointerId;
      s.width = scroller.clientWidth;
      s.maxScroll = maxScroll(scroller);
      s.startX = e.clientX;
      s.startPos = s.pos;
      s.samples = [{ t: e.timeStamp, x: e.clientX }];
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerId !== s.pointerId) {
        return;
      }
      const dx = e.clientX - s.startX;
      if (s.mode === "pressing" && Math.abs(dx) > DRAG_THRESHOLD) {
        s.mode = "dragging";
        scroller.setPointerCapture(e.pointerId);
        scroller.dataset.dragging = "true";
        setFree(true);
      }
      if (s.mode !== "dragging") {
        return;
      }
      s.pos = s.startPos - dx;
      apply(s.pos);
      s.samples.push({ t: e.timeStamp, x: e.clientX });
      while (s.samples.length > 2 && e.timeStamp - s.samples[0].t > 100) {
        s.samples.shift();
      }
    };

    const onRelease = (e: PointerEvent) => {
      if (e.pointerId !== s.pointerId) {
        return;
      }
      s.pointerId = -1;
      if (s.mode !== "dragging") {
        if (s.caught) {
          // A rail caught mid-flight (or mid-rubber-band) and let go
          // settles on the nearest card instead of freezing there. Like a
          // native list, the tap that stopped it does not open a card.
          suppressNextClick();
          const points = snapPoints(scroller, track);
          const index = nearestIndex(points, s.pos);
          springTo(points[index], 0);
          select(index);
          return;
        }
        // A press that never became a drag hands back to native snapping.
        s.mode = "idle";
        setFree(false);
        return;
      }
      scroller.dataset.dragging = "false";
      suppressNextClick();
      const v = releaseVelocity(s.samples, e.timeStamp);
      const reduced = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const travel = clamp(
        (v * DECELERATION) / (1 - DECELERATION),
        -s.width,
        s.width,
      );
      const projected = reduced ? s.pos : s.pos + travel;
      const points = snapPoints(scroller, track);
      const index = nearestIndex(points, projected);
      springTo(points[index], v * 1000);
      select(index);
    };

    // A drag that ends over a card must not follow its link.
    const onClickCapture = (e: MouseEvent) => {
      if (s.suppressClick) {
        e.preventDefault();
        e.stopPropagation();
        s.suppressClick = false;
      }
    };

    // Wheel or touch takes over from a running spring.
    const onNativeInput = () => {
      if (s.mode !== "spring") {
        return;
      }
      cancelAnimationFrame(s.raf);
      s.mode = "idle";
      apply(clamp(s.pos, 0, maxScroll(scroller)));
      setFree(false);
    };

    // Arrow keys step one card; Home and End jump to the ends.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target !== scroller) {
        return;
      }
      const last = track.children.length - 1;
      const index = nearestIndex(
        snapPoints(scroller, track),
        s.mode === "spring" ? s.target : scroller.scrollLeft,
      );
      let next = -1;
      switch (e.key) {
        case "ArrowLeft":
          next = index - 1;
          break;
        case "ArrowRight":
          next = index + 1;
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = last;
          break;
        default:
          return;
      }
      e.preventDefault();
      next = clamp(next, 0, last);
      goTo(next);
      select(next);
    };

    scroller.addEventListener("keydown", onKeyDown);
    scroller.addEventListener("scroll", onScroll, { passive: true });
    scroller.addEventListener("pointerdown", onPointerDown);
    scroller.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onRelease);
    window.addEventListener("pointercancel", onRelease);
    scroller.addEventListener("lostpointercapture", onRelease);
    scroller.addEventListener("click", onClickCapture, true);
    scroller.addEventListener("wheel", onNativeInput, { passive: true });
    scroller.addEventListener("touchstart", onNativeInput, { passive: true });
    return () => {
      cancelAnimationFrame(scrollRaf);
      cancelAnimationFrame(s.raf);
      scroller.removeEventListener("keydown", onKeyDown);
      scroller.removeEventListener("scroll", onScroll);
      scroller.removeEventListener("pointerdown", onPointerDown);
      scroller.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onRelease);
      window.removeEventListener("pointercancel", onRelease);
      scroller.removeEventListener("lostpointercapture", onRelease);
      scroller.removeEventListener("click", onClickCapture, true);
      scroller.removeEventListener("wheel", onNativeInput);
      scroller.removeEventListener("touchstart", onNativeInput);
    };
  }, [apply, goTo, scrollerRef, select, setFree, springTo, trackRef]);

  return { goTo, observedIndex };
}

export function CarouselCards({
  slides,
  index,
  onIndexChange,
  onVideoPlay,
}: {
  slides: RailSlide[];
  index: number;
  onIndexChange: (index: number) => void;
  onVideoPlay: () => void;
}) {
  const scrollerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const railId = useId();
  const reduced = useReducedPreference();
  const { goTo, observedIndex } = useMomentumRail(
    scrollerRef,
    trackRef,
    onIndexChange,
  );

  useEffect(() => {
    if (observedIndex.current !== index) goTo(index);
  }, [goTo, index, observedIndex]);

  return (
    <m.section
      aria-label="Scorri le schede con i tasti freccia"
      className={styles.scroller}
      ref={scrollerRef}
      initial={false}
      whileInView={reduced ? undefined : { opacity: [0.85, 1], y: [8, 0] }}
      viewport={{ once: true, amount: 0.2 }}
      transition={reduced ? instant : { duration: 0.42, ease: revealEase }}
      tabIndex={slides.length > 1 ? 0 : undefined}
      data-single={slides.length === 1 || undefined}
    >
      <ul className={styles.track} ref={trackRef}>
        {slides.map((item, position) => {
          const isActive = position === index;
          return (
            <li
              className={styles.card}
              key={item.video ? item.src : item.href}
              aria-hidden={!isActive || undefined}
              inert={!isActive}
              data-active={isActive}
            >
              {item.video ? (
                <>
                  <div className={styles.media}>
                    {isActive ? (
                      <video
                        src={item.src}
                        controls
                        playsInline
                        preload="metadata"
                        aria-label={item.title}
                        onPlay={onVideoPlay}
                      />
                    ) : (
                      <div
                        className={styles.videoPlaceholder}
                        aria-hidden="true"
                      >
                        <Play size={28} />
                      </div>
                    )}
                  </div>
                  <span className={styles.title}>{item.title}</span>
                </>
              ) : (
                <>
                  <ProjectLink
                    href={item.href}
                    className={styles.link}
                    aria-label={item.title}
                    aria-describedby={`${railId}-${position}`}
                    draggable={false}
                    prefetch={false}
                    initial={false}
                    animate="rest"
                    whileHover={reduced ? undefined : "engaged"}
                    whileFocus={reduced ? undefined : "engaged"}
                  >
                    <div className={styles.media}>
                      <m.div
                        className={styles.image}
                        variants={imageVariants}
                        transition={reduced ? instant : gestureTransition}
                      >
                        <ProjectImage
                          src={item.src}
                          alt={item.alt}
                          priority={position === 0}
                          sizes="(max-width: 760px) 84vw, (max-width: 1580px) 48vw, 760px"
                        />
                      </m.div>
                    </div>
                    <span className={styles.title}>
                      {item.title}
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </span>
                  </ProjectLink>
                  <span className={styles.meta} id={`${railId}-${position}`}>
                    {[item.category, item.location].filter(Boolean).join(" · ")}
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </m.section>
  );
}
