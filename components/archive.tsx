import Link from "next/link";
import {
  categories,
  localPreview,
  searchProjects,
  visibleProjects,
} from "@/content/projects";
import { Breadcrumb, Intro, ProjectGrid } from "./editorial";

export function Archive({
  category,
  query,
}: {
  category?: (typeof categories)[number];
  query: string;
}) {
  const action = category
    ? "/progetti/categoria/" + category.slug
    : "/progetti";
  const targets = [
    { href: "/progetti", label: "Tutti" },
    ...categories.map((item) => ({
      href: "/progetti/categoria/" + item.slug,
      label: item.label,
    })),
  ];
  const projects = searchProjects(
    visibleProjects(localPreview).filter(
      (project) => !category || project.category === category.slug,
    ),
    query,
  );
  return (
    <div className="frame inner-page">
      <Breadcrumb
        items={
          category
            ? [["Progetti", "/progetti"], [category.label]]
            : [["Progetti"]]
        }
      />
      <Intro
        title={category?.label ?? "Progetti"}
        text={
          category?.intro ??
          "Esplora l’archivio per ambito di intervento o cerca un progetto."
        }
      />
      <section className="archive" aria-label="Archivio">
        <nav className="filters" aria-label="Filtra per categoria">
          {targets.map(({ href, label }) => (
            <Link
              key={href}
              href={
                query ? href + "?" + new URLSearchParams({ q: query }) : href
              }
              aria-current={href === action ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <form className="search-form" action={action}>
          <label>
            Cerca nell’archivio
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Titolo o parola chiave"
              maxLength={100}
            />
          </label>
          <button type="submit" className="button">
            Cerca
          </button>
          {query && (
            <Link href={action} className="underlined">
              Azzera ricerca
            </Link>
          )}
        </form>
        <p className="results" role="status">
          {projects.length === 1 ? "1 progetto" : projects.length + " progetti"}
        </p>
        {projects.length ? (
          <ProjectGrid projects={projects} />
        ) : (
          <p>
            {query
              ? "Nessun progetto corrisponde alla ricerca."
              : "Le schede di questo archivio sono in preparazione."}
          </p>
        )}
      </section>
    </div>
  );
}

export type SearchParams = Promise<{ q?: string | string[] }>;
export async function readQuery(params: SearchParams) {
  const { q } = await params;
  return (typeof q === "string" ? q : (q?.[0] ?? "")).trim().slice(0, 100);
}
