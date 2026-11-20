import { pageMetadata } from "@/content/metadata";
import Link from "next/link";
import { EditorialPage } from "@/components/editorial-page";
import { localPreview } from "@/content/projects";
import { method } from "@/content/services";
export const metadata = pageMetadata(
  "/studio",
  "Studio",
  "Profilo e metodo di LoboStudio.",
);
export default function Page() {
  return (
    <EditorialPage
      title="Lo studio"
      text="Architettura, ingegneria e coordinamento del progetto."
    >
      <div className="section split">
        <h2>Profilo</h2>
        <div className="reading">
          {localPreview && (
            <p>
              Nel profilo storico dello studio, Lorenzo Bolelli descrive un
              percorso professionale a Bologna dedicato alla progettazione
              architettonica e strutturale, con attenzione all’efficienza
              energetica e al recupero degli edifici.
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
      </div>
      <section className="section">
        <h2>Dal rilievo alla realizzazione</h2>
        <div className="method">
          {method.map(([title, text]) => (
            <div key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
    </EditorialPage>
  );
}
