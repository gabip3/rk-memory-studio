/**
 * How a customer places an order right now.
 *
 * "enquiry"  The site is a catalogue. No cart, no photo upload, no checkout.
 *            The customer contacts the studio and the order is completed by
 *            hand, or in Check Cherry. This is the honest mode while the site
 *            is served as a static export, because the upload and checkout
 *            endpoints simply do not exist there: offering them produced a
 *            customer who configured an order, uploaded photographs that were
 *            discarded, and only learned at the final screen that nothing had
 *            been sent.
 *
 * "online"   The full flow: configure, upload, cart, checkout handoff. It needs
 *            a Node host AND a configured checkout provider. The code for it is
 *            intact and tested; this switch is the only thing holding it back.
 *
 * Flip with NEXT_PUBLIC_ORDERING_MODE=online once both of those are true.
 */

export type OrderingMode = "enquiry" | "online";

export const orderingMode: OrderingMode =
  process.env.NEXT_PUBLIC_ORDERING_MODE === "online" ? "online" : "enquiry";

/** True while the site takes orders by conversation rather than by checkout. */
export const isEnquiryMode = orderingMode === "enquiry";
