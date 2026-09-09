import { NextResponse } from "next/server";
import { getStorageAdapter } from "@/lib/uploads/adapter";
import {
  MAX_FILES_PER_UPLOAD,
  validateFile,
} from "@/lib/uploads/validation";

/** Uploads touch the filesystem/object store, so this cannot be static. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type UploadedItem = {
  id: string;
  ok: boolean;
  storageKey?: string;
  url?: string;
  error?: string;
};

export async function POST(request: Request) {
  const adapter = getStorageAdapter();

  if (!adapter.isConfigured) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Photo uploads are not available right now. Please contact us and we will help you send your photos.",
        // Diagnostics are for the studio, not the customer - dev only.
        ...(process.env.NODE_ENV !== "production" && { reason: adapter.reason }),
      },
      { status: 503 }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "That upload could not be read. Please try again." },
      { status: 400 }
    );
  }

  const entries = form.getAll("files").filter((e): e is File => e instanceof File);
  const ids = form.getAll("ids").map(String);

  if (entries.length === 0) {
    return NextResponse.json(
      { ok: false, error: "No photos were included in the upload." },
      { status: 400 }
    );
  }

  if (entries.length > MAX_FILES_PER_UPLOAD) {
    return NextResponse.json(
      {
        ok: false,
        error: `Please upload at most ${MAX_FILES_PER_UPLOAD} photos at a time.`,
      },
      { status: 400 }
    );
  }

  const results: UploadedItem[] = [];

  for (const [index, file] of entries.entries()) {
    const id = ids[index] ?? `file-${index}`;

    // Re-validate server-side: the browser check is convenience, not a control.
    const check = validateFile({
      type: file.type,
      size: file.size,
      name: file.name,
    });

    if (!check.ok) {
      results.push({ id, ok: false, error: check.error });
      continue;
    }

    const stored = await adapter.store(file, {
      fileName: file.name,
      mimeType: file.type,
    });

    results.push({
      id,
      ok: stored.ok,
      storageKey: stored.storageKey,
      url: stored.url,
      error: stored.error,
    });
  }

  return NextResponse.json({
    ok: results.every((r) => r.ok),
    results,
  });
}
