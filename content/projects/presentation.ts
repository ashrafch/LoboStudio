export const projectLayouts = ["essenziale", "racconto"] as const;
export type ProjectLayout = (typeof projectLayouts)[number];

export const photoStages = [
  "render",
  "cantiere",
  "realizzato",
  "dettaglio",
] as const;
export type PhotoStage = (typeof photoStages)[number];
export const photoStageLabels: Record<PhotoStage, string> = {
  render: "Render",
  cantiere: "Cantiere",
  realizzato: "Opera realizzata",
  dettaglio: "Dettaglio tecnico",
};

export function orderFeatured<T extends { slug: string }>(
  projects: readonly T[],
  order: readonly string[] = [],
) {
  const positions = new Map(order.map((slug, index) => [slug, index]));
  return [...projects].sort(
    (a, b) =>
      (positions.get(a.slug) ?? order.length) -
      (positions.get(b.slug) ?? order.length),
  );
}
