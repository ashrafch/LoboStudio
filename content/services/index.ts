import catalog from "./photos.json";

export const services = catalog;

export type ServicePhotoOverrides = Record<
  string,
  { image: string; alt: string } | null
>;

export function servicePhoto(
  service: (typeof services)[number],
  overrides?: ServicePhotoOverrides,
) {
  const choice = overrides?.[service.id];
  if (choice === null) return null;
  if (choice)
    return { src: "/media/cms/" + choice.image, alt: choice.alt, credit: "" };
  return {
    src: "/media/attivita/" + service.id + ".webp",
    alt: service.alt,
    credit: "Foto illustrativa · " + service.photographer + " / Pexels",
  };
}

export const method = [
  [
    "Analisi",
    "Esigenze, condizioni dell’esistente e vincoli orientano le prime scelte.",
  ],
  [
    "Progetto",
    "Architettura e struttura si sviluppano insieme, attraverso verifiche e confronto tecnico.",
  ],
  [
    "Realizzazione",
    "Coordinamento e verifiche accompagnano il passaggio dal progetto all’opera.",
  ],
] as const;
