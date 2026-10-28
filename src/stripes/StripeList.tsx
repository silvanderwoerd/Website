import type { StripeInstance } from "@/originals/types";
import { registry } from "./registry";

// Draws a page's stripes in order. `source` is the content file's address,
// e.g. "pages/about", so each stripe's instance id is "pages/about#<id>".
export function StripeList({ source, stripes }: { source: string; stripes: StripeInstance[] }) {
  return stripes.map((stripe) => {
    const Stripe = registry[stripe.type];
    if (!Stripe) throw new Error(`${source}: unknown stripe type "${stripe.type}" (add it to src/stripes/registry.ts)`);
    return <Stripe key={stripe.id} instance={`${source}#${stripe.id}`} stripe={stripe} />;
  });
}
