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

/**
 * Where the "Order now" button sends the customer.
 *
 * Check Cherry is the till: it takes the full payment, then sends the customer
 * the questionnaire that collects the photographs, the shape, the
 * personalization and the delivery address. The studio already runs it for the
 * sister business, so orders for both arrive in one place.
 *
 * Empty string hides the button and leaves email and phone as the only route,
 * which is what should happen if the package is ever unpublished.
 */
export const orderUrl =
  process.env.NEXT_PUBLIC_ORDER_URL ??
  "https://rk-memory-studio.checkcherry.com/reservation/set_event?event_type_id=220490";
