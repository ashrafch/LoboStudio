import { pageMetadata } from "@/content/metadata";
import Link from "next/link";
import { EditorialPage } from "@/components/editorial-page";
import { ProjectImage } from "@/components/project-image";
import { localPreview } from "@/content/projects";
import { method } from "@/content/services";
import { team } from "@/content/studio";
import { ScrollIndex } from "@/components/kokonutui/scroll-index";
import { StudioRoadmap } from "@/components/studio-roadmap";
export const metadata = pageMetadata(
  "/studio",
  "Studio",
  "Profilo e metodo di LoboStudio.",
);
const studioSections = [
  { id: "profilo", label: "Profilo" },
  { id: "persone", label: "Persone" },
  { id: "metodo", label: "Metodo" },
];

export default function Page() {
  const sections = (
    <>
      <section
        className={localPreview ? "section split founder" : "section split"}
      >
        <div>
          {localPreview && <p className="eyebrow">Fondatore e titolare</p>}
          <h2 id="profilo" tabIndex={-1}>
            {localPreview ? "Lorenzo Bolelli" : "Profilo"}
          </h2>
          {localPreview && (
            <div className="founder-photo">
              <ProjectImage
                src="/anteprima-media/lorenzo-bolelli"
                alt="Ritratto in bianco e nero di Lorenzo Bolelli"
                sizes="(max-width: 680px) 80vw, 320px"
              />
            </div>
          )}
        </div>
        <div className="reading">
          {localPreview && (
            <p>
              Lorenzo Bolelli, classe 1966, ha aperto il suo studio a Bologna
              nel 1995. Il profilo storico racconta un interesse per il
              risparmio energetico e la sostenibilità ambientale, dalle nuove
              costruzioni alla ristrutturazione di edifici storici. Con
              consulenti e professionisti ha seguito sia la progettazione sia la
              realizzazione delle opere. Dopo le scosse del 20 e del 29 maggio
              2012, lo studio si è occupato del consolidamento e del ripristino
              di strutture in Emilia.{" "}
              <Link className="underlined" href="/competenze/sisma-emilia-2012">
                Interventi dopo il sisma
              </Link>
            </p>
          )}
          {localPreview && (
            <p>
              Il curriculum storico riporta la laurea in Ingegneria civile,
              sezione Edile, a Bologna nel 1994 e l’abilitazione professionale
              nel 1995.
            </p>
          )}
          <p>
            Il metodo di lavoro parte dalla lettura delle esigenze e del
            contesto. Le scelte spaziali e le verifiche strutturali si
            sviluppano insieme, in dialogo con i professionisti coinvolti.
          </p>
          <Link className="underlined" href="/servizi">
            Esplora le competenze
          </Link>
        </div>
      </section>
      {localPreview && (
        <section className="section" aria-labelledby="persone">
          <h2 id="persone" tabIndex={-1}>
            Le persone dello studio
          </h2>
          <ul className="people-grid">
            {team.map(({ id, name, role }) => (
              <li
                key={id}
                className={
                  name ? "person-card" : "person-card person-placeholder"
                }
              >
                <div className="person-visual" aria-hidden="true">
                  {name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>
                <div className="person-details">
                  {name ? (
                    <>
                      <h3>{name}</h3>
                      <p>{role}</p>
                    </>
                  ) : (
                    <p>Scheda da completare</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="section">
        <h2 id="metodo" tabIndex={-1}>
          Dal rilievo alla realizzazione
        </h2>
        <StudioRoadmap steps={method} />
      </section>
    </>
  );
  return (
    <EditorialPage page="studio">
      {localPreview ? (
        <ScrollIndex scroller="window" sections={studioSections}>
          {sections}
        </ScrollIndex>
      ) : (
        sections
      )}
    </EditorialPage>
  );
}
