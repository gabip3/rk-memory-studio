import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/shop/ProductCard";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getEvent, eventSlugs } from "@/lib/data/events";
import { getProduct } from "@/lib/data/products";
import { OG_IMAGE } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return eventSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);

  if (!event) return { title: "Event not found" };

  return {
    title: event.seo.title,
    description: event.seo.description,
    alternates: { canonical: `/events/${event.slug}` },
    openGraph: {
      images: [OG_IMAGE],
      title: `${event.seo.title} | RK Memory Studio`,
      description: event.seo.description,
      url: `/events/${event.slug}`,
    },
  };
}

export default async function EventPage({ params }: Params) {
  const { slug } = await params;
  const event = getEvent(slug);

  if (!event) notFound();

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    { name: event.name, href: `/events/${event.slug}` },
  ];

  const related = event.relatedProducts
    .map((productSlug) => getProduct(productSlug))
    .filter((product) => product !== undefined);

  return (
    <>
      <BreadcrumbJsonLd items={crumbs} />

      <PageHeader
        eyebrow="Event Keepsakes"
        title={event.name}
        lede={event.intro}
        crumbs={crumbs}
        tone="charcoal"
      />

      <Section tone="ivory" spacing="lg" aria-labelledby="offerings-heading">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Photo
              src={event.image.src}
              alt={event.image.alt}
              placeholderLabel={event.name}
              ratio="5 / 4"
              priority
              zoom
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </Reveal>

          <div>
            <Reveal>
              <h2
                id="offerings-heading"
                className="text-display-s"
              >
                What We Make for {event.name}
              </h2>
            </Reveal>

            <Reveal delay={80}>
              <ul className="mt-7 space-y-3.5">
                {event.offerings.map((offering) => (
                  <li
                    key={offering}
                    className="flex items-start gap-3 text-[1rem] leading-relaxed text-ink"
                  >
                    <Icon
                      name="check-circle"
                      size={18}
                      strokeWidth={1.3}
                      className="mt-1 shrink-0 text-gold"
                    />
                    {offering}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={150}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button href="/bulk-orders" variant="solid" size="lg">
                  Request Event Order
                </Button>
                <Button href="/contact" variant="outline" size="lg">
                  Ask a Question
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {related.length > 0 ? (
        <Section tone="cream" spacing="lg" aria-labelledby="event-products-heading">
          <SectionHeading
            id="event-products-heading"
            eyebrow="Popular For This Event"
            title="Keepsakes to Consider"
          />

          <ul className="mt-14 grid gap-x-7 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((product, index) => (
              <Reveal
                as="li"
                key={product.slug}
                delay={index * 60}
                className="h-full"
              >
                <ProductCard product={product} />
              </Reveal>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}
