import { resolveOriginal } from "../resolve";
import { marks } from "../marks";
import { WorkTile, type WorkTileContent } from "../work-tile/WorkTile";
import { stripeBase } from "@/stripes/base";
import type { StripeProps } from "@/stripes/types";
import styles from "./work-grid.module.css";

export function WorkGrid({ instance, stripe }: StripeProps) {
  const { attrs } = resolveOriginal("work-grid", stripe);
  const base = stripeBase(stripe);
  const { tiles } = stripe.content as { tiles: WorkTileContent[] };
  return (
    <section className={styles.section} style={base.style} {...marks("work-grid", instance)} {...attrs} {...base.attrs}>
      {base.top}
      <div className={styles.container}>
        <div className={styles.grid}>
          {tiles.map((t, i) => (
            <WorkTile key={t.href} instance={`${instance}.tiles.${i}`} tile={t} />
          ))}
        </div>
      </div>
      {base.bottom}
    </section>
  );
}
