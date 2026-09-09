import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { ContactForm } from "@/components/forms/ContactForm";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { site, isPlaceholder } from "@/lib/site";

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Contact", href: "/contact" },
];

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Have a question about an order, personalization or an event? Contact RK Memory Studio in Atlanta, Georgia.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us | RK Memory Studio",
    description:
      "Questions about an order, personalization or an event - get in touch with RK Memory Studio.",
    url: "/contact",
  },
};

export default function ContactPage() {
  const hasEmail = !isPlaceholder(site.contact.email);

  return (
    <>
      <BreadcrumbJsonLd items={crumbs} />

      <PageHeader
        eyebrow="Contact"
        title="We&rsquo;d Love to Help"
        lede="Have a question about an order, personalization or event?"
        crumbs={crumbs}
      />

      <Section tone="ivory" spacing="lg">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <h2 className="text-display-s">Send us a message</h2>
            <p className="u-measure mt-4 text-[1rem] leading-[1.8] text-ink-muted">
              Tell us what you are hoping to make and we will help you get there.
            </p>

            <div className="mt-9">
              <ContactForm />
            </div>
          </Reveal>

          <Reveal delay={90} className="lg:sticky lg:top-32 lg:self-start">
            <div className="border border-taupe/50 bg-cream p-7 sm:p-8">
              <h2 className="u-eyebrow">Contact RK Memory Studio</h2>

              <ul className="mt-6 space-y-6">
                <li className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/45 text-gold"
                  >
                    <Icon name="mail" size={19} strokeWidth={1.2} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="u-caps text-[0.625rem] tracking-[0.2em] text-ink-subtle">
                      Email
                    </h3>
                    {hasEmail ? (
                      <a
                        href={`mailto:${site.contact.email}`}
                        className="mt-1 block break-words text-[1rem] text-ink transition-colors duration-[var(--dur-base)] hover:text-gold-ink"
                      >
                        {site.contact.email}
                      </a>
                    ) : (
                      <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-muted">
                        Our business email address is being set up. Use the form
                        and we will reply from it as soon as it is live.
                      </p>
                    )}
                  </div>
                </li>

                <li className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/45 text-gold"
                  >
                    <Icon name="instagram" size={19} strokeWidth={1.2} />
                  </span>
                  <div>
                    <h3 className="u-caps text-[0.625rem] tracking-[0.2em] text-ink-subtle">
                      Instagram
                    </h3>
                    <a
                      href={site.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block text-[1rem] text-ink transition-colors duration-[var(--dur-base)] hover:text-gold-ink"
                    >
                      {site.social.instagramHandle}
                    </a>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/45 text-gold"
                  >
                    <Icon name="pin" size={19} strokeWidth={1.2} />
                  </span>
                  <div>
                    <h3 className="u-caps text-[0.625rem] tracking-[0.2em] text-ink-subtle">
                      Location
                    </h3>
                    <p className="mt-1 text-[1rem] text-ink">
                      {site.contact.location}
                    </p>
                    <p className="mt-0.5 text-[0.875rem] leading-relaxed text-ink-muted">
                      {site.contact.serviceArea}
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-7 border-t border-taupe/50 pt-6">
                <p className="text-[0.875rem] leading-[1.75] text-ink-muted">
                  Planning an event?{" "}
                  <Link
                    href="/bulk-orders"
                    className="text-gold-ink underline underline-offset-4"
                  >
                    Request a bulk order quote
                  </Link>{" "}
                  and we will price it against your details.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
