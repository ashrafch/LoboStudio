import type { MetadataRoute } from "next";
import { categories } from "@/content/projects";
import { publicProjects } from "@/content/cms/public";
import { indexing, siteUrl } from "@/content/site";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    ...(await publicProjects(false)).map((item) => "/progetti/" + item.slug),
  ];
  return paths.map((path) => ({ url: new URL(path, siteUrl).href }));
}
