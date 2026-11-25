import { ArrowDown, ArrowUp, X } from "lucide-react";
import { ProjectImage } from "@/components/project-image";

export type FeaturedProject = { slug: string; title: string; image: string };

export function ProjectOrderList({
  projects,
  move,
  remove,
}: {
  projects: readonly (Omit<FeaturedProject, "image"> & { image?: string })[];
  move: (index: number, offset: number) => void;
  remove?: (slug: string) => void;
}) {
  return (
    <ol className="project-order-list">
      {projects.map((project, i) => (
        <li key={project.slug}>
          <span className="ve-picture">
            {project.image && (
              <ProjectImage src={project.image} alt="" sizes="80px" />
            )}
          </span>
          <div>
            <strong>{project.title}</strong>
            {!project.image && <small>Al momento non disponibile</small>}
          </div>
          <div className="admin-actions">
            <button
              type="button"
              disabled={i === 0}
              onClick={() => move(i, -1)}
              aria-label={"Sposta prima: " + project.title}
            >
              <ArrowUp size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              disabled={i === projects.length - 1}
              onClick={() => move(i, 1)}
              aria-label={"Sposta dopo: " + project.title}
            >
              <ArrowDown size={16} aria-hidden="true" />
            </button>
            {remove && (
              <button
                type="button"
                onClick={() => remove(project.slug)}
                aria-label={"Rimuovi dalla sezione: " + project.title}
              >
                <X size={16} aria-hidden="true" />
              </button>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function FeaturedOrder({
  projects,
  move,
}: {
  projects: FeaturedProject[];
  move: (index: number, offset: number) => void;
}) {
  return (
    <section
      className="project-photos featured-order"
      aria-labelledby="featured-order-title"
    >
      <h3 id="featured-order-title">Ordine dei progetti in Home</h3>
      {projects.length > 0 ? (
        <>
          <p>
            La prima scheda apre il carosello dei progetti. Per applicare
            l’ordine, salva e pubblica la bozza della Home.
          </p>
          <ProjectOrderList projects={projects} move={move} />
        </>
      ) : (
        <p>
          Per aggiungere un progetto al carosello, attiva «In evidenza nella
          Home» nella sua scheda e pubblicalo.
        </p>
      )}
    </section>
  );
}
