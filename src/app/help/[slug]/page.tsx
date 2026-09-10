import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/layout/ArticlePage";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getHelpPage, helpSlugs } from "@/lib/data/policies";
import { OG_IMAGE } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return helpSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = getHelpPage(slug);

  if (!page) return { title: "Not found" };

  return {
    title: page.seo.title,
    description: page.seo.description,
    alternates: { canonical: `/help/${page.slug}` },
    openGraph: {
      images: [OG_IMAGE],
      title: `${page.seo.title} | RK Memory Studio`,
      description: page.seo.description,
      url: `/help/${page.slug}`,
    },
  };
}

export default async function HelpRoute({ params }: Params) {
  const { slug } = await params;
  const page = getHelpPage(slug);

  if (!page) notFound();

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Help", href: `/help/${page.slug}` },
    { name: page.title, href: `/help/${page.slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={crumbs} />
      <ArticlePage page={page} crumbs={crumbs} />
    </>
  );
}
