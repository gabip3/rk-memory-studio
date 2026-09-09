import Link from "next/link";
import { Container } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export type Crumb = { name: string; href: string };

/** Breadcrumbs give orientation on deep pages and feed BreadcrumbList JSON-LD. */
export function Breadcrumbs({
  items,
  onDark,
  className,
}: {
  items: Crumb[];
  onDark?: boolean;
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.href} className="flex items-center gap-2">
              {isLast ? (
                <span
                  aria-current="page"
                  className={cn(
                    "text-[0.75rem] uppercase tracking-[0.14em]",
                    onDark ? "text-ivory/70" : "text-ink-muted"
                  )}
                >
                  {item.name}
                </span>
              ) : (
                <>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-[0.75rem] uppercase tracking-[0.14em] transition-colors duration-[var(--dur-base)]",
                      onDark
                        ? "text-ivory/55 hover:text-gold-on-dark"
                        : "text-ink-subtle hover:text-gold-ink"
                    )}
                  >
                    {item.name}
                  </Link>
                  <Icon
                    name="chevron-right"
                    size={12}
                    className={onDark ? "text-ivory/35" : "text-taupe"}
                  />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Standard interior page masthead: breadcrumbs, eyebrow, h1, lede.
 * Keeps every non-home page opening with the same rhythm.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  crumbs,
  tone = "cream",
  align = "center",
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  crumbs?: Crumb[];
  tone?: "cream" | "ivory" | "charcoal";
  align?: "center" | "left";
  children?: React.ReactNode;
}) {
  const onDark = tone === "charcoal";

  return (
    <header
      className={cn(
        "border-b",
        tone === "cream" && "border-taupe/40 bg-cream",
        tone === "ivory" && "border-taupe/40 bg-ivory",
        onDark && "border-ivory/12 bg-charcoal"
      )}
    >
      <Container className="py-12 sm:py-16 lg:py-20">
        {crumbs ? (
          <Breadcrumbs
            items={crumbs}
            onDark={onDark}
            className={cn("mb-8", align === "center" && "flex justify-center")}
          />
        ) : null}

        <Reveal
          className={cn(
            "flex flex-col",
            align === "center" ? "items-center text-center" : "items-start text-left"
          )}
        >
          {eyebrow ? (
            <Eyebrow onDark={onDark} className="mb-5">
              {eyebrow}
            </Eyebrow>
          ) : null}

          <h1
            className={cn(
              "text-display-l",
              onDark ? "text-ivory" : "text-ink"
            )}
          >
            {title}
          </h1>

          {lede ? (
            <p
              className={cn(
                "u-measure mt-6 text-[1.0625rem] leading-[1.8]",
                onDark ? "text-ivory/75" : "text-ink-muted"
              )}
            >
              {lede}
            </p>
          ) : null}

          {children}
        </Reveal>
      </Container>
    </header>
  );
}
