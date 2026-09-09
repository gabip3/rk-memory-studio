/**
 * Public checkout API.
 *
 * Everything the app touches goes through this module, so swapping or adding a
 * provider is a one-line change here rather than a refactor of the storefront.
 */

import { checkCherryProvider } from "./check-cherry";
import { etsyProvider } from "./etsy";
import type {
  Cart,
  CartLine,
  CheckoutDraft,
  CheckoutHandoff,
  CheckoutProvider,
  OrderReference,
} from "./types";

/**
 * Registered providers.
 *
 * check-cherry is the default: it is the system the sister business RK 360
 * already runs, and its reference travels in the URL so the customer never
 * copies anything. etsy stays registered but dormant, so opening Etsy as an
 * acquisition channel later is one env var rather than a rewrite.
 */
const providers: Record<string, CheckoutProvider> = {
  "check-cherry": checkCherryProvider,
  etsy: etsyProvider,
};

export function getCheckoutProvider(): CheckoutProvider {
  const id = (process.env.CHECKOUT_PROVIDER ?? "check-cherry").trim();
  return providers[id] ?? checkCherryProvider;
}

/* ---- Order references ---------------------------------------------------- */

/**
 * Crockford-style alphabet: no I, L, O or U. The customer has to read this off
 * one screen and type it into another, so ambiguous glyphs are excluded.
 */
const REF_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export function createOrderReference(): OrderReference {
  const bytes = new Uint8Array(6);
  globalThis.crypto.getRandomValues(bytes);
  const body = Array.from(bytes, (b) => REF_ALPHABET[b % REF_ALPHABET.length]).join("");
  return `RK-${body}`;
}

/* ---- Cart maths ---------------------------------------------------------- */

/**
 * Subtotal in cents, or null when any line is unpriced. Returning null (rather
 * than 0) keeps the UI honest: it says the total is confirmed at checkout
 * instead of implying the order is free.
 */
export function cartSubtotal(lines: CartLine[]): number | null {
  if (lines.length === 0) return null;
  if (lines.some((line) => line.unitPrice == null)) return null;
  return lines.reduce(
    (total, line) => total + (line.unitPrice ?? 0) * line.quantity,
    0
  );
}

export function buildCart(lines: CartLine[]): Cart {
  return { lines, subtotal: cartSubtotal(lines) };
}

export function totalPhotoCount(lines: CartLine[]): number {
  return lines.reduce((n, line) => n + line.photos.length, 0);
}

/* ---- Draft construction -------------------------------------------------- */

export function createDraft(
  cart: Cart,
  customer?: CheckoutDraft["customer"]
): CheckoutDraft {
  return {
    reference: createOrderReference(),
    cart,
    customer,
    createdAt: Date.now(),
  };
}

export async function createHandoff(
  draft: CheckoutDraft
): Promise<CheckoutHandoff> {
  return getCheckoutProvider().createHandoff(draft);
}

export type {
  Cart,
  CartLine,
  CheckoutDraft,
  CheckoutHandoff,
  EtsyHandoffItem,
  OrderReference,
} from "./types";
