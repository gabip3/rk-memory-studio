import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { brandValues } from "@/lib/data/content";

/**
 * The brand's emotional centre, given the full black-and-gold editorial
 * treatment - the most dramatic moment on the page.
 *
 * Contrast on charcoal: ivory 16.2:1, ivory/75 ~8.5:1, gold-on-dark 8.0:1.
 */
export function BrandStory() {
  return (
    <Section tone="charcoal" spacing="lg" aria-labelledby="brand-story-heading">
      <Reveal className="mx-auto flex max-w-[46rem] flex-col items-center text-center">
        <h2 id="brand-story-heading" className="text-display-l text-ivory">
          Memories Deserve More Than a Camera Roll
        </h2>
        <p className="mt-7 text-[1.0625rem] leading-[1.85] text-ivory/75 sm:text-[1.125rem]">
          Your favorite photographs shouldn&rsquo;t disappear among thousands of
          pictures on your phone. RK Memory Studio transforms meaningful moments
          into personalized keepsakes you can see, hold, share and give.
        </p>
      </Reveal>

      <ul className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {brandValues.map((value, index) => (
          <Reveal
            as="li"
            key={value.title}
            delay={index * 60}
            className="flex flex-col items-center text-center"
          >
            <span
              aria-hidden="true"
              className="grid h-16 w-16 place-items-center rounded-full border border-gold-on-dark/45 text-gold-on-dark"
            >
              <Icon name={value.icon} size={27} strokeWidth={1.15} />
            </span>

            <h3 className="u-caps mt-6 text-[0.6875rem] tracking-[0.2em] text-gold-on-dark">
              {value.title}
            </h3>

            <p className="u-measure-tight mt-3 text-[0.9375rem] leading-[1.7] text-ivory/70">
              {value.description}
            </p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
