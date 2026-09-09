import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

/* ------------------------------------------------------------------------ */
/* Container                                                                */
/* ------------------------------------------------------------------------ */

/**
 * Gutters widen with the viewport rather than staying at a fixed narrow inset,
 * so the layout breathes on tablets and desktops instead of looking pinched.
 */
export function Container({
  children,
  className,
  width = "default",
}: {
  children: React.ReactNode;
  className?: string;
  width?: "default" | "wide" | "narrow" | "full";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-12 xl:px-16",
        width === "default" && "max-w-[80rem]",
        width === "wide" && "max-w-[90rem]",
        width === "narrow" && "max-w-[52rem]",
        width === "full" && "max-w-none",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

type Tone = "ivory" | "cream" | "beige" | "charcoal" | "black" | "none";

const tones: Record<Tone, string> = {
  ivory: "bg-ivory text-ink",
  cream: "bg-cream text-ink",
  beige: "bg-beige text-ink",
  charcoal: "bg-charcoal text-ivory",
  black: "bg-black text-ivory",
  none: "",
};

/** Vertical rhythm tiers - deliberately generous, this is an editorial layout. */
const spacings = {
  none: "",
  sm: "py-14 sm:py-16",
  md: "py-16 sm:py-20 lg:py-24",
  lg: "py-20 sm:py-28 lg:py-36",
} as const;

export function Section({
  children,
  className,
  tone = "ivory",
  spacing = "lg",
  id,
  width = "default",
  bleed = false,
  "aria-labelledby": ariaLabelledBy,
  as: Tag = "section",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: Tone;
  spacing?: keyof typeof spacings;
  id?: string;
  width?: "default" | "wide" | "narrow" | "full";
  /** Skips the Container so the section can run edge to edge. */
  bleed?: boolean;
  "aria-labelledby"?: string;
  as?: "section" | "div" | "footer" | "article";
}) {
  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn(tones[tone], spacings[spacing], className)}
    >
      {bleed ? children : <Container width={width}>{children}</Container>}
    </Tag>
  );
}

/* ------------------------------------------------------------------------ */
/* Headings                                                                 */
/* ------------------------------------------------------------------------ */

export function Eyebrow({
  children,
  className,
  onDark,
  as: Tag = "p",
}: {
  children: React.ReactNode;
  className?: string;
  onDark?: boolean;
  as?: "p" | "span" | "div";
}) {
  return (
    <Tag
      className={cn(
        "u-eyebrow",
        onDark && "text-gold-on-dark",
        className
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * The standard section header: eyebrow, heading, optional lede.
 * `id` is wired to the section's aria-labelledby by the caller.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  id,
  align = "center",
  onDark,
  level = 2,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  id?: string;
  align?: "center" | "left";
  onDark?: boolean;
  level?: 2 | 3;
  className?: string;
}) {
  const Heading = level === 2 ? "h2" : "h3";

  return (
    <Reveal
      className={cn(
        "flex flex-col",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow ? (
        <Eyebrow onDark={onDark} className="mb-5">
          {eyebrow}
        </Eyebrow>
      ) : null}

      <Heading
        id={id}
        className={cn(
          "text-display-m",
          onDark ? "text-ivory" : "text-ink"
        )}
      >
        {title}
      </Heading>

      {lede ? (
        <p
          className={cn(
            "u-measure mt-6 text-[1.0625rem] leading-[1.75]",
            onDark ? "text-ivory/75" : "text-ink-muted",
            align === "center" && "mx-auto"
          )}
        >
          {lede}
        </p>
      ) : null}
    </Reveal>
  );
}
