import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { localPreview } from "@/content/projects";

const names = new Set([
  "lobo",
  "malvezza",
  "spadini",
  "torri",
  "pganino",
  "esterno-notte",
  "facciata",
]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  if (!localPreview || !names.has(name))
    return new Response(null, { status: 404 });
  try {
    const data = await readFile(
      join(process.cwd(), ".local-media", name + ".webp"),
    );
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
