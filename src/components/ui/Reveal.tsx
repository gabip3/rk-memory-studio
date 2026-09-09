import { cn } from "@/lib/cn";

/**
 * Marks a block for the scroll-reveal effect.
 *
 * This is a plain server component - it only sets `data-reveal` and a CSS
 * custom property for the stagger delay. A single global IntersectionObserver
 * (see ScrollReveal.tsx) drives every instance, so a page with 60 revealed
 * blocks still has exactly one observer.
 *
 * If JavaScript never runs, the CSS keeps the content fully visible.
 */
export function Reveal({
  children,
  className,
  /** Stagger offset in ms. Keep list staggers in the 30-60ms range. */
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section" | "article" | "header" | "figure";
}) {
  return (
    <Tag
      data-reveal=""
      className={cn(className)}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
