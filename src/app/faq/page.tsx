import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";
import { faqsByGroup } from "@/lib/data/faq";

const crumbs = [
  { name: "Home", href: "/" },
  { name: "FAQ", href: "/faq" },
];

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "How to send your photos, what photo quality to use, adding names and dates, keepsakes for events, and how ordering works at RK Memory Studio.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ | RK Memory Studio",
    description:
      "Answers about photos, personalization, events and ordering personalized keepsakes.",
    url: "/faq",
  },
};

export default function FaqPage() {
  const groups = faqsByGroup();

  // The very first question on the page opens by default, as an affordance
  // showing the accordion is interactive.
  const firstQuestionId = groups[0]?.items[0]?.id;

  return (
    <>
      <FaqJsonLd />
      <BreadcrumbJsonLd items={crumbs} />

      <PageHeader
        eyebrow="FAQ"
        title="Questions, Answered"
        lede="If you cannot find what you need here, we are happy to help directly."
        crumbs={crumbs}
      />

      <Section tone="ivory" spacing="lg">
        <div className="mx-auto max-w-[48rem]">
          {groups.map((group, groupIndex) => (
            <Reveal
              key={group.group}
              delay={groupIndex * 60}
              className={groupIndex > 0 ? "mt-14" : ""}
            >
              <h2 className="u-eyebrow mb-6">{group.group}</h2>

              <Accordion>
                {group.items.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    question={faq.question}
                    defaultOpen={faq.id === firstQuestionId}
                    pending={faq.pending}
                  >
                    <p>{faq.answer}</p>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          ))}

          <Reveal
            delay={120}
            className="mt-16 border border-taupe/50 bg-cream px-8 py-12 text-center"
          >
            <h2 className="text-display-s">
              Still have a question?
            </h2>
            <p className="u-measure mx-auto mt-4 text-[1rem] leading-[1.8] text-ink-muted">
              Tell us about your order, your photos or your event and we will
              come back to you.
            </p>
            <Button href="/contact" variant="solid" className="mt-8">
              Contact Us
            </Button>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
