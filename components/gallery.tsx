"use client";

import { useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Maximize2, X } from "lucide-react";
import { ProjectImage } from "./project-image";
import {
  photoStageLabels,
  type PhotoStage,
} from "@/content/projects/presentation";

export type GalleryFrame = {
  src: string;
  alt: string;
  caption?: string;
  stage?: PhotoStage;
  credit?: string;
};

function Caption({ frame }: { frame: GalleryFrame }) {
  return (
    <>
      {frame.stage && <span>{photoStageLabels[frame.stage]}</span>}
      {frame.caption && <p>{frame.caption}</p>}
    </>
  );
}

export function Gallery({
  frames,
  afterCover,
}: {
  frames: GalleryFrame[];
  afterCover?: ReactNode;
}) {
  const [active, setActive] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const change = (step: number) =>
    setActive((current) => (current + step + frames.length) % frames.length);
  function figure(frame: GalleryFrame, index: number, cover = false) {
    return (
      <figure
        key={frame.src + ":" + index}
        className={cover ? "project-cover-image" : undefined}
      >
        <button
          type="button"
          className="project-picture"
          aria-label={"Ingrandisci: " + frame.alt}
          onClick={(event) => {
            trigger.current = event.currentTarget;
            setActive(index);
            dialog.current?.showModal();
          }}
        >
          <ProjectImage
            src={frame.src}
            alt={frame.alt}
            priority={cover}
            sizes={
              cover
                ? "(max-width: 800px) 100vw, 88vw"
                : "(max-width: 700px) 100vw, 44vw"
            }
          />
          <span className="project-zoom" aria-hidden="true">
            <Maximize2 size={18} />
          </span>
        </button>
        {(frame.stage || frame.caption) && (
          <figcaption className="project-caption">
            <Caption frame={frame} />
          </figcaption>
        )}
      </figure>
    );
  }
  const firstInGrid = afterCover ? 1 : 0;
  return (
    <>
      {afterCover && frames[0] && figure(frames[0], 0, true)}
      {afterCover}
      {frames.length > firstInGrid && (
        <div className="gallery">
          {frames
            .slice(firstInGrid)
            .map((frame, index) => figure(frame, index + firstInGrid))}
        </div>
      )}
      <dialog
        ref={dialog}
        className="lightbox"
        aria-label="Galleria del progetto"
        onClose={() => trigger.current?.focus()}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") change(-1);
          if (event.key === "ArrowRight") change(1);
        }}
      >
        <div className="lightbox-bar">
          <span aria-live="polite">
            {active + 1} / {frames.length}
          </span>
          <button
            className="icon"
            type="button"
            aria-label="Chiudi galleria"
            onClick={() => dialog.current?.close()}
          >
            <X />
          </button>
        </div>
        <div className="lightbox-image">
          {frames[active] && (
            <ProjectImage
              key={frames[active].src}
              src={frames[active].src}
              alt={frames[active].alt}
              sizes="90vw"
            />
          )}
        </div>
        {frames[active] && (frames[active].stage || frames[active].caption) && (
          <div className="project-caption lightbox-caption">
            <Caption frame={frames[active]} />
          </div>
        )}
        <div className="lightbox-bar">
          {frames.length > 1 && (
            <>
              <button
                type="button"
                className="icon"
                aria-label="Immagine precedente"
                onClick={() => change(-1)}
              >
                <ArrowLeft />
              </button>
              <button
                type="button"
                className="icon"
                aria-label="Immagine successiva"
                onClick={() => change(1)}
              >
                <ArrowRight />
              </button>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
