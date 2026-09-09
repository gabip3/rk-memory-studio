import { site, SITE_URL, isPlaceholder } from "@/lib/site";
import type { Product } from "@/lib/data/products";
import { aggregateRating } from "@/lib/data/social-proof";
import { faqsForStructuredData } from "@/lib/data/faq";

/**
 * Structured data.
 *
 * Guiding rule: only emit a property we can actually stand behind. No
 * AggregateRating without real reviews, no Offer without real pricing, no
 * FAQ answer that is still a placeholder. Publishing invented structured data
 * is both a trust problem and a Google penalty risk.
 */

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Escaping "<" prevents a "</script>" inside any string from closing the tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function OrganizationJsonLd() {
  const sameAs = [site.social.instagram, site.social.facebook].filter(
    (url) => !isPlaceholder(url)
  );

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: site.name,
        url: SITE_URL,
        description: site.description,
        slogan: site.tagline,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Atlanta",
          addressRegion: "GA",
          addressCountry: "US",
        },
        ...(sameAs.length > 0 && { sameAs }),
        ...(!isPlaceholder(site.contact.email) && {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: site.contact.email,
            areaServed: "US",
            availableLanguage: "English",
          },
        }),
      }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: site.name,
        url: SITE_URL,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

export function ProductJsonLd({ product }: { product: Product }) {
  const rating = aggregateRating(product.slug);

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.seo.description,
        url: `${SITE_URL}/shop/${product.slug}`,
        brand: { "@type": "Brand", name: site.name },
        category: product.category,
        // Offers are omitted entirely while Etsy owns pricing: an Offer without
        // a real price is invalid structured data.
        ...(product.price != null && {
          offers: {
            "@type": "Offer",
            price: (product.price / 100).toFixed(2),
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/shop/${product.slug}`,
          },
        }),
        ...(rating && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating.ratingValue,
            reviewCount: rating.reviewCount,
          },
        }),
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; href: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: `${SITE_URL}${item.href}`,
        })),
      }}
    />
  );
}

export function FaqJsonLd() {
  const answered = faqsForStructuredData();
  if (answered.length === 0) return null;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: answered.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }}
    />
  );
}
