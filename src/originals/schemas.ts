// Every original's schema, by name. Client-safe: the Inspector draws its
// controls from these. Add each new original here.

import type { OriginalSchema } from "./types";
import { schema as arrowLink } from "./arrow-link/schema";
import { schema as button } from "./button/schema";
import { schema as closingCta } from "./closing-cta/schema";
import { schema as featuredWork } from "./featured-work/schema";
import { schema as footer } from "./footer/schema";
import { schema as hero } from "./hero/schema";
import { schema as latestNews } from "./latest-news/schema";
import { schema as nav } from "./nav/schema";
import { schema as pageBackground } from "./page-background/schema";
import { schema as partners } from "./partners/schema";
import { schema as preloader } from "./preloader/schema";
import { schema as projectTile } from "./project-tile/schema";
import { schema as statement } from "./statement/schema";
import { schema as testStripe } from "./test-stripe/schema";
import { schema as testimonials } from "./testimonials/schema";

const isDev = process.env.NODE_ENV === "development";

export const schemas: Record<string, OriginalSchema> = Object.fromEntries(
  [arrowLink, button, closingCta, featuredWork, footer, hero, latestNews, nav, pageBackground, partners, preloader, projectTile, statement, testimonials]
    // Dev-only originals are left out of production builds entirely.
    .concat(isDev ? [testStripe] : [])
    .map((s) => [s.name, s]),
);
