import { expect, test } from "vitest";
import { pageFields, projectFields } from "../../content/cms/schema";
import { orderFeatured } from "../../content/projects/presentation";
import {
  mediaUrl,
  searchProjects,
  visibleProjects,
} from "../../content/projects";
test("review projects are only visible in local preview", () => {
  expect(
    visibleProjects(false).every((project) => project.status === "published"),
  ).toBe(true);
  expect(
    visibleProjects(true).some((project) => project.status === "review"),
  ).toBe(true);
});
test("search folds accents, case and redundant spacing", () => {
  expect(
    searchProjects(visibleProjects(true), "  TÓRRI   spadini ").map(
      (project) => project.slug,
    ),
  ).toEqual(["torri-residenziali"]);
  expect(searchProjects(visibleProjects(true), "parola-introvabile")).toEqual(
    [],
  );
});
test("local and production media use distinct routes", () => {
  expect(mediaUrl("lobo")).toBe("/anteprima-media/lobo");
  expect(mediaUrl("/media/progetti/foto.webp")).toBe(
    "/media/progetti/foto.webp",
  );
});

test("saved content without presentation fields still opens with defaults", () => {
  const oldProject = {
    slug: "progetto-storico",
    title: "Progetto storico",
    category: "strutture",
    description: "Una descrizione presente prima della nuova impaginazione.",
    gallery: [
      {
        id: "00000000-0000-4000-8000-000000000001",
        alt: "Vista storica",
        credit: "Archivio",
      },
    ],
  };
  expect(projectFields.parse(oldProject)).toMatchObject({
    presentation: "essenziale",
    gallery: oldProject.gallery,
  });
  expect(pageFields.parse({}).featuredOrder).toEqual([]);
});

test("Home order skips unavailable projects and appends other featured work", () => {
  const projects = ["alfa", "beta", "gamma", "delta"].map((slug) => ({ slug }));
  expect(
    orderFeatured(projects, ["ritirato", "gamma", "alfa"]).map(
      (project) => project.slug,
    ),
  ).toEqual(["gamma", "alfa", "beta", "delta"]);
  expect(projects[0].slug).toBe("alfa");
});
