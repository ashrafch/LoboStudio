"use client";

import { useRef, useState } from "react";
import { Images, Upload } from "lucide-react";
import { ProjectImage } from "@/components/project-image";
import { addProjectPhoto } from "./actions";
import { MediaPicker, type Choice } from "./media-picker";
import type { PhotoStage } from "@/content/projects/presentation";

export type PhotoDetails = {
  alt: string;
  caption?: string;
  stage?: PhotoStage;
};
export type HistoricalPhoto = PhotoDetails & { file: string };
type Photo = { uid: string; image: string; alt: string };

export function ProjectPhotos({
  entries,
  library,
  historical,
  select,
  append,
}: {
  entries: Photo[];
  library: Choice[];
  historical: HistoricalPhoto[];
  select: (uid: string) => void;
  append: (item: Choice, details: PhotoDetails) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState<HistoricalPhoto>();
  const [file, setFile] = useState<File>();
  const [alt, setAlt] = useState("");
  const [credit, setCredit] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const full = entries.length >= 36;
  const count = entries.filter((entry) => entry.image).length;

  function open(photo?: HistoricalPhoto) {
    setSource(photo);
    setFile(undefined);
    if (fileInput.current) fileInput.current.value = "";
    setAlt(photo?.alt ?? "");
    setCredit("");
    setError("");
    dialog.current?.showModal();
  }

  async function submit() {
    if (busy || full) return;
    const form = new FormData();
    if (source) form.set("name", source.file);
    else if (file && file.size && file.size <= 8 * 1024 * 1024)
      form.set("file", file);
    else {
      setError("Scegli una foto fino a 8 MB.");
      return;
    }
    if (alt.trim().length < 5 || credit.trim().length < 2) {
      setError(
        "Inserisci una descrizione di almeno 5 caratteri e il credito della foto.",
      );
      return;
    }
    form.set("credit", credit);
    setBusy(true);
    try {
      const result = await addProjectPhoto(form);
      if ("message" in result) {
        setError(result.message);
        return;
      }
      dialog.current?.close();
      append(result.item, {
        alt: alt.trim(),
        caption: source?.caption,
        stage: source?.stage,
      });
    } catch {
      setError("Caricamento interrotto. Riprova dalla scheda aperta.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="project-photos" aria-labelledby="project-photos-title">
      <header>
        <h3 id="project-photos-title">
          <Images size={20} /> Foto del progetto
        </h3>
        <span>{count} foto in bozza</span>
      </header>
      {count === 0 && (
        <p>La prima foto della galleria sarà la copertina del progetto.</p>
      )}
      <div className="admin-actions">
        <button type="button" disabled={full} onClick={() => open()}>
          <Upload size={16} /> Carica dal computer
        </button>
        <MediaPicker
          media={library}
          selected=""
          label="Scegli dalla libreria"
          disabled={full}
          pick={(item) => {
            if (item) append(item, { alt: "" });
          }}
        />
      </div>
      {count > 0 && (
        <div className="project-photo-grid">
          {entries.map(
            (entry, i) =>
              entry.image && (
                <button
                  key={entry.uid}
                  type="button"
                  onClick={() => select(entry.uid)}
                  aria-label={"Gestisci foto " + (i + 1)}
                >
                  <span className="ve-picture">
                    <ProjectImage
                      src={"/media/cms/" + entry.image}
                      alt={entry.alt}
                      sizes="130px"
                    />
                  </span>
                  <span>{i === 0 ? "Copertina" : "Foto " + (i + 1)}</span>
                </button>
              ),
          )}
        </div>
      )}
      {historical.length > 0 && (
        <div className="project-photo-archive">
          <h4>Foto del vecchio portfolio</h4>
          <p>
            Seleziona una foto per aggiungerla alla bozza con il suo credito.
          </p>
          <div className="project-photo-grid">
            {historical.map((photo) => (
              <button
                type="button"
                key={photo.file}
                disabled={full}
                onClick={() => open(photo)}
              >
                <span className="ve-picture">
                  <ProjectImage
                    src={"/anteprima-media/" + photo.file}
                    alt=""
                    sizes="130px"
                  />
                </span>
                <span>{photo.alt}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {full && <p>La galleria ha raggiunto il limite di 36 immagini.</p>}
      <dialog
        ref={dialog}
        className="ve-library"
        aria-label="Aggiungi foto al progetto"
        onCancel={(e) => {
          if (busy) e.preventDefault();
        }}
      >
        <div
          className="ve-library-inner"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
              e.preventDefault();
              void submit();
            }
          }}
        >
          <h3>
            {source ? "Usa foto del vecchio portfolio" : "Carica una foto"}
          </h3>
          {source ? (
            <span className="ve-historic-photo ve-picture">
              <ProjectImage
                key={source.file}
                src={"/anteprima-media/" + source.file}
                alt={source.alt}
                sizes="220px"
              />
            </span>
          ) : (
            <label>
              File immagine (massimo 8 MB)
              <input
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                disabled={busy}
                onChange={(e) => setFile(e.target.files?.[0])}
              />
            </label>
          )}
          <label>
            Descrizione della foto
            <input
              maxLength={250}
              value={alt}
              disabled={busy}
              onChange={(e) => setAlt(e.target.value)}
            />
          </label>
          <label>
            Credito della foto
            <input
              maxLength={200}
              value={credit}
              disabled={busy}
              onChange={(e) => setCredit(e.target.value)}
            />
          </label>
          {error && <p role="alert">{error}</p>}
          <div className="admin-actions">
            <button type="button" disabled={busy} onClick={() => void submit()}>
              {busy ? "Caricamento…" : "Aggiungi alla galleria"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => dialog.current?.close()}
            >
              Annulla
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}
