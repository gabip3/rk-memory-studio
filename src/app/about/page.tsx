import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { Button } from "@/components/ui/Button";
import { BrandStory } from "@/components/home/BrandStory";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { site, OG_IMAGE } from "@/lib/site";

const crumbs = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
];

export const metadata: Metadata = {
  title: "About Us",
  description:
    "RK Memory Studio was created around a simple idea: meaningful moments deserve to become something you can keep. Based in Atlanta, Georgia.",
  alternates: { canonical: "/about" },
  openGraph: {
    images: [OG_IMAGE],
    title: "About Us | RK Memory Studio",
    description:
      "We turn moments into keepsakes - personalized products created for families, celebrations, gifts and events.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd items={crumbs} />

      <PageHeader
        eyebrow="About Us"
        title="We Turn Moments Into Keepsakes"
        crumbs={crumbs}
      />

      <Section tone="ivory" spacing="lg" aria-labelledby="story-heading">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <Reveal>
            <Photo
              src="/images/about.webp"
              alt="Finished photo magnets in a ceramic dish beside photo keychains, a kraft gift box tied with ribbon and a spool of twine on a wooden table."
              placeholderLabel="Studio photography"
              ratio="5 / 4"
              priority
              zoom
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </Reveal>

          <div>
            <Reveal>
              <h2 id="story-heading" className="sr-only">
                Our story
              </h2>

              <p className="u-measure text-[1.125rem] leading-[1.85] text-ink">
                RK Memory Studio was created around a simple idea: meaningful
                moments deserve to become something you can keep.
              </p>

              <p className="u-measure mt-6 text-[1.0625rem] leading-[1.85] text-ink-muted">
                We transform photographs and special memories into personalized
                products created for families, celebrations, gifts and events.
              </p>

              <p className="u-measure mt-6 text-[1.0625rem] leading-[1.85] text-ink-muted">
                From everyday memories to life&rsquo;s biggest celebrations, our
                goal is to help you turn the moments you love into keepsakes
                worth holding onto.
              </p>
            </Reveal>

            <Reveal delay={90}>
              <div className="mt-10 border-l-2 border-gold pl-6">
                <p className="u-eyebrow">Where We Are</p>
                <p className="mt-3 text-[1rem] leading-relaxed text-ink">
                  {site.contact.location}
                </p>
                <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-muted">
                  {site.contact.serviceArea}
                </p>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button href="/shop" variant="solid" size="lg">
                  Shop Keepsakes
                </Button>
                <Button href="/contact" variant="outline" size="lg">
                  Contact Us
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      <BrandStory />

      {/* Sister brand - a genuine relationship, stated plainly */}
      <Section tone="ivory" spacing="md" aria-labelledby="sister-heading">
        <Reveal className="mx-auto max-w-[46rem] border border-taupe/50 bg-cream px-8 py-12 text-center sm:px-12">
          <p className="u-eyebrow">Part of the RK Family</p>

          <h2 id="sister-heading" className="mt-5 text-display-s">
            {site.sisterBrand.name}
          </h2>

          <p className="u-measure mx-auto mt-5 text-[1rem] leading-[1.8] text-ink-muted">
            {site.sisterBrand.blurb} If you are booking a booth for your event,
            we can turn the photographs your guests take on the night into
            keepsakes they take home.
          </p>

          <Button
            href={site.sisterBrand.url}
            variant="outline"
            className="mt-8"
          >
            Visit RK 360
          </Button>
        </Reveal>
      </Section>
    </>
  );
}
