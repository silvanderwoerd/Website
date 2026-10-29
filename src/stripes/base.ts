// The settings every stripe has (docs/system.md §1): spaceBefore, padTop /
// padBottom, pageTone, anchor. A stripe original spreads `attrs` and `style`
// on its root and places `top` / `bottom` as its first and last children.

import { createElement, type CSSProperties } from "react";
import type { StripeInstance } from "@/originals/types";

const spacer = (token: string) => createElement("div", { "aria-hidden": "true", style: { height: `var(--space-${token})` } });

export function stripeBase(stripe: StripeInstance) {
  const attrs: Record<string, string> = {};
  if (stripe.pageTone) attrs["data-page-tone"] = stripe.pageTone;
  if (stripe.anchor) attrs.id = stripe.anchor;
  const style: CSSProperties = stripe.spaceBefore ? { marginTop: `var(--space-${stripe.spaceBefore})` } : {};
  return {
    attrs,
    style,
    top: stripe.padTop ? spacer(stripe.padTop) : null,
    bottom: stripe.padBottom ? spacer(stripe.padBottom) : null,
  };
}
