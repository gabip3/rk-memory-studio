"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { TextField } from "@/components/ui/Field";
import { formatPrice } from "@/lib/format";
import { site, isPlaceholder } from "@/lib/site";
import type { CheckoutHandoff } from "@/lib/checkout/types";

type EmbedHandoff = Extract<CheckoutHandoff, { status: "embed" }>;
type EtsyHandoff = Extract<CheckoutHandoff, { status: "etsy" }>;

type Phase =
  | { state: "review" }
  | { state: "submitting" }
  | { state: "embed"; handoff: EmbedHandoff }
  | { state: "etsy"; handoff: EtsyHandoff }
  | { state: "unavailable"; message: string; reference?: string; reason?: string }
  | { state: "error"; message: string };

/**
 * Checkout handoff.
 *
 * Check Cherry (the default) carries the order reference in the URL, so the
 * customer is simply sent onward and never has to copy or retype anything.
 *
 * The Etsy branch exists because the provider is still registered, but it needs
 * the customer to paste the reference into a text field. Etsy has no checkout
 * API and no buyer-side file upload (both verified against its Open API v3
 * reference), so there is no way to avoid that step there.
 */
export function CheckoutClient({
  checkoutReady,
  provider,
  shopUrl,
}: {
  checkoutReady: boolean;
  provider: "check-cherry" | "etsy";
  shopUrl: string;
}) {
  const { lines, subtotal, hydrated, clear } = useCart();
  const [phase, setPhase] = useState<Phase>({ state: "review" });
  const [copied, setCopied] = useState(false);

  const hasEmail = !isPlaceholder(site.contact.email);
  const totalPhotos = lines.reduce((n, line) => n + line.photos.length, 0);
  const isEtsy = provider === "etsy";

  async function handleContinue(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPhase({ state: "submitting" });

    const data = new FormData(event.currentTarget);
    const customer = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
    };

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines, customer }),
      });

      const result = await response.json();

      if (!result.ok) {
        setPhase({
          state: "unavailable",
          message: result.error ?? "Checkout is not available right now.",
          reference: result.reference,
          reason: result.reason,
        });
        return;
      }

      const handoff: CheckoutHandoff = result.handoff;

      if (handoff.status === "redirect") {
        // Full navigation, not router.push: we are leaving the app.
        window.location.assign(handoff.url);
        return;
      }

      if (handoff.status === "embed") {
        setPhase({ state: "embed", handoff });
        return;
      }

      if (handoff.status === "etsy") {
        setPhase({ state: "etsy", handoff });
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      setPhase({
        state: "unavailable",
        message: "Checkout is not available right now.",
      });
    } catch {
      setPhase({
        state: "error",
        message:
          "We could not reach the server. Check your connection and try again.",
      });
    }
  }

  async function copyReference(reference: string) {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard blocked (insecure context, permissions). The code is on
      // screen in large type, so it can still be read and typed.
      setCopied(false);
    }
  }

  if (!hydrated) {
    return <div className="u-skeleton h-72 w-full" aria-hidden="true" />;
  }

  if (lines.length === 0 && phase.state === "review") {
    return (
      <div className="mx-auto max-w-[38rem] border border-taupe/50 bg-cream px-8 py-16 text-center">
        <h2 className="font-display text-[1.75rem]">Nothing to check out yet</h2>
        <p className="u-measure mx-auto mt-4 text-[1rem] leading-[1.8] text-ink-muted">
          Add a keepsake and your photos, and you will be able to complete your
          order here.
        </p>
        <Button href="/shop" variant="solid" className="mt-8">
          Browse Keepsakes
        </Button>
      </div>
    );
  }

  /* ---- Check Cherry embedded checkout ----------------------------------- */
  if (phase.state === "embed") {
    const { handoff } = phase;

    return (
      <div>
        <div className="mb-6 flex items-start gap-3 border-l-2 border-gold bg-gold-wash/60 px-5 py-4">
          <Icon name="info" size={18} className="mt-0.5 shrink-0 text-gold-ink" />
          <p className="text-[0.9375rem] leading-relaxed text-ink">
            Your photos are uploaded and your order reference is{" "}
            <strong className="tabular font-medium">{handoff.reference}</strong>.
            Complete your payment below.
          </p>
        </div>

        {handoff.embedUrl ? (
          <iframe
            src={handoff.embedUrl}
            title="Checkout"
            className="h-[45rem] w-full border border-taupe/50 bg-ivory"
            // Only what a hosted checkout legitimately needs.
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-top-navigation-by-user-activation"
          />
        ) : (
          // Operator-supplied snippet from the provider dashboard, injected
          // from a server-side env var, never from user input.
          <div
            className="min-h-[35rem] border border-taupe/50 bg-ivory p-4"
            dangerouslySetInnerHTML={{ __html: handoff.embedHtml }}
          />
        )}
      </div>
    );
  }

  /* ---- Etsy handoff (dormant provider) ----------------------------------- */
  if (phase.state === "etsy") {
    const { handoff } = phase;

    return (
      <div className="mx-auto max-w-[46rem]">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-success text-ivory"
          >
            <Icon name="check" size={22} strokeWidth={2.2} />
          </span>
          <h2 className="text-display-s">Your photos are safe with us</h2>
        </div>

        <section
          aria-labelledby="ref-heading"
          className="mt-9 border border-gold/50 bg-gold-wash/60 p-6 sm:p-8"
        >
          <p className="u-eyebrow">Step 1</p>
          <h3 id="ref-heading" className="mt-3 font-display text-[1.5rem]">
            Copy your order code
          </h3>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <p
              className="tabular flex-1 select-all border border-gold bg-ivory px-5 py-4 text-center font-display text-[2rem] tracking-[0.08em] text-ink"
              aria-label={`Your order code is ${handoff.reference.split("").join(" ")}`}
            >
              {handoff.reference}
            </p>

            <Button
              variant="solid"
              size="lg"
              onClick={() => copyReference(handoff.reference)}
            >
              {copied ? "Copied" : "Copy Code"}
            </Button>
          </div>

          <p role="status" aria-live="polite" className="sr-only">
            {copied ? "Order code copied to clipboard." : ""}
          </p>
        </section>

        <section
          aria-labelledby="etsy-heading"
          className="mt-6 border border-taupe/50 bg-cream p-6 sm:p-8"
        >
          <p className="u-eyebrow">Step 2</p>
          <h3 id="etsy-heading" className="mt-3 font-display text-[1.5rem]">
            Complete your order on Etsy
          </h3>

          <p className="u-measure mt-4 text-[0.9375rem] leading-[1.8] text-ink-muted">
            When Etsy asks for{" "}
            <strong className="font-medium text-ink">Personalization</strong>,
            paste your code in. That is how we match your order to the photos you
            just uploaded.
          </p>

          <ul className="mt-6 divide-y divide-taupe/45 border-y border-taupe/45">
            {handoff.items.map((item) => (
              <li
                key={item.lineId}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-display text-[1.125rem] leading-snug">
                    {item.productName}
                  </p>
                  <p className="tabular mt-0.5 text-[0.875rem] text-ink-muted">
                    {item.quantityLabel} &middot; {item.photoCount}{" "}
                    {item.photoCount === 1 ? "photo" : "photos"}
                  </p>
                </div>

                <Button
                  href={item.listingUrl ?? handoff.shopUrl}
                  variant={item.listingUrl ? "solid" : "outline"}
                  size="sm"
                  className="shrink-0"
                >
                  {item.listingUrl ? "Open on Etsy" : "Find on Etsy"}
                </Button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }

  /* ---- Not configured / failed ------------------------------------------- */
  if (phase.state === "unavailable" || phase.state === "error") {
    return (
      <div className="mx-auto max-w-[42rem] border border-gold/50 bg-gold-wash/50 px-8 py-12">
        <span
          aria-hidden="true"
          className="grid h-14 w-14 place-items-center rounded-full border border-gold text-gold-ink"
        >
          <Icon name="alert" size={24} strokeWidth={1.3} />
        </span>

        <h2 className="mt-6 font-display text-[1.75rem]">
          {phase.state === "error"
            ? "We could not continue"
            : "Online checkout is not switched on yet"}
        </h2>

        <p className="u-measure mt-4 text-[1rem] leading-[1.8] text-ink-muted">
          {phase.message}
        </p>

        {"reference" in phase && phase.reference ? (
          <p className="mt-4 text-[0.9375rem] text-ink">
            Your order reference is{" "}
            <strong className="tabular font-medium">{phase.reference}</strong>.
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {hasEmail ? (
            <Button
              href={`mailto:${site.contact.email}?subject=${encodeURIComponent(
                "Order enquiry" +
                  ("reference" in phase && phase.reference
                    ? ` ${phase.reference}`
                    : "")
              )}`}
              variant="solid"
            >
              Email Us to Finish
            </Button>
          ) : (
            <Button href="/contact" variant="solid">
              Contact Us to Finish
            </Button>
          )}

          <Button variant="outline" onClick={() => setPhase({ state: "review" })}>
            Back to Review
          </Button>
        </div>

        {"reason" in phase && phase.reason ? (
          <p className="mt-8 border-t border-gold/40 pt-5 text-[0.8125rem] leading-relaxed text-ink-subtle">
            <strong className="font-medium">Developer note:</strong> {phase.reason}
          </p>
        ) : null}
      </div>
    );
  }

  /* ---- Review + handoff form --------------------------------------------- */
  return (
    <form onSubmit={handleContinue} noValidate>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-14">
        <div>
          {!checkoutReady ? (
            <div className="mb-8 flex items-start gap-3 border-l-2 border-gold bg-gold-wash/60 px-5 py-4">
              <Icon name="info" size={18} className="mt-0.5 shrink-0 text-gold-ink" />
              <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                Our online checkout is being connected. You can still send us
                your order and we will confirm pricing and take payment
                directly.
              </p>
            </div>
          ) : null}

          <h2 className="text-display-s">Your details</h2>
          <p className="u-measure mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
            So we can match your uploaded photos to your order and reach you if a
            photo needs attention.
          </p>

          <div className="mt-7 grid gap-6 sm:grid-cols-2">
            <TextField label="Name" name="name" autoComplete="name" />
            <TextField
              label="Email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              helper="We will send your order reference here."
            />
            <TextField
              label="Phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              className="sm:col-span-2 sm:max-w-[calc(50%-0.75rem)]"
            />
          </div>

          <h2 className="mt-12 text-display-s">Your order</h2>

          <ul className="mt-6 border-t border-taupe/45">
            {lines.map((line) => (
              <li
                key={line.id}
                className="flex items-start justify-between gap-6 border-b border-taupe/45 py-5"
              >
                <div className="min-w-0">
                  <p className="font-display text-[1.125rem] leading-snug">
                    {line.productName}
                  </p>
                  <p className="tabular mt-1 text-[0.875rem] text-ink-muted">
                    {line.variantName ? `${line.variantName} · ` : ""}
                    {line.quantityLabel} &middot; {line.photos.length}{" "}
                    {line.photos.length === 1 ? "photo" : "photos"}
                  </p>
                  {line.personalization.name ||
                  line.personalization.date ||
                  line.personalization.message ? (
                    <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-subtle">
                      {[
                        line.personalization.name,
                        line.personalization.date,
                        line.personalization.message,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  ) : null}
                </div>

                <span className="tabular shrink-0 text-[0.9375rem] font-medium text-ink">
                  {formatPrice(
                    line.unitPrice == null ? null : line.unitPrice * line.quantity
                  )}
                </span>
              </li>
            ))}
          </ul>

          <Link
            href="/cart"
            className="mt-5 inline-flex min-h-11 items-center gap-2 text-[0.75rem] uppercase tracking-[0.14em] text-gold-ink"
          >
            <Icon name="arrow-left" size={14} />
            <span className="u-underline">Edit your cart</span>
          </Link>
        </div>

        {/* Summary rail */}
        <aside
          aria-labelledby="checkout-summary"
          className="lg:sticky lg:top-32 lg:self-start"
        >
          <div className="border border-taupe/50 bg-cream p-7">
            <h2 id="checkout-summary" className="u-eyebrow">
              Summary
            </h2>

            <dl className="mt-6 space-y-3 border-b border-taupe/45 pb-6">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[0.9375rem] text-ink-muted">Items</dt>
                <dd className="tabular text-[0.9375rem] text-ink">{lines.length}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[0.9375rem] text-ink-muted">Photos</dt>
                <dd className="tabular text-[0.9375rem] text-ink">{totalPhotos}</dd>
              </div>
            </dl>

            <div className="mt-6 flex items-baseline justify-between gap-4">
              <span className="u-caps text-[0.6875rem] text-ink">Total</span>
              <span className="tabular font-display text-[1.25rem] text-ink">
                {formatPrice(subtotal)}
              </span>
            </div>

            <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-muted">
              {isEtsy
                ? "Pricing, shipping and payment are handled securely on Etsy."
                : "Pricing, shipping and payment are completed securely through our ordering system."}
            </p>

            <Button
              type="submit"
              variant="solid"
              size="lg"
              fullWidth
              className="mt-6"
              loading={phase.state === "submitting"}
              loadingLabel="Preparing"
            >
              {isEtsy ? "Get My Order Code" : "Continue to Checkout"}
            </Button>

            {isEtsy && checkoutReady && shopUrl ? (
              <Button href={shopUrl} variant="outline" fullWidth className="mt-2">
                Browse Our Etsy Shop
              </Button>
            ) : null}

            <button
              type="button"
              onClick={clear}
              className="mt-2 min-h-11 w-full text-[0.75rem] uppercase tracking-[0.14em] text-ink-subtle transition-colors duration-[var(--dur-base)] hover:text-danger"
            >
              Empty Cart
            </button>
          </div>
        </aside>
      </div>
    </form>
  );
}
