import { pageMetadata } from "@/content/metadata";
import { site } from "@/content/site";
import Link from "next/link";
import {
  categories,
  localPreview,
  mediaUrl,
  visibleProjects,
} from "@/content/projects";
import { method } from "@/content/services";
import { Featured } from "@/components/featured";
import { ContactCallout, ProjectGrid } from "@/components/editorial";

export const metadata = pageMetadata(
  "/",
  "LoboStudio — Studio di ingegneria",
  site.description,
);
export default function Home() {
  const projects = visibleProjects(localPreview).filter(
    (project) => project.featured,
  );
  return (
    <>
      <div className="frame">
        <section className="home-intro">
          <p className="eyebrow">
            <span aria-hidden="true" />
            Studio di ingegneria{localPreview ? " · Bologna" : ""}
          </p>
          <div className="home-heading">
            <h1>
              Architettura
              <br />e <em>ingegneria.</em>
            </h1>
            <div className="hero-aside">
              <p>
                Progettazione architettonica e strutturale. Dal singolo edificio
                alla scala urbana.
              </p>
              <Link className="button" href="/progetti">
                Esplora i progetti
              </Link>
            </div>
          </div>
        </section>
        <Featured
          slides={projects.map((project) => ({
            ...project.gallery[0],
            src: mediaUrl(project.gallery[0].file),
            title: project.title,
            href: "/progetti/" + project.slug,
          }))}
        />
        {projects.length > 0 && (
          <section className="section">
            <div className="section-heading">
              <h2>Progetti selezionati</h2>
              <Link className="underlined" href="/progetti">
                Tutti i progetti
              </Link>
            </div>
            <ProjectGrid projects={projects} />
          </section>
        )}
        <section className="section split">
          <div>
            <p className="eyebrow">Lo studio</p>
            <h2>
              Progettare
              <br />
              insieme.
            </h2>
          </div>
          <div className="reading">
            <p>
              Il progetto prende forma quando architettura, struttura e contesto
              vengono studiati insieme. Il dialogo con committenti, imprese e
              professionisti accompagna il lavoro dalla fattibilità alla
              realizzazione.
            </p>
            <Link className="underlined" href="/studio">
              Conosci lo studio
            </Link>
          </div>
        </section>
        <section className="section split">
          <div>
            <p className="eyebrow">Competenze</p>
            <h2>Ambiti di lavoro</h2>
            <Link className="underlined" href="/servizi">
              Scopri i servizi
            </Link>
          </div>
          <div className="line-list">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={"/progetti/categoria/" + category.slug}
              >
                {category.label}
              </Link>
            ))}
          </div>
        </section>
        <section className="section">
          <h2>Il metodo</h2>
          <div className="method">
            {method.map(([title, description]) => (
              <div key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <ContactCallout />
    </>
  );
}
