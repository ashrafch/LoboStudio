"use client";

import Image from "next/image";
import { useState } from "react";

export function ProjectImage({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 700px) 100vw, 55vw",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <div
        className="image-unavailable"
        role="img"
        aria-label={alt + " (immagine non disponibile)"}
      >
        Immagine non disponibile
      </div>
    );
  return (
    <Image
      fill
      src={src}
      alt={alt}
      sizes={sizes}
      fetchPriority={priority ? "high" : undefined}
      loading={priority ? "eager" : "lazy"}
      unoptimized={src.startsWith("/anteprima-media/")}
      onError={() => setFailed(true)}
    />
  );
}
