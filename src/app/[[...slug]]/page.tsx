import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage, getPageSlugs } from "@/content";
import { StripeList } from "@/stripes/StripeList";
import { SiteShell } from "@/layout/SiteShell";

// Every page in content/pages/, generated ahead of time.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPageSlugs().map((slug) => ({ slug: slug === "home" ? [] : slug.split("/") }));
}

const nameOf = async (params: Promise<{ slug?: string[] }>) => (await params).slug?.join("/") ?? "home";

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const page = getPage(await nameOf(params));
  return page ? { title: page.title, description: page.description } : {};
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const name = await nameOf(params);
  const page = getPage(name);
  if (!page) notFound();
  return (
    <SiteShell path={name === "home" ? "/" : `/${name}`} family={page.family} background={page.background}>
      <StripeList source={`pages/${name}`} stripes={page.stripes} />
    </SiteShell>
  );
}
