import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/shop/ProductCard";
import { HowItWorks } from "@/components/home/HowItWorks";
import { BulkOrdersCta } from "@/components/home/BulkOrdersCta";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { products } from "@/lib/data/products";
import { OG_IMAGE } from "@/lib/site";

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
];

export const metadata: Metadata = {
  title: "Shop Personalized Keepsakes",
  description:
    "Custom photo magnets in two shapes, made individually from the photographs you upload.",
  alternates: { canonical: "/shop" },
  openGraph: {
    images: [OG_IMAGE],
    title: "Shop Personalized Keepsakes | RK Memory Studio",
    description:
      "Custom photo magnets made from your own photographs, as 2x2 squares or 2.25 rounds.",
    url: "/shop",
  },
};

export default function ShopPage() {
  return (
    <>
      <BreadcrumbJsonLd items={crumbs} />

      <PageHeader
        eyebrow="Shop"
        title="Keepsakes Made From Your Photos"
        lede="Choose a keepsake, upload your photographs, and we make it individually for you."
        crumbs={crumbs}
      />

      <Section tone="ivory" spacing="lg" aria-label="All products">
        {/* One product today, so the card is centred at a readable width
            rather than stranded in the first cell of a three-column grid.
            The grid returns on its own if the catalogue grows. */}
        <ul
          className={
            products.length === 1
              ? "mx-auto max-w-[26rem]"
              : "grid gap-x-7 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8"
          }
        >
          {products.map((product, index) => (
            <Reveal
              as="li"
              key={product.slug}
              delay={index * 50}
              className="h-full"
            >
              <ProductCard product={product} priority={index < 3} />
            </Reveal>
          ))}
        </ul>
      </Section>

      <div className="bg-ivory pb-20 sm:pb-28 lg:pb-32">
        <HowItWorks />
      </div>

      <BulkOrdersCta />
    </>
  );
}
