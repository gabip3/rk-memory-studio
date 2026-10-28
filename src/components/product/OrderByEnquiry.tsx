import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { site, isPlaceholder, telHref } from "@/lib/site";
import { orderUrl } from "@/lib/ordering";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/data/products";

/**
 * How to order.
 *
 * The site is a catalogue: it shows the work and the prices, and hands the
 * customer to Check Cherry, which takes the payment in full and then collects
 * the photographs through its own questionnaire. Nothing is uploaded here,
 * because a static export has nowhere to put a file: an earlier version that
 * accepted photographs and discarded them is exactly what this replaces.
 *
 * The prices shown here must match the quantity tiers on the Check Cherry
 * package. They live in products.ts so there is one place to change them.
 */
export function OrderByEnquiry({ product }: { product: Product }) {
  const hasEmail = !isPlaceholder(site.contact.email);
  const hasPhone = !isPlaceholder(site.contact.phone);
  const canOrder = orderUrl.length > 0;

  const mailto = `mailto:${site.contact.email}?subject=${encodeURIComponent(
    `Order enquiry: ${product.name}`
  )}`;

  const tiers = product.quantityOptions.filter((o) => o.price != null);
  const shapes = product.variants?.map((v) => v.name).join(" or ");

  const steps = [
    {
      icon: "cart" as const,
      title: "Choose how many and pay",
      body: "Pick your quantity and pay securely. Your order is confirmed straight away.",
    },
    {
      icon: "camera" as const,
      title: "Send us your photographs",
      body: shapes
        ? `We email you a short form: upload your photos at full resolution, choose ${shapes}, and add any names or dates.`
        : "We email you a short form to upload your photos at full resolution, with any names or dates.",
    },
    {
      icon: "truck" as const,
      title: "We make them and post them",
      body: "Up to 5 business days in the studio, then tracked delivery anywhere in the United States.",
    },
  ];

  return (
    <div className="border border-taupe/50 bg-cream p-7 sm:p-8">
      <h2 className="text-display-s">Order yours</h2>

      {tiers.length > 0 ? (
        <>
          <ul className="mt-7 divide-y divide-taupe/40 border-y border-taupe/40">
            {tiers.map((tier) => (
              <li
                key={tier.count}
                className="flex items-baseline justify-between gap-4 py-3"
              >
                <span className="text-[1rem] text-ink">
                  {tier.label}
                  {tier.note ? (
                    <span className="u-caps ml-2 text-[0.5625rem] tracking-[0.2em] text-gold-ink">
                      {tier.note}
                    </span>
                  ) : null}
                </span>
                <span className="tabular text-[1rem] font-medium text-ink">
                  {formatPrice(tier.price)}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-[0.875rem] leading-[1.7] text-ink-muted">
            {shapes ? `${shapes}, same price. ` : null}
            Shipping is calculated at checkout, and free over $49.99.
          </p>
        </>
      ) : null}

      <ol className="mt-8 space-y-6">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-4">
            <span
              aria-hidden="true"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/45 text-gold"
            >
              <Icon name={step.icon} size={19} strokeWidth={1.2} />
            </span>
            <div className="min-w-0">
              <h3 className="u-caps text-[0.625rem] tracking-[0.2em] text-ink-subtle">
                Step {index + 1}
              </h3>
              <p className="mt-1 font-display text-[1.25rem] leading-snug text-ink">
                {step.title}
              </p>
              <p className="mt-1.5 text-[0.9375rem] leading-[1.75] text-ink-muted">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>

      {canOrder ? (
        <div className="mt-8">
          <Button href={orderUrl} variant="solid" size="lg" fullWidth>
            Order Now
          </Button>
        </div>
      ) : null}

      <div className="mt-7 border-t border-taupe/50 pt-6">
        <p className="text-[0.9375rem] leading-[1.75] text-ink-muted">
          Planning an event, or want something we have not listed? Talk to us
          first.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          {hasEmail ? (
            <Button href={mailto} variant="outline">
              Email Us
            </Button>
          ) : null}
          {hasPhone ? (
            <Button href={telHref(site.contact.phone)} variant="outline">
              {site.contact.phone}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
