"use client";

import { useRef, useState } from "react";
import { ImagePlus, Search, X } from "lucide-react";
import { ProjectImage } from "@/components/project-image";
import type { Medium } from "@/content/cms/store";

export type Choice = Pick<Medium, "id" | "name" | "credit">;

export function HistoricalPicker({ names }: { names: string[] }) {
  const [id, setId] = useState(names[0] ?? "");
  return (
    <>
      <input type="hidden" name="name" value={id} />
      {id && (
        <div className="ve-historic-photo ve-picture">
          <ProjectImage
            key={id}
            src={"/anteprima-media/" + id}
            alt={id}
            sizes="220px"
          />
        </div>
      )}
      <MediaPicker
        media={names.map((name) => ({ id: name, name, credit: "" }))}
        selected={id}
        pick={(item) => setId(item?.id ?? "")}
        historical
      />
    </>
  );
}

export function MediaPicker({
  media,
  selected,
  pick,
  historical = false,
  label,
  disabled = false,
}: {
  media: Choice[];
  selected: string;
  pick: (item?: Choice) => void;
  historical?: boolean;
  label?: string;
  disabled?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(36);
  const matches = media.filter((item) =>
    item.name
      .toLocaleLowerCase("it")
      .includes(query.trim().toLocaleLowerCase("it")),
  );
  const selectedFile = media.find((item) => item.id === selected);
  function choose(item?: Choice) {
    pick(item);
    dialog.current?.close();
  }
  return (
    <>
      <button
        type="button"
        disabled={disabled}
        className="ve-media-button"
        onClick={() => dialog.current?.showModal()}
      >
        <ImagePlus size={18} />
        {label ?? (selectedFile ? "Cambia immagine" : "Scegli immagine")}
      </button>
      {selectedFile && <small>{selectedFile.name}</small>}
      <dialog
        ref={dialog}
        className="ve-library"
        aria-label="Scegli dalla libreria"
      >
        <div className="ve-library-inner">
          <header>
            <h3>Scegli dalla libreria</h3>
            <button
              type="button"
              aria-label="Chiudi libreria"
              onClick={() => dialog.current?.close()}
            >
              <X size={18} />
            </button>
          </header>
          <label>
            <span>
              <Search size={15} /> Cerca per nome
            </span>
            <input
              type="search"
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setLimit(36);
              }}
            />
          </label>
          {matches.length ? (
            <div className="ve-media-grid">
              {matches.slice(0, limit).map((item) => (
                <button
                  type="button"
                  key={item.id}
                  aria-pressed={item.id === selected}
                  onClick={() => choose(item)}
                >
                  <span className="ve-picture">
                    <ProjectImage
                      src={
                        (historical ? "/anteprima-media/" : "/media/cms/") +
                        item.id
                      }
                      alt=""
                      sizes="140px"
                    />
                  </span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <p>
              {media.length
                ? "Nessuna immagine corrisponde alla ricerca."
                : "La libreria è vuota. Salva la bozza e carica una foto nella Libreria media."}
            </p>
          )}
          {matches.length > limit && (
            <button type="button" onClick={() => setLimit(limit + 36)}>
              Mostra altre immagini
            </button>
          )}
          {selected && !historical && (
            <button type="button" onClick={() => choose()}>
              Togli l’immagine
            </button>
          )}
        </div>
      </dialog>
    </>
  );
}
