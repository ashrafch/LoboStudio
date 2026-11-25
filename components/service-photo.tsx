import { ProjectImage } from "./project-image";

export function ServicePhoto({
  photo,
  sizes = "(max-width: 760px) 90vw, (max-width: 1440px) 45vw, 650px",
}: {
  photo: { src: string; alt: string; credit: string };
  sizes?: string;
}) {
  return (
    <figure className="service-photo">
      <div className="service-photo-frame">
        <ProjectImage
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          sizes={sizes}
        />
      </div>
      {photo.credit && <figcaption>{photo.credit}</figcaption>}
    </figure>
  );
}
