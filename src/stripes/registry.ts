// Stripe type (as written in content files) → its original's component.

import type { ComponentType } from "react";
import type { StripeProps } from "./types";
import { ClosingCta } from "@/originals/closing-cta/ClosingCta";
import { FeaturedWork } from "@/originals/featured-work/FeaturedWork";
import { Hero } from "@/originals/hero/Hero";
import { LatestNews } from "@/originals/latest-news/LatestNews";
import { Partners } from "@/originals/partners/Partners";
import { Statement } from "@/originals/statement/Statement";
import { Testimonials } from "@/originals/testimonials/Testimonials";
import { TestStripe } from "@/originals/test-stripe/TestStripe";

const isDev = process.env.NODE_ENV === "development";

export const registry: Record<string, ComponentType<StripeProps>> = {
  "closing-cta": ClosingCta,
  "featured-work": FeaturedWork,
  hero: Hero,
  "latest-news": LatestNews,
  partners: Partners,
  statement: Statement,
  testimonials: Testimonials,
  // Dev-only stripes are left out of production builds entirely.
  ...(isDev ? { "test-stripe": TestStripe } : {}),
};
