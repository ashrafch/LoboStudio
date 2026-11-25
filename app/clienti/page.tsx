import { pageMetadata } from "@/content/metadata";
import Link from "next/link";
import { EditorialPage } from "@/components/editorial-page";
import { ProjectImage } from "@/components/project-image";
import { localPreview, mediaUrl } from "@/content/projects";
import { references } from "@/content/references";
export const metadata = pageMetadata(
  "/clienti",
  "Clienti e collaborazioni",
  "Relazioni e collaborazioni professionali di LoboStudio.",
);
export default function Page() {
  return (
    <EditorialPage page="clienti">
      {localPreview && (
        <section className="section">
          <h2>Referenze dall’archivio</h2>
          <ul className="reference-grid">
            {references.map(({ name, media }) => (
              <li key={media}>
                <div className="reference-mark">
                  <ProjectImage
                    src={mediaUrl(media)}
                    alt=""
                    sizes="130px"
                    fallback={<span>{name}</span>}
                  />
                </div>
                <strong>{name}</strong>
              </li>
            ))}
          </ul>
        </section>
      )}
      <div className="prose-block">
        {!localPreview && <p>Le referenze sono in preparazione.</p>}
        <Link href="/contatti" className="underlined">
          Proponi una collaborazione
        </Link>
      </div>
    </EditorialPage>
  );
}
