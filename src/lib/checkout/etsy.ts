/**
 * Etsy checkout provider.
 *
 * SCOPE, and why it is this narrow:
 *
 * The Etsy Open API v3 reference was checked directly. It exposes no cart,
 * checkout, basket or payment-intent endpoint of any kind. Its Payment
 * endpoints (getPayments, getShopPaymentByReceiptId, the ledger endpoints) are
 * read-only records of sales that already happened. So payment CANNOT be taken
 * on this site, and this provider does not pretend to.
 *
 * What it does instead is the only supported thing: hand the customer to the
 * right Etsy listing, carrying a reference code that ties their Etsy order back
 * to the photos they uploaded here.
 *
 * If you later add the Etsy API for listing sync, that belongs in a separate
 * module (server-side, OAuth) and does not change this handoff.
 */

import { getEtsyConfig, listingUrl } from "./config";
import type {
  CheckoutDraft,
  CheckoutHandoff,
  CheckoutProvider,
  EtsyHandoffItem,
} from "./types";

export const etsyProvider: CheckoutProvider = {
  id: "etsy",

  get isConfigured() {
    return getEtsyConfig().isConfigured;
  },

  async createHandoff(draft: CheckoutDraft): Promise<CheckoutHandoff> {
    const config = getEtsyConfig();

    if (!config.isConfigured) {
      return {
        status: "unconfigured",
        reason: config.reason,
        reference: draft.reference,
      };
    }

    const items: EtsyHandoffItem[] = draft.cart.lines.map((line) => ({
      lineId: line.id,
      productName: line.productName,
      quantityLabel: line.quantityLabel,
      photoCount: line.photos.length,
      listingUrl: listingUrl(line.etsyListingId),
    }));

    return {
      status: "etsy",
      reference: draft.reference,
      items,
      shopUrl: config.shopUrl,
      // Surfaced in the UI so a customer is never left with a dead end:
      // anything without a listing falls back to the shop front.
      hasMissingListings: items.some((item) => item.listingUrl === null),
    };
  },
};
