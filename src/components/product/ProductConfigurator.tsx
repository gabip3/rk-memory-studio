"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/cart/CartProvider";
import { defaultVariant, maxPhotosFor, type Product } from "@/lib/data/products";
import type { UploadedPhoto } from "@/lib/uploads/types";
import type { CartLine, PersonalizationValues } from "@/lib/checkout/types";
import { formatPrice } from "@/lib/format";
import { VariantSelector } from "./VariantSelector";
import { QuantitySelector } from "./QuantitySelector";
import { PhotoUploader } from "./PhotoUploader";
import { PersonalizationFields } from "./PersonalizationFields";

/** Numbered step wrapper - gives the flow a visible spine on every screen. */
function Step({
  index,
  title,
  hint,
  complete,
  children,
  id,
}: {
  index: number;
  title: string;
  hint?: string;
  complete?: boolean;
  children: React.ReactNode;
  id: string;
}) {
  return (
    <section aria-labelledby={`${id}-heading`} className="scroll-mt-32">
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className={cn(
            "tabular mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border text-[0.8125rem] font-medium transition-colors duration-[var(--dur-base)]",
            complete
              ? "border-success bg-success text-ivory"
              : "border-gold bg-gold-wash text-gold-ink"
          )}
        >
          {complete ? <Icon name="check" size={15} strokeWidth={2.2} /> : index}
        </span>

        <div className="min-w-0 flex-1">
          <h2
            id={`${id}-heading`}
            className="font-display text-[1.5rem] leading-snug sm:text-[1.75rem]"
          >
            {title}
          </h2>
          {hint ? (
            <p className="u-measure mt-1.5 text-[0.9375rem] leading-relaxed text-ink-muted">
              {hint}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 sm:pl-13 lg:pl-[3.25rem]">{children}</div>
    </section>
  );
}

export function ProductConfigurator({ product }: { product: Product }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addLine } = useCart();

  // Deep link support: /shop/custom-photo-magnets?qty=24 arrives pre-selected.
  const initialQuantity = useMemo(() => {
    const requested = Number(searchParams.get("qty"));
    const match = product.quantityOptions.find((o) => o.count === requested);
    return (
      match ??
      product.quantityOptions.find((o) => o.default) ??
      product.quantityOptions[0]
    );
  }, [searchParams, product.quantityOptions]);

  const [variant, setVariant] = useState(() => defaultVariant(product));
  const [quantity, setQuantity] = useState(initialQuantity);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [personalization, setPersonalization] = useState<PersonalizationValues>({});
  const [attempted, setAttempted] = useState(false);
  const [adding, setAdding] = useState(false);

  const uploadSectionRef = useRef<HTMLDivElement>(null);

  // Steps renumber themselves when a product has no shape/size choice, so the
  // sequence never shows a gap.
  const hasVariants = Boolean(product.variants?.length);
  const step = (n: number) => (hasVariants ? n : n - 1);

  const maxPhotos = maxPhotosFor(product, quantity.count);
  const minPhotos = product.photoPolicy.min;

  const usablePhotos = photos.filter((p) => p.status === "stored");
  const stillUploading = photos.some((p) => p.status === "uploading");
  const failedPhotos = photos.filter((p) => p.status === "error");

  const photosReady = usablePhotos.length >= minPhotos;
  const canAdd = photosReady && !stillUploading;

  const handleAddToCart = () => {
    setAttempted(true);

    if (!canAdd) {
      // Send focus and the viewport to the thing that is blocking them.
      uploadSectionRef.current?.scrollIntoView({ block: "center" });
      uploadSectionRef.current?.focus();
      return;
    }

    setAdding(true);

    const line: CartLine = {
      id: `line-${Date.now().toString(36)}`,
      productSlug: product.slug,
      productName: product.name,
      quantity: quantity.count,
      quantityLabel: quantity.label,
      variantId: variant?.id ?? null,
      variantName: variant?.name ?? null,
      // Variant ids win when the business sells each shape as its own item.
      checkCherryItemId:
        variant?.checkCherryItemId ?? product.checkCherryItemId,
      etsyListingId: variant?.etsyListingId ?? product.etsyListingId,
      personalization,
      photos: usablePhotos,
      unitPrice: variant?.price ?? quantity.price ?? product.price,
      addedAt: Date.now(),
    };

    addLine(line);
    setAdding(false);

    // Reset the configurator so the next order starts clean, but keep the
    // quantity - customers ordering sets usually want the same size again.
    setPhotos([]);
    setPersonalization({});
    setAttempted(false);
  };

  return (
    <div className="space-y-14 lg:space-y-16">
      {/* ---- 1. Shape and size (only when the product has variants) -------- */}
      {hasVariants && variant ? (
        <Step
          id="step-variant"
          index={1}
          title="Choose Your Shape"
          hint="Both shapes are made from the same photo, so pick whichever you prefer."
          complete
        >
          <VariantSelector
            variants={product.variants!}
            value={variant.id}
            onChange={setVariant}
          />
        </Step>
      ) : null}

      {/* ---- Quantity ------------------------------------------------------ */}
      <Step
        id="step-quantity"
        index={step(2)}
        title="Choose Your Quantity"
        hint="You can change this at any point before adding to your cart."
        complete
      >
        <QuantitySelector
          options={product.quantityOptions}
          value={quantity.count}
          onChange={(option) => {
            setQuantity(option);
            // Keep the URL shareable and the back button meaningful.
            router.replace(`?qty=${option.count}`, { scroll: false });
          }}
        />
      </Step>

      {/* ---- 2. Photos ------------------------------------------------------ */}
      <div ref={uploadSectionRef} tabIndex={-1} className="outline-none">
        <Step
          id="step-photos"
          index={step(3)}
          title="Upload Your Photos"
          hint={`Upload your favorite photos. You can add up to ${maxPhotos} for this quantity.`}
          complete={photosReady && !stillUploading}
        >
          <PhotoUploader
            photos={photos}
            onChange={setPhotos}
            maxPhotos={maxPhotos}
            minPhotos={minPhotos}
            helper={product.photoPolicy.helper}
          />

          {attempted && !photosReady ? (
            <p
              role="alert"
              className="mt-5 flex items-start gap-2.5 border-l-2 border-danger bg-danger-wash px-4 py-3 text-[0.875rem] leading-relaxed text-danger"
            >
              <Icon name="alert" size={16} className="mt-0.5 shrink-0" />
              <span>
                {photos.length === 0
                  ? "Please add at least one photo before adding this to your cart."
                  : failedPhotos.length > 0
                    ? "Some photos did not upload. Remove or replace them, then try again."
                    : `Please add at least ${minPhotos} photos to continue.`}
              </span>
            </p>
          ) : null}
        </Step>
      </div>

      {/* ---- 3. Personalization --------------------------------------------- */}
      <Step
        id="step-personalization"
        index={step(4)}
        title="Add Personalization"
        hint="Optional. Add a name, a date or a short message and we will lay it out to suit your photo."
        complete
      >
        <PersonalizationFields
          fields={product.personalization}
          values={personalization}
          onChange={setPersonalization}
        />
      </Step>

      {/* ---- 4. Review ------------------------------------------------------ */}
      <Step
        id="step-review"
        index={step(5)}
        title="Review Your Order"
        complete={canAdd}
      >
        <div className="border border-taupe/50 bg-cream">
          <dl className="divide-y divide-taupe/45">
            <div className="flex items-baseline justify-between gap-4 px-5 py-4">
              <dt className="text-[0.9375rem] text-ink-muted">Keepsake</dt>
              <dd className="text-right font-display text-[1.125rem] text-ink">
                {product.name}
              </dd>
            </div>

            {variant ? (
              <div className="flex items-baseline justify-between gap-4 px-5 py-4">
                <dt className="text-[0.9375rem] text-ink-muted">Shape</dt>
                <dd className="tabular text-right text-[0.9375rem] font-medium text-ink">
                  {variant.name} ({variant.dimensions})
                </dd>
              </div>
            ) : null}

            <div className="flex items-baseline justify-between gap-4 px-5 py-4">
              <dt className="text-[0.9375rem] text-ink-muted">Quantity</dt>
              <dd className="tabular text-right text-[0.9375rem] font-medium text-ink">
                {quantity.label}
                {quantity.note ? ` (${quantity.note})` : ""}
              </dd>
            </div>

            <div className="flex items-baseline justify-between gap-4 px-5 py-4">
              <dt className="text-[0.9375rem] text-ink-muted">Photos</dt>
              <dd className="tabular text-right text-[0.9375rem] font-medium text-ink">
                {stillUploading ? (
                  <span className="text-ink-muted">Uploading&hellip;</span>
                ) : (
                  `${usablePhotos.length} ready`
                )}
              </dd>
            </div>

            {personalization.name || personalization.date || personalization.message ? (
              <div className="flex items-baseline justify-between gap-4 px-5 py-4">
                <dt className="text-[0.9375rem] text-ink-muted">Personalization</dt>
                <dd className="max-w-[60%] text-right text-[0.9375rem] text-ink">
                  {[personalization.name, personalization.date, personalization.message]
                    .filter(Boolean)
                    .join(" · ")}
                </dd>
              </div>
            ) : null}

            <div className="flex items-baseline justify-between gap-4 px-5 py-4">
              <dt className="text-[0.9375rem] text-ink-muted">Price</dt>
              <dd className="tabular text-right text-[0.9375rem] font-medium text-ink">
                {formatPrice(quantity.price ?? product.price)}
              </dd>
            </div>
          </dl>

          <div className="border-t border-taupe/45 px-5 py-4">
            <p className="flex items-start gap-2.5 text-[0.8125rem] leading-relaxed text-ink-muted">
              <Icon name="info" size={15} className="mt-0.5 shrink-0 text-gold-ink" />
              <span>
                We review every photo before production. If anything will not
                reproduce well, we will contact you before we make your order.
              </span>
            </p>
          </div>
        </div>

        {/* Desktop action - the mobile one lives in the sticky bar below */}
        <div className="mt-7 hidden lg:block">
          <Button
            variant="solid"
            size="lg"
            onClick={handleAddToCart}
            loading={adding}
            loadingLabel="Adding"
            disabled={stillUploading}
            className="w-full sm:w-auto"
          >
            {stillUploading ? "Waiting for uploads" : "Add to Cart"}
          </Button>
        </div>
      </Step>

      {/* ---- Sticky mobile action bar --------------------------------------- */}
      <div className="sticky bottom-0 z-[var(--z-sticky)] -mx-5 border-t border-taupe/50 bg-ivory/97 px-5 pb-[max(0.875rem,env(safe-area-inset-bottom))] pt-3.5 backdrop-blur-md sm:-mx-8 sm:px-8 lg:hidden">
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="tabular truncate text-[0.8125rem] text-ink-muted">
              {variant ? `${variant.name} · ` : ""}
              {quantity.label} &middot;{" "}
              {stillUploading
                ? "uploading…"
                : `${usablePhotos.length}/${maxPhotos} photos`}
            </p>
            <p className="tabular truncate text-[0.9375rem] font-medium text-ink">
              {formatPrice(quantity.price ?? product.price)}
            </p>
          </div>

          <Button
            variant="solid"
            onClick={handleAddToCart}
            loading={adding}
            loadingLabel="Adding"
            disabled={stillUploading}
            className="shrink-0"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
