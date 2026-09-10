import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/layout/ArticlePage";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getPolicy, policySlugs } from "@/lib/data/policies";
import { OG_IMAGE } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return policySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = getPolicy(slug);

  if (!page) return { title: "Not found" };

  return {
    title: page.seo.title,
    description: page.seo.description,
    alternates: { canonical: `/policies/${page.slug}` },
    openGraph: {
      images: [OG_IMAGE],
      title: `${page.seo.title} | RK Memory Studio`,
      description: page.seo.description,
      url: `/policies/${page.slug}`,
    },
  };
}

export default async function PolicyRoute({ params }: Params) {
  const { slug } = await params;
  const page = getPolicy(slug);

  if (!page) notFound();

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Policies", href: `/policies/${page.slug}` },
    { name: page.title, href: `/policies/${page.slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={crumbs} />
      <ArticlePage page={page} crumbs={crumbs} />
    </>
  );
}
