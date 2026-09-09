import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * The RK Memory Studio wordmark: the supplied gold "RK" monogram beside a
 * letterspaced "MEMORY STUDIO" lockup.
 *
 * Why the wordmark is live text rather than part of the image: the supplied
 * lockup sets "MEMORY STUDIO" in black, which disappears on the charcoal
 * footer and the dark editorial sections. The monogram is gold and reads on
 * both grounds, so it ships as the image and the wordmark is typeset per
 * context. That also keeps it crisp and selectable at header sizes, where the
 * baked-in wordmark would be only a few pixels tall.
 *
 * The full supplied lockup is kept at /images/logo-lockup.png for light
 * backgrounds, print and social cards.
 */

type Tone = "light" | "dark";

/** Intrinsic ratio of logo-mark.png (459x320), used to reserve space. */
const MARK_RATIO = 459 / 320;

export function LogoMark({
  className,
  tone = "light",
  /** Rendered height in px. Width follows the intrinsic ratio. */
  height = 40,
  priority = false,
}: {
  className?: string;
  tone?: Tone;
  height?: number;
  priority?: boolean;
}) {
  return (
    <Image
      src="/images/logo-mark.png"
      alt=""
      aria-hidden="true"
      width={Math.round(height * MARK_RATIO)}
      height={height}
      priority={priority}
      className={cn(
        "h-auto w-auto object-contain",
        // The mark is gold on both grounds; on charcoal it just needs to not
        // sit flat against the background.
        tone === "dark" && "drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]",
        className
      )}
      style={{ height, width: "auto" }}
    />
  );
}

export function Logo({
  className,
  tone = "light",
  /** `sm` for the sticky/condensed header, `md` for the resting header. */
  size = "md",
  href = "/",
  priority = false,
}: {
  className?: string;
  tone?: Tone;
  size?: "sm" | "md";
  href?: string | null;
  priority?: boolean;
}) {
  const content = (
    <span className="flex items-center gap-2.5 sm:gap-3">
      <LogoMark tone={tone} height={size === "sm" ? 34 : 42} priority={priority} />

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
