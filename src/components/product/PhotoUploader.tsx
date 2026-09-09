"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import {
  FILE_INPUT_ACCEPT,
  formatBytes,
  qualityWarning,
  readImageDimensions,
  validateFile,
} from "@/lib/uploads/validation";
import type { UploadedPhoto } from "@/lib/uploads/types";

/**
 * Photo upload experience.
 *
 * Built phone-first: the whole panel is a tap target that opens the camera roll,
 * the previews are large enough to recognise at arm's length, and every file's
 * state (uploading / ready / problem) is visible without hovering.
 *
 * Uploads start immediately on selection so the customer is not waiting at the
 * "Add to cart" step, and each file reports independently - one bad file never
 * blocks the rest of the order.
 */

let counter = 0;
const nextId = () => `photo-${Date.now().toString(36)}-${counter++}`;

export function PhotoUploader({
  photos,
  onChange,
  maxPhotos,
  minPhotos,
  helper,
}: {
  photos: UploadedPhoto[];
  /**
   * Accepts a functional update, exactly like a React setState. This matters:
   * several uploads finish concurrently, and each must apply its result to the
   * newest list rather than to whatever it captured when it started.
   */
  onChange: React.Dispatch<React.SetStateAction<UploadedPhoto[]>>;
  maxPhotos: number;
  minPhotos: number;
  helper: string;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const dragDepth = useRef(0);

  // Blob URLs are a finite resource - release them when the component unmounts.
  // The ref is written in an effect (never during render) so it simply mirrors
  // the latest list for the unmount cleanup to read.
  const photosRef = useRef(photos);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(
    () => () => {
      photosRef.current.forEach((photo) => {
        if (photo.previewUrl) URL.revokeObjectURL(photo.previewUrl);
      });
    },
    []
  );

  const remaining = maxPhotos - photos.length;

  const uploadOne = useCallback(
    async (file: File, photo: UploadedPhoto) => {
      const body = new FormData();
      body.append("files", file);
      body.append("ids", photo.id);

      try {
        const response = await fetch("/api/uploads", { method: "POST", body });
        const data = await response.json();
        const result = data?.results?.[0];

        onChange((current) =>
          current.map((p) =>
            p.id === photo.id
              ? result?.ok
                ? {
                    ...p,
                    status: "stored" as const,
                    storageKey: result.storageKey ?? null,
                    url: result.url ?? null,
                  }
                : {
                    ...p,
                    status: "error" as const,
                    error:
                      result?.error ??
                      data?.error ??
                      "We could not save this photo. Please try again.",
                  }
              : p
          )
        );
      } catch {
        onChange((current) =>
          current.map((p) =>
            p.id === photo.id
              ? {
                  ...p,
                  status: "error" as const,
                  error:
                    "Upload failed - check your connection and try this photo again.",
                }
              : p
          )
        );
      }
    },
    [onChange]
  );

  const addFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList);
      if (files.length === 0) return;

      const room = maxPhotos - photos.length;

      if (room <= 0) {
        setNotice(
          `You have already added the maximum of ${maxPhotos} photos for this quantity.`
        );
        return;
      }

      const accepted = files.slice(0, room);
      const overflow = files.length - accepted.length;

      const prepared: UploadedPhoto[] = [];

      for (const file of accepted) {
        const check = validateFile(file);
        const id = nextId();

        if (!check.ok) {
          prepared.push({
            id,
            fileName: file.name,
            size: file.size,
            mimeType: file.type,
            width: null,
            height: null,
            storageKey: null,
            url: null,
            status: "error",
            error: check.error,
          });
          continue;
        }

        const { width, height } = await readImageDimensions(file);

        prepared.push({
          id,
          fileName: file.name,
          size: file.size,
          mimeType: file.type,
          width,
          height,
          previewUrl: URL.createObjectURL(file),
          storageKey: null,
          url: null,
          status: "uploading",
          warning: qualityWarning(width, height),
        });
      }

      onChange((current) => [...current, ...prepared]);

      setNotice(
        overflow > 0
          ? `Added ${accepted.length} ${accepted.length === 1 ? "photo" : "photos"}. ${overflow} could not be added - the maximum for this quantity is ${maxPhotos}.`
          : `Added ${accepted.length} ${accepted.length === 1 ? "photo" : "photos"}.`
      );

      // Upload valid files in parallel; each reports its own outcome.
      await Promise.all(
        prepared
          .filter((photo) => photo.status === "uploading")
          .map((photo, index) => {
            const file = accepted.find((f) => f.name === photo.fileName) ?? accepted[index];
            return file ? uploadOne(file, photo) : Promise.resolve();
          })
      );
    },
    [maxPhotos, photos.length, onChange, uploadOne]
  );

  const removePhoto = (id: string) => {
    const target = photos.find((p) => p.id === id);
    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
    onChange((current) => current.filter((p) => p.id !== id));
    setNotice("Photo removed.");
  };

  const retryPhoto = (id: string) => {
    onChange((current) =>
      current.map((p) =>
        p.id === id ? { ...p, status: "pending" as const, error: undefined } : p
      )
    );
    inputRef.current?.click();
  };

  /* ---- Drag and drop --------------------------------------------------- */

  const onDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    dragDepth.current += 1;
    setIsDragging(true);
  };

  const onDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) {
      dragDepth.current = 0;
      setIsDragging(false);
    }
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    dragDepth.current = 0;
    setIsDragging(false);
    if (event.dataTransfer.files?.length) void addFiles(event.dataTransfer.files);
  };

  const readyCount = photos.filter((p) => p.status === "stored").length;
  const errorCount = photos.filter((p) => p.status === "error").length;
  const busyCount = photos.filter((p) => p.status === "uploading").length;

  return (
    <div>
      {/* ---- Drop zone ---------------------------------------------------- */}
      <div
        onDragEnter={onDragEnter}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative border-2 border-dashed transition-[border-color,background-color] duration-[var(--dur-base)]",
          isDragging
            ? "border-gold-ink bg-gold-wash"
            : "border-taupe bg-cream/60 hover:border-gold hover:bg-gold-wash/50",
          remaining <= 0 && "opacity-60"
        )}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={FILE_INPUT_ACCEPT}
          multiple={maxPhotos > 1}
          disabled={remaining <= 0}
          onChange={(event) => {
            if (event.target.files?.length) void addFiles(event.target.files);
            // Reset so re-picking the same file still fires a change event.
            event.target.value = "";
          }}
          className="sr-only"
        />

        <label
          htmlFor={inputId}
          className={cn(
            "flex flex-col items-center gap-4 px-6 py-12 text-center sm:py-14",
            remaining > 0 ? "cursor-pointer" : "cursor-not-allowed"
          )}
        >
          <span
            aria-hidden="true"
            className="grid h-16 w-16 place-items-center rounded-full border border-gold/45 bg-ivory text-gold"
          >
            <Icon name="upload" size={26} strokeWidth={1.2} />
          </span>

          <span className="font-display text-[1.5rem] leading-snug text-ink">
            Upload Your Photos
          </span>

          <span className="u-measure-tight text-[0.9375rem] leading-relaxed text-ink-muted">
            <span className="hidden sm:inline">
              Drag your photos here, or{" "}
              <span className="text-gold-ink underline underline-offset-4">
                browse your files
              </span>
              .
            </span>
            <span className="sm:hidden">
              Tap to choose photos from your camera roll.
            </span>
          </span>

          <span className="tabular text-[0.8125rem] text-ink-subtle">
            {remaining > 0
              ? `${photos.length} of ${maxPhotos} added`
              : `Maximum of ${maxPhotos} photos reached`}
          </span>
        </label>
      </div>

      {/* Guidance is persistent, not a placeholder that disappears */}
      <div className="mt-4 flex items-start gap-2.5 border-l-2 border-gold/50 bg-gold-wash/50 py-3 pl-4 pr-4">
        <Icon name="info" size={16} className="mt-0.5 shrink-0 text-gold-ink" />
        <p className="text-[0.875rem] leading-relaxed text-ink-muted">
          {helper}{" "}
          <strong className="font-medium text-ink">
            For best results, please upload the original, highest-resolution
            version of your photograph
          </strong>, not a screenshot or a copy saved from social media.
        </p>
      </div>

      {/* Live region: announces additions, removals and failures */}
      <p role="status" aria-live="polite" className="sr-only">
        {notice}
      </p>

      {/* ---- Previews ------------------------------------------------------ */}
      {photos.length > 0 ? (
        <>
          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-1">
            <h3 className="u-eyebrow">
              Your Photos ({photos.length}/{maxPhotos})
            </h3>

            {busyCount > 0 ? (
              <span className="text-[0.8125rem] text-ink-muted">
                Uploading {busyCount}...
              </span>
            ) : null}

            {errorCount > 0 ? (
              <span className="text-[0.8125rem] text-danger">
                {errorCount} need{errorCount === 1 ? "s" : ""} attention
              </span>
            ) : null}

            {readyCount === photos.length && photos.length > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-[0.8125rem] text-success">
                <Icon name="check-circle" size={14} />
                All photos ready
              </span>
            ) : null}
          </div>

          <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            {photos.map((photo) => (
              <li key={photo.id} className="group relative">
                <div
                  className={cn(
                    "relative aspect-square overflow-hidden border bg-cream",
                    photo.status === "error"
                      ? "border-danger"
                      : photo.warning
                        ? "border-gold"
                        : "border-taupe/60"
                  )}
                >
                  {photo.previewUrl ? (
                    // Customer blobs cannot be optimised by next/image.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo.previewUrl}
                      alt={`Preview of ${photo.fileName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="grid h-full w-full place-items-center text-taupe">
                      <Icon name="image" size={22} />
                    </span>
                  )}

                  {photo.status === "uploading" ? (
                    <span className="absolute inset-0 grid place-items-center bg-ivory/70">
                      <span
                        aria-hidden="true"
                        className="h-6 w-6 rounded-full border-2 border-gold-ink border-r-transparent motion-safe:animate-spin"
                      />
                      <span className="sr-only">Uploading {photo.fileName}</span>
                    </span>
                  ) : null}

                  {photo.status === "stored" ? (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-1.5 left-1.5 grid h-6 w-6 place-items-center rounded-full bg-success text-ivory"
                    >
                      <Icon name="check" size={13} strokeWidth={2} />
                    </span>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    aria-label={`Remove ${photo.fileName}`}
                    className="absolute right-1.5 top-1.5 grid h-8 w-8 place-items-center rounded-full bg-charcoal/80 text-ivory opacity-100 transition-colors duration-[var(--dur-base)] hover:bg-danger sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                  >
                    <Icon name="close" size={14} strokeWidth={2} />
                  </button>
                </div>

                <p className="tabular mt-1.5 truncate text-[0.6875rem] text-ink-subtle">
                  {photo.fileName}
                </p>
                <p className="tabular text-[0.6875rem] text-ink-subtle">
                  {formatBytes(photo.size)}
                  {photo.width && photo.height
                    ? ` · ${photo.width}×${photo.height}`
                    : ""}
                </p>

                {photo.status === "error" ? (
                  <p className="mt-1 text-[0.6875rem] leading-snug text-danger">
                    {photo.error}{" "}
                    <button
                      type="button"
                      onClick={() => retryPhoto(photo.id)}
                      className="underline underline-offset-2"
                    >
                      Choose another
                    </button>
                  </p>
                ) : null}

                {photo.warning && photo.status !== "error" ? (
                  <p className="mt-1 text-[0.6875rem] leading-snug text-gold-ink">
                    Lower resolution than we recommend
                  </p>
                ) : null}
              </li>
            ))}
          </ul>

          {photos.some((p) => p.warning) ? (
            <p className="mt-4 flex items-start gap-2.5 text-[0.8125rem] leading-relaxed text-ink-muted">
              <Icon name="alert" size={15} className="mt-0.5 shrink-0 text-gold-ink" />
              Some photos are smaller than we recommend. You can still order them. If you have the original files, they will print with more
              detail. We will contact you if anything will not reproduce well.
            </p>
          ) : null}
        </>
      ) : (
        <p className="mt-5 text-[0.875rem] text-ink-muted">
          {minPhotos === 1
            ? "At least one photo is needed to create your keepsake."
            : `At least ${minPhotos} photos are needed to create your keepsake.`}
        </p>
      )}
    </div>
  );
}
