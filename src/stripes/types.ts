import type { StripeInstance } from "@/originals/types";

// What every stripe original receives from the page renderer.
export type StripeProps = {
  instance: string; // e.g. "pages/about#hero": the Inspector's data-instance
  stripe: StripeInstance;
  context?: PageContext;
};

// What a template hands its stripes: the post or category the page is for.
export type PageContext = { post?: string; category?: string };
