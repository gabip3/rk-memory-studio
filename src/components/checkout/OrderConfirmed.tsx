"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useCart } from "@/lib/cart/CartProvider";
import { site, isPlaceholder } from "@/lib/site";

/**
 * The page Stripe returns the customer to after a successful payment.
 *
 * It empties the cart, because the order has been paid for and leaving the
 * items there invites a second, duplicate purchase. The clear runs once: in
 * development React mounts effects twice, and a cart that refills itself from
 * a stale render would be worse than not clearing at all.
 *
 * The reference comes from the URL rather than from storage, so it is still
 * correct if the customer opens the confirmation on another device.
 */
export function OrderConfirmed() {
  const params = useSearchParams();
  const reference = params.get("reference");
  const { clear } = useCart();
  const cleared = useRef(false);

  useEffect(() => {
    if (cleared.current) return;
    cleared.current = true;
    clear();
  }, [clear]);

  const hasEmail = !isPlaceholder(site.contact.email);

  const steps = [
    {
      icon: "check-circle" as const,
      title: "Payment received",
      body: "A receipt is on its way to your email from Stripe, our payment provider.",
    },
    {
      icon: "camera" as const,
      title: "Your photographs are with us",
      body: "They came through with your order. We check every file before printing, and we will contact you if one will not reproduce well.",
    },
    {
      icon: "truck" as const,
      title: "Made, then posted",
      body: "Up to 5 business days in the studio, then tracked delivery. You will get the tracking number by email as soon as it ships.",
    },
  ];

  return (
    <div className="mx-auto max-w-[34rem] border border-taupe/50 bg-cream p-7 sm:p-8">
      {reference ? (
        <div className="border-b border-taupe/50 pb-6">
          <h2 className="u-caps text-[0.625rem] tracking-[0.2em] text-ink-subtle">
            Your order reference
          </h2>
          <p className="tabular mt-2 font-display text-[1.75rem] leading-none text-ink">
            {reference}
          </p>
          <p className="mt-3 text-[0.875rem] leading-[1.7] text-ink-muted">
            Keep it. Quote it if you contact us about this order.
          </p>
        </div>
      ) : null}

      <ol className="mt-7 space-y-6">
        {steps.map((step) => (
          <li key={step.title} className="flex gap-4">
            <span
              aria-hidden="true"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/45 text-gold"
            >
              <Icon name={step.icon} size={19} strokeWidth={1.2} />
            </span>
            <div className="min-w-0">
              <p className="font-display text-[1.25rem] leading-snug text-ink">
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
        <Button href="/shop" variant="solid">
          Make Another
        </Button>
        {hasEmail ? (
          <Button href={`mailto:${site.contact.email}`} variant="outline">
            Contact the Studio
          </Button>
        ) : null}
      </div>
    </div>
  );
}
