import { pageMetadata } from "@/content/metadata";
import Link from "next/link";
import { EditorialPage } from "@/components/editorial-page";
export const metadata = pageMetadata(
  "/clienti",
  "Clienti e collaborazioni",
  "Relazioni e collaborazioni professionali di LoboStudio.",
);
export default function Page() {
  return (
    <EditorialPage
      title="Clienti e collaborazioni"
      text="Progetti e collaborazioni con committenti, imprese e professionisti."
    >
      <div className="prose-block">
        <p>Le referenze sono in preparazione.</p>
        <Link href="/contatti" className="underlined">
          Proponi una collaborazione
        </Link>
      </div>
    </EditorialPage>
  );
}
