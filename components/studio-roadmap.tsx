"use client";

import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionStyle,
} from "motion/react";
import { span as MotionSpan } from "motion/react-m";
import { useRef, useState } from "react";
import { useReducedPreference } from "./motion/settings";
import styles from "./studio-roadmap.module.css";

export function StudioRoadmap({
  steps,
}: {
  steps: readonly (readonly [string, string])[];
}) {
  const path = useRef<HTMLOListElement>(null);
  const reduced = useReducedPreference();
  const [reached, setReached] = useState(0);
  const { scrollYProgress } = useScroll({
    target: path,
    offset: ["start 0.88", "end 0.88"],
  });
  const firstLeg = useTransform(scrollYProgress, [0.12, 0.52], [0, 1]);
  const secondLeg = useTransform(scrollYProgress, [0.52, 0.92], [0, 1]);
  const legs = [firstLeg, secondLeg];
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setReached(
      progress >= 0.92 ? 3 : progress >= 0.52 ? 2 : progress >= 0.12 ? 1 : 0,
    );
  });

  return (
    <ol
      ref={path}
      className={styles.roadmap}
      data-reduced={reduced}
      aria-label="Fasi del metodo"
    >
      {steps.map(([title, text], index) => (
        <li
          key={title}
          className={styles.step}
          data-reached={reduced || index < reached}
        >
          {legs[index] && (
            <span className={styles.track} aria-hidden="true">
              <MotionSpan
                className={styles.line}
                style={{ "--track-progress": legs[index] } as MotionStyle}
              />
            </span>
          )}
          <span className={styles.marker} aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className={styles.copy}>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
