import { pageMetadata } from "@/content/metadata";
import Link from "next/link";
import { EditorialPage } from "@/components/editorial-page";
import { services } from "@/content/services";
export const metadata = pageMetadata(
  "/servizi",
  "Servizi",
  "Fattibilità, progettazione e coordinamento tecnico.",
);
export default function Page() {
  return (
    <EditorialPage
      title="Servizi"
      text="Dalla valutazione iniziale alle verifiche in fase di realizzazione."
    >
      <section className="section">
        <h2>Competenze</h2>
        <dl className="line-list">
          {services.map(([label, text]) => (
            <div key={label} className="split">
              <dt>
                <strong>{label}</strong>
              </dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
      </section>
      <div className="prose-block">
        <Link className="underlined" href="/competenze/sisma-emilia-2012">
          Archivio sisma Emilia 2012
        </Link>
      </div>
    </EditorialPage>
  );
}
