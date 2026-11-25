import { DatabaseSync } from "node:sqlite";
import { dirname } from "node:path";
import { mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { gzipSync, gunzipSync } from "node:zlib";
import {
  mediaId,
  pageFields,
  projectFields,
  type PageDraft,
  type ProjectDraft,
} from "./schema";

type Kind = "project" | "page";
export type Document = {
  kind: Kind;
  key: string;
  draft: string;
  published: string | null;
  version: number;
  archived: number;
  updated: string;
};
export type Medium = {
  id: string;
  name: string;
  credit: string;
  bytes: number;
};
type Revision = { id: number; payload: string; created: string };
type Payload = ProjectDraft | PageDraft;
type StoredRevision = Revision & Pick<Document, "kind" | "key">;
type Snapshot = { documents: Document[]; revisions: StoredRevision[] };
type BackupKind = "manual" | "publication" | "restore";
export type SiteBackup = {
  id: number;
  label: string;
  kind: BackupKind;
  created: string;
};

let instance: DatabaseSync | undefined;

export function database() {
  const path = process.env.CMS_DB_PATH;
  if (!path) return;
  if (instance) return instance;
  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(`
    PRAGMA busy_timeout=5000;
    PRAGMA journal_mode=WAL;
    PRAGMA foreign_keys=ON;
    CREATE TABLE IF NOT EXISTS documents (
      kind TEXT NOT NULL, key TEXT NOT NULL, draft TEXT NOT NULL, published TEXT,
      version INTEGER NOT NULL DEFAULT 1, archived INTEGER NOT NULL DEFAULT 0,
      updated TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(kind,key)
    );
    CREATE TABLE IF NOT EXISTS revisions (
      id INTEGER PRIMARY KEY, kind TEXT NOT NULL, key TEXT NOT NULL, payload TEXT NOT NULL,
      created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS revisions_document ON revisions(kind,key,id);
    CREATE TABLE IF NOT EXISTS media (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, credit TEXT NOT NULL, bytes INTEGER NOT NULL, data BLOB NOT NULL
    );
    CREATE TABLE IF NOT EXISTS live_media (
      kind TEXT NOT NULL, key TEXT NOT NULL, media_id TEXT NOT NULL REFERENCES media(id),
      PRIMARY KEY(kind,key,media_id)
    );
    CREATE INDEX IF NOT EXISTS live_media_id ON live_media(media_id);
    CREATE TABLE IF NOT EXISTS sessions (hash TEXT PRIMARY KEY, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS login_limits (id INTEGER PRIMARY KEY CHECK(id=1), attempts INTEGER NOT NULL, reset_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS site_backups (
      id INTEGER PRIMARY KEY, label TEXT NOT NULL, kind TEXT NOT NULL,
      payload BLOB NOT NULL, created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS backup_media (
      backup_id INTEGER NOT NULL REFERENCES site_backups(id) ON DELETE CASCADE,
      media_id TEXT NOT NULL REFERENCES media(id),
      PRIMARY KEY(backup_id,media_id)
    );
    CREATE INDEX IF NOT EXISTS backup_media_id ON backup_media(media_id);
    CREATE TABLE IF NOT EXISTS version_floor (
      id INTEGER PRIMARY KEY CHECK(id=1), version INTEGER NOT NULL
    );
    INSERT OR IGNORE INTO version_floor VALUES(1,1);
  `);
  instance = db;
  return db;
}

export function activeDatabase() {
  const db = database();
  if (!db) throw new Error("Archivio non configurato");
  return db;
}

export function transaction<T>(work: (db: DatabaseSync) => T) {
  const db = activeDatabase();
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = work(db);
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function documents(kind: Kind) {
  return activeDatabase()
    .prepare("SELECT * FROM documents WHERE kind=? ORDER BY updated DESC, key")
    .all(kind) as unknown as Document[];
}

export function document(kind: Kind, key: string) {
  return activeDatabase()
    .prepare("SELECT * FROM documents WHERE kind=? AND key=?")
    .get(kind, key) as Document | undefined;
}

export function revisions(kind: Kind, key: string) {
  return activeDatabase()
    .prepare(
      "SELECT id,payload,created FROM revisions WHERE kind=? AND key=? ORDER BY id DESC LIMIT 30",
    )
    .all(kind, key) as unknown as Revision[];
}

function imageIds(payload: Payload) {
  return [
    ...new Set(
      "gallery" in payload
        ? payload.gallery.map((item) => item.id)
        : [
            ...payload.blocks.flatMap((item) => item.image || []),
            ...Object.values(payload.servicePhotos ?? {}).flatMap((item) =>
              item ? [item.image] : [],
            ),
          ],
    ),
  ];
}

function checkMedia(db: DatabaseSync, payload: Payload) {
  const exists = db.prepare("SELECT id FROM media WHERE id=?");
  if (imageIds(payload).some((id) => !exists.get(id)))
    throw new Error("Una delle immagini selezionate non esiste.");
}

function documentPayload(kind: Kind, json: string) {
  return (kind === "project" ? projectFields : pageFields).parse(
    JSON.parse(json),
  );
}

function saveSnapshot(db: DatabaseSync, label: string, kind: BackupKind) {
  const snapshot: Snapshot = {
    documents: db
      .prepare("SELECT * FROM documents")
      .all() as unknown as Document[],
    revisions: db
      .prepare("SELECT * FROM revisions")
      .all() as unknown as StoredRevision[],
  };
  const media = new Set<string>();
  function include(kind: Kind, json: string) {
    for (const id of imageIds(documentPayload(kind, json))) media.add(id);
  }
  for (const row of snapshot.documents) {
    include(row.kind, row.draft);
    if (row.published) include(row.kind, row.published);
  }
  for (const row of snapshot.revisions) include(row.kind, row.payload);

  const { lastInsertRowid } = db
    .prepare("INSERT INTO site_backups(label,kind,payload) VALUES(?,?,?)")
    .run(label, kind, gzipSync(JSON.stringify(snapshot)));
  const pin = db.prepare(
    "INSERT INTO backup_media(backup_id,media_id) VALUES(?,?)",
  );
  for (const id of media) pin.run(lastInsertRowid, id);
}

export function createSiteBackup(label: string) {
  transaction((db) => saveSnapshot(db, label, "manual"));
}

export function siteBackups() {
  const rows = activeDatabase()
    .prepare("SELECT id,label,kind,created FROM site_backups ORDER BY id DESC")
    .all() as unknown as SiteBackup[];
  return rows.map((backup) => ({ ...backup }));
}

export function restoreSiteBackup(id: number) {
  transaction((db) => {
    const target = db
      .prepare("SELECT label,payload FROM site_backups WHERE id=?")
      .get(id) as { label: string; payload: Uint8Array } | undefined;
    if (!target)
      throw new Error("Questa copia di ripristino non è disponibile.");
    const snapshot: Snapshot = JSON.parse(
      gunzipSync(target.payload).toString("utf8"),
    );
    saveSnapshot(db, "Prima di ripristinare · " + target.label, "restore");

    // Old editor tabs must not save over restored data, including newly recreated rows.
    const { version } = db
      .prepare(
        `
      SELECT MAX((SELECT version FROM version_floor WHERE id=1),
                 COALESCE((SELECT MAX(version) FROM documents), 0)) + 1 AS version
    `,
      )
      .get() as { version: number };
    db.prepare("UPDATE version_floor SET version=? WHERE id=1").run(version);
    db.exec(
      "DELETE FROM live_media; DELETE FROM revisions; DELETE FROM documents;",
    );

    const insert = db.prepare(
      "INSERT INTO documents(kind,key,draft,published,version,archived) VALUES(?,?,?,?,?,?)",
    );
    const publishImage = db.prepare("INSERT INTO live_media VALUES(?,?,?)");
    for (const row of snapshot.documents) {
      insert.run(
        row.kind,
        row.key,
        row.draft,
        row.published,
        version,
        row.archived,
      );
      if (row.published && !row.archived) {
        const payload = documentPayload(row.kind, row.published);
        for (const media of imageIds(payload))
          publishImage.run(row.kind, row.key, media);
      }
    }
    const insertRevision = db.prepare(
      "INSERT INTO revisions(id,kind,key,payload,created) VALUES(?,?,?,?,?)",
    );
    for (const revision of snapshot.revisions) {
      insertRevision.run(
        revision.id,
        revision.kind,
        revision.key,
        revision.payload,
        revision.created,
      );
    }
  });
}

export function importDrafts(projects: ProjectDraft[]) {
  return transaction((db) => {
    const insert = db.prepare(
      "INSERT INTO documents(kind,key,draft,version) VALUES('project',?,?,(SELECT version FROM version_floor WHERE id=1)) ON CONFLICT DO NOTHING",
    );
    let count = 0;
    for (const project of projects) {
      checkMedia(db, project);
      count += Number(
        insert.run(project.slug, JSON.stringify(project)).changes,
      );
    }
    return count;
  });
}

export function saveDraft(
  kind: Kind,
  key: string,
  payload: Payload,
  version: number,
) {
  transaction((db) => {
    checkMedia(db, payload);
    const json = JSON.stringify(payload);
    const result =
      version === 0
        ? db
            .prepare(
              "INSERT INTO documents(kind,key,draft,version) VALUES(?,?,?,(SELECT version FROM version_floor WHERE id=1)) ON CONFLICT DO NOTHING",
            )
            .run(kind, key, json)
        : db
            .prepare(
              "UPDATE documents SET draft=?,version=version+1,updated=CURRENT_TIMESTAMP WHERE kind=? AND key=? AND version=? AND archived=0",
            )
            .run(json, kind, key, version);
    if (!result.changes)
      throw new Error("La scheda è cambiata. Riaprila prima di salvare.");
  });
}

export function changePublication(
  kind: Kind,
  key: string,
  version: number,
  action: "publish" | "unpublish" | "archive" | "recover",
) {
  transaction((db) => {
    const row = document(kind, key);
    if (
      !row ||
      row.version !== version ||
      (row.archived && action !== "recover")
    ) {
      throw new Error("La scheda è cambiata. Riaprila prima di procedere.");
    }
    let published: string | null = null;
    let ids: string[] = [];
    if (action === "publish") {
      const payload = documentPayload(kind, row.draft);
      checkMedia(db, payload);
      ids = imageIds(payload);
      published = row.draft;
    }
    if (
      published !== row.published ||
      action === "archive" ||
      action === "recover"
    ) {
      const labels = {
        publish: "Prima di pubblicare",
        unpublish: "Prima di ritirare",
        archive: "Prima di spostare nel cestino",
        recover: "Prima di recuperare dal cestino",
      };
      saveSnapshot(db, labels[action] + " · " + key, "publication");
    }
    if (row.published)
      db.prepare("INSERT INTO revisions(kind,key,payload) VALUES(?,?,?)").run(
        kind,
        key,
        row.published,
      );
    db.prepare("DELETE FROM live_media WHERE kind=? AND key=?").run(kind, key);
    for (const id of ids)
      db.prepare("INSERT INTO live_media VALUES(?,?,?)").run(kind, key, id);
    db.prepare(
      "UPDATE documents SET published=?,archived=?,version=version+1,updated=CURRENT_TIMESTAMP WHERE kind=? AND key=?",
    ).run(published, action === "archive" ? 1 : 0, kind, key);
  });
}

export function restoreRevision(
  kind: Kind,
  key: string,
  version: number,
  id: number,
) {
  const record = activeDatabase()
    .prepare("SELECT payload FROM revisions WHERE kind=? AND key=? AND id=?")
    .get(kind, key, id);
  if (!record) throw new Error("Versione assente.");
  const payload = documentPayload(kind, String(record.payload));
  saveDraft(kind, key, payload, version);
}

export function mediaLibrary() {
  const rows = activeDatabase()
    .prepare("SELECT id,name,credit,bytes FROM media ORDER BY rowid DESC")
    .all() as unknown as Medium[];
  return rows.map(({ id, name, credit, bytes }) => ({
    id,
    name,
    credit,
    bytes,
  }));
}

export function storeMedia(name: string, credit: string, bytes: Buffer) {
  const id = randomUUID();
  activeDatabase()
    .prepare("INSERT INTO media VALUES(?,?,?,?,?)")
    .run(id, name, credit, bytes.length, bytes);
  return id;
}

export function removeMedia(id: string) {
  transaction((db) => {
    const used = db
      .prepare(
        `
      SELECT 1 FROM documents WHERE instr(draft,?)>0 OR instr(published,?)>0
      UNION ALL SELECT 1 FROM revisions WHERE instr(payload,?)>0
      UNION ALL SELECT 1 FROM backup_media WHERE media_id=?
      LIMIT 1
    `,
      )
      .get(id, id, id, id);
    if (used)
      throw new Error(
        "L’immagine è usata in una scheda, nella cronologia o in una copia di ripristino.",
      );
    db.prepare("DELETE FROM media WHERE id=?").run(id);
  });
}

export function getMedia(id: string, includePrivate: boolean) {
  if (!mediaId.safeParse(id).success) return;
  return database()
    ?.prepare(
      `
    SELECT data,bytes FROM media WHERE id=? AND (?=1 OR EXISTS (SELECT 1 FROM live_media WHERE media_id=media.id))
  `,
    )
    .get(id, includePrivate ? 1 : 0) as
    { data: Uint8Array; bytes: number } | undefined;
}
