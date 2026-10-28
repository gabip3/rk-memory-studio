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

import { get, list, put } from "@vercel/blob";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type {
  StorageAdapter,
  StoredOrder,
  StoredPhoto,
  UploadResult,
} from "./types";

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

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".heic": "image/heic",
  ".heif": "image/heif",
  ".tif": "image/tiff",
};

const contentTypeFor = (key: string) =>
  CONTENT_TYPES[path.extname(key).toLowerCase()] ?? "application/octet-stream";

/** A storage key comes from a manifest we wrote, but treat it as untrusted:
 * a "../" in one would otherwise read files outside the upload directory. */
function isSafeKey(key: string): boolean {
  return (
    key.length > 0 &&
    !key.includes("\\") &&
    !key.split("/").some((part) => part === ".." || part === "")
  );
}

/** Our own references are RK-XXXXXX, but never build a path from unchecked input. */
function safeReference(reference: string): string {
  const clean = reference.toUpperCase().replace(/[^A-Z0-9-]/g, "");
  return clean || "UNKNOWN";
}

/** Date-partitioned so a busy store stays navigable for the studio. */
function photoKey(fileName: string, mimeType: string): string {
  const day = new Date().toISOString().slice(0, 10);
  return `${day}/${randomUUID()}${safeExtension(fileName, mimeType)}`;
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
      const key = photoKey(meta.fileName, meta.mimeType);
      const target = path.join(localUploadDir, key);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, Buffer.from(await file.arrayBuffer()));

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

  async storeOrder(reference, manifest): Promise<UploadResult> {
    try {
      const key = `orders/${safeReference(reference)}.json`;
      const target = path.join(localUploadDir, key);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, manifest, "utf8");
      return { ok: true, storageKey: key };
    } catch (error) {
      return {
        ok: false,
        error:
          error instanceof Error ? error.message : "Could not record the order.",
      };
    }
  },

  async listOrders(limit): Promise<StoredOrder[]> {
    try {
      const dir = path.join(localUploadDir, "orders");
      const names = await readdir(dir);
      const orders = await Promise.all(
        names
          .filter((name) => name.endsWith(".json"))
          .map(async (name) => ({
            reference: name.replace(/\.json$/, ""),
            storedAt: (await stat(path.join(dir, name))).mtime,
          }))
      );
      return orders
        .sort((a, b) => b.storedAt.getTime() - a.storedAt.getTime())
        .slice(0, limit);
    } catch {
      // No orders directory yet simply means no orders yet.
      return [];
    }
  },

  async readOrder(reference): Promise<string | null> {
    try {
      const target = path.join(
        localUploadDir,
        "orders",
        `${safeReference(reference)}.json`
      );
      return await readFile(target, "utf8");
    } catch {
      return null;
    }
  },

  async readPhoto(storageKey): Promise<StoredPhoto | null> {
    if (!isSafeKey(storageKey)) return null;
    try {
      const target = path.join(localUploadDir, storageKey);
      const info = await stat(target);
      return {
        body: Readable.toWeb(
          createReadStream(target)
        ) as ReadableStream<Uint8Array>,
        contentType: contentTypeFor(storageKey),
        size: info.size,
      };
    } catch {
      return null;
    }
  },
};

/* ---- Vercel Blob (production) -------------------------------------------- */

/**
 * Object storage for a serverless deployment.
 *
 * Stored `private`, never `public`: these are weddings, newborns and memorials,
 * and a public blob URL is readable by anyone who ever sees it, forever. The
 * studio reads them back through the Vercel dashboard or an authenticated
 * `get()`, which is a small inconvenience in exchange for not publishing a
 * customer's family photographs.
 *
 * Nothing needs configuring in code: `BLOB_READ_WRITE_TOKEN` is injected by
 * Vercel when a Blob store is linked to the project.
 */
const vercelBlobAdapter: StorageAdapter = {
  id: "vercel-blob",

  get isConfigured() {
    return Boolean(trim(process.env.BLOB_READ_WRITE_TOKEN));
  },

  get reason() {
    return this.isConfigured
      ? ""
      : "BLOB_READ_WRITE_TOKEN is missing. Create a Blob store in the Vercel " +
          "dashboard and connect it to this project, then redeploy.";
  },

  async store(file, meta): Promise<UploadResult> {
    try {
      const blob = await put(photoKey(meta.fileName, meta.mimeType), file, {
        access: "private",
        contentType: meta.mimeType,
        // Our key already carries a UUID, so a second random suffix would only
        // make the path harder for the studio to match against a manifest.
        addRandomSuffix: false,
        // Phone photographs are large and mobile connections drop.
        multipart: true,
      });

      // No URL is returned: a private blob's URL needs authentication anyway,
      // and the customer's browser has no business holding one.
      return { ok: true, storageKey: blob.pathname };
    } catch (error) {
      console.error("[uploads] vercel-blob store failed", error);
      return {
        ok: false,
        error:
          error instanceof Error ? error.message : "Could not save the photo.",
      };
    }
  },

  async storeOrder(reference, manifest): Promise<UploadResult> {
    try {
      const blob = await put(`orders/${safeReference(reference)}.json`, manifest, {
        access: "private",
        contentType: "application/json",
        addRandomSuffix: false,
        // One manifest per reference. A retry on the same reference should
        // replace it rather than fail the customer's checkout.
        allowOverwrite: true,
      });
      return { ok: true, storageKey: blob.pathname };
    } catch (error) {
      console.error("[uploads] vercel-blob storeOrder failed", error);
      return {
        ok: false,
        error:
          error instanceof Error ? error.message : "Could not record the order.",
      };
    }
  },

  async listOrders(limit): Promise<StoredOrder[]> {
    try {
      const { blobs } = await list({ prefix: "orders/", limit });
      return blobs
        .map((blob) => ({
          reference: blob.pathname.replace(/^orders\//, "").replace(/\.json$/, ""),
          storedAt: blob.uploadedAt ?? null,
        }))
        .sort((a, b) => (b.storedAt?.getTime() ?? 0) - (a.storedAt?.getTime() ?? 0));
    } catch (error) {
      console.error("[uploads] vercel-blob listOrders failed", error);
      return [];
    }
  },

  async readOrder(reference): Promise<string | null> {
    try {
      const result = await get(`orders/${safeReference(reference)}.json`, {
        access: "private",
      });
      if (!result?.stream) return null;
      return await new Response(result.stream).text();
    } catch (error) {
      console.error("[uploads] vercel-blob readOrder failed", error);
      return null;
    }
  },

  async readPhoto(storageKey): Promise<StoredPhoto | null> {
    if (!isSafeKey(storageKey)) return null;
    try {
      const result = await get(storageKey, { access: "private" });
      if (!result?.stream) return null;
      return {
        body: result.stream as ReadableStream<Uint8Array>,
        contentType: result.blob.contentType ?? contentTypeFor(storageKey),
        size: result.blob.size ?? null,
      };
    } catch (error) {
      console.error("[uploads] vercel-blob readPhoto failed", error);
      return null;
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

  async storeOrder(reference): Promise<UploadResult> {
    console.warn(
      `[uploads] demo-discard: DISCARDED the order manifest for ${reference}. ` +
        "Nothing from this environment can be fulfilled."
    );
    return { ok: true, storageKey: `demo-discard/orders/${reference}.json` };
  },

  async listOrders(): Promise<StoredOrder[]> {
    return [];
  },

  async readOrder(): Promise<string | null> {
    return null;
  },

  async readPhoto(): Promise<StoredPhoto | null> {
    return null;
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

  async storeOrder(): Promise<UploadResult> {
    return {
      ok: false,
      error: "Photo storage is not configured yet.",
    };
  },

  async listOrders(): Promise<StoredOrder[]> {
    return [];
  },

  async readOrder(): Promise<string | null> {
    return null;
  },

  async readPhoto(): Promise<StoredPhoto | null> {
    return null;
  },
};

/* ---- Registry ------------------------------------------------------------- */

const adapters: Record<string, StorageAdapter> = {
  local: localAdapter,
  "vercel-blob": vercelBlobAdapter,
  "demo-discard": demoDiscardAdapter,
  // s3:         implement and register
  // cloudinary: implement and register
};

export function getStorageAdapter(): StorageAdapter {
  const id = trim(process.env.UPLOAD_PROVIDER) || "local";
  return adapters[id] ?? unconfiguredAdapter;
}
