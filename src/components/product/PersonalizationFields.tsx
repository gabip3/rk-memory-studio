"use client";

import { TextField, TextAreaField } from "@/components/ui/Field";
import type { PersonalizationField } from "@/lib/data/products";
import type { PersonalizationValues } from "@/lib/checkout/types";

/**
 * Optional personalization inputs.
 *
 * Every field is genuinely optional and labelled as such, so no one is stopped
 * at checkout by a field they did not want. A live character counter appears
 * only as the customer approaches the limit, rather than nagging from zero.
 */
export function PersonalizationFields({
  fields,
  values,
  onChange,
}: {
  fields: PersonalizationField[];
  values: PersonalizationValues;
  onChange: (values: PersonalizationValues) => void;
}) {
  const set = (id: PersonalizationField["id"], value: string) =>
    onChange({ ...values, [id]: value });

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {fields.map((field) => {
        const value = values[field.id] ?? "";
        const nearLimit = value.length > field.maxLength * 0.7;

        const counter = nearLimit
          ? `${value.length}/${field.maxLength} characters`
          : undefined;

        if (field.multiline) {
          return (
            <TextAreaField
              key={field.id}
              label={field.label}
              helper={counter ?? field.helper}
              maxLength={field.maxLength}
              rows={3}
              value={value}
              onChange={(event) => set(field.id, event.target.value)}
              className="sm:col-span-2"
            />
          );
        }

        return (
          <TextField
            key={field.id}
            label={field.label}
            helper={counter ?? field.helper}
            maxLength={field.maxLength}
            value={value}
            // A date here is free text on purpose: customers write "09.24.2024",
            // "Summer 2025" or "Est. 2019". A date picker would fight them.
            inputMode={field.id === "date" ? "text" : undefined}
            autoComplete="off"
            onChange={(event) => set(field.id, event.target.value)}
          />
        );
      })}
    </div>
  );
}
