"use client";

import { useRef, useState } from "react";
import { TextField, TextAreaField, SelectField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { site, isPlaceholder } from "@/lib/site";

const topics = [
  "An order I have placed",
  "Photos and personalization",
  "An event or bulk order",
  "Shipping or pickup",
  "Something else",
];

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success" }
  | { state: "error"; message: string; fields?: string[] };

export function ContactForm() {
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
          kind: "contact",
          company: fields.company,
          fields,
        }),
      });

      const result = await response.json();

      if (result.ok) {
        setStatus({ state: "success" });
        formRef.current?.reset();
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

        <h2 className="mt-6 font-display text-[1.75rem]">Message sent</h2>

        <p className="u-measure mx-auto mt-4 text-[1rem] leading-[1.8] text-ink-muted">
          Thank you for getting in touch. We will come back to you as soon
          as we can.
        </p>

        <Button
          variant="outline"
          className="mt-8"
          onClick={() => setStatus({ state: "idle" })}
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">
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

      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-company">Company (leave blank)</label>
        <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

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
      </div>

      <SelectField
        label="What is it about?"
        name="topic"
        options={topics}
        placeholder="Choose a topic"
        helper="This helps us get your message to the right place."
      />

      <TextAreaField
        label="Message"
        name="message"
        required
        rows={6}
        helper="Tell us about your order, your photos or your event."
        error={invalid("message")}
      />

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
        <Button
          type="submit"
          variant="solid"
          size="lg"
          loading={status.state === "submitting"}
          loadingLabel="Sending"
        >
          Send Message
        </Button>

        <p className="text-[0.8125rem] leading-relaxed text-ink-muted">
          We use your details only to reply to you.
        </p>
      </div>
    </form>
  );
}
