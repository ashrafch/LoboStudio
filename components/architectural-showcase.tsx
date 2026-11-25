"use client";

import { ArrowUpRight, Maximize2 } from "lucide-react";
import Link from "next/link";
import {
  AnimatePresence,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { div as MotionDiv } from "motion/react-m";
import { useRef, useState } from "react";
import { ProjectImage } from "./project-image";
import { showcaseTitle } from "@/content/projects/showcase";
import { ProjectPhotoPreview } from "./project-photo-preview";
import { useReducedPreference } from "./motion/settings";
import { revealEase } from "./motion/transitions";
import styles from "./architectural-showcase.module.css";

export type ShowcaseProject = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  photos: [{ src: string; alt: string }, ...{ src: string; alt: string }[]];
};

const fullFrame = "inset(0% 0% 0% 0%)";
const reveal = { duration: 0.68, ease: revealEase };

export function ArchitecturalShowcase({
  projects,
}: {
  projects: ShowcaseProject[];
}) {
  const chapters = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const [preview, setPreview] = useState<ShowcaseProject>();
  const reduced = useReducedPreference();
  const { scrollYProgress } = useScroll({
    target: chapters,
    offset: ["start 0.56", "end 0.56"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 145,
    damping: 27,
    restDelta: 0.001,
  });
  const offset = useTransform(smooth, [0, 1], ["-3%", "3%"]);
  const scale = useTransform(smooth, [0, 0.5, 1], [1.08, 1.14, 1.08]);
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setActive(
      Math.min(projects.length - 1, Math.floor(progress * projects.length)),
    );
  });
  const current = projects[active];
  if (!current) return null;

  return (
    <section
      className={styles.section}
      aria-labelledby="progetti-in-fotografia"
    >
      <header className={styles.heading}>
        <h2 id="progetti-in-fotografia">{showcaseTitle}</h2>
        <Link className="underlined" href="/progetti">
          Esplora il portfolio
        </Link>
      </header>
      <div className={styles.sequence}>
        <div className={styles.stage} aria-hidden="true">
          <AnimatePresence initial={false}>
            <MotionDiv
              className={styles.frame}
              key={current.slug}
              initial={reduced ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
              animate={{ clipPath: fullFrame }}
              exit={
                reduced
                  ? undefined
                  : { opacity: 0, transition: { duration: 0.72 } }
              }
              transition={reduced ? { duration: 0 } : reveal}
            >
              <MotionDiv
                className={styles.surface}
                style={reduced ? undefined : { y: offset, scale }}
              >
                <ProjectImage
                  src={current.photos[0].src}
                  alt=""
                  sizes="(max-width: 1440px) 61vw, 880px"
                />
              </MotionDiv>
            </MotionDiv>
          </AnimatePresence>
        </div>
        <ol ref={chapters} className={styles.chapters}>
          {projects.map((project, index) => (
            <li
              key={project.slug}
              className={styles.chapter}
              data-active={index === active}
            >
              <div className={styles.inlinePhoto}>
                <ProjectImage
                  src={project.photos[0].src}
                  alt={project.photos[0].alt}
                  sizes="90vw"
                />
              </div>
              <div className={styles.copy}>
                <p className={styles.category}>{project.category}</p>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <span className={styles.photoDescription}>
                  {project.photos[0].alt}
                </span>
                <div className={styles.actions}>
                  <button
                    className={styles.link}
                    type="button"
                    aria-label={"Anteprima foto · " + project.title}
                    onClick={() => setPreview(project)}
                  >
                    Anteprima foto <Maximize2 size={16} aria-hidden="true" />
                  </button>
                  <Link
                    className={styles.link}
                    href={"/progetti/" + project.slug}
                    aria-label={"Scheda progetto · " + project.title}
                  >
                    Scheda progetto{" "}
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
      {preview && (
        <ProjectPhotoPreview
          title={preview.title}
          href={"/progetti/" + preview.slug}
          photos={preview.photos}
          close={() => setPreview(undefined)}
        />
      )}
    </section>
  );
}
