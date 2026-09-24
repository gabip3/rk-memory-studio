/**
 * The order manifest: what lets the studio find a customer's photographs from
 * the reference that arrives with the order.
 *
 * Check Cherry owns payment and the order record, but it never sees the
 * photographs. They are uploaded here, and all Check Cherry receives is
 * `RK-XXXXXX`. Without a record written on our side, that code points at
 * nothing and the order cannot be fulfilled. So the manifest is written BEFORE
 * the customer is handed over to pay, and failing to write it stops the
 * checkout rather than producing an order nobody can complete.
 *
 * `previewUrl` is deliberately excluded: it is a browser blob: URL that is
 * valid only inside the tab that created it, and meaningless once stored.
 */

import type { CheckoutDraft } from "./types";

export type ManifestPhoto = {
  /** Where the file actually lives, as returned by the storage adapter. */
  storageKey: string;
  /** The customer's own filename, useful when they refer to it by name. */
  fileName: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  /** e.g. a low-resolution advisory the customer chose to accept. */
  warning?: string;
};

export type ManifestLine = {
  lineId: string;
  productSlug: string;
  productName: string;
  variantName: string | null;
  quantity: number;
  quantityLabel: string;
  personalization: CheckoutDraft["cart"]["lines"][number]["personalization"];
  notes?: string;
  photos: ManifestPhoto[];
};

export type OrderManifest = {
  reference: string;
  /** ISO 8601, so the file reads correctly wherever the studio opens it. */
  createdAt: string;
  customer?: CheckoutDraft["customer"];
  lines: ManifestLine[];
  totalPhotos: number;
};

export function buildOrderManifest(draft: CheckoutDraft): OrderManifest {
  const lines: ManifestLine[] = draft.cart.lines.map((line) => ({
    lineId: line.id,
    productSlug: line.productSlug,
    productName: line.productName,
    variantName: line.variantName ?? null,
    quantity: line.quantity,
    quantityLabel: line.quantityLabel,
    personalization: line.personalization,
    ...(line.notes ? { notes: line.notes } : {}),
    photos: line.photos.map((photo) => ({
      storageKey: photo.storageKey ?? "",
      fileName: photo.fileName,
      mimeType: photo.mimeType,
      size: photo.size,
      width: photo.width,
      height: photo.height,
      ...(photo.warning ? { warning: photo.warning } : {}),
    })),
  }));

  return {
    reference: draft.reference,
    createdAt: new Date(draft.createdAt).toISOString(),
    ...(draft.customer ? { customer: draft.customer } : {}),
    lines,
    totalPhotos: lines.reduce((n, line) => n + line.photos.length, 0),
  };
}

/**
 * Photos the browser says belong to the order but that never reached storage.
 * An order containing one is unfulfillable, so checkout refuses it instead of
 * taking money for photographs the studio does not have.
 */
export function unstoredPhotos(draft: CheckoutDraft): string[] {
  return draft.cart.lines.flatMap((line) =>
    line.photos
      .filter((photo) => !photo.storageKey || photo.status !== "stored")
      .map((photo) => photo.fileName)
  );
}
