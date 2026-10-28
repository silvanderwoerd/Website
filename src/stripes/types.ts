import type { StripeInstance } from "@/originals/types";

// What every stripe original receives from the page renderer.
export type StripeProps = {
  instance: string; // e.g. "pages/about#hero": the Inspector's data-instance
  stripe: StripeInstance;
};
