import { z } from "zod";
import { historicalEntries, projectEntries } from "./entries";
import { projectLayouts, photoStages } from "./presentation";

export const categories = [
  {
    slug: "nuove-costruzioni",
    label: "Nuove costruzioni",
    intro:
      "Edifici e spazi di nuova realizzazione, in relazione al luogo che li accoglie.",
  },
  {
    slug: "ristrutturazioni",
    label: "Ristrutturazioni e recupero",
    intro:
      "Trasformazioni del costruito, dagli interni agli interventi sull’intero edificio.",
  },
  {
    slug: "strutture",
    label: "Strutture e adeguamenti sismici",
    intro:
      "Progettazione strutturale, consolidamento e interventi per le costruzioni in zona sismica.",
  },
  {
    slug: "piani-urbanistici",
    label: "Piani urbanistici",
    intro: "Progetti alla scala del quartiere e del territorio.",
  },
] as const;

const mediaSchema = z.object({
  file: z
    .string()
    .regex(/^(?:[a-z0-9-]+|\/media\/[a-z0-9/-]+\.(?:webp|jpg|avif))$/),
  alt: z.string().min(8),
  credit: z.string().optional(),
  caption: z.string().optional(),
  stage: z.enum(photoStages).optional(),
});
const projectSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(3),
    category: z.enum(categories.map(({ slug }) => slug)),
    description: z.string().min(20),
    summary: z.string().optional(),
    presentation: z.enum(projectLayouts).default("essenziale"),
    gallery: z.array(mediaSchema),
    featured: z.boolean(),
    status: z.enum(["draft", "review", "published"]),
    role: z.string().optional(),
    year: z.number().int().optional(),
    period: z.string().optional(),
    location: z.string().optional(),
    sources: z.array(z.string()).optional(),
  })
  .refine(
    (project) => !project.featured || project.gallery.length > 0,
    "I progetti in evidenza richiedono una copertina.",
  )
  .refine(
    (project) =>
      project.status !== "published" ||
      project.gallery.every(
        (media) => media.file.startsWith("/media/") && media.credit,
      ),
    "Le schede pubblicate richiedono file web e crediti.",
  );

export type Project = z.infer<typeof projectSchema>;
export type ProjectMedia = z.infer<typeof mediaSchema>;

export const clientPreview = process.env.LOBO_CLIENT_PREVIEW === "1";
export const localPreview =
  clientPreview ||
  (process.env.NODE_ENV === "development" &&
    process.env.LOBO_LOCAL_PREVIEW === "1");
const atlas = z
  .array(projectSchema)
  .refine(
    (projects) =>
      new Set(projects.map((project) => project.slug)).size === projects.length,
    "Slug duplicati",
  )
  .parse([...projectEntries, ...historicalEntries]);

export function visibleProjects(preview: boolean) {
  return atlas.filter(
    (project) =>
      project.status === "published" ||
      (preview && project.status === "review"),
  );
}

export function searchProjects(projects: Project[], query: string) {
  const normalize = (input: string) =>
    input
      .normalize("NFD")
      .replace(/\p{Mark}/gu, "")
      .toLocaleLowerCase("it");
  const terms = normalize(query.trim()).split(/\s+/).filter(Boolean);
  return projects.filter((project) => {
    const category = categories.find((item) => item.slug === project.category);
    const haystack = normalize(
      [
        project.title,
        project.summary,
        project.description,
        project.location,
        project.period,
        project.role,
        category?.label,
      ].join(" "),
    );
    return terms.every((term) => haystack.includes(term));
  });
}

export function mediaUrl(file: string) {
  return file.startsWith("/") ? file : "/anteprima-media/" + file;
}
