"use client";

import { stagger, useInView } from "motion/react";
import { useReducedPreference } from "./settings";
import { useAnimate } from "motion/react-mini";
import * as m from "motion/react-m";
import { useEffect, type ReactNode } from "react";
import { instant, revealEase } from "./transitions";

export function ScrollReveal({
  as = "div",
  className,
  children,
}: {
  as?: "div" | "article";
  className?: string;
  children: ReactNode;
}) {
  const reduced = useReducedPreference();
  const Element = as === "article" ? m.article : m.div;
  return (
    <Element
      className={className}
      initial={false}
      whileInView={
        reduced === false ? { y: [14, 0], opacity: [0.78, 1] } : undefined
      }
      viewport={{ once: true, amount: 0.15 }}
      transition={reduced ? instant : { duration: 0.42, ease: revealEase }}
    >
      {children}
    </Element>
  );
}

export function HeroReveal({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const [scope, animate] = useAnimate<HTMLElement>();
  const visible = useInView(scope, { once: true, amount: 0.2 });
  const reduced = useReducedPreference();

  useEffect(() => {
    if (!visible || reduced !== false) return;
    const animation = animate(
      "[data-hero-line]",
      { opacity: [0.77, 1], transform: ["translateY(15px)", "none"] },
      { duration: 0.54, delay: stagger(0.07), ease: revealEase },
    );
    return () => animation.cancel();
  }, [animate, visible, reduced]);

  return (
    <section ref={scope} className={className}>
      {children}
    </section>
  );
}
