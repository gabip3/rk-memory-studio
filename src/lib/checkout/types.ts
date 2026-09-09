/**
 * Checkout contract.
 *
 * The storefront owns browsing, configuration and photo upload. The checkout
 * provider owns pricing, payment and the order record.
 *
 * TWO PROVIDERS ARE REGISTERED:
 *
 *   check-cherry  ACTIVE. The same system the sister business RK 360 already
 *                 runs, so orders for both live in one place. The order
 *                 reference travels in the URL, so the customer never has to
 *                 copy or retype anything.
 *
 *   etsy          DORMANT, kept deliberately. Switching is one env var, not a
 *                 rewrite. Two constraints verified against the Etsy Open API
 *                 v3 reference: Etsy exposes NO cart/checkout/payment endpoint
 *                 (its Payment endpoints are read-only records), and NO
 *                 buyer-side file upload (its upload endpoints are seller-side
 *                 listing assets). That is why the Etsy path has to ask the
 *                 customer to paste the reference into a text field, and why
 *                 Check Cherry is the better default.
 */

import type { UploadedPhoto } from "@/lib/uploads/types";

export type PersonalizationValues = {
  name?: string;
  date?: string;
  message?: string;
};

export type CartLine = {
  /** Stable client-side id for this configured line. */
  id: string;
  productSlug: string;
  productName: string;
  quantity: number;
  quantityLabel: string;
  /** Chosen shape/size, when the product has variants. */
  variantId?: string | null;
  variantName?: string | null;
  /** Check Cherry package/item id, when the business has supplied one. */
  checkCherryItemId: string | null;
  /** Etsy listing id, used only when the Etsy provider is active. */
  etsyListingId: string | null;
  personalization: PersonalizationValues;
  photos: UploadedPhoto[];
  /** Cents. Null while pricing lives entirely with the provider. */
  unitPrice: number | null;
  notes?: string;
  addedAt: number;
};

export type Cart = {
  lines: CartLine[];
  /** Cents, or null when any line has no price. */
  subtotal: number | null;
};

/**
 * A reference code we mint and carry into the provider, so the business can
 * match an incoming order to the photos uploaded on this site.
 * Format: RK-XXXXXX (no ambiguous characters).
 */
export type OrderReference = string;

export type CheckoutDraft = {
  reference: OrderReference;
  cart: Cart;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  createdAt: number;
};

/** One line of the order paired with where to buy it, for the Etsy path. */
export type EtsyHandoffItem = {
  lineId: string;
  productName: string;
  quantityLabel: string;
  photoCount: number;
  listingUrl: string | null;
};

export type CheckoutHandoff =
  | {
      /** Check Cherry hosted: send the customer straight there. */
      status: "redirect";
      url: string;
      reference: OrderReference;
    }
  | {
      /** Check Cherry embed: render their snippet on our checkout page. */
      status: "embed";
      embedHtml: string;
      embedUrl: string | null;
      reference: OrderReference;
    }
  | {
      /** Etsy: list the items, customer pastes the reference on Etsy. */
      status: "etsy";
      reference: OrderReference;
      items: EtsyHandoffItem[];
      shopUrl: string;
      hasMissingListings: boolean;
    }
  | {
      status: "unconfigured";
      /** Staff-facing explanation, surfaced outside production only. */
      reason: string;
      reference: OrderReference;
    };

export type CheckoutProvider = {
  readonly id: string;
  readonly isConfigured: boolean;
  /** Build the handoff for a completed draft. Must never throw for config gaps. */
  createHandoff(draft: CheckoutDraft): Promise<CheckoutHandoff>;
};
