import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const preview = process.env.LOBO_E2E_PREVIEW === "1";

test("responsive home renders without horizontal overflow", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Architettura e ingegneria." }),
  ).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  for (const width of [360, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 950 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    if ([390, 1440].includes(width))
      await page.screenshot({
        path: testInfo.outputPath("home-" + width + ".png"),
        fullPage: true,
      });
  }
  expect(errors).toEqual([]);
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
});

test("desktop project menu supports hover, keyboard activation and Escape", async ({
  page,
}) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Principale" });
  await nav.getByRole("link", { name: "Progetti", exact: true }).hover();
  const category = nav.getByRole("link", { name: "Nuove costruzioni" });
  await expect(category).toBeVisible();
  await page.mouse.move(5, 200);
  const button = nav.getByRole("button", { name: "Categorie progetti" });
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(category).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(category).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(button).toBeFocused();
  await expect(category).toBeHidden();
});

test("mobile navigation, search URL and empty result", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Apri navigazione" }).click();
  await page.getByRole("button", { name: "Categorie progetti" }).click();
  await page
    .getByRole("navigation", { name: "Principale" })
    .getByRole("link", { name: "Ristrutturazioni" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Ristrutturazioni", level: 1 }),
  ).toBeVisible();
  await page.getByRole("searchbox").fill("non-presente");
  await page.getByRole("button", { name: "Cerca", exact: true }).click();
  await expect(page).toHaveURL(/q=non-presente/);
  await expect(page.getByRole("status")).toContainText("0 progetti");
  await page.getByRole("link", { name: "Azzera ricerca" }).click();
  await expect(page).not.toHaveURL(/q=/);
});

test("institutional routes, legal metadata, security headers and not found", async ({
  request,
}) => {
  for (const path of [
    "/studio",
    "/servizi",
    "/clienti",
    "/rassegna-stampa",
    "/contatti",
    "/privacy",
    "/note-legali",
    "/competenze/sisma-emilia-2012",
    "/robots.txt",
    "/sitemap.xml",
    "/opengraph-image",
  ]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
  }
  const privacy = await request.get("/privacy");
  expect(await privacy.text()).toContain("noindex");
  expect(privacy.headers()["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
  expect((await request.get("/progetti/categoria/inesistente")).status()).toBe(
    404,
  );
  expect((await request.get("/progetti/inesistente")).status()).toBe(404);
  expect((await request.get("/anteprima-media/inesistente")).status()).toBe(
    404,
  );
  if (!preview) {
    expect((await request.get("/anteprima-media/lobo")).status()).toBe(404);
    expect((await request.get("/progetti/torri-residenziali")).status()).toBe(
      404,
    );
  }
});

test("preview media, carousel, gallery and contact links", async ({
  page,
  request,
}) => {
  test.skip(!preview, "Richiede gli originali locali derivati.");
  await page.goto("/");
  await expect
    .poll(() =>
      page
        .getByRole("region", { name: "Progetti in evidenza" })
        .getByAltText("Rendering di una residenza a due livelli con giardino")
        .evaluate((img: HTMLImageElement) => img.naturalWidth),
    )
    .toBeGreaterThan(0);
  await page.getByRole("button", { name: "Progetto successivo" }).click();
  await page
    .getByRole("region", { name: "Progetti in evidenza" })
    .getByRole("link", { name: "Torri residenziali" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Torri residenziali", level: 1 }),
  ).toBeVisible();
  const thumb = page.getByRole("button", { name: /Ingrandisci/ }).first();
  await thumb.click();
  const gallery = page.getByRole("dialog");
  await expect(gallery.getByText("1 / 2")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(gallery.getByText("2 / 2")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(gallery).toBeHidden();
  await expect(thumb).toBeFocused();
  await page.goto("/contatti");
  await expect(
    page.getByRole("link", { name: "Invia un’email" }),
  ).toHaveAttribute("href", "mailto:studiobolelli@gmail.com");
  expect(
    (await request.get("/anteprima-media/lobo")).headers()["content-type"],
  ).toBe("image/webp");
});

test("failed preview image has a visible fallback", async ({ page }) => {
  test.skip(!preview, "Richiede la modalità di anteprima.");
  await page.route("**/anteprima-media/malvezza", (route) =>
    route.fulfill({ status: 404 }),
  );
  await page.goto("/");
  await expect(
    page.getByText("Immagine non disponibile").first(),
  ).toBeVisible();
});
