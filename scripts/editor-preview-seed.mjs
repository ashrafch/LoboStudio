import { closeSync, openSync, rmSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";

const [destination] = process.argv.slice(2);
if (!process.env.CMS_DB_PATH || !destination) {
  throw new Error("Indica il database sorgente e un nuovo percorso per la copia.");
}

const source = new DatabaseSync(process.env.CMS_DB_PATH, { readOnly: true });
closeSync(openSync(destination, "wx", 0o600));
const target = new DatabaseSync(destination);
let complete = false;
try {
  source.exec("BEGIN");
  target.exec("BEGIN");
  const table = source.prepare(
    "SELECT sql FROM sqlite_schema WHERE name=? AND type='table'",
  );
  for (const name of ["documents", "media", "live_media"]) {
    target.exec(table.get(name).sql);
  }

  const insertDocument = target.prepare(
    "INSERT INTO documents(kind,key,draft,published) VALUES(?,?,?,?)",
  );
  const insertMedia = target.prepare("INSERT INTO media VALUES(?,?,?,?,?)");
  const insertReference = target.prepare("INSERT INTO live_media VALUES(?,?,?)");
  for (const { kind, key, published: payload } of source.prepare(
    "SELECT kind,key,published FROM documents WHERE published IS NOT NULL AND archived=0",
  ).iterate()) {
    insertDocument.run(kind, key, payload, payload);
  }
  const references = `SELECT live_media.* FROM live_media JOIN documents USING(kind,key)
    WHERE documents.published IS NOT NULL AND documents.archived=0`;
  for (const media of source.prepare(
    `SELECT * FROM media WHERE id IN (SELECT media_id FROM (${references}))`,
  ).iterate()) {
    insertMedia.run(media.id, media.name, media.credit, media.bytes, media.data);
  }
  for (const link of source.prepare(references).iterate()) {
    insertReference.run(link.kind, link.key, link.media_id);
  }
  target.exec("COMMIT");
  if (
    target.prepare("PRAGMA integrity_check").get()?.integrity_check !== "ok" ||
    target.prepare("PRAGMA foreign_key_check").get()
  ) {
    throw new Error("La copia del CMS non ha superato i controlli di integrità.");
  }
  complete = true;
} finally {
  target.close();
  source.close();
  if (!complete) rmSync(destination);
}
