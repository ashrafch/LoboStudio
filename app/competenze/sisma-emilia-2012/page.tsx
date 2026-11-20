import Link from "next/link";
import { EditorialPage } from "@/components/editorial-page";
import { localPreview } from "@/content/projects";
export const metadata = {
  title: "Sisma Emilia 2012",
  description:
    "Archivio storico degli interventi e delle attività di ricostruzione.",
};
export default function Page() {
  return (
    <EditorialPage
      title="Sisma Emilia 2012"
      text="Ricostruzione, interventi strutturali e assistenza tecnica nel contesto post-sisma."
    >
      <div className="prose-block">
        <h2>Archivio storico</h2>
        {localPreview && (
          <p>
            Nel materiale storico, lo studio riferisce attività di messa in
            sicurezza e ripristino di fabbricati produttivi, direzione dei
            lavori strutturali e assistenza alle imprese per le domande di
            contributo.
          </p>
        )}
        <p>
          La pagina riguarda la ricostruzione seguita agli eventi del maggio
          2012. Per informazioni su pratiche e misure disponibili, consulta i
          riferimenti istituzionali competenti.
        </p>
        <Link className="underlined" href="/progetti/categoria/strutture">
          Esplora la sezione Strutture
        </Link>
      </div>
    </EditorialPage>
  );
}
