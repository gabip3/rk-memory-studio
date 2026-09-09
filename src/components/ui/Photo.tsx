import Image from "next/image";
import { cn } from "@/lib/cn";
import { LogoMark } from "./Logo";

/**
 * Photography slot.
 *
 * When `src` is set it renders an optimised, lazily-loaded next/image.
 * When `src` is null - which is the case until the studio supplies real
 * product photography - it renders a designed, on-brand placeholder frame
 * instead of a broken image or a stock photo that misrepresents the product.
 *
 * Either way the aspect ratio is reserved up front, so swapping placeholders
 * for real photographs causes zero layout shift (CLS).
 */

export type PhotoProps = {
  src: string | null;
  /** Always required. Describes the photograph, not the layout. */
  alt: string;
  /** CSS aspect-ratio, e.g. "4 / 5". Reserves space before the image loads. */
  ratio?: string;
  className?: string;
  /** Responsive sizes hint - important for bandwidth on mobile. */
  sizes?: string;
  /** Set on the LCP image only. Everything else stays lazy. */
  priority?: boolean;
  /** Short caption shown inside the placeholder, e.g. "Wedding magnets". */
  placeholderLabel?: string;
  /** Placeholder styling for dark sections. */
  tone?: "light" | "dark";
  /** Adds the shared hover-zoom behaviour (parent needs `group`). */
  zoom?: boolean;
  objectPosition?: string;
};

export function Photo({
  src,
  alt,
  ratio = "4 / 5",
  className,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  placeholderLabel,
  tone = "light",
  zoom = false,
  objectPosition,
}: PhotoProps) {
  return (
    <div
      className={cn(
        "relative isolate w-full overflow-hidden",
        zoom && "u-zoom-frame",
        className
      )}
      style={{ aspectRatio: ratio }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="object-cover"
          style={objectPosition ? { objectPosition } : undefined}
        />
      ) : (
        <PhotoPlaceholder alt={alt} label={placeholderLabel} tone={tone} />
      )}
    </div>
  );
}

/**
 * The placeholder itself. It is decorative scaffolding, but it still carries
 * the intended alt text to assistive technology via a visually hidden node, so
 * the page's meaning survives before the real photograph is dropped in.
 */
function PhotoPlaceholder({
  alt,
  label,
  tone,
}: {
  alt: string;
  label?: string;
  tone: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "u-zoom-target absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-hidden",
        tone === "light"
          ? "bg-[linear-gradient(145deg,#f7f2e9_0%,#efe6d7_45%,#e3d8c5_100%)]"
          : "bg-[linear-gradient(145deg,#2a2621_0%,#1f1c18_55%,#161310_100%)]"
      )}
    >
      {/* Hairline inner frame - the detail that keeps it feeling designed */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-3 border sm:inset-4",
          tone === "light" ? "border-gold/25" : "border-gold-on-dark/20"
        )}
      />

      <LogoMark
        tone={tone === "light" ? "light" : "dark"}
        height={52}
        className={cn(tone === "light" ? "opacity-30" : "opacity-40")}
      />

      {label ? (
        <span
          aria-hidden="true"
          className={cn(
            "u-caps max-w-[70%] text-center text-[0.5625rem] tracking-[0.28em]",
            // 70%, not 40%: at 9px this still has to clear 4.5:1.
            tone === "light" ? "text-ink/70" : "text-ivory/70"
          )}
        >
          {label}
        </span>
      ) : null}

      {/* The real description, available to screen readers and to search. */}
      <span className="sr-only">{alt}</span>
    </div>
  );
}
