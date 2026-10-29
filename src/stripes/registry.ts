// Stripe type (as written in content files) → its original's component.

import type { ComponentType } from "react";
import type { StripeProps } from "./types";
import { LogoRow } from "@/originals/logo-row/LogoRow";
import { CampaignFact } from "@/originals/campaign-fact/CampaignFact";
import { CampaignIntro } from "@/originals/campaign-intro/CampaignIntro";
import { ContactHero } from "@/originals/contact-hero/ContactHero";
import { Values } from "@/originals/values/Values";
import { ActStatement } from "@/originals/act-statement/ActStatement";
import { Sustainability } from "@/originals/sustainability/Sustainability";
import { ActCampaigns } from "@/originals/act-campaigns/ActCampaigns";
import { ActHero } from "@/originals/act-hero/ActHero";
import { LifeWith } from "@/originals/life-with/LifeWith";
import { Team } from "@/originals/team/Team";
import { Awards } from "@/originals/awards/Awards";
import { Services } from "@/originals/services/Services";
import { AboutStatement } from "@/originals/about-statement/AboutStatement";
import { WorkGrid } from "@/originals/work-grid/WorkGrid";
import { PageHeading } from "@/originals/page-heading/PageHeading";
import { Campaign } from "@/originals/campaign/Campaign";
import { ClosingCta } from "@/originals/closing-cta/ClosingCta";
import { Cta } from "@/originals/cta/Cta";
import { Embed } from "@/originals/embed/Embed";
import { Episode } from "@/originals/episode/Episode";
import { FeaturedWork } from "@/originals/featured-work/FeaturedWork";
import { Film } from "@/originals/film/Film";
import { Gallery } from "@/originals/gallery/Gallery";
import { Hero } from "@/originals/hero/Hero";
import { Instafilter } from "@/originals/instafilter/Instafilter";
import { LatestNews } from "@/originals/latest-news/LatestNews";
import { NewsList } from "@/originals/news-list/NewsList";
import { PostBody } from "@/originals/post-body/PostBody";
import { PostHeader } from "@/originals/post-header/PostHeader";
import { RelatedPosts } from "@/originals/related-posts/RelatedPosts";
import { MoreWork } from "@/originals/more-work/MoreWork";
import { Partners } from "@/originals/partners/Partners";
import { Phones } from "@/originals/phones/Phones";
import { Posters } from "@/originals/posters/Posters";
import { ProjectDetails } from "@/originals/project-details/ProjectDetails";
import { Quote } from "@/originals/quote/Quote";
import { Statement } from "@/originals/statement/Statement";
import { Stats } from "@/originals/stats/Stats";
import { Testimonials } from "@/originals/testimonials/Testimonials";
import { TestStripe } from "@/originals/test-stripe/TestStripe";
import { Text } from "@/originals/text/Text";
import { TextOnImage } from "@/originals/text-on-image/TextOnImage";

const isDev = process.env.NODE_ENV === "development";

export const registry: Record<string, ComponentType<StripeProps>> = {
  campaign: Campaign,
  "closing-cta": ClosingCta,
  cta: Cta,
  embed: Embed,
  episode: Episode,
  "featured-work": FeaturedWork,
  film: Film,
  gallery: Gallery,
  hero: Hero,
  instafilter: Instafilter,
  "latest-news": LatestNews,
  "more-work": MoreWork,
  "news-list": NewsList,
  partners: Partners,
  phones: Phones,
  "post-body": PostBody,
  "post-header": PostHeader,
  posters: Posters,
  "project-details": ProjectDetails,
  quote: Quote,
  "related-posts": RelatedPosts,
  statement: Statement,
  stats: Stats,
  testimonials: Testimonials,
  text: Text,
  "text-on-image": TextOnImage,
  "page-heading": PageHeading,
  "work-grid": WorkGrid,
  "about-statement": AboutStatement,
  "services": Services,
  "awards": Awards,
  "team": Team,
  "life-with": LifeWith,
  "act-hero": ActHero,
  "act-campaigns": ActCampaigns,
  "sustainability": Sustainability,
  "act-statement": ActStatement,
  "values": Values,
  "contact-hero": ContactHero,
  "campaign-intro": CampaignIntro,
  "campaign-fact": CampaignFact,
  "logo-row": LogoRow,
  // Dev-only stripes are left out of production builds entirely.
  ...(isDev ? { "test-stripe": TestStripe } : {}),
};
