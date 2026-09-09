import Link from "next/link";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Photo } from "@/components/ui/Photo";
import type { Product } from "@/lib/data/products";

/** Each category gets a consistent mark, drawn from the one icon family. */
const categoryIcon: Record<Product["category"], IconName> = {
  magnets: "magnet",
  keychains: "key",
  "photo-strips": "image",
  "event-keepsakes": "gift",
  gifts: "gift",
};

/**
 * The premium product card.
 *
 * The whole card is one link (via a stretched overlay on the title) so the tap
 * target is the full card on mobile, while the accessible name stays the
 * product name rather than "image, link, link".
 */
export function ProductCard({
  product,
  cta,
  className,
  priority = false,
}: {
  product: Product;
  /** Overrides the default "Shop <name>" label. */
  cta?: string;
  className?: string;
  priority?: boolean;
}) {
  const href = `/shop/${product.slug}`;
  const image = product.images[0];

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col border border-taupe/40 bg-ivory",
        "transition-[box-shadow,border-color,transform] duration-[var(--dur-slow)] ease-out-soft",
        "hover:border-gold/60 hover:shadow-lift motion-safe:hover:-translate-y-1",
        className
      )}
    >
      <div className="relative">
        <Photo
          src={image?.src ?? null}
          alt={image?.alt ?? product.name}
          placeholderLabel={product.name}
          ratio="4 / 3"
          zoom
          priority={priority}
          sizes="(max-width: 640px) 88vw, (max-width: 1024px) 45vw, 30vw"
        />

        {/* Circular mark straddling the image edge - the card's signature */}
        <span
          aria-hidden="true"
          className="absolute -bottom-7 left-6 grid h-14 w-14 place-items-center rounded-full bg-charcoal text-gold-on-dark shadow-card transition-colors duration-[var(--dur-base)] group-hover:bg-black"
        >
          <Icon name={categoryIcon[product.category]} size={22} strokeWidth={1.3} />
        </span>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-7 pt-12">
        <h3 className="text-[1.375rem] leading-snug sm:text-[1.5rem]">
          <Link
            href={href}
            className="transition-colors duration-[var(--dur-base)] group-hover:text-gold-display after:absolute after:inset-0 after:content-['']"
          >
            {product.name}
          </Link>
        </h3>

        <p className="mt-3 flex-1 text-[0.9375rem] leading-[1.7] text-ink-muted">
          {product.cardDescription}
        </p>

        <span
          aria-hidden="true"
          className="mt-6 inline-flex items-center gap-2.5 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-gold-ink"
        >
          <span className="u-underline">{cta ?? `Shop ${product.name}`}</span>
          <Icon
            name="arrow-right"
            size={15}
            className="transition-transform duration-[var(--dur-base)] ease-out-soft group-hover:translate-x-1 motion-reduce:transform-none"
          />
        </span>
      </div>
    </article>
  );
}
