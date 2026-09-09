"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { formatPrice } from "@/lib/format";

/** Full-page cart. Shares state with the drawer via CartProvider. */
export function CartContents() {
  const { lines, removeLine, subtotal, clear, hydrated } = useCart();

  // Until localStorage has been read, render a stable skeleton so the server
  // and client markup match and nothing flashes.
  if (!hydrated) {
    return (
      <div className="u-skeleton mx-auto h-64 max-w-[52rem]" aria-hidden="true" />
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-[38rem] border border-taupe/50 bg-cream px-8 py-16 text-center">
        <span
          aria-hidden="true"
          className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold/45 text-gold"
        >
          <Icon name="cart" size={26} strokeWidth={1.2} />
        </span>

        <h2 className="mt-6 font-display text-[1.75rem]">Your cart is empty</h2>

        <p className="u-measure mx-auto mt-4 text-[1rem] leading-[1.8] text-ink-muted">
          Choose a keepsake, upload the photographs you would like us to use, and
          your order will appear here.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/shop" variant="solid">
            Browse Keepsakes
          </Button>
          <Button href="/how-it-works" variant="outline">
            How It Works
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-14">
      <div>
        <ul className="border-t border-taupe/45">
          {lines.map((line) => (
            <li
              key={line.id}
              className="flex flex-col gap-5 border-b border-taupe/45 py-7 sm:flex-row"
            >
              {/* Photo strip */}
              <ul className="flex shrink-0 gap-2">
                {line.photos.slice(0, 3).map((photo) => (
                  <li
                    key={photo.id}
                    className="grid h-20 w-20 place-items-center overflow-hidden border border-taupe/60 bg-cream"
                  >
                    {photo.previewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo.previewUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Icon name="image" size={20} className="text-taupe" />
                    )}
                  </li>
                ))}
                {line.photos.length > 3 ? (
                  <li className="tabular grid h-20 w-20 place-items-center border border-taupe/60 bg-cream text-[0.875rem] text-ink-muted">
                    +{line.photos.length - 3}
                  </li>
                ) : null}
              </ul>

              <div className="min-w-0 flex-1">
                <h2 className="font-display text-[1.375rem] leading-snug">
                  <Link
                    href={`/shop/${line.productSlug}`}
                    className="transition-colors duration-[var(--dur-base)] hover:text-gold-display"
                  >
                    {line.productName}
                  </Link>
                </h2>

                <dl className="mt-2.5 space-y-1 text-[0.9375rem]">
                  {line.variantName ? (
                    <div className="flex gap-2">
                      <dt className="text-ink-muted">Shape:</dt>
                      <dd className="text-ink">{line.variantName}</dd>
                    </div>
                  ) : null}
                  <div className="flex gap-2">
                    <dt className="text-ink-muted">Quantity:</dt>
                    <dd className="tabular text-ink">{line.quantityLabel}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-ink-muted">Photos:</dt>
                    <dd className="tabular text-ink">{line.photos.length}</dd>
                  </div>
                  {line.personalization.name ||
                  line.personalization.date ||
                  line.personalization.message ? (
                    <div className="flex gap-2">
                      <dt className="text-ink-muted">Personalization:</dt>
                      <dd className="text-ink">
                        {[
                          line.personalization.name,
                          line.personalization.date,
                          line.personalization.message,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </dd>
                    </div>
                  ) : null}
                </dl>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <span className="tabular text-[1rem] font-medium text-ink">
                    {formatPrice(
                      line.unitPrice == null ? null : line.unitPrice * line.quantity
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeLine(line.id)}
                    className="-mr-2 inline-flex min-h-11 items-center gap-1.5 px-2 text-[0.75rem] uppercase tracking-[0.14em] text-ink-subtle transition-colors duration-[var(--dur-base)] hover:text-danger"
                  >
                    <Icon name="trash" size={15} />
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <Button href="/shop" variant="link">
            <Icon name="arrow-left" size={15} />
            Continue Shopping
          </Button>

          <button
            type="button"
            onClick={clear}
            className="min-h-11 text-[0.75rem] uppercase tracking-[0.14em] text-ink-subtle transition-colors duration-[var(--dur-base)] hover:text-danger"
          >
            Empty Cart
          </button>
        </div>
      </div>

      {/* Summary */}
      <aside
        aria-labelledby="summary-heading"
        className="lg:sticky lg:top-32 lg:self-start"
      >
        <div className="border border-taupe/50 bg-cream p-7">
          <h2 id="summary-heading" className="u-eyebrow">
            Order Summary
          </h2>

          <dl className="mt-6 space-y-3 border-b border-taupe/45 pb-6">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[0.9375rem] text-ink-muted">Items</dt>
              <dd className="tabular text-[0.9375rem] text-ink">{lines.length}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[0.9375rem] text-ink-muted">Photos uploaded</dt>
              <dd className="tabular text-[0.9375rem] text-ink">
                {lines.reduce((n, line) => n + line.photos.length, 0)}
              </dd>
            </div>
          </dl>

          <div className="mt-6 flex items-baseline justify-between gap-4">
            <span className="u-caps text-[0.6875rem] text-ink">Subtotal</span>
            <span className="tabular font-display text-[1.5rem] text-ink">
              {formatPrice(subtotal)}
            </span>
          </div>

          {subtotal == null ? (
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-muted">
              Your total, shipping and any event pricing are confirmed at
              checkout.
            </p>
          ) : null}

          <Button href="/checkout" variant="solid" size="lg" fullWidth className="mt-6">
            Continue to Checkout
          </Button>
        </div>
      </aside>
    </div>
  );
}
