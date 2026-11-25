import { hasSession } from "@/content/cms/auth";
import { getMedia } from "@/content/cms/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const media = getMedia(id, await hasSession());
  if (!media)
    return new Response(null, {
      status: 404,
      headers: { "Cache-Control": "private, no-store" },
    });
  return new Response(new Uint8Array(media.data), {
    headers: {
      "Content-Type": "image/webp",
      "Content-Length": String(media.bytes),
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
