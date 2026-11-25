import type { MetadataRoute } from "next";
import { indexing, siteUrl } from "@/content/site";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(indexing ? { allow: "/", disallow: "/admin" } : { disallow: "/" }),
    },
    sitemap:
      indexing && siteUrl ? new URL("/sitemap.xml", siteUrl).href : undefined,
  };
}
