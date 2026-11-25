import { connection } from "next/server";
import { cache } from "react";
import { visibleProjects, type Project } from "../projects";
import { database, type Document } from "./store";
import { pageFields, projectFields, type PageKey } from "./schema";

export const cmsImage = (id: string) => "/media/cms/" + id;

export const pageContent = cache(async (key: PageKey) => {
  await connection();
  const row = database()
    ?.prepare(
      "SELECT published FROM documents WHERE kind='page' AND key=? AND archived=0",
    )
    .get(key);
  return typeof row?.published === "string"
    ? pageFields.parse(JSON.parse(row.published))
    : undefined;
});

export const publicProjects = cache(
  async (preview: boolean): Promise<Project[]> => {
    await connection();
    const rows = (database()
      ?.prepare(
        `
    SELECT key,published,archived,EXISTS(SELECT 1 FROM revisions WHERE kind='project' AND revisions.key=documents.key) AS retired
    FROM documents WHERE kind='project'
  `,
      )
      .all() ?? []) as (Pick<Document, "key" | "published" | "archived"> & {
      retired: number;
    })[];
    const projects = rows.flatMap((row) => {
      if (!row.published) return [];
      const value = projectFields.parse(JSON.parse(row.published));
      return [
        {
          ...value,
          status: "published" as const,
          gallery: value.gallery.map(({ id, ...photo }) => ({
            ...photo,
            file: cmsImage(id),
          })),
        },
      ];
    });
    const managed = new Set(
      rows
        .filter((row) => row.published || row.archived || row.retired)
        .map((row) => row.key),
    );
    return [
      ...projects,
      ...visibleProjects(preview).filter((item) => !managed.has(item.slug)),
    ];
  },
);
