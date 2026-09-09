import { PageHeader, type Crumb } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import type { PolicyPage } from "@/lib/data/policies";

/**
 * Shared renderer for policy and help pages.
 *
 * Pages whose content is still outstanding show an honest notice band rather
 * than filler text, and always offer a route to a real answer.
 */
export function ArticlePage({
  page,
  crumbs,
}: {
  page: PolicyPage;
  crumbs: Crumb[];
}) {
  return (
    <>
      <PageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        lede={page.intro}
        crumbs={crumbs}
        align="left"
      />

      <Section tone="ivory" spacing="lg" width="narrow">
        {page.notice ? (
          <Reveal className="mb-12 flex items-start gap-3.5 border-l-2 border-gold bg-gold-wash/60 px-5 py-4">
            <Icon name="info" size={19} className="mt-0.5 shrink-0 text-gold-ink" />
            <div>
              <p className="u-caps text-[0.625rem] tracking-[0.2em] text-gold-ink">
                {page.status === "draft" ? "Draft" : "Coming before launch"}
              </p>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink">
                {page.notice}
              </p>
            </div>
          </Reveal>
        ) : null}

        <div className="space-y-10">
          {page.sections.map((section, index) => (
            <Reveal key={section.heading} delay={index * 50}>
              <h2 className="text-display-s">
                {section.heading}
              </h2>

              {section.body.map((paragraph, pIndex) => (
                <p
                  key={pIndex}
                  className="u-measure mt-4 text-[1.0625rem] leading-[1.85] text-ink-muted"
                >
                  {paragraph}
                </p>
              ))}
            </Reveal>
          ))}
        </div>

        <Reveal
          delay={120}
          className="mt-14 border-t border-taupe/50 pt-10"
        >
          <h2 className="text-display-s">Need a direct answer?</h2>
          <p className="u-measure mt-4 text-[1rem] leading-[1.8] text-ink-muted">
            We would rather confirm something for your specific order than have
            you guess from a general page.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="/contact" variant="solid">
              Contact Us
            </Button>
            <Button href="/faq" variant="outline">
              Read the FAQ
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
