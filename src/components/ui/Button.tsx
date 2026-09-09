import Link from "next/link";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

/**
 * The site's single button component.
 *
 * Contrast notes (all verified against WCAG AA):
 *   solid   ivory on #0e0d0b ................ 18.6:1
 *   gold    ivory on --gold-ink #8a6a38 ...... 5.0:1
 *   outline --ink on ivory .................. 14.8:1  (border is decorative)
 *   onDark  charcoal on ivory ............... 16.2:1
 *
 * Plain --gold (#b18f5f) is never used as a text or fill colour behind text -
 * it only reaches 2.8:1 on ivory. It appears here as borders only.
 */

type Variant = "solid" | "outline" | "gold" | "onDark" | "onDarkOutline" | "link";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 " +
  "font-sans uppercase tracking-[0.16em] font-medium text-center " +
  "transition-[background-color,color,border-color,transform,box-shadow] " +
  "duration-[var(--dur-base)] ease-out-soft " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "active:translate-y-px select-none";

const variants: Record<Variant, string> = {
  solid:
    "bg-black text-ivory border border-black " +
    "hover:bg-charcoal hover:shadow-card",
  gold:
    "bg-gold-ink text-ivory border border-gold-ink " +
    "hover:bg-[#75592e] hover:shadow-card",
  outline:
    "bg-transparent text-ink border border-gold " +
    "hover:bg-gold-wash hover:border-gold-ink",
  onDark:
    "bg-ivory text-charcoal border border-ivory " +
    "hover:bg-gold-wash hover:border-gold-wash",
  onDarkOutline:
    "bg-transparent text-gold-on-dark border border-gold-on-dark/55 " +
    "hover:border-gold-on-dark hover:bg-gold-on-dark/10",
  link:
    "bg-transparent border-0 p-0 text-gold-ink tracking-[0.14em] " +
    "hover:text-[#75592e]",
};

/** Every size clears the 44px minimum touch target. */
const sizes: Record<Size, string> = {
  sm: "min-h-11 px-5 text-[0.6875rem]",
  md: "min-h-12 px-7 text-xs",
  lg: "min-h-14 px-9 text-[0.8125rem]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  /** Renders a trailing arrow that nudges right on hover. */
  withArrow?: boolean;
  fullWidth?: boolean;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: never;
    /** Shows a spinner and blocks repeat submits. */
    loading?: boolean;
    /** Announced to screen readers while `loading`. */
    loadingLabel?: string;
  };

type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
    loading?: never;
    loadingLabel?: never;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function Arrow() {
  return (
    <Icon
      name="arrow-right"
      size={16}
      className="transition-transform duration-[var(--dur-base)] ease-out-soft group-hover/btn:translate-x-1 motion-reduce:transform-none"
    />
  );
}

function Spinner() {
  return (
    <span
      className="h-4 w-4 shrink-0 rounded-full border-2 border-current border-r-transparent motion-safe:animate-spin"
      aria-hidden="true"
    />
  );
}

export function Button(props: ButtonProps) {
  const {
    variant = "solid",
    size = "md",
    className,
    children,
    withArrow,
    fullWidth,
  } = props;

  const classes = cn(
    base,
    variants[variant],
    variant === "link" ? "min-h-11" : sizes[size],
    fullWidth && "w-full",
    className
  );

  if ("href" in props && props.href !== undefined) {
    const { href, variant: _v, size: _s, className: _c, children: _ch,
      withArrow: _w, fullWidth: _f, ...rest } = props;

    const isExternal = /^https?:\/\//i.test(href);

    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          {...rest}
        >
          {children}
          {withArrow ? <Arrow /> : null}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...rest}>
        {children}
        {withArrow ? <Arrow /> : null}
      </Link>
    );
  }

  const {
    loading,
    loadingLabel = "Working",
    disabled,
    variant: _v2, size: _s2, className: _c2, children: _ch2,
    withArrow: _w2, fullWidth: _f2,
    ...rest
  } = props as ButtonAsButton;

  return (
    <button
      type={rest.type ?? "button"}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <>
          <Spinner />
          <span>{loadingLabel}</span>
        </>
      ) : (
        <>
          {children}
          {withArrow ? <Arrow /> : null}
        </>
      )}
    </button>
  );
}

/**
 * The gold text CTA used on product cards ("SHOP MAGNETS ->").
 * The underline draws in on hover and on keyboard focus.
 */
export function TextCta({
  href,
  children,
  className,
  onDark,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group/cta inline-flex min-h-11 items-center gap-2.5 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.2em] transition-colors duration-[var(--dur-base)]",
        onDark
          ? "text-gold-on-dark hover:text-ivory"
          : "text-gold-ink hover:text-[#75592e]",
        className
      )}
    >
      <span className="u-underline">{children}</span>
      <Icon
        name="arrow-right"
        size={15}
        className="transition-transform duration-[var(--dur-base)] ease-out-soft group-hover/cta:translate-x-1 motion-reduce:transform-none"
      />
    </Link>
  );
}
