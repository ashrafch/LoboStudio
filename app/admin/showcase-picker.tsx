"use client";

import { useState } from "react";
import { showcaseLimit } from "@/content/projects/showcase";
import { ProjectOrderList, type FeaturedProject } from "./featured-order";

export function ShowcasePicker({
  selection,
  catalogue,
  custom,
  change,
}: {
  selection: readonly string[];
  catalogue: ReadonlyMap<string, FeaturedProject>;
  custom: boolean;
  change: (next: string[] | undefined) => void;
}) {
  const [candidate, setCandidate] = useState("");
  const items = selection.map(
    (slug) => catalogue.get(slug) ?? { slug, title: slug },
  );
  const available = [...catalogue.values()].filter(
    (project) => !selection.includes(project.slug),
  );
  const canAdd = available.length > 0 && selection.length < showcaseLimit;
  const selectedCandidate = available.find(({ slug }) => slug === candidate);

  return (
    <div className="ve-showcase-picker">
      <p>
        Scegli fino a {showcaseLimit} progetti nell’ordine in cui devono
        apparire. Testi e foto vengono dalle schede progetto.
      </p>
      {items.length > 0 && (
        <ProjectOrderList
          projects={items}
          move={(index, offset) => {
            const next = [...selection];
            const other = index + offset;
            [next[index], next[other]] = [next[other], next[index]];
            change(next);
          }}
          remove={(slug) => change(selection.filter((item) => item !== slug))}
        />
      )}
      {canAdd ? (
        <>
          <label>
            Progetto da aggiungere
            <select
              value={selectedCandidate?.slug ?? ""}
              onChange={(event) => setCandidate(event.target.value)}
            >
              <option value="">Scegli un progetto</option>
              {available.map(({ slug, title }) => (
                <option key={slug} value={slug}>
                  {title}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            disabled={!selectedCandidate}
            onClick={() => {
              if (!selectedCandidate) return;
              change([...selection, selectedCandidate.slug]);
              setCandidate("");
            }}
          >
            Aggiungi alla sezione
          </button>
        </>
      ) : (
        catalogue.size === 0 && (
          <p>
            Pubblica un progetto con almeno una foto per poterlo aggiungere.
          </p>
        )
      )}
      <div className="admin-actions">
        {selection.length > 0 && (
          <button type="button" onClick={() => change([])}>
            Nascondi sezione
          </button>
        )}
        {custom && (
          <button type="button" onClick={() => change(undefined)}>
            Ripristina selezione iniziale
          </button>
        )}
      </div>
    </div>
  );
}
