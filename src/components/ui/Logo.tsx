import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * The RK Memory Studio wordmark: a serif "RK" monogram in champagne gold beside
 * a stacked, letterspaced "MEMORY STUDIO" lockup.
 *
 * Drawn in type rather than shipped as an image so it stays crisp at every
 * size, inherits the theme, and costs no extra request. If the business later
 * supplies a vector logo, swap the monogram span for an inline SVG - the
 * lockup, sizing and link behaviour stay as they are.
 */

type Tone = "light" | "dark";

export function LogoMark({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: Tone;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        // Bebas Neue is already tightly set, so the monogram needs no negative
        // tracking or letter overlap - both would collide the R into the K.
        "font-display font-normal leading-none tracking-[0.01em]",
        tone === "light" ? "text-gold-display" : "text-gold-on-dark",
        className
      )}
    >
      RK
    </span>
  );
}

export function Logo({
  className,
  tone = "light",
  /** `sm` for the sticky/condensed header, `md` for the resting header. */
  size = "md",
  href = "/",
}: {
  className?: string;
  tone?: Tone;
  size?: "sm" | "md";
  href?: string | null;
}) {
  const content = (
    <span className="flex items-center gap-2.5 sm:gap-3">
      <LogoMark
        tone={tone}
        className={size === "sm" ? "text-[2rem]" : "text-[2.5rem] sm:text-[2.875rem]"}
      />
      <span
        className={cn(
          "flex flex-col font-sans font-medium uppercase leading-[1.35]",
          size === "sm"
            ? "text-[0.5625rem] tracking-[0.26em]"
            : "text-[0.625rem] tracking-[0.28em] sm:text-[0.6875rem]",
          tone === "light" ? "text-ink" : "text-ivory"
        )}
      >
        <span>Memory</span>
        <span>Studio</span>
      </span>
    </span>
  );

  if (!href) {
    return <span className={cn("inline-flex", className)}>{content}</span>;
  }

  return (
    <Link
      href={href}
      aria-label="RK Memory Studio - home"
      className={cn(
        "inline-flex rounded-sm transition-opacity duration-[var(--dur-base)] hover:opacity-80",
        className
      )}
    >
      {content}
    </Link>
  );
}
