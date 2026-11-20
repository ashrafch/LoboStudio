import { z } from "zod";

export const categories = [
  {
    slug: "nuove-costruzioni",
    label: "Nuove costruzioni",
    intro:
      "Edifici e spazi di nuova realizzazione, in relazione al luogo che li accoglie.",
  },
  {
    slug: "ristrutturazioni",
    label: "Ristrutturazioni",
    intro:
      "Trasformazioni del costruito, dagli interni agli interventi sull’intero edificio.",
  },
  {
    slug: "strutture",
    label: "Strutture",
    intro: "Progettazione strutturale e interventi sul patrimonio esistente.",
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
});
const projectSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(3),
    category: z.enum(categories.map(({ slug }) => slug)),
    description: z.string().min(20),
    gallery: z.array(mediaSchema).min(1),
    featured: z.boolean(),
    status: z.enum(["draft", "review", "published"]),
    role: z.string().optional(),
    year: z.number().int().optional(),
    location: z.string().optional(),
  })
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

export const localPreview =
  process.env.NODE_ENV === "development" &&
  process.env.LOBO_LOCAL_PREVIEW === "1";
const atlas = z
  .array(projectSchema)
  .refine(
    (projects) =>
      new Set(projects.map((project) => project.slug)).size === projects.length,
    "Slug duplicati",
  )
  .parse([
    {
      slug: "residenza-con-giardino",
      title: "Residenza con giardino",
      category: "nuove-costruzioni",
      description:
        "Una residenza a due livelli affacciata su un giardino. Titolo descrittivo di anteprima.",
      gallery: [
        {
          file: "malvezza",
          alt: "Rendering di una residenza a due livelli con giardino",
        },
      ],
      featured: true,
      status: "review",
    },
    {
      slug: "torri-residenziali",
      title: "Torri residenziali",
      category: "nuove-costruzioni",
      description:
        "Due edifici residenziali con logge e terrazze. Titolo descrittivo di anteprima.",
      gallery: [
        {
          file: "spadini",
          alt: "Rendering di due torri residenziali su un fronte urbano",
        },
        {
          file: "torri",
          alt: "Rendering di un edificio residenziale con balconi sfalsati",
        },
      ],
      featured: true,
      status: "review",
    },
    {
      slug: "fronti-industriali",
      title: "Fronti industriali",
      category: "ristrutturazioni",
      description:
        "Una sequenza di coperture a falda e ingressi illuminati scandisce il fronte. Titolo descrittivo di anteprima.",
      gallery: [
        {
          file: "esterno-notte",
          alt: "Vista serale di un fronte industriale con coperture a falda",
        },
      ],
      featured: true,
      status: "review",
    },
    {
      slug: "facciata-e-percorsi",
      title: "Facciata e percorsi",
      category: "ristrutturazioni",
      description:
        "Vetrate e ingressi si alternano lungo un percorso esterno pavimentato. Titolo descrittivo di anteprima.",
      gallery: [
        {
          file: "pganino",
          alt: "Vista prospettica di un percorso esterno davanti a vetrate",
        },
      ],
      featured: false,
      status: "review",
    },
  ]);

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
        project.description,
        project.location,
        category?.label,
      ].join(" "),
    );
    return terms.every((term) => haystack.includes(term));
  });
}

export function mediaUrl(file: string) {
  return file.startsWith("/") ? file : "/anteprima-media/" + file;
}
