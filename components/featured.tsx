"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ProjectImage } from "./project-image";

type Slide = { title: string; href: string; src: string; alt: string };

export function Featured({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  if (!slide) return null;
  const move = (offset: number) =>
    setIndex((current) => (current + offset + slides.length) % slides.length);
  return (
    <section aria-label="Progetti in evidenza" className="featured">
      <div className="hero-photo" key={slide.src}>
        <ProjectImage
          src={slide.src}
          alt={slide.alt}
          priority={index === 0}
          sizes="(max-width: 1440px) 95vw, 1370px"
        />
      </div>
      <div className="caption">
        <Link href={slide.href} aria-live="polite">
          {slide.title}
        </Link>
        {slides.length > 1 && (
          <div className="slider-controls">
            <span aria-live="polite">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(slides.length).padStart(2, "0")}
            </span>
            <button
              className="icon"
              aria-label="Progetto precedente"
              type="button"
              onClick={() => move(-1)}
            >
              <ArrowLeft size={19} />
            </button>
            <button
              className="icon"
              aria-label="Progetto successivo"
              type="button"
              onClick={() => move(1)}
            >
              <ArrowRight size={19} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
