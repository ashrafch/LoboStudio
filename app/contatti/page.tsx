import { pageMetadata } from "@/content/metadata";
import Link from "next/link";
import { EditorialPage } from "@/components/editorial-page";
import { contact } from "@/content/site";
export const metadata = pageMetadata(
  "/contatti",
  "Contatti",
  "Recapiti e richieste di collaborazione.",
);
export default function Page() {
  return (
    <EditorialPage
      title="Contatti"
      text="Nuovi incarichi, consulenze e collaborazioni professionali."
    >
      {contact ? (
        <>
          <div className="section split">
            <div>
              <h2>Scrivi allo studio</h2>
              <p className="results">
                Recapiti del sito precedente, in verifica.
              </p>
              <a className="button" href={"mailto:" + contact.email}>
                Invia un’email
              </a>
            </div>
            <address className="not-italic line-list">
              <p>
                {contact.person}
                <br />
                {contact.address}
              </p>
              <a href={"tel:" + contact.tel}>{contact.phone}</a>
              <a href={"mailto:" + contact.email}>{contact.email}</a>
              <a
                href={
                  "https://www.google.com/maps/search/?api=1&query=" +
                  encodeURIComponent(contact.address)
                }
              >
                Indicazioni su Google Maps
              </a>
            </address>
          </div>
          <div className="prose-block">
            <Link className="underlined" href="/privacy">
              Informazioni sulla privacy
            </Link>
          </div>
        </>
      ) : (
        <p className="prose-block">
          I recapiti dello studio sono in aggiornamento.
        </p>
      )}
    </EditorialPage>
  );
}
