import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getTemplate } from "@/content";
import { StripeList } from "@/stripes/StripeList";
import { SiteShell } from "@/layout/SiteShell";

// The Category template (content/templates/category.json): one page per category.
export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategories().find((c) => c.slug === slug);
  return category ? { title: category.name, description: category.description } : {};
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getCategories().some((c) => c.slug === slug)) notFound();
  const template = getTemplate("category");
  return (
    <SiteShell path={`/blog-categories/${slug}`} family={template.family} background={template.background}>
      <StripeList source="templates/category" stripes={template.stripes} context={{ category: slug }} />
    </SiteShell>
  );
}
