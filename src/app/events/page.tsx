import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { Icon } from "@/components/ui/Icon";
import { BulkOrdersCta } from "@/components/home/BulkOrdersCta";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { eventCategories } from "@/lib/data/events";

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Events", href: "/events" },
];

export const metadata: Metadata = {
  title: "Event Keepsakes & Favours",
  description:
    "Personalized keepsakes for weddings, birthdays, baby showers, graduations, corporate events and memorials - favours your guests will actually take home.",
  alternates: { canonical: "/events" },
  openGraph: {
    title: "Event Keepsakes & Favours | RK Memory Studio",
    description:
      "Personalized event keepsakes for weddings, birthdays, graduations, corporate events and more.",
    url: "/events",
  },
};

export default function EventsPage() {
  return (
    <>
      <BreadcrumbJsonLd items={crumbs} />

      <PageHeader
        eyebrow="Events"
        title="Make Your Celebration Unforgettable"
        lede="Personalized favours built around your event's photography, names and dates - for weddings, birthdays, graduations, corporate events and more."
        crumbs={crumbs}
        tone="charcoal"
      />

      <Section tone="ivory" spacing="lg" aria-label="Event types">
        <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {eventCategories.map((event, index) => (
            <Reveal as="li" key={event.slug} delay={index * 55}>
              <article className="group h-full">
                <Link href={`/events/${event.slug}`} className="block">
                  <Photo
                    src={event.image.src}
                    alt={event.image.alt}
                    placeholderLabel={event.name}
                    ratio="4 / 3"
                    zoom
                    priority={index < 3}
                    sizes="(max-width: 640px) 88vw, (max-width: 1024px) 45vw, 30vw"
                  />

                  <h2 className="mt-6 text-[1.5rem] transition-colors duration-[var(--dur-base)] group-hover:text-gold-display">
                    {event.name}
                  </h2>

                  <p className="mt-2.5 text-[0.9375rem] leading-[1.7] text-ink-muted">
                    {event.blurb}
                  </p>

                  <span
                    aria-hidden="true"
                    className="mt-4 inline-flex items-center gap-2 font-sans text-[0.625rem] font-medium uppercase tracking-[0.2em] text-gold-ink"
                  >
                    <span className="u-underline">Explore {event.name}</span>
                    <Icon
                      name="arrow-right"
                      size={14}
                      className="transition-transform duration-[var(--dur-base)] group-hover:translate-x-1 motion-reduce:transform-none"
                    />
                  </span>
                </Link>
              </article>
            </Reveal>
          ))}
        </ul>
      </Section>

      <BulkOrdersCta />
    </>
  );
}
