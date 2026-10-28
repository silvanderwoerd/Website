import { notFound } from "next/navigation";
import { getDevPage } from "@/content";
import { StripeList } from "@/stripes/StripeList";

// Dev only (*.dev.tsx): the Inspector's test page, /dev/inspector-test.
export const dynamic = "force-dynamic";

export default function InspectorTestPage() {
  const page = getDevPage("inspector-test");
  if (!page) notFound();
  return (
    <main className="page-fluid">
      <StripeList source="dev/inspector-test" stripes={page.stripes} />
    </main>
  );
}
