// Rich text from content (Markdown, moved from Webflow's rich text) as HTML.
// The containing original styles it. Webflow's spacer paragraphs (a single
// zero-width joiner) come through as empty paragraphs, as on the live site.

import { marked } from "marked";

export function RichText({ markdown, className, as: Tag = "div" }: { markdown: string; className?: string; as?: "div" | "blockquote" }) {
  const html = marked.parse(markdown, { async: false, gfm: true, breaks: true }) as string;
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
