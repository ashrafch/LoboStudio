import type { Transition } from "motion/react";

export const revealEase = [0.22, 1, 0.36, 1] as const;
export const instant = { duration: 0 } satisfies Transition;

export const menuTransition = {
  duration: 0.2,
  ease: revealEase,
} satisfies Transition;

export const gestureTransition = {
  type: "spring",
  stiffness: 380,
  damping: 31,
} satisfies Transition;
