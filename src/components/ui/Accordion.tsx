import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

/**
 * Accordion built on native <details>/<summary>.
 *
 * Chosen deliberately over a custom button + aria-expanded widget: it is
 * keyboard operable, correctly announced by screen readers, findable by the
 * browser's in-page search, and it still opens if JavaScript never runs.
 *
 * The open/close animation uses a grid-template-rows transition, which is
 * compositor-friendly and needs no height measurement.
 */

export type AccordionItemProps = {
  id: string;
  question: React.ReactNode;
  children: React.ReactNode;
  /** Opens on first render - use for the first item in a list. */
  defaultOpen?: boolean;
  /** Renders the "answer coming before launch" treatment. */
  pending?: boolean;
  className?: string;
};

export function AccordionItem({
  id,
  question,
  children,
  defaultOpen = false,
  pending = false,
  className,
}: AccordionItemProps) {
  return (
    <details
      id={id}
      open={defaultOpen}
      className={cn(
        "group/acc border-b border-taupe/45 [&[open]>summary_.acc-icon]:rotate-45",
        className
      )}
    >
      <summary
        className={cn(
          "flex cursor-pointer list-none items-start justify-between gap-6 py-6",
          "min-h-14 transition-colors duration-[var(--dur-base)]",
          "hover:text-gold-display focus-visible:text-gold-display",
          "[&::-webkit-details-marker]:hidden"
        )}
      >
        <span className="font-display text-[1.1875rem] leading-snug sm:text-[1.375rem]">
          {question}
        </span>

        <span
          aria-hidden="true"
          className="acc-icon mt-1 shrink-0 text-gold transition-transform duration-[var(--dur-base)] ease-out-soft"
        >
          <Icon name="plus" size={20} />
        </span>
      </summary>

      {/* grid 0fr -> 1fr gives a smooth reveal without measuring heights */}
      <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-[var(--dur-base)] ease-out-soft group-open/acc:grid-rows-[1fr]">
        <div className="overflow-hidden">
          <div className="u-measure pb-7 pr-8 text-[1.0625rem] leading-[1.8] text-ink-muted">
            {children}

            {pending ? (
              <p className="mt-4 flex items-start gap-2.5 border-l-2 border-gold/50 bg-gold-wash/60 py-3 pl-4 pr-4 text-[0.875rem] leading-relaxed text-ink-muted">
                <Icon name="info" size={16} className="mt-0.5 shrink-0 text-gold-ink" />
                <span>
                  This answer will be finalised before launch - we have not
                  published a figure we cannot yet confirm.
                </span>
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </details>
  );
}

export function Accordion({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-t border-taupe/45", className)}>{children}</div>
  );
}
