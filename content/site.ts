import { localPreview } from "./projects";

export const site = {
  name: "LoboStudio",
  description:
    "Portfolio di architettura, strutture e progettazione integrata.",
};
export const contact = localPreview
  ? {
      person: "Studio di Ingegneria Lorenzo Bolelli",
      email: "studiobolelli@gmail.com",
      phone: "051 313981",
      tel: "+39051313981",
      address: "Via Marzabotto, 8 · Bologna",
    }
  : null;

function readSiteUrl(value: string | undefined) {
  if (!value) return;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && url.href === url.origin + "/") return url;
  } catch {
    return;
  }
}

export const siteUrl = readSiteUrl(process.env.SITE_URL);
export const indexing = Boolean(
  siteUrl &&
  process.env.LOBO_INDEXING === "1" &&
  process.env.NODE_ENV === "production",
);
