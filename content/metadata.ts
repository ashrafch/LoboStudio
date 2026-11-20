import type { Metadata } from "next";
import { site, siteUrl } from "./site";

export function pageMetadata(
  path: string,
  title: string,
  description: string,
): Metadata {
  const url = siteUrl && new URL(path, siteUrl);
  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: "it_IT",
      type: "website",
    },
  };
}
