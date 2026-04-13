const TARGET_MAX_BYTES = 4 * 1024 * 1024;
const DIMENSION_STEPS = [2560, 1920, 1440, 1080];
const QUALITY_STEPS = [0.85, 0.75, 0.65, 0.55];

const COMPRESSIBLE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export function canCompress(file: File): boolean {
  return COMPRESSIBLE_TYPES.has(file.type);
}

async function loadBitmap(file: File): Promise<ImageBitmap> {
  if ("createImageBitmap" in window) {
    return await createImageBitmap(file);
  }
  throw new Error("createImageBitmap not supported");
}

function drawToCanvas(
  bitmap: ImageBitmap,
  maxDim: number
): HTMLCanvasElement {
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  ctx.drawImage(bitmap, 0, 0, width, height);
  return canvas;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas encode failed"));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      quality
    );
  });
}

export async function compressImage(file: File): Promise<File> {
  if (!canCompress(file) || file.size <= TARGET_MAX_BYTES) {
    return file;
  }

  const bitmap = await loadBitmap(file);
  try {
    let best: Blob | null = null;

    for (const maxDim of DIMENSION_STEPS) {
      const canvas = drawToCanvas(bitmap, maxDim);
      for (const quality of QUALITY_STEPS) {
        const blob = await canvasToBlob(canvas, quality);
        if (!best || blob.size < best.size) best = blob;
        if (blob.size <= TARGET_MAX_BYTES) {
          return new File([blob], replaceExtension(file.name, "jpg"), {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
        }
      }
    }

    if (best) {
      return new File([best], replaceExtension(file.name, "jpg"), {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
    }
    return file;
  } finally {
    bitmap.close?.();
  }
}

function replaceExtension(name: string, ext: string): string {
  const dot = name.lastIndexOf(".");
  if (dot <= 0) return `${name}.${ext}`;
  return `${name.slice(0, dot)}.${ext}`;
}

export const MAX_UPLOAD_BYTES = TARGET_MAX_BYTES;
