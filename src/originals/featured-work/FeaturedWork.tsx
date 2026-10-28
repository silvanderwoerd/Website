import { resolveOriginal } from "../resolve";
import { marks } from "../marks";
import { ProjectTile, type Tile } from "../project-tile/ProjectTile";
import { stripeBase } from "@/stripes/base";
import { getSite } from "@/content";
import type { StripeProps } from "@/stripes/types";
import styles from "./featured-work.module.css";

export function FeaturedWork({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("featured-work", stripe);
  const base = stripeBase(stripe);
  const { projects } = stripe.content as { projects: Tile[] };
  const { icons } = getSite();
  return (
    <section className={styles.section} style={base.style} {...marks("featured-work", instance)} {...attrs} {...base.attrs}>
      {projects.map((p, i) => (
        <ProjectTile key={p.href} instance={`${instance}.projects.${i}`} tile={p} play={icons.play} />
      ))}
    </section>
  );
}
