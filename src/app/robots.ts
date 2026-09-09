import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Keep pre-launch environments out of the index entirely.
  const isLive = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";

  if (!isLive) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      sitemap: `${SITE_URL}/sitemap.xml`,
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Personal and transactional routes carry nothing worth indexing.
        disallow: ["/api/", "/cart", "/checkout", "/account", "/search"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
