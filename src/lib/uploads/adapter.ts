/**
 * Storage adapters for customer photo uploads.
 *
 * The default `local` adapter writes to a directory on disk. That is fine for
 * development and for a long-running Node server, but NOT for serverless
 * deployments (Vercel/Netlify functions have an ephemeral, read-only-ish
 * filesystem). Before launch, point UPLOAD_PROVIDER at a real object store.
 *
 * Adding one is deliberately small: implement `StorageAdapter` and register it
 * in `adapters` below. Nothing else in the app changes.
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { StorageAdapter, UploadResult } from "./types";

const trim = (v: string | undefined) => (v ?? "").trim();

function safeExtension(fileName: string, mimeType: string): string {
  const fromName = path.extname(fileName).toLowerCase();
  if (/^\.[a-z0-9]{2,5}$/.test(fromName)) return fromName;
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/heic": ".heic",
    "image/heif": ".heif",
    "image/tiff": ".tif",
  };
  return map[mimeType.toLowerCase()] ?? ".bin";
}

/* ---- Local filesystem (development) -------------------------------------- */

// The dynamic cwd path is intentional and development-only; the bundler is
// told not to try to trace it into the deployment output.
const localUploadDir =
  trim(process.env.UPLOAD_LOCAL_DIR) ||
  path.join(/* turbopackIgnore: true */ process.cwd(), ".uploads");

const localAdapter: StorageAdapter = {
  id: "local",
  isConfigured: true,
  reason: "",

  async store(file, meta): Promise<UploadResult> {
    try {
      // Date-partitioned so a busy folder stays navigable for the studio.
      const day = new Date().toISOString().slice(0, 10);
      const dir = path.join(localUploadDir, day);
      await mkdir(dir, { recursive: true });

      const key = `${day}/${randomUUID()}${safeExtension(meta.fileName, meta.mimeType)}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(localUploadDir, key), buffer);

      // Deliberately no public URL: these are customers' personal photographs
      // and must not be served from a guessable path.
      return { ok: true, storageKey: key };
    } catch (error) {
      return {
        ok: false,
        error:
          error instanceof Error ? error.message : "Could not save the photo.",
      };
    }
  },
};

/* ---- Demo (accepts and DISCARDS files) ------------------------------------ */

/**
 * For showing the site on a serverless preview, where the local adapter cannot
 * write to disk. It accepts the upload so the customer flow can be walked
 * end to end, then **throws the file away**.
 *
 * The provider is named `demo-discard` on purpose: anyone reading the env file
 * can see it loses data. It logs a warning on every call so it cannot sit
 * unnoticed in a real deployment. NEVER use it to take real orders.
 */
const demoDiscardAdapter: StorageAdapter = {
  id: "demo-discard",
  isConfigured: true,
  reason: "",

  async store(_file, meta): Promise<UploadResult> {
    console.warn(
      `[uploads] demo-discard: accepted and DISCARDED "${meta.fileName}". ` +
        "No file was stored. Set a real UPLOAD_PROVIDER before taking orders."
    );
    return { ok: true, storageKey: `demo-discard/${randomUUID()}` };
  },
};

/* ---- Not-configured fallback --------------------------------------------- */

const unconfiguredAdapter: StorageAdapter = {
  id: "unconfigured",
  isConfigured: false,
  reason:
    "UPLOAD_PROVIDER is set to a provider that has not been implemented yet. " +
    "Implement a StorageAdapter in src/lib/uploads/adapter.ts and register it.",
  async store(): Promise<UploadResult> {
    return {
      ok: false,
      error: "Photo storage is not configured yet.",
    };
  },
};

/* ---- Registry ------------------------------------------------------------- */

const adapters: Record<string, StorageAdapter> = {
  local: localAdapter,
  "demo-discard": demoDiscardAdapter,
  // s3:         implement and register
  // cloudinary: implement and register
};

export function getStorageAdapter(): StorageAdapter {
  const id = trim(process.env.UPLOAD_PROVIDER) || "local";
  return adapters[id] ?? unconfiguredAdapter;
}
