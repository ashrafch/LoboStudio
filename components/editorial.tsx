import Link from "next/link";
import type { ReactNode } from "react";
import { categories, mediaUrl, type Project } from "@/content/projects";
import { ProjectImage } from "./project-image";
import { ProjectCard } from "./motion/project-card";

export function Breadcrumb({ items }: { items: readonly [string, string?][] }) {
  return (
    <nav aria-label="Percorso" className="breadcrumbs">
      <ol>
        <li>
          <Link href="/">Home</Link>
        </li>
        {items.map(([label, href]) => (
          <li key={label}>
            {href ? (
              <Link href={href}>{label}</Link>
            ) : (
              <span aria-current="page">{label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Intro({
  title,
  text,
  aside,
}: {
  title: string;
  text?: string;
  aside?: ReactNode;
}) {
  return (
    <div className="page-intro">
      <div>
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
      {aside}
    </div>
  );
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="project-grid">
      {projects.map((project) => (
        <ProjectCard
          key={project.slug}
          href={"/progetti/" + project.slug}
          image={
            <ProjectImage
              {...project.gallery[0]}
              src={mediaUrl(project.gallery[0].file)}
            />
          }
        >
          <p className="eyebrow">
            {
              categories.find((category) => category.slug === project.category)
                ?.label
            }
            {project.status !== "published" ? " · Anteprima" : ""}
          </p>
          <h3>{project.title}</h3>
        </ProjectCard>
      ))}
    </div>
  );
}

export function ContactCallout() {
  return (
    <section className="contact-band">
      <div className="frame split">
        <h2>
          Parliamo del
          <br />
          tuo progetto.
        </h2>
        <div>
          <p>
            Per un nuovo intervento, una valutazione tecnica o una
            collaborazione professionale.
          </p>
          <Link className="button inverse" href="/contatti">
            Contatta lo studio
          </Link>
        </div>
      </div>
    </section>
  );
}
