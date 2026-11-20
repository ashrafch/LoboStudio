import Link from "next/link";
import { categories, mediaUrl, type Project } from "@/content/projects";
import { ProjectImage } from "./project-image";

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

export function Intro({ title, text }: { title: string; text?: string }) {
  return (
    <div className="page-intro">
      <h1>{title}</h1>
      {text && <p>{text}</p>}
    </div>
  );
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="project-grid">
      {projects.map((project) => (
        <article key={project.slug}>
          <Link className="project-tile" href={"/progetti/" + project.slug}>
            <div className="project-picture">
              <ProjectImage
                {...project.gallery[0]}
                src={mediaUrl(project.gallery[0].file)}
              />
            </div>
            <p className="eyebrow">
              {
                categories.find(
                  (category) => category.slug === project.category,
                )?.label
              }
              {project.status !== "published" ? " · Anteprima" : ""}
            </p>
            <h3>{project.title}</h3>
          </Link>
        </article>
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
