"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { login, logout, requireAdmin, assertOrigin } from "@/content/cms/auth";
import {
  mediaId,
  pageFields,
  pages,
  projectFields,
  slug,
} from "@/content/cms/schema";
import {
  changePublication,
  createSiteBackup,
  importDrafts,
  removeMedia,
  restoreRevision,
  restoreSiteBackup,
  saveDraft,
  storeMedia,
} from "@/content/cms/store";
import { visibleProjects } from "@/content/projects";
import previewImages from "@/content/preview-images.json";
import type { Medium } from "@/content/cms/store";

type Result = { message: string };
const integer = z.coerce.number().int().nonnegative();
const keyAndKind = z.object({
  kind: z.enum(["project", "page"]),
  key: slug,
  version: integer,
});
const field = (form: FormData, name: string) => String(form.get(name) ?? "");
const errorMessage = (error: unknown) =>
  error instanceof z.ZodError
    ? "Controlla i campi: " +
      error.issues
        .map((issue) => issue.path.join(".") || issue.message)
        .join(", ")
    : error instanceof Error &&
        /[àèòù]/.test(error.message) &&
        !("code" in error)
      ? error.message
      : "Operazione non riuscita.";

export async function signIn(_state: Result, form: FormData): Promise<Result> {
  try {
    if (!(await login(form.get("password"))))
      return {
        message:
          "Accesso non riuscito. Attendi alcuni minuti se hai eseguito più tentativi.",
      };
  } catch {
    return { message: "Accesso non disponibile." };
  }
  redirect("/admin");
}

export async function signOut() {
  await assertOrigin();
  await logout();
  redirect("/admin");
}

type PhotoResult = { item: Medium } | { message: string };

async function receivePhoto(
  form: FormData,
  historical: boolean,
): Promise<PhotoResult> {
  const credit = field(form, "credit").trim();
  if (credit.length < 2 || credit.length > 200)
    return { message: "Indica il credito della foto (da 2 a 200 caratteri)." };
  let name: string;
  let data: Buffer;
  if (historical) {
    const source = field(form, "name");
    if (
      process.env.NODE_ENV !== "development" ||
      process.env.LOBO_LOCAL_PREVIEW !== "1" ||
      !Object.hasOwn(previewImages, source)
    ) {
      return { message: "Questa foto di archivio non è disponibile." };
    }
    name = source + ".webp";
    data = await readFile(join(process.cwd(), ".local-media", name));
  } else {
    const file = form.get("file");
    if (!(file instanceof File) || !file.size || file.size > 8 * 1024 * 1024)
      return { message: "Seleziona un’immagine fino a 8 MB." };
    const input = sharp(Buffer.from(await file.arrayBuffer()), {
      limitInputPixels: 28_000_000,
      failOn: "error",
    });
    const meta = await input.metadata();
    if (
      !meta.format ||
      !["jpeg", "png", "webp", "avif", "heif"].includes(meta.format) ||
      (meta.pages ?? 1) > 1
    )
      return { message: "Carica una foto statica JPEG, PNG, WebP o AVIF." };
    name = file.name.slice(0, 160);
    data = await input
      .rotate()
      .resize({
        width: 1920,
        height: 1920,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 84 })
      .toBuffer();
  }
  return {
    item: {
      id: storeMedia(name, credit, data),
      name,
      credit,
      bytes: data.length,
    },
  };
}

export async function addProjectPhoto(form: FormData): Promise<PhotoResult> {
  await assertOrigin();
  await requireAdmin();
  try {
    return await receivePhoto(form, form.has("name"));
  } catch {
    return {
      message: "Impossibile leggere la foto. Verifica il file e riprova.",
    };
  }
}

export async function mutate(_state: Result, form: FormData): Promise<Result> {
  await assertOrigin();
  await requireAdmin();
  let destination = "/admin";
  try {
    const action = field(form, "action");
    if (action === "backup-create") {
      const label = z.string().trim().min(1).max(100).parse(form.get("label"));
      createSiteBackup(label);
      destination += "?tab=backup&done=backup-created";
    } else if (action === "backup-restore") {
      restoreSiteBackup(
        z.coerce.number().int().positive().parse(form.get("backupId")),
      );
      destination += "?tab=backup&done=backup-restored";
    } else if (action === "upload" || action === "seed-media") {
      const result = await receivePhoto(form, action === "seed-media");
      if ("message" in result) return result;
      destination += "?tab=media&done=1";
    } else if (action === "delete-image") {
      removeMedia(mediaId.parse(form.get("id")));
      destination += "?tab=media&done=1";
    } else if (action === "import") {
      const data = z
        .array(projectFields)
        .min(1)
        .max(1000)
        .parse(JSON.parse(field(form, "data")));
      const count = importDrafts(data);
      return {
        message: `Importazione completata. ${count} bozze create, ${data.length - count} slug già presenti ignorati.`,
      };
    } else if (action === "seed") {
      const data = visibleProjects(true).map((project) =>
        projectFields.parse({ ...project, gallery: [], featured: false }),
      );
      const count = importDrafts(data);
      return {
        message: `${count} schede storiche importate come bozze. Assegna i media con crediti prima della pubblicazione.`,
      };
    } else {
      const { kind, key, version } = keyAndKind.parse(Object.fromEntries(form));
      if (kind === "page" && !Object.hasOwn(pages, key))
        throw new Error("Pagina non riconosciuta.");
      if (action === "save") {
        const payload =
          kind === "project"
            ? projectFields.parse({
                slug: key,
                title: field(form, "title"),
                category: field(form, "category"),
                description: field(form, "description"),
                summary: field(form, "summary"),
                presentation: field(form, "presentation") || undefined,
                location: field(form, "location"),
                period: field(form, "period"),
                role: field(form, "role"),
                featured: form.has("featured"),
                gallery: form.getAll("image").flatMap((id, index) =>
                  id
                    ? [
                        {
                          id,
                          alt: form.getAll("alt")[index],
                          credit: form.getAll("credit")[index],
                          caption: form.getAll("caption")[index],
                          stage: form.getAll("stage")[index] || undefined,
                        },
                      ]
                    : [],
                ),
              })
            : pageFields.parse({
                title: field(form, "title"),
                intro: field(form, "intro"),
                subtitle: field(form, "subtitle"),
                cta: field(form, "cta"),
                layout: field(form, "layout"),
                mode: field(form, "mode"),
                email: field(form, "email"),
                phone: field(form, "phone"),
                address: field(form, "address"),
                servicePhotos:
                  key === "servizi" && form.has("servicePhotos")
                    ? JSON.parse(field(form, "servicePhotos"))
                    : undefined,
                featuredOrder:
                  key === "home" ? form.getAll("featuredOrder") : [],
                showcaseOrder:
                  key === "home" && form.has("showcaseOrder")
                    ? JSON.parse(field(form, "showcaseOrder"))
                    : undefined,
                blocks: form.getAll("blockTitle").flatMap((title, index) => {
                  const text = form.getAll("blockText")[index];
                  const image = form.getAll("image")[index];
                  return title || text || image
                    ? [{ title, text, image, alt: form.getAll("alt")[index] }]
                    : [];
                }),
              });
        saveDraft(kind, key, payload, version);
      } else if (action === "restore") {
        restoreRevision(
          kind,
          key,
          version,
          integer.parse(form.get("revision")),
        );
      } else {
        changePublication(
          kind,
          key,
          version,
          z.enum(["publish", "unpublish", "archive", "recover"]).parse(action),
        );
      }
      destination += "?tab=" + kind + "&key=" + key + "&done=1";
    }
  } catch (error) {
    return { message: errorMessage(error) };
  }
  redirect(destination);
}
