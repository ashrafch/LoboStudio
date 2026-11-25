import { expect, test } from "@playwright/test";

const preview = process.env.LOBO_E2E_PREVIEW === "1";

test("studio stays stable when the self-hosted fonts arrive after first paint", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 900 });
  const fonts = Promise.withResolvers<void>();
  await page.route("**/*.woff2", async (route) => {
    await fonts.promise;
    await route.continue();
  });

  try {
    await page.goto("/studio", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { name: "Studio", level: 1 }),
    ).toBeVisible();
    await page.evaluate(
      () =>
        new Promise((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(resolve));
        }),
    );
  } finally {
    fonts.resolve();
  }

  const shift = await page.evaluate(async () => {
    type LayoutShift = PerformanceEntry & {
      hadRecentInput: boolean;
      value: number;
    };
    let total = 0;
    const collect = (entries: PerformanceEntry[]) => {
      for (const entry of entries as LayoutShift[]) {
        if (!entry.hadRecentInput) total += entry.value;
      }
    };
    const observer = new PerformanceObserver((list) =>
      collect(list.getEntries()),
    );
    observer.observe({ type: "layout-shift", buffered: true });
    await document.fonts.ready;
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
    collect(observer.takeRecords());
    observer.disconnect();
    return total;
  });
  expect(shift).toBeLessThan(0.025);
});

test("the showcase follows scroll and gives reduced-motion users the photographs in reading order", async ({
  page,
}) => {
  test.skip(!preview, "Richiede le schede dell’archivio in anteprima.");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const showcase = page.getByRole("region", { name: "Progetti in fotografia" });
  const chapters = showcase.getByRole("listitem");
  await expect(chapters).toHaveCount(3);
  for (const chapter of await chapters.all()) {
    await chapter.evaluate((item) => {
      window.scrollTo(
        0,
        item.getBoundingClientRect().top + scrollY - innerHeight * 0.4,
      );
    });
    await expect(chapter).toHaveAttribute("data-active", "true");
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(showcase.getByRole("img")).toHaveCount(3);
});

test("the studio roadmap reaches all steps and preserves its static version", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/studio");
  const roadmap = page.getByRole("list", { name: "Fasi del metodo" });
  await expect(roadmap).toHaveAttribute("data-reduced", "false");
  await roadmap.evaluate((path) => {
    const { top, height } = path.getBoundingClientRect();
    window.scrollTo(0, top + scrollY + height * 0.64 - innerHeight * 0.88);
  });
  await expect(roadmap.locator('[data-reached="true"]')).toHaveCount(2);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(roadmap.locator('[data-reached="true"]')).toHaveCount(3);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(roadmap).toHaveAttribute("data-reduced", "true");
  await expect(roadmap.getByRole("heading")).toHaveCount(3);
});

test("the photo preview supports dragging, keyboard navigation and focus restoration", async ({
  page,
}) => {
  test.skip(!preview, "Richiede le fotografie dell’archivio in anteprima.");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "Anteprima foto · Via Emilia Levante 98",
  });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: /Anteprima fotografica/ });
  await expect(
    dialog.getByRole("button", { name: "Chiudi anteprima" }),
  ).toBeFocused();
  const status = dialog.getByRole("status");
  await expect(status).toHaveText("Foto 1 di 2");
  await dialog
    .getByRole("img")
    .evaluate((image: HTMLImageElement) => image.decode());
  const bounds = (await dialog
    .locator('[data-draggable="true"]')
    .boundingBox())!;
  const start = bounds.x + bounds.width * 0.75;
  const y = bounds.y + bounds.height / 2;
  await page.mouse.move(start, y);
  await page.mouse.down();
  await page.mouse.move(start - bounds.width * 0.5, y, { steps: 8 });
  await page.mouse.up();
  await expect(status).toHaveText("Foto 2 di 2");
  await page.keyboard.press("ArrowLeft");
  await expect(status).toHaveText("Foto 1 di 2");
  await expect(
    dialog.getByRole("link", { name: "Scheda progetto" }),
  ).toHaveAttribute("href", "/progetti/emilia-levante-98");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});
