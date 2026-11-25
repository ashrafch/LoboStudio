import { EditorialPage } from "@/components/editorial-page";
export const metadata = {
  title: "Privacy",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <EditorialPage page="privacy">
      <div className="prose-block">
        <h2>Navigazione e contatti</h2>
        <p>
          Questa versione del sito non integra analytics, cookie di profilazione
          o mappe incorporate. I link di contatto aprono il client di posta del
          visitatore. Il link alle indicazioni apre un servizio esterno.
        </p>
        <h2>Informazioni in revisione</h2>
        <p>
          Identità e recapiti del titolare, finalità e basi giuridiche,
          destinatari, eventuali trasferimenti, conservazione e modalità di
          esercizio dei diritti saranno completati dopo la definizione
          dell’hosting e del flusso di contatto.
        </p>
      </div>
    </EditorialPage>
  );
}
