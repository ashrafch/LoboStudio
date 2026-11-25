import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { pageFields, projectFields } from "../../content/cms/schema";

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("CMS_DB_PATH", ":memory:");
});
afterEach(() => vi.unstubAllEnvs());

describe("CMS restore points", () => {
  it("restores publications, drafts, history and image visibility, with an undo point", async () => {
    const cms = await import("../../content/cms/store");
    const photo = cms.storeMedia("foto.webp", "Studio", Buffer.from("media"));
    const project = projectFields.parse({
      slug: "progetto-demo",
      title: "Progetto approvato",
      description: "Descrizione completa del progetto di esempio.",
      category: "strutture",
      gallery: [{ id: photo, alt: "Vista della struttura", credit: "Studio" }],
    });
    cms.saveDraft("project", project.slug, project, 0);
    cms.changePublication("project", project.slug, 1, "publish");
    cms.saveDraft("page", "home", pageFields.parse({ title: "Bozza Home" }), 0);
    cms.createSiteBackup("Stato accettato");
    const accepted = cms.siteBackups()[0].id;

    cms.changePublication("project", project.slug, 2, "archive");
    expect(cms.getMedia(photo, false)).toBeUndefined();
    expect(cms.revisions("project", project.slug)).toHaveLength(1);
    cms.saveDraft(
      "page",
      "servizi",
      pageFields.parse({ title: "Nuova pagina" }),
      0,
    );
    cms.restoreSiteBackup(accepted);
    const undo = cms.siteBackups()[0];
    expect(undo.kind).toBe("restore");
    expect(cms.document("project", project.slug)?.published).toBe(
      JSON.stringify(project),
    );
    expect(cms.getMedia(photo, false)).toBeDefined();
    expect(cms.revisions("project", project.slug)).toHaveLength(0);
    expect(cms.document("page", "servizi")).toBeUndefined();
    expect(cms.document("page", "home")?.draft).toContain("Bozza Home");
    expect(() =>
      cms.saveDraft("page", "home", pageFields.parse({}), 1),
    ).toThrow("scheda è cambiata");

    cms.saveDraft("page", "servizi", pageFields.parse({}), 0);
    expect(() =>
      cms.saveDraft("page", "servizi", pageFields.parse({}), 1),
    ).toThrow("scheda è cambiata");
    cms.restoreSiteBackup(undo.id);
    expect(cms.document("project", project.slug)?.archived).toBe(1);
    expect(cms.revisions("project", project.slug)).toHaveLength(1);
    expect(cms.getMedia(photo, false)).toBeUndefined();
    expect(cms.document("page", "servizi")?.draft).toContain("Nuova pagina");
  });

  it("protects photographs used only by a backup and saves a point before publishing", async () => {
    const cms = await import("../../content/cms/store");
    const photo = cms.storeMedia(
      "attivita.webp",
      "Studio",
      Buffer.from("media"),
    );
    const page = pageFields.parse({
      servicePhotos: { collaudi: { image: photo, alt: "Foto di un collaudo" } },
    });
    cms.saveDraft("page", "servizi", page, 0);
    cms.createSiteBackup("Bozza con foto");
    cms.saveDraft(
      "page",
      "servizi",
      pageFields.parse({ title: "Servizi aggiornati" }),
      1,
    );
    expect(() => cms.removeMedia(photo)).toThrow("copia di ripristino");
    cms.changePublication("page", "servizi", 2, "publish");
    const automatic = cms.siteBackups()[0];
    expect(automatic.kind).toBe("publication");
    cms.restoreSiteBackup(automatic.id);
    expect(cms.document("page", "servizi")?.published).toBeNull();
    expect(cms.document("page", "servizi")?.draft).toContain(
      "Servizi aggiornati",
    );
  });
});
