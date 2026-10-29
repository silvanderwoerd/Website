import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, getPostSlugs, getTemplate } from "@/content";
import { StripeList } from "@/stripes/StripeList";
import { SiteShell } from "@/layout/SiteShell";

// The Post template (content/templates/post.json): every post in content/posts/,
// generated ahead of time.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPost((await params).slug);
  return post ? { title: post.title, description: post.summary } : {};
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getPost(slug)) notFound();
  const template = getTemplate("post");
  return (
    <SiteShell path={`/blog-posts/${slug}`} family={template.family} background={template.background}>
      <StripeList source="templates/post" stripes={template.stripes} context={{ post: slug }} />
    </SiteShell>
  );
}
