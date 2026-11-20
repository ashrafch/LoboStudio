import { expect, test } from "vitest";
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
    searchProjects(visibleProjects(true), "  TÓRRI   residenziali ").map(
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
