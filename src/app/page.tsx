import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { BestSellers } from "@/components/home/BestSellers";
import { HowItWorks } from "@/components/home/HowItWorks";
import { MadeJustForYou } from "@/components/home/MadeJustForYou";
import { FeaturedProduct } from "@/components/home/FeaturedProduct";
import { Keychains } from "@/components/home/Keychains";
import { EventKeepsakes } from "@/components/home/EventKeepsakes";
import { BulkOrdersCta } from "@/components/home/BulkOrdersCta";
import { BrandStory } from "@/components/home/BrandStory";
import { Reviews } from "@/components/home/Reviews";
import { InstagramGallery } from "@/components/home/InstagramGallery";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import { site, isPlaceholder, OG_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} | ${site.positioning}`,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    images: [OG_IMAGE],
    title: `${site.name} | ${site.positioning}`,
    description: site.description,
    url: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />

      <Hero />
      <BestSellers />

      {/* The beige tray sits on ivory, so this section owns its own spacing */}
      <div className="bg-ivory pb-20 sm:pb-28 lg:pb-36">
        <HowItWorks />
      </div>

      <MadeJustForYou />
      <FeaturedProduct />
      <Keychains />
      <EventKeepsakes />
      <BulkOrdersCta />
      <BrandStory />
      <Reviews />
      {/* Hidden until the account exists; see site.social.instagram. */}
      {!isPlaceholder(site.social.instagram) ? <InstagramGallery /> : null}
    </>
  );
}
