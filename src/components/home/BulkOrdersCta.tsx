import { Container } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Section";

/**
 * Bulk orders call to action.
 *
 * A black panel edged in champagne gold, sitting on the ivory page rather than
 * filling a full band - so it reads as a distinct card between the dark events
 * section above and the charcoal footer below, instead of merging into one
 * long dark passage.
 */
export function BulkOrdersCta() {
  return (
    <section
      aria-labelledby="bulk-cta-heading"
      className="bg-ivory pb-20 sm:pb-28 lg:pb-36"
    >
      <Container>
        <Reveal className="relative overflow-hidden border border-gold/45 bg-black px-6 py-14 text-center sm:px-12 sm:py-16 lg:px-20 lg:py-20">
          {/* Soft gold corner wash - decorative only */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gold/20 blur-3xl"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-gold/10 blur-3xl"
          />

          <div className="relative mx-auto max-w-[42rem]">
            <Eyebrow onDark className="mb-5">
              Bulk Orders
            </Eyebrow>

            <h2 id="bulk-cta-heading" className="text-display-m text-ivory">
              Need 50, 100, 250 or More?
            </h2>

            <p className="mt-6 text-[1.0625rem] leading-[1.8] text-ivory/75">
              Planning a wedding, corporate event, graduation or large
              celebration? RK Memory Studio offers custom bulk orders for events.
            </p>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <Button href="/bulk-orders" variant="onDark" size="lg">
                Request a Quote
              </Button>
              <Button href="/contact" variant="onDarkOutline" size="lg">
                Talk to Us
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
