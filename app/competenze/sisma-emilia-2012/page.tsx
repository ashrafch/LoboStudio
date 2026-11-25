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
    <EditorialPage page="sisma">
      <div className="prose-block">
        <h2>Archivio storico</h2>
        {localPreview && (
          <p>
            Nel materiale storico, lo studio riferisce attività di messa in
            sicurezza e ripristino di fabbricati produttivi, direzione dei
            lavori strutturali e assistenza alle imprese per le domande di
            contributo. Descrive anche il confronto con la Regione
            Emilia-Romagna sull’interpretazione delle ordinanze. Alla data del
            resoconto, lo studio indicava 2,6 milioni di euro di contributi a
            fondo perduto riconosciuti alle imprese clienti per ricostruzione e
            riavvio delle attività, in parte già liquidati.
          </p>
        )}
        {localPreview && (
          <p>
            La comunicazione dell’epoca richiamava il D.L. 74/2012 per
            l’agibilità sismica dei fabbricati produttivi e le ordinanze
            regionali 57/2012 e 23/2013 per i contributi relativi agli edifici
            residenziali, agricoli, artigianali e industriali. La scadenza
            riportata in quella pagina era il 31 dicembre 2014.
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
