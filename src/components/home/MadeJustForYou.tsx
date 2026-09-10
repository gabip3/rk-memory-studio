import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/ui/Photo";
import { occasions } from "@/lib/data/content";

/**
 * Editorial two-up: photography on the left, the occasions list on the right.
 * The list is a real <ul> in two columns rather than a grid of divs, so it is
 * announced as a list of ten items.
 */
export function MadeJustForYou() {
  return (
    <Section tone="ivory" spacing="lg" aria-labelledby="made-for-you-heading">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
        <Reveal className="order-2 lg:order-1">
          <Photo
            src="/images/made-for-you.webp"
            alt="A hand holding a square photo magnet of a father hugging his son and daughter, with more photo magnets on the refrigerator behind."
            placeholderLabel="Lifestyle photography"
            ratio="5 / 4"
            zoom
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <h2
              id="made-for-you-heading"
              className="text-display-m"
            >
              Made Just for You
            </h2>

            <p className="u-measure mt-6 text-[1.0625rem] leading-[1.8] text-ink-muted">
              Every RK Memory Studio keepsake is individually created using the
              photos you provide.
            </p>
          </Reveal>

          <Reveal delay={90}>
            <h3 className="u-eyebrow mt-10">Perfect For</h3>

            <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
              {occasions.map((occasion) => (
                <li
                  key={occasion}
                  className="flex items-center gap-3 py-1.5 text-[0.9375rem] text-ink"
                >
                  <Icon
                    name="check-circle"
                    size={18}
                    strokeWidth={1.3}
                    className="shrink-0 text-gold"
                  />
                  {occasion}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={160}>
            <Button href="/shop" variant="outline" className="mt-10">
              See All Products
            </Button>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
