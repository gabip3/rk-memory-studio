"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/CartProvider";
import { useDialog } from "@/lib/hooks/useDialog";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";

/** Small square preview of the first few photos in a line. */
function PhotoStack({
  photos,
}: {
  photos: { id: string; previewUrl?: string; fileName: string }[];
}) {
  const shown = photos.slice(0, 3);
  const extra = photos.length - shown.length;

  return (
    <div className="flex shrink-0 -space-x-3">
      {shown.map((photo) => (
        <span
          key={photo.id}
          className="grid h-16 w-16 place-items-center overflow-hidden border border-taupe/60 bg-cream"
        >
          {photo.previewUrl ? (
            // Customer blobs are not next/image-optimisable, so a plain img is
            // correct here. Dimensions are fixed by the parent, so no CLS.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo.previewUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <Icon name="image" size={18} className="text-taupe" />
          )}
        </span>
      ))}

      {extra > 0 ? (
        <span className="tabular grid h-16 w-16 place-items-center border border-taupe/60 bg-cream text-[0.8125rem] font-medium text-ink-muted">
          +{extra}
        </span>
      ) : null}
    </div>
  );
}

export function CartDrawer() {
  const { lines, isOpen, closeCart, removeLine, subtotal, itemCount } = useCart();
  const panelRef = useDialog<HTMLDivElement>(isOpen, closeCart);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[var(--z-modal)]">
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeCart}
        className="u-anim-fade absolute inset-0 bg-charcoal/55 backdrop-blur-[2px]"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        tabIndex={-1}
        className="u-anim-drawer absolute inset-y-0 right-0 flex w-[min(29rem,100vw)] flex-col bg-ivory shadow-lift outline-none"
      >
        <div className="flex items-center justify-between border-b border-taupe/45 px-5 py-4 sm:px-6">
          <h2 className="font-display text-[1.375rem]">
            Your Cart
            {itemCount > 0 ? (
              <span className="tabular ml-2 text-[1rem] text-ink-muted">
                ({itemCount})
              </span>
            ) : null}
          </h2>

          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="-mr-2 grid h-11 w-11 place-items-center text-ink transition-colors duration-[var(--dur-base)] hover:text-gold-display"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full border border-gold/40 text-gold">
              <Icon name="cart" size={26} />
            </span>
            <p className="mt-6 font-display text-[1.5rem]">Your cart is empty</p>
            <p className="u-measure-tight mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
              Choose a keepsake, upload your photos, and it will appear here.
            </p>
            <Button
              href="/shop"
              variant="solid"
              className="mt-8"
              onClick={closeCart}
            >
              Browse Keepsakes
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6">
              {lines.map((line) => (
                <li
                  key={line.id}
                  className="flex gap-4 border-b border-taupe/40 py-5"
                >
                  <PhotoStack photos={line.photos} />

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/shop/${line.productSlug}`}
                      onClick={closeCart}
                      className="font-display text-[1.0625rem] leading-snug text-ink transition-colors duration-[var(--dur-base)] hover:text-gold-display"
                    >
                      {line.productName}
                    </Link>

                    <p className="tabular mt-1 text-[0.875rem] text-ink-muted">
                      {line.variantName ? `${line.variantName} · ` : ""}
                      {line.quantityLabel} &middot; {line.photos.length}{" "}
                      {line.photos.length === 1 ? "photo" : "photos"}
                    </p>

                    {(line.personalization.name ||
                      line.personalization.date ||
                      line.personalization.message) && (
                      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-subtle">
                        {[
                          line.personalization.name,
                          line.personalization.date,
                          line.personalization.message,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}

                    <div className="mt-2.5 flex items-center justify-between gap-3">
                      <span className="tabular text-[0.875rem] font-medium text-ink">
                        {formatPrice(
                          line.unitPrice == null
                            ? null
                            : line.unitPrice * line.quantity
                        )}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeLine(line.id)}
                        className="-mr-2 inline-flex min-h-11 items-center gap-1.5 px-2 text-[0.75rem] uppercase tracking-[0.14em] text-ink-subtle transition-colors duration-[var(--dur-base)] hover:text-danger"
                      >
                        <Icon name="trash" size={15} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-taupe/45 bg-cream px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 sm:px-6">
              <div className="flex items-baseline justify-between">
                <span className="u-caps text-[0.6875rem] text-ink">Subtotal</span>
                <span className="tabular font-display text-[1.375rem] text-ink">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {subtotal == null ? (
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-muted">
                  Your total is confirmed at checkout, where shipping and any
                  event pricing are applied.
                </p>
              ) : null}

              <Button
                href="/checkout"
                variant="solid"
                fullWidth
                className="mt-4"
                onClick={closeCart}
              >
                Continue to Checkout
              </Button>

              <button
                type="button"
                onClick={closeCart}
                className="mt-1 min-h-11 w-full text-[0.75rem] uppercase tracking-[0.16em] text-ink-muted transition-colors duration-[var(--dur-base)] hover:text-ink"
              >
                Keep Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
