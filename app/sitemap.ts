import type { MetadataRoute } from "next";
import { categories, visibleProjects } from "@/content/projects";
import { indexing, siteUrl } from "@/content/site";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexing || !siteUrl) return [];
  const paths = [
    "/",
    "/progetti",
    "/studio",
    "/servizi",
    "/clienti",
    "/rassegna-stampa",
    "/contatti",
    "/competenze/sisma-emilia-2012",
    ...categories.map((item) => "/progetti/categoria/" + item.slug),
    ...visibleProjects(false).map((item) => "/progetti/" + item.slug),
  ];
  return paths.map((path) => ({ url: new URL(path, siteUrl).href }));
}
