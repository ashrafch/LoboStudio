"use client";

import Link from "next/link";
import { type Variants } from "motion/react";
import { useReducedPreference } from "./settings";
import * as m from "motion/react-m";
import type { ReactNode } from "react";
import { ScrollReveal } from "./reveal";
import { gestureTransition, instant } from "./transitions";

const TileLink = m.create(Link);
const imageStates = {
  rest: { scale: 1 },
  engaged: { scale: 1.045 },
  pressed: { scale: 1.015 },
} satisfies Variants;

export function ProjectCard({
  href,
  image,
  children,
}: {
  href: string;
  image: ReactNode;
  children: ReactNode;
}) {
  const reduced = useReducedPreference();
  return (
    <ScrollReveal as="article">
      <TileLink
        className="project-tile"
        href={href}
        initial={false}
        animate="rest"
        whileHover={reduced ? "rest" : "engaged"}
        whileFocus={reduced ? "rest" : "engaged"}
        whileTap={reduced ? "rest" : "pressed"}
      >
        <div className="project-picture">
          <m.div
            className="project-card-image"
            variants={imageStates}
            transition={reduced ? instant : gestureTransition}
          >
            {image}
          </m.div>
        </div>
        {children}
      </TileLink>
    </ScrollReveal>
  );
}
