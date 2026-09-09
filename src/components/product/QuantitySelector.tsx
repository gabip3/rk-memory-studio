"use client";

import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { formatPrice } from "@/lib/format";
import type { QuantityOption } from "@/lib/data/products";

/**
 * Quantity picker.
 *
 * A real radiogroup (native inputs inside labels) rather than styled buttons:
 * arrow keys move between options, the selection is announced, and it submits
 * inside a form if one is ever wrapped around it.
 *
 * Sized for thumbs first - two columns on the narrowest phone, each tile well
 * over the 44px minimum, with the selected state carried by border, background
 * AND a check mark, so it never depends on colour alone.
 */
export function QuantitySelector({
  options,
  value,
  onChange,
  name = "quantity",
}: {
  options: QuantityOption[];
  value: number;
  onChange: (option: QuantityOption) => void;
  name?: string;
}) {
  return (
    <fieldset>
      <legend className="sr-only">Choose a quantity</legend>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {options.map((option) => {
          const selected = option.count === value;

          return (
            <label
              key={option.count}
              className={cn(
                "group relative flex min-h-[4.5rem] cursor-pointer flex-col justify-center border px-4 py-3",
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
                value={option.count}
                checked={selected}
                onChange={() => onChange(option)}
                className="sr-only"
              />

              <span className="tabular font-display text-[1.5rem] leading-none text-ink">
                {option.count}
              </span>

              <span className="mt-1 text-[0.8125rem] leading-tight text-ink-muted">
                {option.label.replace(`${option.count} `, "")}
              </span>

              {option.note ? (
                <span className="u-caps mt-1.5 text-[0.5625rem] tracking-[0.16em] text-gold-ink">
                  {option.note}
                </span>
              ) : null}

              {option.price != null ? (
                <span className="tabular mt-1 text-[0.8125rem] font-medium text-ink">
                  {formatPrice(option.price)}
                </span>
              ) : null}

              {/* Selection is signalled by shape as well as colour */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute right-2.5 top-2.5 grid h-5 w-5 place-items-center rounded-full transition-opacity duration-[var(--dur-base)]",
                  selected
                    ? "bg-gold-ink text-ivory opacity-100"
                    : "opacity-0"
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
