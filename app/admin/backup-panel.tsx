"use client";

import { useEffect, useRef, useState } from "react";
import type { SiteBackup } from "@/content/cms/store";
import { AdminForm } from "./form";

const dateFormat = new Intl.DateTimeFormat("it-IT", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Rome",
});
const backupTypes = {
  manual: "Copia manuale",
  publication: "Copia automatica",
  restore: "Salvataggio prima del ripristino",
};

function date(created: string) {
  return new Date(created.replace(" ", "T") + "Z");
}

export function BackupPanel({ backups }: { backups: SiteBackup[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<SiteBackup>();
  useEffect(() => {
    if (selected) dialog.current?.showModal();
  }, [selected]);
  return (
    <section
      className="admin-panel admin-backups"
      aria-labelledby="backups-heading"
    >
      <h2 id="backups-heading">Backup del sito</h2>
      <p>
        Crea una copia quando hai uno stato da conservare. Le copie includono
        pagine, progetti, bozze, cronologia e immagini associate.
      </p>
      <AdminForm>
        <label data-admin-guide="backup">
          Nome della copia
          <input
            name="label"
            required
            maxLength={100}
            placeholder="Es. Portfolio approvato"
          />
        </label>
        <button className="button" name="action" value="backup-create">
          Crea copia di ripristino
        </button>
      </AdminForm>
      <h3>Copie disponibili</h3>
      {backups.length ? (
        <ul className="admin-backup-list">
          {backups.map((backup) => (
            <li key={backup.id}>
              <div>
                <strong>{backup.label}</strong>
                <p className="admin-backup-meta">
                  {backupTypes[backup.kind]} ·{" "}
                  <time dateTime={date(backup.created).toISOString()}>
                    {dateFormat.format(date(backup.created))}
                  </time>
                </p>
              </div>
              <button
                type="button"
                aria-label={"Ripristina · " + backup.label}
                onClick={() => setSelected(backup)}
              >
                Ripristina
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="admin-media-hint">
          Qui appariranno le copie manuali e quelle salvate prima delle
          pubblicazioni.
        </p>
      )}
      <dialog
        ref={dialog}
        className="admin-dialog"
        aria-labelledby="restore-heading"
        onClose={() => setSelected(undefined)}
      >
        <div className="admin-dialog-inner">
          <h2 id="restore-heading">Ripristinare questa copia?</h2>
          {selected && (
            <>
              <p>
                <strong>{selected.label}</strong> ·{" "}
                {dateFormat.format(date(selected.created))}
              </p>
              <p>
                Il sito pubblicato e le bozze torneranno a questa versione.
                Prima di procedere verrà salvata una copia dello stato attuale.
              </p>
              <AdminForm key={selected.id}>
                <input type="hidden" name="backupId" value={selected.id} />
                <div className="admin-actions admin-guide-controls">
                  <button
                    type="button"
                    autoFocus
                    onClick={() => dialog.current?.close()}
                  >
                    Annulla
                  </button>
                  <button
                    className="button"
                    name="action"
                    value="backup-restore"
                  >
                    Conferma ripristino
                  </button>
                </div>
              </AdminForm>
            </>
          )}
        </div>
      </dialog>
    </section>
  );
}
