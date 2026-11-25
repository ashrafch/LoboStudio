import { EditorialPage } from "@/components/editorial-page";
export const metadata = {
  title: "Note legali",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <EditorialPage page="legali">
      <div className="prose-block">
        <p>
          Denominazione professionale, sede, partita IVA, estremi professionali
          e crediti dei materiali sono in verifica.
        </p>
      </div>
    </EditorialPage>
  );
}
