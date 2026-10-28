/**
 * Stripe checkout provider.
 *
 * The customer configures the order and uploads their photographs here, then
 * pays on Stripe's own hosted page and comes back. Card details never touch
 * this site, which is the whole point of using Checkout rather than building a
 * payment form: no card number ever reaches our server or our logs.
 *
 * The order reference travels in `client_reference_id` and in metadata, so a
 * payment in the Stripe dashboard can be matched to the manifest written by
 * /api/checkout, which is what names the uploaded photographs.
 *
 * Pack pricing: `linePrice` is the total for the line, so every Stripe line
 * item is quantity 1 with the pack price as its amount. Sending quantity 12
 * with the pack price would charge twelve times over.
 */

import Stripe from "stripe";
import { getStripeConfig } from "./config";
import { SITE_URL } from "@/lib/site";
import type { CheckoutDraft, CheckoutHandoff, CheckoutProvider } from "./types";

function lineLabel(line: CheckoutDraft["cart"]["lines"][number]): string {
  return line.variantName
    ? `${line.productName} - ${line.quantityLabel}, ${line.variantName}`
    : `${line.productName} - ${line.quantityLabel}`;
}

function lineDetails(
  line: CheckoutDraft["cart"]["lines"][number]
): string | undefined {
  const parts: string[] = [];
  if (line.personalization.name) parts.push(`Name: ${line.personalization.name}`);
  if (line.personalization.date) parts.push(`Date: ${line.personalization.date}`);
  if (line.photos.length) {
    parts.push(
      `${line.photos.length} photo${line.photos.length === 1 ? "" : "s"} uploaded`
    );
  }
  // Stripe rejects an empty string here, so send undefined instead.
  return parts.length ? parts.join(" | ") : undefined;
}

export const stripeProvider: CheckoutProvider = {
  id: "stripe",

  get isConfigured() {
    return getStripeConfig().isConfigured;
  },

  async createHandoff(draft: CheckoutDraft): Promise<CheckoutHandoff> {
    const config = getStripeConfig();

    if (!config.isConfigured) {
      return {
        status: "unconfigured",
        reason: config.reason,
        reference: draft.reference,
      };
    }

    const unpriced = draft.cart.lines.some((line) => line.linePrice == null);
    if (unpriced) {
      return {
        status: "unconfigured",
        reason:
          "A line in this order has no price, so it cannot be charged. Check quantityOptions in products.ts.",
        reference: draft.reference,
      };
    }

    const subtotal = draft.cart.lines.reduce(
      (total, line) => total + (line.linePrice ?? 0),
      0
    );
    const shipping =
      subtotal >= config.freeShippingThreshold ? 0 : config.shippingFlatRate;

    try {
      const stripe = new Stripe(config.secretKey);

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: draft.cart.lines.map((line) => ({
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: line.linePrice ?? 0,
            product_data: {
              name: lineLabel(line),
              ...(lineDetails(line) ? { description: lineDetails(line) } : {}),
            },
          },
        })),

        // Both, because they show up in different places: the reference is
        // listed on the payment itself and searchable in the dashboard.
        client_reference_id: draft.reference,
        metadata: { reference: draft.reference },

        ...(draft.customer?.email
          ? { customer_email: draft.customer.email }
          : {}),

        // The studio posts everything, so the address is required. Stripe
        // collects it rather than us holding another form.
        shipping_address_collection: { allowed_countries: ["US"] },
        phone_number_collection: { enabled: true },

        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: { amount: shipping, currency: "usd" },
              display_name:
                shipping === 0 ? "Free standard shipping" : "Standard shipping",
              delivery_estimate: {
                // Production time, then transit. Both are promised on the
                // shipping policy page; keep the two in step.
                minimum: { unit: "business_day", value: 5 },
                maximum: { unit: "business_day", value: 10 },
              },
            },
          },
        ],

        success_url: `${SITE_URL}/order-confirmed?reference=${draft.reference}`,
        cancel_url: `${SITE_URL}/cart`,
      });

      if (!session.url) {
        return {
          status: "unconfigured",
          reason: "Stripe created a session without a redirect URL.",
          reference: draft.reference,
        };
      }

      return { status: "redirect", url: session.url, reference: draft.reference };
    } catch (error) {
      console.error(`[checkout] Stripe session failed for ${draft.reference}`, error);
      return {
        status: "unconfigured",
        reason:
          error instanceof Error
            ? `Stripe refused the order: ${error.message}`
            : "Stripe refused the order.",
        reference: draft.reference,
      };
    }
  },
};
