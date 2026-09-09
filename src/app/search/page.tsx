import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { SearchResults } from "@/components/search/SearchResults";

export const metadata: Metadata = {
  title: "Search",
  description: "Search RK Memory Studio products, events and questions.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <>
      <PageHeader
        eyebrow="Search"
        title="Find What You Need"
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Search", href: "/search" },
        ]}
      />

      <Section tone="ivory" spacing="lg" width="narrow">
        <Suspense
          fallback={<div className="u-skeleton h-64 w-full" aria-hidden="true" />}
        >
          <SearchResults />
        </Suspense>
      </Section>
    </>
  );
}
