import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { HowItWorks } from "@/components/home/HowItWorks";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { photoGuidelines } from "@/lib/data/content";

const crumbs = [
  { name: "Home", href: "/" },
  { name: "How It Works", href: "/how-it-works" },
];

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Choose your keepsake, upload your photos, and we create it individually for you. Here is exactly what happens between your camera roll and your keepsake.",
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    title: "How It Works | RK Memory Studio",
    description:
      "Choose it, upload it, we create it, love it - how your photographs become keepsakes.",
    url: "/how-it-works",
  },
};

export default function HowItWorksPage() {
  return (
    <>
      <BreadcrumbJsonLd items={crumbs} />

      <PageHeader
        eyebrow="How It Works"
        title="Creating Your Keepsake Is Easy"
        lede="Four steps between the photo on your phone and something you can hold."
        crumbs={crumbs}
      />

      <div className="bg-ivory py-16 sm:py-20 lg:py-24">
        <HowItWorks showHeading={false} />
      </div>

      <Section tone="cream" spacing="lg" aria-labelledby="photo-tips-heading">
        <SectionHeading
          id="photo-tips-heading"
          eyebrow="Getting the Best Result"
          title="Choosing the Right Photo"
          lede="The keepsake can only be as good as the file it is made from. These four things make the biggest difference."
        />

        <ul className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2">
          {photoGuidelines.map((tip, index) => (
            <Reveal
              as="li"
              key={tip.title}
              delay={index * 60}
              className="flex gap-5 border-t border-taupe/50 pt-7"
            >
              <span
                aria-hidden="true"
                className="tabular grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/50 font-sans text-[0.8125rem] font-medium text-gold-ink"
              >
                {index + 1}
              </span>

              <div>
                <h3 className="text-[1.25rem] leading-snug">{tip.title}</h3>
                <p className="u-measure mt-2.5 text-[0.9375rem] leading-[1.75] text-ink-muted">
                  {tip.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section tone="ivory" spacing="lg" aria-labelledby="what-we-do-heading">
        <div className="mx-auto max-w-[46rem]">
          <SectionHeading
            id="what-we-do-heading"
            eyebrow="Our Part"
            title="What Happens After You Order"
          />

          <Reveal delay={80}>
            <ul className="mt-12 space-y-7">
              {[
                {
                  icon: "image" as const,
                  title: "We review every photo",
                  body: "Each file is checked before anything is produced. If a photo will not reproduce well at keepsake size, we contact you first rather than printing it anyway.",
                },
                {
                  icon: "hands" as const,
                  title: "We prepare each design",
                  body: "Cropping, placement and any name, date or message you added are set up by hand so the photograph sits well in the finished piece.",
                },
                {
                  icon: "gift" as const,
                  title: "We produce and pack your order",
                  body: "Your keepsakes are made and packed ready to give, display or hand out at your event.",
                },
              ].map((item) => (
                <li key={item.title} className="flex gap-5">
                  <span
                    aria-hidden="true"
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/45 text-gold"
                  >
                    <Icon name={item.icon} size={22} strokeWidth={1.2} />
                  </span>
                  <div>
                    <h3 className="text-[1.25rem] leading-snug">{item.title}</h3>
                    <p className="mt-2 text-[0.9375rem] leading-[1.8] text-ink-muted">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={140} className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Button href="/shop" variant="solid" size="lg">
              Start Creating
            </Button>
            <Button href="/faq" variant="outline" size="lg">
              Read the FAQ
            </Button>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
