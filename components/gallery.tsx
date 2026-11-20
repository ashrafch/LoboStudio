"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { ProjectImage } from "./project-image";

type Frame = { src: string; alt: string };

export function Gallery({ frames }: { frames: Frame[] }) {
  const [active, setActive] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const change = (step: number) =>
    setActive((current) => (current + step + frames.length) % frames.length);
  return (
    <>
      <div className="gallery">
        {frames.map((frame, index) => (
          <button
            key={frame.src}
            type="button"
            className="project-picture"
            aria-label={"Ingrandisci: " + frame.alt}
            onClick={(event) => {
              trigger.current = event.currentTarget;
              setActive(index);
              dialog.current?.showModal();
            }}
          >
            <ProjectImage {...frame} />
          </button>
        ))}
      </div>
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
              {...frames[active]}
              sizes="90vw"
            />
          )}
        </div>
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
