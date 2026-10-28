import { notFound } from "next/navigation";
import { getPage, getPageSlugs } from "@/content";
import { StripeList } from "@/stripes/StripeList";

// Every page in content/pages/, generated ahead of time.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPageSlugs().map((slug) => ({ slug: slug === "home" ? [] : slug.split("/") }));
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const name = slug?.join("/") ?? "home";
  const page = getPage(name);
  if (!page) notFound();
  return (
    <main className={page.family === "fixed" ? "page-fixed" : "page-fluid"}>
      <StripeList source={`pages/${name}`} stripes={page.stripes} />
    </main>
  );
}
