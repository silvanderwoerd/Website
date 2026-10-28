// The settings every stripe has (docs/system.md §1): spaceBefore, pageTone,
// anchor. A stripe original spreads these on its root element.

import type { CSSProperties } from "react";
import type { StripeInstance } from "@/originals/types";

export function stripeBase(stripe: StripeInstance) {
  const attrs: Record<string, string> = {};
  if (stripe.pageTone) attrs["data-page-tone"] = stripe.pageTone;
  if (stripe.anchor) attrs.id = stripe.anchor;
  const style: CSSProperties = stripe.spaceBefore ? { marginTop: `var(--space-${stripe.spaceBefore})` } : {};
  return { attrs, style };
}
