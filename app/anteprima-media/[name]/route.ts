import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { Readable } from "node:stream";
import { localPreview } from "@/content/projects";
import { previewVideos } from "@/content/preview-videos";
import previewImages from "@/content/preview-images.json";

async function serveVideo(file: string, range: string | null) {
  const path = join(process.cwd(), "assets", "archive", "videos", file);
  const { size } = await stat(path);
  const headers = new Headers({
    "Content-Type": "video/mp4",
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, no-store",
    "X-Robots-Tag": "noindex",
  });
  let start = 0;
  let end = size - 1;
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (match?.[1]) {
      start = Number(match[1]);
      if (match[2]) end = Math.min(Number(match[2]), end);
    } else if (match?.[2]) {
      start = Math.max(0, size - Number(match[2]));
    }
    if (!match || !(match[1] || match[2]) || start > end || start >= size) {
      headers.set("Content-Range", "bytes */" + size);
      return new Response(null, { status: 416, headers });
    }
    headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
  }
  headers.set("Content-Length", String(end - start + 1));
  const stream = Readable.toWeb(createReadStream(path, { start, end }));
  return new Response(stream as ReadableStream<Uint8Array>, {
    status: range ? 206 : 200,
    headers,
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  if (!localPreview) return new Response(null, { status: 404 });
  try {
    if (Object.hasOwn(previewVideos, name)) {
      const { file } = previewVideos[name as keyof typeof previewVideos];
      return await serveVideo(file, request.headers.get("range"));
    }
    if (!Object.hasOwn(previewImages, name))
      return new Response(null, { status: 404 });
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
