import { Container } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { processSteps } from "@/lib/data/content";

/**
 * The four-step process, presented on a charcoal tray with champagne-gold
 * markers - the black-and-gold register shared with RK 360.
 *
 * Desktop: a horizontal run with a hairline connecting the numbered markers.
 * Mobile: a vertical rail, because a squeezed four-column row would push the
 * step copy below a readable size.
 *
 * The connector is decorative and `aria-hidden`; the ordered list carries the
 * sequence for assistive technology.
 */
export function HowItWorks({
  showHeading = true,
  className,
}: {
  showHeading?: boolean;
  className?: string;
}) {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      id="how-it-works"
      className={className}
    >
      <Container>
        <div className="bg-charcoal px-5 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          {showHeading ? (
            <Reveal className="flex flex-col items-center text-center">
              <Eyebrow onDark className="mb-5">
                How It Works
              </Eyebrow>
              <h2
                id="how-it-works-heading"
                className="text-display-m text-ivory"
              >
                Creating Your Keepsake Is Easy
              </h2>
            </Reveal>
          ) : (
            <h2 id="how-it-works-heading" className="sr-only">
              How it works
            </h2>
          )}

          <div className="relative mt-12 lg:mt-16">
            {/* Desktop connector: spans marker centres (12.5% to 87.5%) */}
            <span
              aria-hidden="true"
              className="absolute left-[12.5%] right-[12.5%] top-6 hidden h-px bg-gradient-to-r from-transparent via-gold-on-dark/45 to-transparent lg:block"
            />
            {/* Mobile connector: vertical rail behind the markers */}
            <span
              aria-hidden="true"
              className="absolute bottom-8 left-6 top-8 w-px bg-gradient-to-b from-transparent via-gold-on-dark/35 to-transparent sm:left-7 lg:hidden"
            />

            <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-6">
              {processSteps.map((step, index) => (
                <Reveal
                  as="li"
                  key={step.step}
                  delay={index * 70}
                  className="flex gap-5 lg:flex-col lg:items-center lg:gap-0 lg:text-center"
                >
                  {/* Numbered marker - charcoal on gold reaches 5.8:1 */}
                  <span
                    aria-hidden="true"
                    className="tabular grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold font-sans text-[0.9375rem] font-semibold text-charcoal ring-8 ring-charcoal"
                  >
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1 lg:mt-7 lg:flex lg:flex-col lg:items-center">
                    <Icon
                      name={step.icon}
                      size={34}
                      strokeWidth={1.15}
                      className="mb-4 hidden text-gold-on-dark lg:block"
                    />

                    <h3 className="text-[1.25rem] leading-snug text-ivory lg:text-[1.375rem]">
                      {step.title}
                    </h3>

                    <p className="u-measure-tight mt-2.5 text-[0.9375rem] leading-[1.7] text-ivory/70 lg:mx-auto lg:mt-3">
                      {step.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>

          <Reveal delay={120} className="mt-12 flex justify-center lg:mt-16">
            <Button href="/shop/custom-photo-magnets" variant="onDark" size="lg">
              Start Creating
            </Button>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
