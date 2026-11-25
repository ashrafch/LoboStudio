import { pageMetadata } from "@/content/metadata";
import Link from "next/link";
import { EditorialPage } from "@/components/editorial-page";
import { localPreview } from "@/content/projects";
import { press } from "@/content/press";
const articleDate = new Intl.DateTimeFormat("it-IT", {
  dateStyle: "long",
  timeZone: "UTC",
});
export const metadata = pageMetadata(
  "/rassegna-stampa",
  "Rassegna stampa",
  "Articoli e pubblicazioni relativi ai progetti.",
);
export default function Page() {
  return (
    <EditorialPage page="stampa">
      <div className="prose-block">
        {localPreview ? (
          <>
            <p>
              Selezione dal sito precedente. Le attribuzioni sono in revisione.
            </p>
            {press.map((article) => (
              <article key={article.url}>
                <p className="eyebrow">
                  {article.source} · {article.author} ·{" "}
                  <time dateTime={article.date}>
                    {articleDate.format(new Date(article.date))}
                  </time>
                </p>
                <h2>{article.title}</h2>
                <p>{article.summary}</p>
                <a className="underlined" href={article.url}>
                  Leggi su {article.source}
                </a>
              </article>
            ))}
          </>
        ) : (
          <p>La rassegna è in preparazione.</p>
        )}
        <p className="results">
          <Link href="/progetti" className="underlined">
            Visita l’archivio progetti
          </Link>
        </p>
      </div>
    </EditorialPage>
  );
}
