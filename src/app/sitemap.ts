import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { productSlugs } from "@/lib/data/products";
import { eventSlugs } from "@/lib/data/events";
import { policySlugs, helpSlugs } from "@/lib/data/policies";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const entry = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly"
  ) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    entry("/", 1, "weekly"),
    entry("/shop", 0.9, "weekly"),
    ...productSlugs().map((slug) => entry(`/shop/${slug}`, 0.9, "weekly")),
    entry("/events", 0.8),
    ...eventSlugs().map((slug) => entry(`/events/${slug}`, 0.7)),
    entry("/how-it-works", 0.7),
    entry("/bulk-orders", 0.7),
    entry("/about", 0.6),
    entry("/faq", 0.6),
    entry("/contact", 0.6),
    ...helpSlugs().map((slug) => entry(`/help/${slug}`, 0.4)),
    ...policySlugs().map((slug) => entry(`/policies/${slug}`, 0.3, "yearly")),
  ];
}
