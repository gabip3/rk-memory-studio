import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { Eyebrow } from "@/components/ui/Section";
import { keychainStyles } from "@/lib/data/products";
import { keychainAudiences } from "@/lib/data/content";

export function Keychains() {
  return (
    <Section tone="ivory" spacing="lg" aria-labelledby="keychains-heading">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
        <Reveal>
          <Photo
            src={null}
            alt="Two personalized photo keychains resting on a linen surface, one showing a couple and one showing a golden retriever."
            placeholderLabel="Photo keychains"
            ratio="5 / 4"
            zoom
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </Reveal>

        <div>
          <Reveal>
            <Eyebrow className="mb-5">Photo Keychains</Eyebrow>

            <h2 id="keychains-heading" className="text-display-m">
              Carry Your Memories Everywhere
            </h2>

            <p className="u-measure mt-6 text-[1.0625rem] leading-[1.8] text-ink-muted">
              Transform your favorite photographs into personalized photo
              keychains.
            </p>
          </Reveal>

          <Reveal delay={90}>
            <h3 className="u-eyebrow mt-9">Perfect For</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {keychainAudiences.map((audience) => (
                <li
                  key={audience}
                  className="border border-gold/45 bg-gold-wash/50 px-3.5 py-2 text-[0.8125rem] text-ink"
                >
                  {audience}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={150}>
            <h3 className="u-eyebrow mt-9">Styles</h3>
            <ul className="mt-4 divide-y divide-taupe/45 border-y border-taupe/45">
              {keychainStyles.map((style) => (
                <li key={style.name} className="py-3.5">
                  <p className="font-display text-[1.125rem] leading-snug text-ink">
                    {style.name}
                  </p>
                  <p className="mt-0.5 text-[0.875rem] leading-relaxed text-ink-muted">
                    {style.description}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={210}>
            <Button
              href="/shop/photo-keychains"
              variant="solid"
              size="lg"
              className="mt-9"
            >
              Create Your Keychain
            </Button>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
