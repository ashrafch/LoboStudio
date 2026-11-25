"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const reducedQuery = "(prefers-reduced-motion: reduce)";
const ReducedMotion = createContext(true);

function subscribe(onChange: () => void) {
  const preference = window.matchMedia(reducedQuery);
  preference.addEventListener("change", onChange);
  return () => preference.removeEventListener("change", onChange);
}

export function useReducedPreference() {
  return useContext(ReducedMotion);
}

export function MotionSettings({ children }: { children: ReactNode }) {
  const reduced = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(reducedQuery).matches,
    () => true,
  );
  return (
    <ReducedMotion.Provider value={reduced}>
      <MotionConfig reducedMotion="user">
        <LazyMotion features={domAnimation} strict>
          {children}
        </LazyMotion>
      </MotionConfig>
    </ReducedMotion.Provider>
  );
}
