import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductConfigurator } from "@/components/product/ProductConfigurator";
import { BreadcrumbJsonLd, ProductJsonLd } from "@/components/seo/JsonLd";
import { getProduct, products, productSlugs } from "@/lib/data/products";
import { photoGuidelines } from "@/lib/data/content";
import { OG_IMAGE } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

/** Pre-render every product page at build time. */
export function generateStaticParams() {
  return productSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) return { title: "Product not found" };

  return {
    title: product.seo.title,
    description: product.seo.description,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      images: [OG_IMAGE],
      title: `${product.seo.title} | RK Memory Studio`,
      description: product.seo.description,
      url: `/shop/${product.slug}`,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) notFound();

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: product.name, href: `/shop/${product.slug}` },
  ];

  const related = products
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  return (
    <>
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd items={crumbs} />

      <div className="border-b border-taupe/40 bg-cream">
        <Container className="py-6">
          <Breadcrumbs items={crumbs} />
        </Container>
      </div>

      <Section tone="ivory" spacing="md" width="wide">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14 xl:gap-20">
          {/* ---- Gallery (sticky on desktop) ------------------------------ */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <Photo
                src={product.images[0]?.src ?? null}
                alt={product.images[0]?.alt ?? product.name}
                placeholderLabel={product.name}
                ratio={
                  // The photo's own proportions, so a landscape product shot is
                  // not cropped straight through its subject.
                  product.images[0]?.src
                    ? `${product.images[0].width} / ${product.images[0].height}`
                    : "4 / 5"
                }
                priority
                zoom
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </Reveal>

            {product.images.length > 1 ? (
              <ul className="mt-3 grid grid-cols-4 gap-3">
                {product.images.slice(1).map((image, index) => (
                  <li key={index}>
                    <Photo
                      src={image.src}
                      alt={image.alt}
                      placeholderLabel="Detail"
                      ratio="1 / 1"
                      sizes="12vw"
                    />
                  </li>
                ))}
              </ul>
            ) : null}

            {/* Photo guidance sits with the imagery, where it is most useful */}
            <div className="mt-8 hidden border border-taupe/45 bg-cream p-6 lg:block">
              <h2 className="u-eyebrow">Photo Tips</h2>
              <ul className="mt-4 space-y-3">
                {photoGuidelines.slice(0, 3).map((tip) => (
                  <li key={tip.title} className="flex items-start gap-2.5">
                    <Icon
                      name="check"
                      size={15}
                      strokeWidth={1.6}
                      className="mt-1 shrink-0 text-gold"
                    />
                    <span className="text-[0.875rem] leading-relaxed text-ink-muted">
                      <strong className="font-medium text-ink">{tip.title}.</strong>{" "}
                      {tip.description}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/help/photo-guidelines"
                className="mt-4 inline-flex min-h-11 items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-gold-ink"
              >
                <span className="u-underline">All photo guidelines</span>
                <Icon name="arrow-right" size={14} />
              </Link>
            </div>
          </div>

          {/* ---- Details + configurator ----------------------------------- */}
          <div>
            <Reveal>
              <p className="u-eyebrow">{product.tagline}</p>

              <h1 className="mt-4 text-display-m">
                {product.headline}
              </h1>

              <p className="u-measure mt-6 text-[1.0625rem] leading-[1.8] text-ink-muted">
                {product.description}
              </p>

              <ul className="mt-7 space-y-2.5 border-y border-taupe/45 py-6">
                {product.details.map((detail) => (
                  <li
                    key={detail}
                    className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-ink"
                  >
                    <Icon
                      name="check"
                      size={16}
                      strokeWidth={1.6}
                      className="mt-1 shrink-0 text-gold"
                    />
                    {detail}
                  </li>
                ))}
              </ul>
            </Reveal>

            <div className="mt-12">
              {/* useSearchParams needs a Suspense boundary in the App Router */}
              <Suspense
                fallback={
                  <div className="u-skeleton h-96 w-full" aria-hidden="true" />
                }
              >
                <ProductConfigurator product={product} />
              </Suspense>
            </div>
          </div>
        </div>
      </Section>

      {related.length > 0 ? (
        <Section tone="cream" spacing="lg" aria-labelledby="related-heading">
          <SectionHeading
            id="related-heading"
            eyebrow="Also Made For You"
            title="More Ways to Keep a Memory"
          />

          <ul className="mt-14 grid gap-x-7 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <Reveal as="li" key={item.slug} delay={index * 60} className="h-full">
                <ProductCard product={item} />
              </Reveal>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}
