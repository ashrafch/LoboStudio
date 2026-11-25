"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { AnimatePresence, LazyMotion } from "motion/react";
import { div as MotionDiv } from "motion/react-m";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProjectImage } from "./project-image";
import { useReducedPreference } from "./motion/settings";
import { gestureTransition, revealEase } from "./motion/transitions";
import styles from "./project-photo-preview.module.css";

const loadDrag = () => import("motion/react").then(({ domMax }) => domMax);
const variants = {
  enter: (direction: number) => ({ x: 46 * direction, opacity: 0 }),
  current: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: -30 * direction, opacity: 0 }),
};

export function ProjectPhotoPreview({
  title,
  href,
  photos,
  close,
}: {
  title: string;
  href: string;
  photos: { src: string; alt: string }[];
  close: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const reduced = useReducedPreference();
  const [{ index, direction }, setSlide] = useState({ index: 0, direction: 1 });
  const photo = photos[index];

  useEffect(() => {
    dialog.current?.showModal();
    closeButton.current?.focus();
  }, []);

  function move(step: number) {
    setSlide((slide) => {
      const index = Math.max(
        0,
        Math.min(photos.length - 1, slide.index + step),
      );
      return index === slide.index ? slide : { index, direction: step };
    });
  }

  return (
    <LazyMotion features={loadDrag} strict>
      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-label={"Anteprima fotografica · " + title}
        onClose={close}
        onKeyDown={(event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          move(event.key === "ArrowRight" ? 1 : -1);
        }}
      >
        <MotionDiv
          className={styles.panel}
          initial={
            reduced ? false : { opacity: 0, clipPath: "inset(6% 0% 0% 0%)" }
          }
          animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
          transition={
            reduced ? { duration: 0 } : { duration: 0.35, ease: revealEase }
          }
        >
          <header className={styles.header}>
            <h3>{title}</h3>
            <button
              ref={closeButton}
              type="button"
              aria-label="Chiudi anteprima"
              onClick={() => dialog.current?.close()}
            >
              <X size={22} aria-hidden="true" />
            </button>
          </header>
          <div className={styles.viewport} data-draggable={photos.length > 1}>
            <AnimatePresence initial={false} custom={direction}>
              <MotionDiv
                key={index}
                className={styles.photo}
                custom={direction}
                variants={variants}
                initial={reduced ? false : "enter"}
                animate="current"
                exit={reduced ? undefined : "exit"}
                transition={reduced ? { duration: 0 } : gestureTransition}
                drag={photos.length > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={reduced ? 0 : 0.2}
                dragMomentum={!reduced}
                dragTransition={{
                  bounceStiffness: 340,
                  bounceDamping: 32,
                  timeConstant: 200,
                }}
                onDragEnd={(_, { offset, velocity }) => {
                  const distance = offset.x + velocity.x * 0.12;
                  if (Math.abs(distance) > 65) move(distance < 0 ? 1 : -1);
                }}
              >
                <ProjectImage
                  src={photo.src}
                  alt={photo.alt}
                  sizes="(max-width: 900px) 94vw, 960px"
                />
              </MotionDiv>
            </AnimatePresence>
          </div>
          <footer className={styles.controls}>
            {photos.length > 1 && (
              <div className={styles.pager}>
                <button
                  type="button"
                  aria-label="Foto precedente"
                  disabled={index === 0}
                  onClick={() => move(-1)}
                >
                  <ArrowLeft size={20} aria-hidden="true" />
                </button>
                <span role="status">
                  Foto {index + 1} di {photos.length}
                </span>
                <button
                  type="button"
                  aria-label="Foto successiva"
                  disabled={index === photos.length - 1}
                  onClick={() => move(1)}
                >
                  <ArrowRight size={20} aria-hidden="true" />
                </button>
              </div>
            )}
            <Link
              className="underlined"
              href={href}
              onClick={() => dialog.current?.close()}
            >
              Scheda progetto <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </footer>
        </MotionDiv>
      </dialog>
    </LazyMotion>
  );
}
