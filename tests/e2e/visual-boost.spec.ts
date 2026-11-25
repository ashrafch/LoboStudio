import { expect, test } from "@playwright/test";

const preview = process.env.LOBO_E2E_PREVIEW === "1";

test("the featured rail snaps with the keyboard and retains the video slides", async ({
  page,
}) => {
  test.skip(!preview, "Richiede progetti e video dell’anteprima locale.");
  await page.goto("/#inizio-home");
  const featured = page.getByRole("region", { name: "Progetti in evidenza" });
  const rail = featured.getByRole("region", {
    name: "Scorri le schede con i tasti freccia",
  });
  await expect(
    featured.getByRole("button", { name: "Avvia il carosello" }),
  ).toBeVisible();
  await expect(
    rail.getByRole("link", { name: "Residenza con giardino" }),
  ).toBeVisible();
  await rail.focus();
  await rail.press("ArrowRight");
  await expect(
    rail.getByRole("link", { name: "Torri Spadini" }),
  ).toHaveAttribute("href", "/progetti/torri-residenziali");
  await expect
    .poll(() => rail.evaluate((element) => element.scrollLeft))
    .toBeGreaterThan(0);
  await rail.press("End");
  await expect(rail.locator("video[controls]")).toBeVisible();
  await rail.press("Home");
  await expect(
    rail.getByRole("link", { name: "Residenza con giardino" }),
  ).toBeVisible();
});

test("the topographic background only appears on the urban-planning category", async ({
  page,
}) => {
  await page.goto("/progetti/categoria/piani-urbanistici");
  const topo = page.locator("[data-topo-background]");
  await expect(
    topo.getByRole("heading", { name: "Piani urbanistici", level: 1 }),
  ).toBeVisible();
  await expect(topo).toHaveAttribute("data-motion", "still");
  await expect(topo.locator("canvas")).toHaveAttribute("aria-hidden", "true");
  await page.goto("/progetti/categoria/strutture");
  await expect(topo).toHaveCount(0);
});

test("the Studio index follows headings and supports keyboard anchors", async ({
  page,
}) => {
  test.skip(!preview, "L’indice richiede le tre sezioni dell’anteprima.");
  await page.goto("/studio");
  const index = page.getByRole("navigation", { name: "In questa pagina" });
  await expect(index.getByRole("link")).toHaveCount(3);
  const people = index.getByRole("link", { name: "Persone" });
  await people.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#persone$/);
  await expect(people).toHaveAttribute("aria-current", "location");
  const heading = page.getByRole("heading", {
    name: "Le persone dello studio",
  });
  await expect(heading).toBeFocused();
  const header = await page.getByRole("banner").boundingBox();
  const target = await heading.boundingBox();
  expect(target!.y).toBeGreaterThan(header!.y + header!.height);
});
