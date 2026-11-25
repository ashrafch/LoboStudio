import { pageMetadata } from "@/content/metadata";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ContactCallout } from "@/components/editorial";
import { EditorialPage } from "@/components/editorial-page";
import { ServicePhoto } from "@/components/service-photo";
import { pageContent } from "@/content/cms/public";
import { services, servicePhoto } from "@/content/services";

export const metadata = pageMetadata(
  "/servizi",
  "Servizi",
  "Fattibilità, progettazione e coordinamento tecnico.",
);
export default async function Page() {
  const page = await pageContent("servizi");
  return (
    <>
      <EditorialPage
        page="servizi"
        introAside={
          <nav className="service-index" aria-label="Indice delle competenze">
            <ul>
              {services.map(({ id, title }) => (
                <li key={id}>
                  <a href={"#" + id}>
                    {title}
                    <ArrowDown size={16} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        }
      >
        <section className="section" aria-labelledby="competenze">
          <h2 id="competenze">Competenze</h2>
          <div className="service-grid">
            {services.map((service) => {
              const photo = servicePhoto(service, page?.servicePhotos);
              return (
                <article className="service-card" key={service.id}>
                  <div className="service-card-copy">
                    <h3 id={service.id} tabIndex={-1}>
                      {service.title}
                    </h3>
                    <p>{service.description}</p>
                  </div>
                  {photo && <ServicePhoto photo={photo} />}
                </article>
              );
            })}
          </div>
        </section>
        <nav className="service-related" aria-label="Approfondimenti">
          <Link href="/progetti">
            Esplora i progetti
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
          <Link href="/competenze/sisma-emilia-2012">
            Archivio sisma Emilia 2012
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </nav>
      </EditorialPage>
      {page?.mode !== "sostituisci" && <ContactCallout />}
    </>
  );
}
