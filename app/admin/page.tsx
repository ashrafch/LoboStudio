import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  categories,
  localPreview,
  mediaUrl,
  visibleProjects,
} from "@/content/projects";
import previewImages from "@/content/preview-images.json";
import { adminEnabled, adminHref, hasSession } from "@/content/cms/auth";
import {
  pageFields,
  pages,
  projectFields,
  slug,
  type PageKey,
} from "@/content/cms/schema";
import {
  document,
  documents,
  mediaLibrary,
  revisions,
  siteBackups,
  type Document,
  type Medium,
} from "@/content/cms/store";
import { cmsImage, publicProjects } from "@/content/cms/public";
import { ProjectImage } from "@/components/project-image";
import { VisualEditor } from "./visual-editor";
import { HistoricalPicker } from "./media-picker";
import { contact } from "@/content/site";

import { signOut } from "./actions";
import { AdminForm } from "./form";
import { AdminGuide } from "./guide";
import { BackupPanel } from "./backup-panel";
import "./admin.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Gestione sito",
  robots: { index: false, follow: false },
};

function Identity({
  kind,
  row,
  keyValue,
}: {
  kind: Document["kind"];
  row?: Document;
  keyValue?: string;
}) {
  return (
    <>
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="version" value={row?.version ?? 0} />
      {keyValue && <input type="hidden" name="key" value={keyValue} />}
    </>
  );
}

async function Editor({
  kind,
  keyValue,
  row,
  media,
}: {
  kind: Document["kind"];
  keyValue?: string;
  row?: Document;
  media: Medium[];
}) {
  const historicalProject =
    localPreview && kind === "project"
      ? visibleProjects(true).find((item) => item.slug === keyValue)
      : undefined;
  const projectDraft =
    row && kind === "project" ? JSON.parse(row.draft) : undefined;
  const project = projectDraft
    ? projectFields.parse({
        ...projectDraft,
        presentation:
          projectDraft.presentation ?? historicalProject?.presentation,
        summary: projectDraft.summary ?? historicalProject?.summary,
      })
    : undefined;
  const page =
    row && kind === "page"
      ? pageFields.parse(JSON.parse(row.draft))
      : undefined;
  const archive = row ? revisions(kind, row.key) : [];
  const homeProjects =
    keyValue === "home" && kind === "page"
      ? (await publicProjects(localPreview)).filter((item) => item.gallery[0])
      : [];
  return (
    <section className="admin-panel">
      <h2>
        {project?.title ??
          (kind === "page" ? pages[keyValue as PageKey] : "Nuovo progetto")}
      </h2>
      {kind === "page" && keyValue === "progetti" && (
        <p>
          <Link className="underlined" href="/admin?tab=project">
            Gestisci le schede progetto e le loro foto →
          </Link>
        </p>
      )}
      {row && (
        <p>
          {row.archived
            ? "Nel cestino"
            : row.published
              ? row.draft === row.published
                ? "Pubblicato"
                : "Pubblicato · bozza con modifiche"
              : "Bozza privata"}
        </p>
      )}
      <VisualEditor
        kind={kind}
        docKey={keyValue}
        version={row?.version ?? 0}
        project={project}
        historicalGallery={historicalProject?.gallery.filter((photo) =>
          Object.hasOwn(previewImages, photo.file),
        )}
        page={page}
        media={media}
        categories={categories}
        localPreview={localPreview}
        homeProjects={homeProjects.map(
          ({ slug, title, gallery, featured }) => ({
            slug,
            title,
            image: mediaUrl(gallery[0].file),
            featured,
          }),
        )}
        contactFallback={keyValue === "contatti" ? contact : null}
        archived={Boolean(row?.archived)}
      >
        {row && (
          <div className="admin-publish">
            <AdminForm>
              <Identity kind={kind} keyValue={row.key} row={row} />
              <div className="admin-actions">
                {row.archived ? (
                  <button name="action" value="recover">
                    Recupera dal cestino
                  </button>
                ) : (
                  <>
                    <button
                      className="button"
                      name="action"
                      value="publish"
                      data-admin-guide="publish"
                    >
                      Pubblica la bozza salvata
                    </button>
                    {row.published && (
                      <button name="action" value="unpublish">
                        Ritira dal sito
                      </button>
                    )}
                    <button name="action" value="archive">
                      Sposta nel cestino
                    </button>
                  </>
                )}
              </div>
            </AdminForm>
            {!row.archived && archive.length > 0 && (
              <details>
                <summary>Cronologia pubblicazioni</summary>
                {archive.map((revision) => (
                  <AdminForm key={revision.id}>
                    <Identity kind={kind} keyValue={row.key} row={row} />
                    <input type="hidden" name="revision" value={revision.id} />
                    <button name="action" value="restore">
                      Ripristina come bozza · {revision.created} UTC
                    </button>
                  </AdminForm>
                ))}
              </details>
            )}
          </div>
        )}
      </VisualEditor>
    </section>
  );
}

export default async function Admin({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!adminEnabled()) {
    const href = adminHref();
    if (href) redirect(href);
    notFound();
  }
  if (!(await hasSession()))
    return (
      <div className="frame admin admin-login">
        <h1>Gestione sito</h1>
        <AdminForm login>
          <label>
            Password amministratore
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              maxLength={256}
            />
          </label>
          <button className="button">Accedi</button>
        </AdminForm>
      </div>
    );
  const { tab = "page", key, done, q } = await searchParams;
  const backups = tab === "backup" ? siteBackups() : [];
  const media = tab === "backup" ? [] : mediaLibrary();
  const pageKey =
    typeof key === "string" && Object.hasOwn(pages, key) ? key : "home";
  const projectKey = slug.safeParse(key).data;
  const editedPage = tab === "page" ? document("page", pageKey) : undefined;
  const editedProject =
    tab === "project" && projectKey
      ? document("project", projectKey)
      : undefined;
  const projects = tab === "project" ? documents("project") : [];
  const projectRows = projects.map((row) => ({
    row,
    data: projectFields.parse(JSON.parse(row.draft)),
  }));
  const search =
    typeof q === "string" ? q.trim().slice(0, 100).toLowerCase() : "";
  return (
    <div className="frame admin">
      <div className="admin-head">
        <h1>Gestione sito</h1>
        <div className="admin-actions admin-head-tools">
          <AdminGuide />
          <form action={signOut}>
            <button>Esci</button>
          </form>
        </div>
      </div>
      <nav
        aria-label="Sezioni amministrazione"
        className="admin-actions"
        data-admin-guide="navigation"
      >
        <Link
          href="/admin?tab=page"
          aria-current={tab === "page" ? "page" : undefined}
        >
          Pagine
        </Link>
        <Link
          href="/admin?tab=project"
          aria-current={tab === "project" ? "page" : undefined}
        >
          Progetti
        </Link>
        <Link
          href="/admin?tab=media"
          aria-current={tab === "media" ? "page" : undefined}
        >
          Libreria media
        </Link>
        <Link
          href="/admin?tab=import"
          aria-current={tab === "import" ? "page" : undefined}
        >
          Importa
        </Link>
        <Link
          href="/admin?tab=backup"
          aria-current={tab === "backup" ? "page" : undefined}
        >
          Backup
        </Link>
        <Link href="/">Vai al sito</Link>
      </nav>
      {done === "1" && (
        <p role="status" className="admin-message">
          Operazione completata.
        </p>
      )}
      {tab === "backup" &&
        (done === "backup-created" || done === "backup-restored") && (
          <p role="status" className="admin-message">
            {done === "backup-created"
              ? "Copia di ripristino creata."
              : "Versione ripristinata. La copia dello stato precedente è disponibile qui sotto."}
          </p>
        )}
      {tab === "page" ? (
        <div className="admin-split">
          <nav aria-label="Pagine da modificare" className="admin-list">
            {Object.entries(pages).map(([id, label]) => (
              <Link
                key={id}
                href={"/admin?tab=page&key=" + id}
                aria-current={id === pageKey ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
          <Editor
            key={pageKey + ":" + (editedPage?.version ?? 0)}
            kind="page"
            keyValue={pageKey}
            row={editedPage}
            media={media}
          />
        </div>
      ) : tab === "backup" ? (
        <BackupPanel key={backups[0]?.id} backups={backups} />
      ) : tab === "media" ? (
        <section className="admin-panel">
          <h2>Libreria media</h2>
          <AdminForm>
            <label data-admin-guide="media-upload">
              File immagine
              <input
                name="file"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                required
              />
            </label>
            <label>
              Credito o titolare dei diritti
              <input name="credit" required maxLength={200} />
            </label>
            <button className="button" name="action" value="upload">
              Carica immagine
            </button>
          </AdminForm>
          {process.env.NODE_ENV === "development" && (
            <details>
              <summary>Recupera un’immagine dall’anteprima</summary>
              <AdminForm>
                <HistoricalPicker names={Object.keys(previewImages)} />
                <label>
                  Credito
                  <input name="credit" required maxLength={200} />
                </label>
                <button name="action" value="seed-media">
                  Copia in libreria
                </button>
              </AdminForm>
            </details>
          )}
          <ul className="admin-media">
            {media.map((item) => (
              <li key={item.id}>
                <div className="admin-thumb">
                  <ProjectImage src={cmsImage(item.id)} alt="" sizes="160px" />
                </div>
                <strong>{item.name}</strong>
                <p>{item.credit}</p>
                <AdminForm>
                  <input type="hidden" name="id" value={item.id} />
                  <button name="action" value="delete-image">
                    Elimina immagine
                  </button>
                </AdminForm>
              </li>
            ))}
          </ul>
        </section>
      ) : tab === "import" ? (
        <section className="admin-panel">
          <h2>Importazione</h2>
          <AdminForm>
            <button className="button" name="action" value="seed">
              Importa il portfolio storico come bozze
            </button>
          </AdminForm>
          <AdminForm>
            <label>
              Progetti JSON
              <textarea
                name="data"
                rows={12}
                required
                placeholder={
                  '[{"slug":"via-rossi","title":"Via Rossi","category":"nuove-costruzioni","description":"Descrizione completa del progetto."}]'
                }
              />
            </label>
            <button name="action" value="import">
              Importa fino a 1.000 progetti
            </button>
          </AdminForm>
        </section>
      ) : (
        <div className="admin-split">
          <aside>
            <Link
              href="/admin?tab=project"
              className="button"
              data-admin-guide="new-project"
            >
              Nuovo progetto
            </Link>
            <form method="get" action="/admin" className="admin-project-search">
              <input name="tab" type="hidden" value="project" />
              <label>
                Cerca progetti
                <input
                  type="search"
                  name="q"
                  defaultValue={search}
                  maxLength={100}
                />
              </label>
              <button>Cerca</button>
            </form>
            <nav aria-label="Progetti da modificare" className="admin-list">
              {projectRows
                .filter(({ data }) =>
                  [data.title, data.slug, data.location]
                    .join(" ")
                    .toLowerCase()
                    .includes(search),
                )
                .map(({ row, data }) => (
                  <Link
                    key={row.key}
                    href={"/admin?tab=project&key=" + row.key}
                    aria-current={row.key === projectKey ? "page" : undefined}
                  >
                    {data.title}
                    <small>
                      {row.archived
                        ? "Cestino"
                        : row.published
                          ? "Pubblicato"
                          : "Bozza"}
                    </small>
                  </Link>
                ))}
            </nav>
          </aside>
          <Editor
            key={(projectKey ?? "new") + ":" + (editedProject?.version ?? 0)}
            kind="project"
            keyValue={projectKey}
            row={editedProject}
            media={media}
          />
        </div>
      )}
    </div>
  );
}
