/**
 * Formatting helpers.
 *
 * `formatPrice` deliberately returns a sentence rather than "$0.00" when a
  * price is unknown. Showing a zero would imply the order is free; saying the
 * total is confirmed at checkout is both honest and better UX.
 */

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(cents: number | null | undefined): string {
  if (cents == null) return "Confirmed at checkout";
  return currency.format(cents / 100);
}

export function formatCount(n: number, singular: string, plural = `${singular}s`) {
  return `${n} ${n === 1 ? singular : plural}`;
}
