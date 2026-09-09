"use client";

import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { formatPrice } from "@/lib/format";
import type { ProductVariant } from "@/lib/data/products";

/**
 * Shape and size picker.
 *
 * The shape is drawn, not just named. "2x2 Square" and "2.25 Round" are hard to
 * tell apart as two lines of text at a glance, and the difference is purely
 * visual, so the control shows it. The shape swatch is decorative; the radio
 * label carries the real name and measurement for screen readers.
 *
 * A real radiogroup, so arrow keys move between options and the selection is
 * announced. Selection is signalled by border, background AND a check mark,
 * never by colour alone.
 */
export function VariantSelector({
  variants,
  value,
  onChange,
  name = "variant",
}: {
  variants: ProductVariant[];
  value: string;
  onChange: (variant: ProductVariant) => void;
  name?: string;
}) {
  return (
    <fieldset>
      <legend className="sr-only">Choose a shape and size</legend>

      <div className="grid grid-cols-2 gap-3 sm:max-w-md">
        {variants.map((variant) => {
          const selected = variant.id === value;

          return (
            <label
              key={variant.id}
              className={cn(
                "group relative flex cursor-pointer flex-col items-center gap-3 border px-4 py-5",
                "transition-[border-color,background-color,box-shadow] duration-[var(--dur-base)]",
                "has-[:focus-visible]:shadow-[0_0_0_3px_var(--color-gold-wash)]",
                selected
                  ? "border-gold-ink bg-gold-wash"
                  : "border-taupe bg-ivory hover:border-gold hover:bg-gold-wash/40"
              )}
            >
              <input
                type="radio"
                name={name}
                value={variant.id}
                checked={selected}
                onChange={() => onChange(variant)}
                className="sr-only"
              />

              {/* The shape itself, drawn to scale relative to each other */}
              <span
                aria-hidden="true"
                className={cn(
                  "block border-2 transition-colors duration-[var(--dur-base)]",
                  variant.shape === "round" ? "rounded-full" : "rounded-[2px]",
                  // 2.25in vs 2in, kept proportional: 56px vs 50px
                  variant.shape === "round" ? "h-14 w-14" : "h-[3.125rem] w-[3.125rem]",
                  selected
                    ? "border-gold-ink bg-ivory"
                    : "border-taupe bg-cream group-hover:border-gold"
                )}
              />

              <span className="text-center">
                <span className="block font-display text-[1.125rem] leading-snug text-ink">
                  {variant.name}
                </span>
                <span className="tabular mt-0.5 block text-[0.8125rem] text-ink-muted">
                  {variant.dimensions}
                </span>
                {variant.price != null ? (
                  <span className="tabular mt-1 block text-[0.8125rem] font-medium text-ink">
                    {formatPrice(variant.price)}
                  </span>
                ) : null}
              </span>

              <span
                aria-hidden="true"
                className={cn(
                  "absolute right-2.5 top-2.5 grid h-5 w-5 place-items-center rounded-full transition-opacity duration-[var(--dur-base)]",
                  selected ? "bg-gold-ink text-ivory opacity-100" : "opacity-0"
                )}
              >
                <Icon name="check" size={12} strokeWidth={2.4} />
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
