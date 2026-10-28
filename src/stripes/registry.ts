// Stripe type (as written in content files) → its original's component.

import type { ComponentType } from "react";
import type { StripeProps } from "./types";
import { TestStripe } from "@/originals/test-stripe/TestStripe";

const isDev = process.env.NODE_ENV === "development";

export const registry: Record<string, ComponentType<StripeProps>> = {
  // Dev-only stripes are left out of production builds entirely.
  ...(isDev ? { "test-stripe": TestStripe } : {}),
};
