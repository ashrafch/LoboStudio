import { pageDefaults } from "@/content/cms/page-defaults";
import Link from "next/link";
import {
  categories,
  localPreview,
  mediaUrl,
  searchProjects,
} from "@/content/projects";
import { pageContent, publicProjects } from "@/content/cms/public";
import { ContentBlocks } from "./content-blocks";
import {
  ArrowUpRight,
  Building2,
  Grid2X2,
  Hammer,
  Layers3,
  Map,
} from "lucide-react";
import { Breadcrumb, Intro, ProjectGrid } from "./editorial";
import { ProjectImage } from "./project-image";
import { TopoBackground } from "./kokonutui/topo-background";

const categoryIcons = {
  "nuove-costruzioni": Building2,
  ristrutturazioni: Hammer,
  strutture: Layers3,
  "piani-urbanistici": Map,
};

export async function Archive({
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
    { href: "/progetti", label: "Tutti", slug: undefined },
    ...categories.map((item) => ({
      href: "/progetti/categoria/" + item.slug,
      label: item.label,
      slug: item.slug,
    })),
  ];
  const [available, content] = await Promise.all([
    publicProjects(localPreview),
    pageContent("progetti"),
  ]);
  const matches = searchProjects(available, query);
  const projects = matches.filter(
    (project) => !category || project.category === category.slug,
  );
  const illustrated = projects.filter((project) => project.gallery.length > 0);
  const documented = projects.filter((project) => project.gallery.length === 0);
  const intro = (
    <Intro
      title={category?.label ?? (content?.title || pageDefaults.progetti.title)}
      text={category?.intro ?? (content?.intro || pageDefaults.progetti.intro)}
    />
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
      {category?.slug === "piani-urbanistici" ? (
        <TopoBackground>{intro}</TopoBackground>
      ) : (
        intro
      )}
      <section className="archive" aria-label="Archivio">
        <nav className="filters" aria-label="Filtra per categoria">
          {targets.map(({ href, label, slug }) => {
            const image = available.find(
              (project) =>
                project.gallery.length > 0 &&
                (!slug || project.category === slug),
            )?.gallery[0];
            const count = slug
              ? matches.filter((project) => project.category === slug).length
              : matches.length;
            const Icon = slug ? categoryIcons[slug] : Grid2X2;
            return (
              <Link
                key={href}
                className="filter-card"
                href={
                  query ? href + "?" + new URLSearchParams({ q: query }) : href
                }
                aria-current={href === action ? "page" : undefined}
              >
                <span className="filter-visual" aria-hidden="true">
                  {image ? (
                    <ProjectImage
                      src={mediaUrl(image.file)}
                      alt=""
                      sizes="(max-width: 680px) 42vw, 18vw"
                    />
                  ) : (
                    <Icon size={28} />
                  )}
                </span>
                <span className="filter-label">
                  <strong>{label}</strong>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </span>
                <span className="filter-count">
                  {count === 1 ? "1 progetto" : count + " progetti"}
                </span>
              </Link>
            );
          })}
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
        {illustrated.length > 0 && <ProjectGrid projects={illustrated} />}
        {documented.length > 0 && (
          <section
            className="documented-projects"
            aria-labelledby="documented-title"
          >
            <h2 id="documented-title">Dall’archivio dello studio</h2>
            <ul>
              {documented.map((project) => (
                <li key={project.slug}>
                  <Link href={"/progetti/" + project.slug}>
                    <strong>{project.title}</strong>
                    <span>
                      {[project.location, project.period]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
        {projects.length === 0 && (
          <p>
            {query
              ? "Nessun progetto corrisponde alla ricerca."
              : "Le schede di questo archivio sono in preparazione."}
          </p>
        )}
      </section>
      {!category && <ContentBlocks content={content} />}
    </div>
  );
}

export type SearchParams = Promise<{ q?: string | string[] }>;
export async function readQuery(params: SearchParams) {
  const { q } = await params;
  return (typeof q === "string" ? q : (q?.[0] ?? "")).trim().slice(0, 100);
}
