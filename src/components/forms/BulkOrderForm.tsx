"use client";

import { useRef, useState } from "react";
import {
  TextField,
  TextAreaField,
  SelectField,
  RadioGroupField,
} from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { site, isPlaceholder } from "@/lib/site";
import { eventTypeOptions } from "@/lib/data/events";
import { products } from "@/lib/data/products";

const productOptions = [
  ...products.map((product) => product.name),
  "A mix of products",
  "Not sure yet",
];

const quantityOptions = [
  "50 - 99",
  "100 - 149",
  "150 - 249",
  "250 - 499",
  "500+",
  "Not sure yet",
];

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; reference?: string }
  | { state: "error"; message: string; fields?: string[] };

export function BulkOrderForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const hasEmail = !isPlaceholder(site.contact.email);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ state: "submitting" });

    const data = new FormData(event.currentTarget);
    const fields = Object.fromEntries(
      Array.from(data.entries()).map(([key, value]) => [key, String(value)])
    );

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "bulk-order",
          company: fields.company, // honeypot
          fields,
        }),
      });

      const result = await response.json();

      if (result.ok) {
        setStatus({ state: "success", reference: result.reference });
        formRef.current?.reset();
        // Move focus to the confirmation so it is announced and reachable.
        requestAnimationFrame(() => successRef.current?.focus());
      } else {
        setStatus({
          state: "error",
          message: result.error ?? "Something went wrong. Please try again.",
          fields: result.fields,
        });
      }
    } catch {
      setStatus({
        state: "error",
        message:
          "We could not reach the server. Check your connection and try again.",
      });
    }
  }

  const invalid = (name: string) =>
    status.state === "error" && status.fields?.includes(name)
      ? "This field is required."
      : undefined;

  if (status.state === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="border border-gold/50 bg-gold-wash/60 px-8 py-14 text-center outline-none"
      >
        <span
          aria-hidden="true"
          className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success text-ivory"
        >
          <Icon name="check" size={28} strokeWidth={2} />
        </span>

        <h2 className="mt-6 font-display text-[1.75rem]">
          Thank you, your request is in
        </h2>

        <p className="u-measure mx-auto mt-4 text-[1rem] leading-[1.8] text-ink-muted">
          We have your event details and will come back to you with a quote.
          {status.reference ? (
            <>
              {" "}
              Your reference is{" "}
              <strong className="tabular font-medium text-ink">
                {status.reference}
              </strong>. Quote it if you get in touch in the meantime.
            </>
          ) : null}
        </p>

        <Button
          variant="outline"
          className="mt-8"
          onClick={() => setStatus({ state: "idle" })}
        >
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-8">
      {status.state === "error" ? (
        <div
          role="alert"
          className="flex items-start gap-3 border-l-2 border-danger bg-danger-wash px-5 py-4"
        >
          <Icon name="alert" size={18} className="mt-0.5 shrink-0 text-danger" />
          <div>
            <p className="text-[0.9375rem] font-medium text-danger">
              {status.message}
            </p>
            {hasEmail ? (
              <p className="mt-1 text-[0.875rem] text-ink-muted">
                You can also email us at{" "}
                <a
                  href={`mailto:${site.contact.email}`}
                  className="underline underline-offset-2"
                >
                  {site.contact.email}
                </a>
                .
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Honeypot - hidden from people, tempting to bots */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="bulk-company">Company (leave blank)</label>
        <input id="bulk-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="space-y-6">
        <legend className="u-eyebrow mb-2">About Your Event</legend>

        <div className="grid gap-6 sm:grid-cols-2">
          <SelectField
            label="Event Type"
            name="eventType"
            required
            options={eventTypeOptions}
            placeholder="Choose an event type"
            helper="Tell us what you are celebrating."
            error={invalid("eventType")}
          />

          <TextField
            label="Event Date"
            name="eventDate"
            type="date"
            helper="An approximate date is fine if it is not confirmed."
          />

          <SelectField
            label="Quantity"
            name="quantity"
            required
            options={quantityOptions}
            placeholder="How many keepsakes?"
            helper="An estimate is fine - we can refine it together."
            error={invalid("quantity")}
          />

          <SelectField
            label="Product"
            name="product"
            required
            options={productOptions}
            placeholder="Choose a product"
            helper="Not sure? Choose 'Not sure yet' and we will advise."
            error={invalid("product")}
          />
        </div>

        <TextAreaField
          label="Customization"
          name="customization"
          rows={3}
          helper="Names, dates, event branding, colours, or anything you would like printed."
        />

        <RadioGroupField
          label="Delivery"
          name="delivery"
          defaultValue="shipping"
          options={[
            { value: "shipping", label: "Shipping", hint: "Sent to your address" },
            {
              value: "pickup",
              label: "Local Pickup",
              hint: "Collect in the Atlanta area",
            },
          ]}
        />
      </fieldset>

      <fieldset className="space-y-6 border-t border-taupe/45 pt-8">
        <legend className="u-eyebrow mb-2">How We Reach You</legend>

        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            label="Name"
            name="name"
            required
            autoComplete="name"
            error={invalid("name")}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            required
            inputMode="email"
            autoComplete="email"
            error={invalid("email")}
          />

          <TextField
            label="Phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            helper="Only if you would prefer we call."
            className="sm:col-span-2 sm:max-w-[calc(50%-0.75rem)]"
          />
        </div>

        <TextAreaField
          label="Additional Information"
          name="notes"
          rows={4}
          helper="Anything else that would help us quote accurately."
        />
      </fieldset>

      <div className="flex flex-col gap-4 border-t border-taupe/45 pt-8 sm:flex-row sm:items-center">
        <Button
          type="submit"
          variant="solid"
          size="lg"
          loading={status.state === "submitting"}
          loadingLabel="Sending"
        >
          Request a Quote
        </Button>

        <p className="text-[0.8125rem] leading-relaxed text-ink-muted">
          We use your details only to answer your enquiry.
        </p>
      </div>
    </form>
  );
}
