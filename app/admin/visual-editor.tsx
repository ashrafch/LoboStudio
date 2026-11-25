"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  AlignLeft,
  ArrowDown,
  ArrowUp,
  Check,
  Columns2,
  Eye,
  ImagePlus,
  LayoutPanelTop,
  LockKeyhole,
  Monitor,
  Pencil,
  Plus,
  Smartphone,
  Trash2,
} from "lucide-react";
import { ProjectImage } from "@/components/project-image";
import { ProjectPresentation } from "@/components/project-presentation";
import {
  orderFeatured,
  photoStageLabels,
  photoStages,
  type PhotoStage,
} from "@/content/projects/presentation";
import type { PageDraft, PageKey, ProjectDraft } from "@/content/cms/schema";
import {
  defaultShowcaseOrder,
  showcaseTitle,
} from "@/content/projects/showcase";
import type { Medium } from "@/content/cms/store";
import {
  homeCta,
  homeSubtitle,
  pageDefaults,
} from "@/content/cms/page-defaults";
import { mutate } from "./actions";
import { MediaPicker, type Choice } from "./media-picker";
import {
  ProjectPhotos,
  type HistoricalPhoto,
  type PhotoDetails,
} from "./project-photos";
import { FeaturedOrder, type FeaturedProject } from "./featured-order";
import Link from "next/link";
import { ServicePhotos } from "./service-photos";
import { services, type ServicePhotoOverrides } from "@/content/services";
import { pageContext } from "./page-context";
import { ShowcasePicker } from "./showcase-picker";

type Entry = {
  uid: string;
  title: string;
  text: string;
  image: string;
  alt: string;
  credit: string;
  caption?: string;
  stage?: PhotoStage;
};
const blankEntry = { title: "", text: "", image: "", alt: "", credit: "" };
type Props = {
  kind: "project" | "page";
  docKey?: string;
  version: number;
  project?: ProjectDraft;
  historicalGallery?: HistoricalPhoto[];
  page?: PageDraft;
  media: Medium[];
  categories: readonly { slug: string; label: string }[];
  homeProjects: (FeaturedProject & { featured: boolean })[];
  localPreview: boolean;
  contactFallback: { email: string; phone: string; address: string } | null;
  archived: boolean;
  children: ReactNode;
};

function Zone({
  label,
  active,
  editing,
  onSelect,
  children,
  className = "",
}: {
  label: string;
  active: boolean;
  editing: boolean;
  onSelect: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "ve-zone",
        className,
        editing && active ? "ve-selected" : "",
      ].join(" ")}
    >
      {children}
      {editing && (
        <button
          type="button"
          className="ve-hit"
          aria-label={"Modifica " + label}
          aria-pressed={active}
          onClick={onSelect}
        >
          <span>
            <Pencil size={13} />
            {label}
          </span>
        </button>
      )}
    </div>
  );
}

function Picture({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="ve-picture">
      <ProjectImage
        key={src}
        src={src}
        alt={alt}
        sizes="(max-width: 680px) 80vw, 350px"
      />
    </div>
  );
}

const layouts = [
  { value: "standard", label: "Affiancata", icon: LayoutPanelTop },
  { value: "compatto", label: "Due colonne", icon: Columns2 },
  { value: "ampio", label: "Ampia", icon: AlignLeft },
] as const;

export function VisualEditor({
  kind,
  docKey,
  version,
  page,
  project,
  historicalGallery = [],
  media,
  categories,
  homeProjects,
  localPreview,
  contactFallback,
  archived,
  children,
}: Props) {
  const isProject = kind === "project";
  const pageKey = !isProject ? (docKey as PageKey) : undefined;
  const defaults = pageKey ? pageDefaults[pageKey] : undefined;
  const isHome = pageKey === "home";
  const [data, setData] = useState(() => ({
    key: docKey ?? "",
    title: isProject
      ? (project?.title ?? "")
      : page?.title || defaults?.title || "",
    description: project?.description ?? "",
    summary: project?.summary ?? "",
    presentation: project?.presentation ?? "essenziale",
    intro: page?.intro || defaults?.intro || "",
    subtitle: page?.subtitle || (isHome ? homeSubtitle : ""),
    cta: page?.cta || (isHome ? homeCta : ""),
    email: page?.email ?? "",
    phone: page?.phone ?? "",
    address: page?.address ?? "",
    role: project?.role ?? "",
    location: project?.location ?? "",
    period: project?.period ?? "",
    category: project?.category ?? categories[0].slug,
    featured: project?.featured ?? false,
    layout: page?.layout ?? "standard",
    mode: page?.mode ?? "affianca",
  }));
  const [entries, setEntries] = useState<Entry[]>(() =>
    isProject
      ? (project?.gallery ?? []).map((item, i) => ({
          ...blankEntry,
          ...item,
          uid: String(i),
          image: item.id,
        }))
      : (page?.blocks ?? []).map((item, i) => ({
          ...blankEntry,
          ...item,
          uid: String(i),
        })),
  );
  const [selected, select] = useState("intro");
  const [servicePhotos, setServicePhotos] = useState<ServicePhotoOverrides>(
    page?.servicePhotos ?? {},
  );
  const [featuredOrder, setFeaturedOrder] = useState(page?.featuredOrder ?? []);
  const orderedFeatured = orderFeatured(
    homeProjects.filter(({ featured }) => featured),
    featuredOrder,
  );
  const [showcaseOrder, setShowcaseOrder] = useState(page?.showcaseOrder);
  const showcaseCatalogue = new Map(
    homeProjects.map((project) => [project.slug, project]),
  );
  const showcaseSelection =
    showcaseOrder ??
    defaultShowcaseOrder.filter((slug) => showcaseCatalogue.has(slug));
  const showcasePreview = showcaseSelection.flatMap(
    (slug) => showcaseCatalogue.get(slug) ?? [],
  );
  const homePhoto = orderedFeatured[0]?.image;
  const [library, setLibrary] = useState<Choice[]>(media);
  const [editing, setEditing] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [dirty, setDirty] = useState(false);
  const inspector = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const entryIndex = entries.findIndex((item) => item.uid === selected);
  const entry = entries[entryIndex];
  const showExisting = data.mode === "affianca";
  const sectionName =
    selected === "intro"
      ? "Intestazione"
      : selected === "settings"
        ? "Composizione"
        : selected === "details"
          ? "Dati del progetto"
          : selected === "showcase"
            ? showcaseTitle
            : selected === "contact"
              ? "Recapiti"
              : (isProject ? "Immagine " : "Blocco ") + (entryIndex + 1);

  function change<K extends keyof typeof data>(
    key: K,
    value: (typeof data)[K],
  ) {
    setData((current) => ({ ...current, [key]: value }));
    setDirty(true);
  }
  function choose(id: string, focus = true) {
    select(id);
    setEditing(true);
    if (focus) requestAnimationFrame(() => inspector.current?.focus());
  }
  function editEntry(patch: Partial<Entry>) {
    setEntries((current) =>
      current.map((item) =>
        item.uid === selected ? { ...item, ...patch } : item,
      ),
    );
    setDirty(true);
  }
  function add() {
    const uid = crypto.randomUUID();
    setEntries((current) => [...current, { ...blankEntry, uid }]);
    setDirty(true);
    choose(uid);
  }
  function appendPhoto(item: Choice, details: PhotoDetails) {
    const existing = entries.find((photo) => photo.image === item.id);
    if (existing) {
      choose(existing.uid);
      return;
    }
    if (entries.length >= 36) return;
    const uid = crypto.randomUUID();
    setLibrary((current) =>
      current.some((photo) => photo.id === item.id)
        ? current
        : [item, ...current],
    );
    setEntries((current) => [
      ...current,
      { ...blankEntry, ...details, uid, image: item.id, credit: item.credit },
    ]);
    setDirty(true);
    choose(uid);
  }
  function move(step: number) {
    const next = [...entries];
    [next[entryIndex], next[entryIndex + step]] = [
      next[entryIndex + step],
      next[entryIndex],
    ];
    setEntries(next);
    setDirty(true);
  }
  function moveFeatured(index: number, offset: number) {
    const keys = orderedFeatured.map((project) => project.slug);
    const other = index + offset;
    [keys[index], keys[other]] = [keys[other], keys[index]];
    setFeaturedOrder(keys);
    setDirty(true);
  }
  useEffect(() => {
    if (!dirty) return;
    function warn(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }
    function leave(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      )
        return;
      const link =
        event.target instanceof Element ? event.target.closest("a") : null;
      if (
        link &&
        link.target !== "_blank" &&
        link.href !== location.href &&
        !window.confirm(
          "Lasciare la pagina e perdere le modifiche non salvate?",
        )
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
    window.addEventListener("beforeunload", warn);
    document.addEventListener("click", leave, true);
    return () => {
      window.removeEventListener("beforeunload", warn);
      document.removeEventListener("click", leave, true);
    };
  }, [dirty]);

  const [message, save, pending] = useActionState(async () => {
    function invalid(id: string, text: string) {
      choose(id);
      return text;
    }
    if (isProject && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.key))
      return invalid(
        "details",
        "Indica un indirizzo con lettere minuscole, numeri e trattini.",
      );
    if (
      isProject &&
      (data.title.trim().length < 3 || data.description.trim().length < 20)
    )
      return invalid(
        "intro",
        "Inserisci un titolo di almeno 3 caratteri e una descrizione di almeno 20.",
      );
    if (isProject && data.featured && !entries.some((item) => item.image))
      return invalid(
        "details",
        "Per mostrare il progetto in home scegli una copertina.",
      );
    const form = new FormData();
    form.set("action", "save");
    form.set("kind", kind);
    form.set("version", String(version));
    for (const [name, value] of Object.entries(data)) {
      if (typeof value === "string" || value) form.set(name, String(value));
    }
    if (pageKey === "servizi") {
      const incomplete = services.find(
        ({ id }) =>
          servicePhotos[id] && servicePhotos[id]!.alt.trim().length < 5,
      );
      if (incomplete)
        return (
          "Descrivi la foto di “" +
          incomplete.title +
          "” in almeno 5 caratteri."
        );
      form.set("servicePhotos", JSON.stringify(servicePhotos));
    }
    if (isHome) {
      featuredOrder.forEach((key) => form.append("featuredOrder", key));
      if (showcaseOrder !== undefined)
        form.set("showcaseOrder", JSON.stringify(showcaseOrder));
    }
    for (const item of entries) {
      if (isProject && !item.image)
        return invalid(
          item.uid,
          "Scegli una foto oppure rimuovi il riquadro vuoto dalla galleria.",
        );
      if (!isProject && !(item.title.trim() || item.text.trim() || item.image))
        return invalid(
          item.uid,
          "Inserisci un testo o una foto, oppure rimuovi il blocco vuoto.",
        );
      if (item.image && item.alt.trim().length < 5)
        return invalid(item.uid, "Descrivi l’immagine in almeno 5 caratteri.");
      if (isProject && item.credit.trim().length < 2)
        return invalid(item.uid, "Indica il credito della fotografia.");
      form.append("image", item.image);
      form.append("alt", item.alt);
      form.append("credit", item.credit);
      form.append("caption", item.caption ?? "");
      form.append("stage", item.stage ?? "");
      form.append("blockTitle", item.title);
      form.append("blockText", item.text);
    }
    // Preserve inherited site copy when the editor has not overridden it.
    if (defaults) {
      if (data.title === defaults.title) form.set("title", "");
      if (data.intro === defaults.intro) form.set("intro", "");
      if (isHome && data.subtitle === homeSubtitle) form.set("subtitle", "");
      if (isHome && data.cta === homeCta) form.set("cta", "");
    }
    const result = await mutate({ message: "" }, form);
    return result.message;
  }, "");

  if (archived) return children;
  const introTitle = data.title || defaults?.title || "Titolo del progetto";
  const introText = isProject
    ? data.description
    : data.intro || defaults?.intro;
  const contacts =
    data.email || data.phone || data.address ? data : contactFallback;
  const zone = (
    id: string,
    label: string,
    children: ReactNode,
    className?: string,
  ) => (
    <Zone
      key={id}
      label={label}
      active={selected === id}
      editing={editing}
      onSelect={() => choose(id)}
      className={className}
    >
      {children}
    </Zone>
  );
  type TextKey = Exclude<
    keyof typeof data,
    "layout" | "featured" | "mode" | "category" | "presentation"
  >;
  function field(
    key: TextKey,
    label: string,
    limit: number,
    placeholder = "",
    multiline = false,
  ) {
    const props = {
      name: key,
      value: data[key],
      maxLength: limit,
      placeholder,
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => change(key, e.target.value),
    };
    return (
      <label>
        {label}
        {multiline ? (
          <textarea {...props} rows={4} />
        ) : (
          <input {...props} type={key === "email" ? "email" : "text"} />
        )}
      </label>
    );
  }
  return (
    <>
      <form action={save} className="ve-form">
        <fieldset disabled={pending}>
          {editing && isProject && (
            <ProjectPhotos
              entries={entries}
              library={library}
              historical={historicalGallery}
              select={choose}
              append={appendPhoto}
            />
          )}
          {editing && isHome && (
            <FeaturedOrder projects={orderedFeatured} move={moveFeatured} />
          )}
          {pageKey === "servizi" && (
            <ServicePhotos
              photos={servicePhotos}
              update={(next) => {
                setServicePhotos(next);
                setDirty(true);
              }}
              library={library}
              editing={editing}
            />
          )}
          <div className="ve-toolbar">
            <div className="ve-switch">
              <button
                type="button"
                aria-pressed={editing}
                onClick={() => setEditing(true)}
              >
                <Pencil size={15} /> Modifica
              </button>
              <button
                type="button"
                aria-pressed={!editing}
                data-admin-guide="preview"
                onClick={() => setEditing(false)}
              >
                <Eye size={16} /> Anteprima
              </button>
            </div>
            {editing && isProject && (
              <div
                className="ve-switch"
                role="group"
                aria-label="Impaginazione della scheda"
              >
                <button
                  type="button"
                  aria-pressed={data.presentation === "essenziale"}
                  onClick={() => change("presentation", "essenziale")}
                >
                  Essenziale
                </button>
                <button
                  type="button"
                  aria-pressed={data.presentation === "racconto"}
                  onClick={() => change("presentation", "racconto")}
                >
                  Racconto
                </button>
              </div>
            )}
            <div className="ve-switch">
              <button
                type="button"
                aria-label="Vista desktop"
                aria-pressed={!mobile}
                onClick={() => setMobile(false)}
              >
                <Monitor size={17} />
              </button>
              <button
                type="button"
                aria-label="Vista telefono"
                aria-pressed={mobile}
                onClick={() => setMobile(true)}
              >
                <Smartphone size={16} />
              </button>
            </div>
          </div>
          <div className={"ve-workspace" + (editing ? "" : " ve-reading")}>
            <div className="ve-stage" tabIndex={-1} ref={canvas}>
              <div className={"ve-sheet" + (mobile ? " ve-phone" : "")}>
                <div className="ve-mast">
                  <strong>LOBO</strong>
                  <span>{isProject ? "Progetti" : defaults?.title}</span>
                </div>
                {isProject && !editing ? (
                  <ProjectPresentation
                    title={introTitle}
                    summary={data.summary}
                    description={data.description}
                    layout={data.presentation}
                    preview
                    frames={entries
                      .filter((item) => item.image)
                      .map(({ image, alt, caption, stage, credit }) => ({
                        src: "/media/cms/" + image,
                        alt,
                        caption,
                        stage,
                        credit,
                      }))}
                    facts={{
                      location: data.location,
                      period: data.period,
                      role: data.role,
                    }}
                  />
                ) : (
                  <>
                    {isHome && localPreview && showExisting && (
                      <div className="ve-fixed">
                        <LockKeyhole size={14} /> Video di apertura
                      </div>
                    )}
                    {zone(
                      "intro",
                      "intestazione",
                      <div className={"ve-intro" + (isHome ? " ve-cover" : "")}>
                        <div>
                          {isProject && (
                            <small>
                              {
                                categories.find((c) => c.slug === data.category)
                                  ?.label
                              }
                            </small>
                          )}
                          <strong>{introTitle}</strong>
                          {isProject && data.summary && <b>{data.summary}</b>}
                          {isHome && <b>{data.subtitle || homeSubtitle}</b>}
                          {introText && <p>{introText}</p>}
                          {isHome && <span>{data.cta || homeCta} →</span>}
                        </div>
                        {isHome && homePhoto && (
                          <Picture src={homePhoto} alt="Progetto in evidenza" />
                        )}
                      </div>,
                    )}
                    {isProject &&
                      zone(
                        "details",
                        "dati del progetto",
                        <div className="ve-facts">
                          {[
                            ["Ruolo", data.role],
                            ["Località", data.location],
                            ["Periodo", data.period],
                          ]
                            .filter(([, v]) => editing || v)
                            .map(([k, v]) => (
                              <div key={k}>
                                <small>{k}</small>
                                <strong>{v || "—"}</strong>
                              </div>
                            ))}
                        </div>,
                      )}
                    {pageKey &&
                      showExisting &&
                      pageContext(pageKey).map((label) =>
                        isHome && label === showcaseTitle ? (
                          (editing || showcasePreview.length > 0) &&
                          zone(
                            "showcase",
                            showcaseTitle,
                            <div className="ve-showcase">
                              <h3 data-admin-guide="showcase">
                                {showcaseTitle}
                              </h3>
                              {showcasePreview.length ? (
                                <ol>
                                  {showcasePreview.map(
                                    ({ slug, image, title }) => (
                                      <li key={slug}>
                                        <Picture src={image} alt="" />
                                        <strong>{title}</strong>
                                      </li>
                                    ),
                                  )}
                                </ol>
                              ) : (
                                <p>
                                  La sezione è nascosta finché non scegli un
                                  progetto.
                                </p>
                              )}
                            </div>,
                          )
                        ) : isHome &&
                          editing &&
                          label === "Attività dello studio" ? (
                          <Link
                            key={label}
                            className="ve-fixed"
                            href="/admin?tab=page&key=servizi"
                          >
                            <Pencil size={14} /> Attività dello studio ·
                            Gestisci foto
                          </Link>
                        ) : (
                          <div key={label} className="ve-fixed">
                            <LockKeyhole size={14} />
                            {label}
                          </div>
                        ),
                      )}
                    {pageKey === "contatti" &&
                      showExisting &&
                      zone(
                        "contact",
                        "recapiti",
                        <div className="ve-contact">
                          <b>Scrivi allo studio</b>
                          {contacts ? (
                            <p>
                              {[
                                contacts.address,
                                contacts.phone,
                                contacts.email,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          ) : (
                            <p>
                              I recapiti dello studio sono in aggiornamento.
                            </p>
                          )}
                        </div>,
                      )}
                    {editing && !isProject && (
                      <button
                        type="button"
                        className="ve-config"
                        onClick={() => choose("settings")}
                        aria-pressed={selected === "settings"}
                      >
                        <LayoutPanelTop size={17} /> Composizione dei blocchi{" "}
                        <span>
                          {layouts.find((l) => l.value === data.layout)?.label}
                        </span>
                      </button>
                    )}
                    <div
                      className={
                        isProject ? "ve-gallery" : "ve-blocks ve-" + data.layout
                      }
                    >
                      {entries.map((item, i) =>
                        zone(
                          item.uid,
                          (isProject ? "immagine " : "blocco ") + (i + 1),
                          <div className="ve-card">
                            {item.image ? (
                              <Picture
                                src={"/media/cms/" + item.image}
                                alt={item.alt}
                              />
                            ) : (
                              (isProject || (!item.title && !item.text)) && (
                                <div className="ve-empty">
                                  <ImagePlus size={23} />
                                  <span>
                                    {isProject
                                      ? "Scegli una foto"
                                      : "Blocco da completare"}
                                  </span>
                                </div>
                              )
                            )}
                            {!isProject && (item.title || item.text) && (
                              <div className="ve-copy">
                                {item.title && <strong>{item.title}</strong>}
                                {item.text && <p>{item.text}</p>}
                              </div>
                            )}
                            {isProject && editing && (
                              <small>
                                {i === 0 ? "Copertina" : "Foto " + (i + 1)}
                                {item.stage &&
                                  " · " + photoStageLabels[item.stage]}
                              </small>
                            )}
                            {isProject && item.caption && (
                              <p className="ve-photo-caption">{item.caption}</p>
                            )}
                          </div>,
                        ),
                      )}
                    </div>
                    {editing && !isProject && (
                      <button
                        type="button"
                        className="ve-add"
                        disabled={entries.length >= 30}
                        onClick={add}
                      >
                        <Plus size={16} />
                        Aggiungi blocco
                      </button>
                    )}
                    {isHome && (
                      <div className="ve-fixed">
                        <LockKeyhole size={14} /> Contatti dello studio
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            {editing && (
              <aside
                className="ve-inspector"
                ref={inspector}
                tabIndex={-1}
                aria-label={"Modifica · " + sectionName}
              >
                <header data-admin-guide={isHome ? "editor" : undefined}>
                  <Pencil size={16} />
                  <h3>{sectionName}</h3>
                </header>
                {selected === "showcase" && (
                  <ShowcasePicker
                    selection={showcaseSelection}
                    catalogue={showcaseCatalogue}
                    custom={showcaseOrder !== undefined}
                    change={(next) => {
                      setShowcaseOrder(next);
                      setDirty(true);
                    }}
                  />
                )}
                {selected === "intro" && (
                  <>
                    {field("title", "Titolo", 140, defaults?.title)}
                    {isHome &&
                      field("subtitle", "Sottotitolo", 180, homeSubtitle)}
                    {isProject ? (
                      <>
                        {field("summary", "Introduzione breve", 320, "", true)}
                        {field("description", "Descrizione", 8000, "", true)}
                      </>
                    ) : (
                      field(
                        "intro",
                        "Testo introduttivo",
                        1200,
                        defaults?.intro,
                        true,
                      )
                    )}
                    {isHome &&
                      field("cta", "Testo del link ai progetti", 100, homeCta)}
                  </>
                )}
                {selected === "details" && (
                  <>
                    {docKey ? (
                      <small>/progetti/{docKey}</small>
                    ) : (
                      field(
                        "key",
                        "Indirizzo della scheda",
                        100,
                        "esempio-via-rossi",
                      )
                    )}
                    <label>
                      Categoria
                      <select
                        aria-label="Categoria"
                        value={data.category}
                        onChange={(e) => change("category", e.target.value)}
                      >
                        {categories.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    {field("role", "Ruolo dello studio", 220)}
                    {field("location", "Località", 140)}
                    {field("period", "Periodo", 100)}
                    <label className="admin-check">
                      <input
                        type="checkbox"
                        checked={data.featured}
                        onChange={(e) => change("featured", e.target.checked)}
                      />{" "}
                      In evidenza nella home
                    </label>
                  </>
                )}
                {selected === "contact" && (
                  <>
                    {field("email", "Email", 254)}
                    {field("phone", "Telefono", 32)}
                    {field("address", "Indirizzo", 240)}
                  </>
                )}
                {selected === "settings" && (
                  <>
                    <span>Impaginazione dei blocchi</span>
                    <div className="ve-layouts">
                      {layouts.map(({ value, label, icon: Icon }) => (
                        <button
                          type="button"
                          key={value}
                          aria-pressed={data.layout === value}
                          onClick={() => change("layout", value)}
                        >
                          <Icon size={23} />
                          {label}
                        </button>
                      ))}
                    </div>
                    {pageKey !== "progetti" && (
                      <label>
                        Sezioni del sito
                        <select
                          aria-label="Sezioni del sito"
                          value={data.mode}
                          onChange={(e) =>
                            change("mode", e.target.value as PageDraft["mode"])
                          }
                        >
                          <option value="affianca">
                            Mantieni le sezioni esistenti
                          </option>
                          <option value="sostituisci">
                            Sostituisci con i miei blocchi
                          </option>
                        </select>
                      </label>
                    )}
                    <small>
                      {pageKey === "progetti"
                        ? "I blocchi seguono i risultati dell’archivio."
                        : showExisting
                          ? "I nuovi blocchi seguono le sezioni del sito."
                          : "Le sezioni predefinite sono nascoste in questa composizione."}
                    </small>
                  </>
                )}
                {entry && (
                  <>
                    {!isProject && (
                      <>
                        <label>
                          Titolo del blocco
                          <input
                            value={entry.title}
                            maxLength={140}
                            onChange={(e) =>
                              editEntry({ title: e.target.value })
                            }
                          />
                        </label>
                        <label>
                          Testo del blocco
                          <textarea
                            rows={4}
                            value={entry.text}
                            maxLength={8000}
                            onChange={(e) =>
                              editEntry({ text: e.target.value })
                            }
                          />
                        </label>
                      </>
                    )}
                    <MediaPicker
                      media={library}
                      selected={entry.image}
                      pick={(item) => {
                        if (item?.id === entry.image) return;
                        if (
                          isProject &&
                          item &&
                          entries.some((photo) => photo.image === item.id)
                        ) {
                          choose(
                            entries.find((photo) => photo.image === item.id)!
                              .uid,
                          );
                          return;
                        }
                        editEntry({
                          image: item?.id ?? "",
                          alt: "",
                          credit: item?.credit ?? "",
                          caption: undefined,
                          stage: undefined,
                        });
                      }}
                    />
                    {entry.image && (
                      <>
                        <label>
                          Testo alternativo
                          <input
                            value={entry.alt}
                            maxLength={250}
                            onChange={(e) => editEntry({ alt: e.target.value })}
                          />
                        </label>
                        {isProject && (
                          <>
                            <label>
                              Tipo di immagine
                              <select
                                value={entry.stage ?? ""}
                                onChange={(e) =>
                                  editEntry({
                                    stage: photoStages.find(
                                      (stage) => stage === e.target.value,
                                    ),
                                  })
                                }
                              >
                                <option value="">Nessuna etichetta</option>
                                {photoStages.map((stage) => (
                                  <option key={stage} value={stage}>
                                    {photoStageLabels[stage]}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label>
                              Didascalia
                              <textarea
                                rows={2}
                                maxLength={400}
                                value={entry.caption ?? ""}
                                onChange={(e) =>
                                  editEntry({ caption: e.target.value })
                                }
                              />
                            </label>
                            <label>
                              Credito
                              <input
                                value={entry.credit}
                                maxLength={200}
                                onChange={(e) =>
                                  editEntry({ credit: e.target.value })
                                }
                              />
                            </label>
                          </>
                        )}
                      </>
                    )}
                    <div className="ve-order">
                      <button
                        type="button"
                        disabled={entryIndex === 0}
                        onClick={() => move(-1)}
                      >
                        <ArrowUp size={15} /> Prima
                      </button>
                      <button
                        type="button"
                        disabled={entryIndex === entries.length - 1}
                        onClick={() => move(1)}
                      >
                        <ArrowDown size={15} /> Dopo
                      </button>
                    </div>
                    {isProject && entryIndex > 0 && entry.image && (
                      <button
                        type="button"
                        onClick={() => {
                          setEntries([
                            entry,
                            ...entries.filter((item) => item.uid !== selected),
                          ]);
                          setDirty(true);
                        }}
                      >
                        Imposta come copertina
                      </button>
                    )}
                    <button
                      type="button"
                      className="ve-remove"
                      onClick={() => {
                        setEntries(entries.filter((i) => i.uid !== selected));
                        setDirty(true);
                        choose("intro");
                      }}
                    >
                      <Trash2 size={15} /> Rimuovi{" "}
                      {isProject ? "foto" : "blocco"}
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="ve-back"
                  onClick={() => canvas.current?.focus()}
                >
                  Torna alla composizione ↑
                </button>
              </aside>
            )}
          </div>
          <div className="ve-save">
            <span role="status">
              {dirty
                ? "Modifiche da salvare"
                : version
                  ? "Bozza salvata"
                  : "Nuova bozza"}
            </span>
            <button className="button" type="submit" data-admin-guide="save">
              <Check size={16} />
              {pending ? "Salvataggio…" : "Salva bozza"}
            </button>
          </div>
          {message && (
            <p className="admin-message" role="alert">
              {message}
            </p>
          )}
        </fieldset>
      </form>
      <fieldset disabled={dirty || pending} className="ve-publication">
        {children}
      </fieldset>
    </>
  );
}
