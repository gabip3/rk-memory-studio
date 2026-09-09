"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

/**
 * Accessible form controls.
 *
 * Rules enforced here so callers cannot get them wrong:
 *  - every control has a real, visible <label> (never a placeholder as a label)
 *  - helper text is persistent, not a placeholder that vanishes on focus
 *  - errors sit next to the field, are announced via role="alert", and are
 *    linked with aria-describedby / aria-invalid
 *  - inputs are >=48px tall and 16px text, so iOS does not zoom on focus
 */

const controlBase =
  "w-full min-h-12 rounded-none border bg-ivory px-4 py-3 " +
  "font-sans text-base text-ink placeholder:text-ink-subtle/70 " +
  "transition-[border-color,box-shadow] duration-[var(--dur-base)] " +
  "hover:border-gold/70 " +
  "focus:outline-none focus-visible:border-gold-ink " +
  "focus-visible:shadow-[0_0_0_3px_var(--color-gold-wash)] " +
  "disabled:cursor-not-allowed disabled:bg-cream disabled:text-ink-subtle";

const stateBorder = (invalid?: boolean) =>
  invalid ? "border-danger" : "border-taupe";

type BaseProps = {
  label: string;
  /** Persistent guidance shown beneath the control. */
  helper?: string;
  error?: string;
  required?: boolean;
  className?: string;
  /** Hides the label visually but keeps it for screen readers. Use sparingly. */
  hideLabel?: boolean;
};

function Label({
  htmlFor,
  children,
  required,
  hidden,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
  hidden?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "mb-2 block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink",
        hidden && "sr-only"
      )}
    >
      {children}
      {required ? (
        <>
          <span aria-hidden="true" className="ml-1 text-danger">
            *
          </span>
          <span className="sr-only"> (required)</span>
        </>
      ) : (
        <span className="ml-2 font-normal normal-case tracking-normal text-ink-subtle">
          Optional
        </span>
      )}
    </label>
  );
}

function Messages({
  helperId,
  errorId,
  helper,
  error,
}: {
  helperId: string;
  errorId: string;
  helper?: string;
  error?: string;
}) {
  return (
    <>
      {helper && !error ? (
        <p id={helperId} className="mt-2 text-[0.8125rem] leading-relaxed text-ink-muted">
          {helper}
        </p>
      ) : null}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-2 flex items-start gap-2 text-[0.8125rem] leading-relaxed text-danger"
        >
          <Icon name="alert" size={15} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : null}
    </>
  );
}

/* ---- Text input ---------------------------------------------------------- */

export function TextField({
  label,
  helper,
  error,
  required,
  className,
  hideLabel,
  ...props
}: BaseProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      <Label htmlFor={id} required={required} hidden={hideLabel}>
        {label}
      </Label>
      <input
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : helper ? helperId : undefined}
        className={cn(controlBase, stateBorder(!!error))}
        {...props}
      />
      <Messages helperId={helperId} errorId={errorId} helper={helper} error={error} />
    </div>
  );
}

/* ---- Textarea ------------------------------------------------------------ */

export function TextAreaField({
  label,
  helper,
  error,
  required,
  className,
  hideLabel,
  rows = 5,
  ...props
}: BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      <Label htmlFor={id} required={required} hidden={hideLabel}>
        {label}
      </Label>
      <textarea
        id={id}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : helper ? helperId : undefined}
        className={cn(controlBase, stateBorder(!!error), "resize-y leading-relaxed")}
        {...props}
      />
      <Messages helperId={helperId} errorId={errorId} helper={helper} error={error} />
    </div>
  );
}

/* ---- Select -------------------------------------------------------------- */

export function SelectField({
  label,
  helper,
  error,
  required,
  className,
  hideLabel,
  options,
  placeholder,
  ...props
}: BaseProps &
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    options: readonly string[];
    placeholder?: string;
  }) {
  const id = useId();
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      <Label htmlFor={id} required={required} hidden={hideLabel}>
        {label}
      </Label>
      <div className="relative">
        <select
          id={id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : helper ? helperId : undefined}
          className={cn(controlBase, stateBorder(!!error), "appearance-none pr-11")}
          defaultValue=""
          {...props}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <Icon
          name="chevron-down"
          size={18}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gold-ink"
        />
      </div>
      <Messages helperId={helperId} errorId={errorId} helper={helper} error={error} />
    </div>
  );
}

/* ---- Radio group (used for shipping vs pickup) --------------------------- */

export function RadioGroupField({
  label,
  helper,
  error,
  required,
  className,
  name,
  options,
  defaultValue,
}: BaseProps & {
  name: string;
  options: readonly { value: string; label: string; hint?: string }[];
  defaultValue?: string;
}) {
  const id = useId();
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  return (
    <fieldset
      className={className}
      aria-describedby={error ? errorId : helper ? helperId : undefined}
    >
      <legend className="mb-3 block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink">
        {label}
        {required ? (
          <>
            <span aria-hidden="true" className="ml-1 text-danger">
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        ) : null}
      </legend>

      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "group flex min-h-14 cursor-pointer items-start gap-3 border border-taupe bg-ivory p-4",
              "transition-[border-color,background-color] duration-[var(--dur-base)]",
              "hover:border-gold hover:bg-gold-wash/50",
              "has-[:checked]:border-gold-ink has-[:checked]:bg-gold-wash",
              "has-[:focus-visible]:shadow-[0_0_0_3px_var(--color-gold-wash)]"
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              required={required}
              defaultChecked={defaultValue === option.value}
              className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[#8a6a38]"
            />
            <span>
              <span className="block text-[0.9375rem] font-medium text-ink">
                {option.label}
              </span>
              {option.hint ? (
                <span className="mt-0.5 block text-[0.8125rem] leading-relaxed text-ink-muted">
                  {option.hint}
                </span>
              ) : null}
            </span>
          </label>
        ))}
      </div>

      <Messages helperId={helperId} errorId={errorId} helper={helper} error={error} />
    </fieldset>
  );
}
