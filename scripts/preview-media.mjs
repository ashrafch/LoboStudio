import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";
import previewImages from "../content/preview-images.json" with { type: "json" };

const files = Map.groupBy(
  Object.entries(previewImages).map(([slug, source]) => {
    if (typeof source === "string") return { slug, path: source };
    const [path, left, top, width, height] = source;
    return { slug, path, crop: { left, top, width, height } };
  }),
  (file) => file.path,
);

async function writeLogo(image, destination) {
  const { data: alpha, info } = await image
    .rotate()
    .toColourspace("b-w")
    .negate()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  for (let index = 0; index < alpha.length; index += 1) {
    alpha[index] = Math.max(0, Math.round(((alpha[index] - 12) * 255) / 243));
  }
  await sharp({ create: { width, height, channels: 3, background: "#000" } })
    .joinChannel(alpha, { raw: { width, height, channels: 1 } })
    .webp({ lossless: true })
    .toFile(destination);
}

await fs.mkdir(".local-media", { recursive: true });
const rows = [
  [
    "originale",
    "sha256",
    "byte",
    "formato",
    "larghezza",
    "altezza",
    "derivato",
    "diritti",
    "uso",
    "duplicato_di",
  ],
];
const originals = new Map();
const archiveFiles = await Promise.all(
  ["projects", "studio", "archive"].map(async (directory) => {
    const entries = await fs.readdir("assets/" + directory, {
      recursive: true,
    });
    return entries.map(
      (entry) => directory + "/" + entry.replaceAll("\\", "/"),
    );
  }),
);
for (const relative of archiveFiles.flat().sort()) {
  if (relative.endsWith("/.gitkeep")) continue;
  const path = "assets/" + relative;
  if (!(await fs.stat(path)).isFile()) continue;
  const buffer = await fs.readFile(path);
  const derivatives = files.get(relative) ?? [];
  const image = /\.(jpe?g|png)$/i.test(relative) ? sharp(buffer) : null;
  const metadata = await image?.metadata();
  const hash = createHash("sha256").update(buffer).digest("hex");
  const duplicate = originals.get(hash);
  if (!duplicate) originals.set(hash, relative);
  for (const { slug, crop } of derivatives) {
    const destination = ".local-media/" + slug + ".webp";
    if (slug === "lobo") {
      await writeLogo(image, destination);
    } else {
      const variant = image.clone().rotate();
      if (crop) variant.extract(crop);
      await variant
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 84 })
        .toFile(destination);
    }
  }
  rows.push([
    path,
    hash,
    buffer.length,
    metadata?.format ?? relative.split(".").at(-1),
    metadata?.width,
    metadata?.height,
    derivatives.map(({ slug }) => ".local-media/" + slug + ".webp").join(" | "),
    "da confermare",
    relative.startsWith("archive/weebly/infoImage/")
      ? "fonte storica"
      : derivatives.length || relative.endsWith(".mp4")
        ? "anteprima"
        : "da verificare",
    duplicate,
  ]);
}
const csv = rows
  .map((row) =>
    row
      .map((value) => '"' + String(value ?? "").replaceAll('"', '""') + '"')
      .join(","),
  )
  .join("\n");
await fs.writeFile("docs/asset-manifest.csv", csv + "\n");
