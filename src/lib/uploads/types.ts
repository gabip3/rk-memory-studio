/** Photo upload contracts, shared between the browser and the server. */

export type UploadStatus =
  | "pending"
  | "uploading"
  | "stored"
  | "error";

export type UploadedPhoto = {
  /** Client-generated id, stable for the life of the cart line. */
  id: string;
  fileName: string;
  /** Bytes. */
  size: number;
  mimeType: string;
  /** Natural pixel dimensions, read in the browser before upload. */
  width: number | null;
  height: number | null;
  /**
   * Blob URL used for the on-page preview. Client-only and revoked on removal -
   * never persisted or sent to the server.
   */
  previewUrl?: string;
  /** Key returned by the storage adapter once the file is stored. */
  storageKey: string | null;
  /** Retrievable URL once stored, if the adapter exposes one. */
  url: string | null;
  status: UploadStatus;
  /** Blocking problem - the file was rejected. */
  error?: string;
  /**
   * Non-blocking advisory, e.g. a low-resolution original. The customer can
   * still order; we simply tell them the truth about the file.
   */
  warning?: string;
};

export type UploadResult = {
  ok: boolean;
  storageKey?: string;
  url?: string;
  error?: string;
};

export interface StorageAdapter {
  readonly id: string;
  /** True when the adapter has everything it needs to accept real uploads. */
  readonly isConfigured: boolean;
  /** Reason it is not configured, for staff-facing diagnostics. */
  readonly reason: string;
  store(file: File | Blob, meta: { fileName: string; mimeType: string }): Promise<UploadResult>;
}
