// Every original's schema, by name. Client-safe: the Inspector draws its
// controls from these. Add each new original here.

import type { OriginalSchema } from "./types";
import { schema as button } from "./button/schema";
import { schema as testStripe } from "./test-stripe/schema";

const isDev = process.env.NODE_ENV === "development";

export const schemas: Record<string, OriginalSchema> = {
  [button.name]: button,
  // Dev-only originals are left out of production builds entirely.
  ...(isDev ? { [testStripe.name]: testStripe } : {}),
};
