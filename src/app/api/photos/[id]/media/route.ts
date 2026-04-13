import { getFileMedia, getFileThumbnail } from "@/lib/drive";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!/^[a-zA-Z0-9_-]{10,}$/.test(id)) {
    return new Response("Invalid id", { status: 400 });
  }

  const url = new URL(request.url);
  const isThumb = url.searchParams.get("size") === "thumb";

  try {
    if (isThumb) {
      const thumb = await getFileThumbnail(id, 500);
      if (thumb) {
        return new Response(thumb.body, {
          headers: {
            "Content-Type": thumb.mimeType,
            "Cache-Control": "public, max-age=86400, immutable",
          },
        });
      }
      // Fall through to full media if no thumbnail (e.g. small images)
    }

    const { stream, mimeType, size } = await getFileMedia(id);

    const webStream = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk: Buffer) => controller.enqueue(chunk));
        stream.on("end", () => controller.close());
        stream.on("error", (err) => controller.error(err));
      },
      cancel() {
        (stream as NodeJS.ReadableStream & { destroy?: () => void }).destroy?.();
      },
    });

    const headers: Record<string, string> = {
      "Content-Type": mimeType,
      "Cache-Control": "public, max-age=3600, immutable",
    };
    if (size) headers["Content-Length"] = String(size);

    return new Response(webStream, { headers });
  } catch (error) {
    console.error(`[MEDIA] Failed for ${id}:`, error instanceof Error ? error.message : error);
    return new Response("Not found", { status: 404 });
  }
}
