import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";

const files = {
  "9008705.jpg": "lobo",
  "esterno-notte-fronte.jpg": "esterno-notte",
  "malvezza-4-seconda-vista.jpeg": "malvezza",
  "pganino-2_orig.jpeg": "pganino",
  "torri-a-e-b.jpg": "torri",
  "vista-da-via-spadini.jpg": "spadini",
  "whatsapp-image-2025-01-24-at-18-30-37-1_orig.jpeg": "facciata",
};
await fs.mkdir(".local-media", { recursive: true });
const rows = [
  "originale,sha256,byte,formato,larghezza,altezza,derivato,diritti,mapping",
];
for (const name of (await fs.readdir("asset")).sort()) {
  const path = "asset/" + name;
  if (!(await fs.stat(path)).isFile()) continue;
  const buffer = await fs.readFile(path);
  const slug = files[name];
  const image = slug ? sharp(buffer) : null;
  const metadata = await image?.metadata();
  if (image)
    await image
      .rotate()
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 84 })
      .toFile(".local-media/" + slug + ".webp");
  rows.push(
    [
      path,
      createHash("sha256").update(buffer).digest("hex"),
      buffer.length,
      metadata?.format ?? name.split(".").at(-1),
      metadata?.width,
      metadata?.height,
      slug && ".local-media/" + slug + ".webp",
      "da confermare",
      "da confermare",
    ].join(","),
  );
}
await fs.writeFile("docs/asset-manifest.csv", rows.join("\n") + "\n");
