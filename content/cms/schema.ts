import { services } from "../services";
import { z } from "zod";
import { categories } from "../projects";
import { projectLayouts, photoStages } from "../projects/presentation";
import { showcaseLimit } from "../projects/showcase";

const text = (max: number) => z.string().trim().max(max);
export const slug = z
  .string()
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const mediaId = z.string().uuid();
export const projectFields = z
  .object({
    slug,
    title: text(140).min(3),
    category: z.enum(categories.map((value) => value.slug)),
    description: text(8000).min(20),
    summary: text(320).optional(),
    presentation: z.enum(projectLayouts).default("essenziale"),
    period: text(100).optional(),
    role: text(220).optional(),
    location: text(140).optional(),
    featured: z.boolean().default(false),
    gallery: z
      .array(
        z.object({
          id: mediaId,
          alt: text(250).min(5),
          credit: text(200).min(2),
          caption: text(400).optional(),
          stage: z.enum(photoStages).optional(),
        }),
      )
      .max(36)
      .default([]),
  })
  .refine(
    (entry) => !entry.featured || entry.gallery.length > 0,
    "Un progetto in evidenza richiede un’immagine.",
  );

export const pages = {
  home: "Home",
  studio: "Studio",
  servizi: "Servizi",
  clienti: "Clienti",
  stampa: "Rassegna stampa",
  contatti: "Contatti",
  privacy: "Privacy",
  legali: "Note legali",
  sisma: "Sisma Emilia 2012",
  progetti: "Archivio progetti",
} as const;
export type PageKey = keyof typeof pages;

export const pageFields = z.object({
  servicePhotos: z
    .record(
      z
        .string()
        .refine((key) => services.some((service) => service.id === key)),
      z.object({ image: mediaId, alt: text(250).min(5) }).nullable(),
    )
    .optional(),
  featuredOrder: z
    .array(slug)
    .max(1000)
    .refine((items) => new Set(items).size === items.length)
    .default([]),
  showcaseOrder: z
    .array(slug)
    .max(showcaseLimit)
    .refine((items) => new Set(items).size === items.length)
    .optional(),
  title: text(140).optional(),
  intro: text(1200).optional(),
  subtitle: text(180).optional(),
  cta: text(100).optional(),
  email: z.union([z.literal(""), z.email().max(254)]).optional(),
  phone: z
    .union([
      z.literal(""),
      z
        .string()
        .trim()
        .regex(/^\+?[0-9 .()-]{6,32}$/),
    ])
    .optional(),
  address: text(240).optional(),
  layout: z.enum(["standard", "compatto", "ampio"]).default("standard"),
  mode: z.enum(["affianca", "sostituisci"]).default("affianca"),
  blocks: z
    .array(
      z
        .object({
          title: text(140),
          text: text(8000),
          image: z.union([z.literal(""), mediaId]),
          alt: text(250),
        })
        .refine((block) => block.title || block.text || block.image)
        .refine((block) => !block.image || block.alt.length >= 5),
    )
    .max(30)
    .default([]),
});

export type ProjectDraft = z.infer<typeof projectFields>;
export type PageDraft = z.infer<typeof pageFields>;
