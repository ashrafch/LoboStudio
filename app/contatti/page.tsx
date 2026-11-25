import { pageMetadata } from "@/content/metadata";
import Link from "next/link";
import { EditorialPage } from "@/components/editorial-page";
import { contact as archivedContact } from "@/content/site";
import { pageContent } from "@/content/cms/public";
export const metadata = pageMetadata(
  "/contatti",
  "Contatti",
  "Recapiti e richieste di collaborazione.",
);
export default async function Page() {
  const content = await pageContent("contatti");
  const contact =
    content && (content.email || content.phone || content.address)
      ? {
          person: "Studio Lobo",
          email: content.email,
          phone: content.phone,
          address: content.address,
          tel: content.phone?.replace(/[^+0-9]/g, ""),
        }
      : archivedContact;
  return (
    <EditorialPage page="contatti">
      {contact ? (
        <>
          <div className="section split">
            <div>
              <h2>Scrivi allo studio</h2>
              {contact === archivedContact && (
                <p className="results">
                  Recapiti del sito precedente, in verifica.
                </p>
              )}
              {contact.email && (
                <a className="button" href={"mailto:" + contact.email}>
                  Invia un’email
                </a>
              )}
            </div>
            <address className="not-italic line-list">
              <p>
                {contact.person}
                <br />
                {contact.address}
              </p>
              {contact.phone && (
                <a href={"tel:" + contact.tel}>{contact.phone}</a>
              )}
              {contact.email && (
                <a href={"mailto:" + contact.email}>{contact.email}</a>
              )}
              {contact.address && (
                <a
                  href={
                    "https://www.google.com/maps/search/?api=1&query=" +
                    encodeURIComponent(contact.address)
                  }
                >
                  Indicazioni su Google Maps
                </a>
              )}
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
