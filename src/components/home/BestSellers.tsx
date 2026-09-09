import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/shop/ProductCard";
import { bestSellers } from "@/lib/data/products";

/** CTA wording is fixed per the brand copy deck rather than auto-generated. */
const ctaFor: Record<string, string> = {
  "custom-photo-magnets": "Shop Magnets",
  "photo-keychains": "Shop Keychains",
  "event-keepsakes": "Shop Event Keepsakes",
};

export function BestSellers() {
  const items = bestSellers();

  return (
    <Section
      tone="ivory"
      spacing="lg"
      aria-labelledby="best-sellers-heading"
      id="best-sellers"
    >
      <SectionHeading
        id="best-sellers-heading"
        eyebrow="Best Sellers"
        title="Made From Your Favorite Moments"
      />

      <ul className="mt-14 grid gap-x-7 gap-y-16 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-x-8">
        {items.map((product, index) => (
          <Reveal
            as="li"
            key={product.slug}
            // 60ms stagger reads as one considered sequence, not a queue.
            delay={index * 60}
            className="h-full"
          >
            <ProductCard product={product} cta={ctaFor[product.slug]} />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
