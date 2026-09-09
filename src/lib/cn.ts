/** Minimal class combiner - no runtime dependency needed for this. */
export function cn(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}
