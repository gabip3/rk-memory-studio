import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { site, isPlaceholder, telHref } from "@/lib/site";
import type { Product } from "@/lib/data/products";

/**
 * How to order, while the site is a catalogue.
 *
 * This replaces the configurator in `enquiry` mode. It states the truth up
 * front rather than at the end: orders are arranged with the studio, and
 * photographs are sent once the order is agreed. The version that collected
 * photographs in the browser and then discarded them is exactly what this
 * exists to prevent.
 *
 * It deliberately quotes no price. The shapes and quantities come from the
 * product data, so this stays correct if either changes.
 */
export function OrderByEnquiry({ product }: { product: Product }) {
  const hasEmail = !isPlaceholder(site.contact.email);
  const hasPhone = !isPlaceholder(site.contact.phone);

  const subject = `Order enquiry: ${product.name}`;
  const body =
    `Hi RK Memory Studio,\n\n` +
    `I would like to order ${product.name.toLowerCase()}.\n\n` +
    `Shape: \nHow many: \nFor an event? \n\n` +
    `Thank you,\n`;

  const mailto = `mailto:${site.contact.email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  const quantities = product.quantityOptions.map((q) => q.count).join(", ");
  const shapes = product.variants?.map((v) => v.name).join(" or ");

  const steps = [
    {
      icon: "mail" as const,
      title: "Tell us what you need",
      body: shapes
        ? `Email or call with the shape you want, ${shapes}, and how many.`
        : "Email or call with what you would like and how many.",
    },
    {
      icon: "check-circle" as const,
      title: "We confirm the details",
      body: "We reply with the price for your quantity, what we need from you, and when it will be ready.",
    },
    {
      icon: "camera" as const,
      title: "You send your photographs",
      body: "Once the order is agreed we send you a link to upload them at full resolution, with any names or dates you would like printed.",
    },
  ];

  return (
    <div className="border border-taupe/50 bg-cream p-7 sm:p-8">
      <h2 className="text-display-s">How to order</h2>

      <p className="u-measure mt-4 text-[1rem] leading-[1.8] text-ink-muted">
        Every order is made individually, so we arrange it with you directly.
      </p>

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

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {hasEmail ? (
          <Button href={mailto} variant="solid" size="lg">
            Email Us to Order
          </Button>
        ) : null}
        {hasPhone ? (
          <Button href={telHref(site.contact.phone)} variant="outline" size="lg">
            {site.contact.phone}
          </Button>
        ) : null}
      </div>

      <dl className="mt-8 border-t border-taupe/50 pt-6 text-[0.9375rem] leading-[1.8] text-ink-muted">
        {shapes ? (
          <div className="flex gap-2">
            <dt className="font-medium text-ink">Shapes:</dt>
            <dd>{shapes}</dd>
          </div>
        ) : null}
        <div className="flex gap-2">
          <dt className="font-medium text-ink">Quantities:</dt>
          <dd>{quantities}</dd>
        </div>
      </dl>
    </div>
  );
}
