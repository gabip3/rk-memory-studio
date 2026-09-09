/**
 * Upload validation rules, shared by the client uploader and the API route.
 * Client-side checks are for fast feedback; the server re-validates because a
 * browser check is a convenience, never a security control.
 */

export const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/tiff",
] as const;

/** The `accept` attribute for the file input. HEIC covers iPhone originals. */
export const FILE_INPUT_ACCEPT = "image/*,.heic,.heif";

/** Per-file ceiling in bytes. Generous, because we ask for originals. */
export const MAX_FILE_BYTES = Number(
  process.env.NEXT_PUBLIC_MAX_UPLOAD_BYTES ?? 30 * 1024 * 1024
);

/** Ceiling on a single order's uploads, to keep the browser responsive. */
export const MAX_FILES_PER_UPLOAD = 60;

/**
 * Below this on the shorter edge we warn (never block). Roughly the point where
 * a small keepsake print starts to show softness.
 */
export const MIN_RECOMMENDED_EDGE = 1000;

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export type FileValidation = { ok: boolean; error?: string };

export function validateFile(file: {
  type: string;
  size: number;
  name: string;
}): FileValidation {
  const type = file.type.toLowerCase();
  const looksLikeImage =
    type.startsWith("image/") || /\.(heic|heif)$/i.test(file.name);

  if (!looksLikeImage) {
    return {
      ok: false,
      error: "That file is not a photo. Please choose a JPG, PNG or HEIC image.",
    };
  }

  if (file.size === 0) {
    return { ok: false, error: "That file appears to be empty." };
  }

  if (file.size > MAX_FILE_BYTES) {
    return {
      ok: false,
      error: `That photo is ${formatBytes(file.size)}. The limit is ${formatBytes(
        MAX_FILE_BYTES
      )} - please choose a smaller file.`,
    };
  }

  return { ok: true };
}

/**
 * Advisory quality note. Returns undefined when the file looks fine.
 * We tell the customer the truth about resolution without blocking the order.
 */
export function qualityWarning(
  width: number | null,
  height: number | null
): string | undefined {
  if (!width || !height) return undefined;
  const shortEdge = Math.min(width, height);
  if (shortEdge < MIN_RECOMMENDED_EDGE) {
    return `This photo is ${width}x${height}px, which is smaller than we recommend. If you have the original version, it will print with more detail.`;
  }
  return undefined;
}

/** Reads natural dimensions in the browser without decoding the full file twice. */
export async function readImageDimensions(
  file: File
): Promise<{ width: number | null; height: number | null }> {
  if (typeof window === "undefined" || !("createImageBitmap" in window)) {
    return { width: null, height: null };
  }
  try {
    const bitmap = await createImageBitmap(file);
    const dims = { width: bitmap.width, height: bitmap.height };
    bitmap.close?.();
    return dims;
  } catch {
    // HEIC and some TIFFs cannot be decoded by the browser. That is expected -
    // we simply skip the advisory check rather than rejecting a valid original.
    return { width: null, height: null };
  }
}
