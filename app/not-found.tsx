import Link from "next/link";
import { EditorialPage } from "@/components/editorial-page";
export default function NotFound() {
  return (
    <EditorialPage
      title="Pagina non trovata"
      text="Controlla l’indirizzo o riparti dall’archivio dei progetti."
    >
      <div className="prose-block">
        <Link className="button" href="/progetti">
          Vai ai progetti
        </Link>
      </div>
    </EditorialPage>
  );
}
