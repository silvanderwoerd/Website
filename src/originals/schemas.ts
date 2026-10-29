// Every original's schema, by name. Client-safe: the Inspector draws its
// controls from these. Add each new original here.

import type { OriginalSchema } from "./types";
import { schema as arrowLink } from "./arrow-link/schema";
import { schema as button } from "./button/schema";
import { schema as campaign } from "./campaign/schema";
import { schema as closingCta } from "./closing-cta/schema";
import { schema as cta } from "./cta/schema";
import { schema as embed } from "./embed/schema";
import { schema as episode } from "./episode/schema";
import { schema as featuredWork } from "./featured-work/schema";
import { schema as film } from "./film/schema";
import { schema as footer } from "./footer/schema";
import { schema as gallery } from "./gallery/schema";
import { schema as hero } from "./hero/schema";
import { schema as instafilter } from "./instafilter/schema";
import { schema as latestNews } from "./latest-news/schema";
import { schema as moreWork } from "./more-work/schema";
import { schema as nav } from "./nav/schema";
import { schema as newsList } from "./news-list/schema";
import { schema as pageBackground } from "./page-background/schema";
import { schema as partners } from "./partners/schema";
import { schema as phones } from "./phones/schema";
import { schema as postBody } from "./post-body/schema";
import { schema as postHeader } from "./post-header/schema";
import { schema as posters } from "./posters/schema";
import { schema as preloader } from "./preloader/schema";
import { schema as projectDetails } from "./project-details/schema";
import { schema as projectTile } from "./project-tile/schema";
import { schema as quote } from "./quote/schema";
import { schema as relatedPosts } from "./related-posts/schema";
import { schema as statement } from "./statement/schema";
import { schema as stats } from "./stats/schema";
import { schema as testStripe } from "./test-stripe/schema";
import { schema as testimonials } from "./testimonials/schema";
import { schema as text } from "./text/schema";
import { schema as textOnImage } from "./text-on-image/schema";
import { schema as pageHeading } from "./page-heading/schema";
import { schema as workGrid } from "./work-grid/schema";
import { schema as workTile } from "./work-tile/schema";

const isDev = process.env.NODE_ENV === "development";

export const schemas: Record<string, OriginalSchema> = Object.fromEntries(
  [
    workTile, workGrid, pageHeading, arrowLink, button, campaign, closingCta, cta, embed, episode, featuredWork, film, footer, gallery, hero,
    instafilter, latestNews, moreWork, nav, newsList, pageBackground, partners, phones, postBody, postHeader,
    posters, preloader, projectDetails, projectTile, quote, relatedPosts, statement, stats, testimonials, text, textOnImage,
  ]
    // Dev-only originals are left out of production builds entirely.
    .concat(isDev ? [testStripe] : [])
    .map((s) => [s.name, s]),
);
