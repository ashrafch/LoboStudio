"use client";

/**
 * Adapted from Kokonut UI Scroll Index v1.0.0 by @dorianbaffier (MIT).
 * https://kokonutui.com/docs/navigation/scroll-index
 */
import { type ReactNode, useEffect, useRef, useState } from "react";
import styles from "./scroll-index.module.css";

type Section = { id: string; label: string };

export function ScrollIndex({
  sections,
  scroller,
  children,
}: {
  sections: readonly Section[];
  scroller: "window";
  children: ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const content = contentRef.current;
    const progress = progressRef.current;
    if (!content || !progress) return;

    const targets = sections.map(({ id }) => document.getElementById(id));
    const scrollTarget = window;
    let positions: number[] = [];
    let end = 0;
    let frame = 0;
    let current = -1;
    let measureNextFrame = true;

    const paint = () => {
      frame = 0;
      const scroll = scrollTarget.scrollY;
      if (measureNextFrame) {
        const max =
          document.documentElement.scrollHeight - scrollTarget.innerHeight;
        positions = targets.map((target) => {
          if (!target) return Infinity;
          const margin =
            parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
          return Math.min(
            target.getBoundingClientRect().top + scroll - margin,
            max,
          );
        });
        end = Math.min(
          Math.max(
            positions.at(-1) ?? 0,
            content.getBoundingClientRect().bottom +
              scroll -
              scrollTarget.innerHeight,
          ),
          max,
        );
        measureNextFrame = false;
      }
      const first = positions[0];
      const fraction = Math.min(
        1,
        Math.max(0, (scroll - first) / Math.max(end - first, 1)),
      );
      progress.style.transform = `scaleY(${fraction})`;

      const index = Math.max(
        0,
        positions.findLastIndex((at) => at <= scroll + 2),
      );
      if (index !== current) {
        current = index;
        setActive(index);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const measure = () => {
      measureNextFrame = true;
      schedule();
    };

    const resize = new ResizeObserver(measure);
    resize.observe(content);
    scrollTarget.addEventListener("resize", measure, { passive: true });
    scrollTarget.addEventListener("scroll", schedule, { passive: true });
    schedule();

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      scrollTarget.removeEventListener("resize", measure);
      scrollTarget.removeEventListener("scroll", schedule);
    };
  }, [sections]);

  return (
    <div className={styles.layout} data-scroll-index={scroller}>
      <nav className={styles.index} aria-label="In questa pagina">
        <p className={styles.heading} aria-hidden="true">
          In questa pagina
        </p>
        <div className={styles.track} aria-hidden="true">
          <span ref={progressRef} />
        </div>
        <ol className={styles.links}>
          {sections.map(({ id, label }, i) => (
            <li key={id}>
              <a
                href={"#" + id}
                aria-current={i === active ? "location" : undefined}
                data-state={
                  i === active ? "current" : i < active ? "passed" : "ahead"
                }
              >
                {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className={styles.content} ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
