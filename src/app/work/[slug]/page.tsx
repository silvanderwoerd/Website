import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, getProjectSlugs } from "@/content";
import { StripeList } from "@/stripes/StripeList";
import { SiteShell } from "@/layout/SiteShell";

// The Project template: every project in content/projects/, generated ahead of time.
export const dynamicParams = false;

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = getProject((await params).slug);
  return project ? { title: project.title, description: project.description } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return (
    <SiteShell path={`/work/${slug}`} family={project.family} background={project.background}>
      <StripeList source={`projects/${slug}`} stripes={project.stripes} />
    </SiteShell>
  );
}
