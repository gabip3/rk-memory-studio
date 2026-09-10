import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/ui/Photo";
import { Eyebrow } from "@/components/ui/Section";
import { featuredProduct } from "@/lib/data/products";

/**
 * Featured product spotlight for Custom Photo Magnets.
 *
 * The quantity chips here are presentational previews that deep-link into the
 * configurator with the choice pre-selected (`?qty=`), so a customer can go
 * from the home page straight to "24 magnets, ready to upload" in one tap.
 * The real selection control lives on the product page.
 */
export function FeaturedProduct() {
  const product = featuredProduct();

  return (
    <Section tone="cream" spacing="lg" aria-labelledby="featured-heading">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16 xl:gap-20">
        <div>
          <Reveal>
            <Eyebrow className="mb-5">Featured: {product.name}</Eyebrow>

            <h2 id="featured-heading" className="text-display-m">
              {product.headline}
            </h2>

            <p className="u-measure mt-6 text-[1.0625rem] leading-[1.8] text-ink-muted">
              {product.description}
            </p>
          </Reveal>

          <Reveal delay={90}>
            <ul className="mt-8 space-y-2.5">
              {product.details.map((detail) => (
                <li
                  key={detail}
                  className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-ink"
                >
                  <Icon
                    name="check"
                    size={17}
                    strokeWidth={1.6}
                    className="mt-1 shrink-0 text-gold"
                  />
                  {detail}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={160}>
            <h3 className="u-eyebrow mt-10">Choose Your Quantity</h3>

            <ul className="u-rail mt-4 -mx-5 flex gap-2.5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
              {product.quantityOptions.map((option) => (
                <li key={option.count} className="shrink-0">
                  <Link
                    href={`/shop/${product.slug}?qty=${option.count}`}
                    className="tabular flex min-h-12 items-center gap-2 border border-taupe bg-ivory px-4 text-[0.875rem] text-ink transition-[border-color,background-color,color] duration-[var(--dur-base)] hover:border-gold-ink hover:bg-gold-wash"
                  >
                    <span className="font-medium">{option.count}</span>
                    <span className="text-ink-muted">
                      {option.label.replace(`${option.count} `, "")}
                    </span>
                    {option.note ? (
                      <span className="u-caps ml-1 border-l border-taupe/70 pl-2 text-[0.5625rem] tracking-[0.16em] text-gold-ink">
                        {option.note}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button href={`/shop/${product.slug}`} variant="solid" size="lg">
                Create Your Magnets
              </Button>
              <Button href="/how-it-works" variant="outline" size="lg">
                How It Works
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={80}>
          <Photo
            src={product.images[0]?.src ?? null}
            alt={product.images[0]?.alt ?? product.name}
            placeholderLabel="Custom photo magnets"
            ratio={
              // The photo's own proportions, so a landscape product shot is
              // not cropped straight through its subject.
              product.images[0]?.src
                ? `${product.images[0].width} / ${product.images[0].height}`
                : "4 / 5"
            }
            zoom
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </Reveal>
      </div>
    </Section>
  );
}
