import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { BulkOrderForm } from "@/components/forms/BulkOrderForm";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Bulk Orders", href: "/bulk-orders" },
];

export const metadata: Metadata = {
  title: "Bulk Orders & Event Quotes",
  description:
    "Custom bulk orders for weddings, corporate events, graduations and large celebrations. Tell us about your event and we will put a quote together.",
  alternates: { canonical: "/bulk-orders" },
  openGraph: {
    title: "Bulk Orders & Event Quotes | RK Memory Studio",
    description:
      "Custom bulk keepsake orders for weddings, corporate events, graduations and large celebrations.",
    url: "/bulk-orders",
  },
};

const reassurances = [
  {
    icon: "gift" as const,
    title: "Built around your event",
    body: "Designs use your photography, names, dates and any branding you need.",
  },
  {
    icon: "hands" as const,
    title: "Quoted individually",
    body: "Every event is different, so we price against your actual quantity and specification.",
  },
  {
    icon: "truck" as const,
    title: "Shipping or local pickup",
    body: "Delivered to you, or collected in the Atlanta area.",
  },
];

export default function BulkOrdersPage() {
  return (
    <>
      <BreadcrumbJsonLd items={crumbs} />

      <PageHeader
        eyebrow="Bulk Orders"
        title="Need 50, 100, 250 or More?"
        lede="Planning a wedding, corporate event, graduation or large celebration? RK Memory Studio offers custom bulk orders for events."
        crumbs={crumbs}
      />

      <Section tone="ivory" spacing="lg">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-16">
          {/* Form */}
          <Reveal>
            <h2 className="sr-only">Request a quote</h2>
            <BulkOrderForm />
          </Reveal>

          {/* Supporting rail */}
          <Reveal delay={90} className="lg:sticky lg:top-32 lg:self-start">
            <div className="border border-taupe/50 bg-cream p-7 sm:p-8">
              <h2 className="u-eyebrow">What to Expect</h2>

              <ul className="mt-6 space-y-6">
                {reassurances.map((item) => (
                  <li key={item.title} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/45 text-gold"
                    >
                      <Icon name={item.icon} size={20} strokeWidth={1.2} />
                    </span>
                    <div>
                      <h3 className="text-[1.0625rem] leading-snug">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-[0.875rem] leading-[1.7] text-ink-muted">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-7 border-t border-taupe/50 pt-6">
                <p className="flex items-start gap-2.5 text-[0.8125rem] leading-relaxed text-ink-muted">
                  <Icon
                    name="info"
                    size={15}
                    className="mt-0.5 shrink-0 text-gold-ink"
                  />
                  <span>
                    Production timeframes and shipping costs are confirmed with
                    your quote, against your event date. We do not publish
                    figures we cannot guarantee for your specific order.
                  </span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
