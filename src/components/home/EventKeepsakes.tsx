import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/ui/Photo";
import { homeEvents } from "@/lib/data/events";

/**
 * The dramatic editorial break in the page: charcoal ground, champagne-gold
 * type, event photography.
 *
 * All text here is checked against the charcoal background - gold-on-dark
 * (#c9ac7e) reaches 8.0:1 and ivory/70 stays above 4.5:1, so nothing relies on
 * the reader having a bright screen.
 */
export function EventKeepsakes() {
  const events = homeEvents();

  return (
    <Section
      tone="charcoal"
      spacing="lg"
      width="wide"
      aria-labelledby="events-heading"
      id="events"
    >
      <SectionHeading
        id="events-heading"
        eyebrow="Event Keepsakes"
        title="Make Your Celebration Unforgettable"
        lede="Personalized favours built around your event's photography, names and dates - for the people who came to celebrate with you."
        onDark
      />

      <ul className="mt-14 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-x-6">
        {events.map((event, index) => (
          <Reveal as="li" key={event.slug} delay={index * 60}>
            <article className="group h-full">
              <Link href={`/events/${event.slug}`} className="block">
                <Photo
                  src={event.image.src}
                  alt={event.image.alt}
                  placeholderLabel={event.name}
                  ratio="3 / 4"
                  tone="dark"
                  zoom
                  sizes="(max-width: 640px) 88vw, (max-width: 1024px) 45vw, 23vw"
                />

                <h3 className="mt-6 text-[1.375rem] text-ivory transition-colors duration-[var(--dur-base)] group-hover:text-gold-on-dark">
                  {event.name}
                </h3>

                <p className="mt-2.5 text-[0.9375rem] leading-[1.7] text-ivory/70">
                  {event.blurb}
                </p>

                <span
                  aria-hidden="true"
                  className="mt-4 inline-flex items-center gap-2 font-sans text-[0.625rem] font-medium uppercase tracking-[0.2em] text-gold-on-dark"
                >
                  <span className="u-underline">Explore</span>
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

      <Reveal delay={140} className="mt-14 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button href="/bulk-orders" variant="onDark" size="lg">
          Request Event Order
        </Button>
        <Button href="/events" variant="onDarkOutline" size="lg">
          All Event Types
        </Button>
      </Reveal>
    </Section>
  );
}
