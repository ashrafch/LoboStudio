import { pageMetadata } from "@/content/metadata";
import Link from "next/link";
import { EditorialPage } from "@/components/editorial-page";
import { localPreview } from "@/content/projects";
import { press } from "@/content/press";
export const metadata = pageMetadata(
  "/rassegna-stampa",
  "Rassegna stampa",
  "Articoli e pubblicazioni relativi ai progetti.",
);
export default function Page() {
  return (
    <EditorialPage
      title="Rassegna stampa"
      text="Articoli e pubblicazioni dedicati ai progetti."
    >
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
                  <time dateTime={article.date}>14 gennaio 2021</time>
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
