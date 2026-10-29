import type { StripeInstance } from "@/originals/types";
import { registry } from "./registry";
import type { PageContext } from "./types";

// Draws a page's stripes in order. `source` is the content file's address,
// e.g. "pages/about", so each stripe's instance id is "pages/about#<id>".
// A template (Post, Category) also passes `context`: the post or category shown.
export function StripeList({ source, stripes, context }: { source: string; stripes: StripeInstance[]; context?: PageContext }) {
  return stripes.map((stripe) => {
    const Stripe = registry[stripe.type];
    if (!Stripe) throw new Error(`${source}: unknown stripe type "${stripe.type}" (add it to src/stripes/registry.ts)`);
    return <Stripe key={stripe.id} instance={`${source}#${stripe.id}`} stripe={stripe} context={context} />;
  });
}
