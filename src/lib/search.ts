/**
 * Lightweight client-side search index.
 *
 * The catalogue is small and fully known at build time, so a filtered array
 * beats shipping a search library. If the catalogue grows past a few hundred
 * entries, swap this module for a real index - the component contract is just
 * `searchSite(query)`.
 */

import { products } from "@/lib/data/products";
import { eventCategories } from "@/lib/data/events";
import { faqs } from "@/lib/data/faq";

export type SearchResult = {
  title: string;
  href: string;
  kind: "Product" | "Event" | "Question" | "Page";
  description: string;
};

const staticPages: SearchResult[] = [
  {
    title: "How It Works",
    href: "/how-it-works",
    kind: "Page",
    description: "Choose it, upload it, we create it, love it.",
  },
  {
    title: "Bulk Orders",
    href: "/bulk-orders",
    kind: "Page",
    description: "Request a quote for 50, 100, 250 or more.",
  },
  {
    title: "About Us",
    href: "/about",
    kind: "Page",
    description: "We turn moments into keepsakes.",
  },
  {
    title: "Photo Guidelines",
    href: "/help/photo-guidelines",
    kind: "Page",
    description: "How to pick and send the best version of your photo.",
  },
  {
    title: "Contact",
    href: "/contact",
    kind: "Page",
    description: "Questions about an order, personalization or an event.",
  },
];

const index: SearchResult[] = [
  ...products.map((product) => ({
    title: product.name,
    href: `/shop/${product.slug}`,
    kind: "Product" as const,
    description: product.cardDescription,
  })),
  ...eventCategories.map((event) => ({
    title: event.name,
    href: `/events/${event.slug}`,
    kind: "Event" as const,
    description: event.blurb,
  })),
  ...faqs.map((faq) => ({
    title: faq.question,
    href: `/faq#${faq.id}`,
    kind: "Question" as const,
    description: faq.answer.slice(0, 110) + "...",
  })),
  ...staticPages,
];

/** Extra terms that should match an entry without appearing in its copy. */
const synonyms: Record<string, string> = {
  "custom photo magnets": "fridge refrigerator magnet magnets photo",
  "photo keychains": "keyring key ring keychain keychains",
  "photo strips": "photo booth strip strips booth",
  "event keepsakes": "favour favor favours favors guests party",
  "personalized gifts": "gift gifting present personalised",
  weddings: "wedding bride groom marriage",
  birthdays: "birthday party milestone",
  "baby showers": "baby shower newborn sonogram maternity",
  graduations: "graduation graduate senior school college",
  "corporate events": "corporate business company logo branded conference",
  "memorial keepsakes": "memorial memory remembrance funeral",
};

export function searchSite(query: string, limit = 8): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const terms = q.split(/\s+/).filter(Boolean);

  const scored = index
    .map((entry) => {
      const title = entry.title.toLowerCase();
      const haystack = [
        title,
        entry.description.toLowerCase(),
        synonyms[title] ?? "",
      ].join(" ");

      let score = 0;
      for (const term of terms) {
        if (!haystack.includes(term)) return { entry, score: -1 };
        if (title.startsWith(term)) score += 6;
        else if (title.includes(term)) score += 4;
        else score += 1;
      }

      // Products first when the score is otherwise level.
      if (entry.kind === "Product") score += 1.5;

      return { entry, score };
    })
    .filter((r) => r.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map((r) => r.entry);
}

/** Shown before the customer has typed anything. */
export const popularSearches = [
  "Photo magnets",
  "Keychains",
  "Wedding favours",
  "Bulk orders",
  "Photo guidelines",
];
