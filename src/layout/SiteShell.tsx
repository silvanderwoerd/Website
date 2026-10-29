import type { CSSProperties, ReactNode } from "react";
import { getSite } from "@/content";
import { PageBackground } from "@/originals/page-background/PageBackground";
import { Preloader } from "@/originals/preloader/Preloader";
import { Nav } from "@/originals/nav/Nav";
import { Footer } from "@/originals/footer/Footer";
import { PointerEffects } from "@/motion/PointerEffects";
import styles from "./site-shell.module.css";

// Every page's frame, as Webflow's page wrapper: background, preloader, nav,
// the page's stripes, footer. `family` picks the type system (decisions #4);
// `background: "plain"` leaves the page-background layer out, as the news pages do.
export function SiteShell({
  path,
  family = "fluid",
  background,
  footer = true,
  children,
}: {
  path: string;
  family?: "fluid" | "fixed";
  background?: "black" | "plain";
  footer?: boolean;
  children: ReactNode;
}) {
  const site = getSite();
  return (
    <div
      data-body={background}
      className={`${styles.shell} ${family === "fixed" ? "page-fixed" : "page-fluid"}`}
      style={{ "--grain": `url("${site.pageBackground.grain}")` } as CSSProperties}
    >
      {background !== "plain" && <PageBackground grain={site.pageBackground.grain} />}
      <Preloader mask={site.pageBackground.preloaderMask} />
      <Nav logo={site.logo} email={site.email} socials={site.socials} nav={site.nav} mail={site.icons.mail} />
      <main className={styles.main}>{children}</main>
      {footer && <Footer logo={site.logo} socials={site.socials} footer={site.footer} path={path} />}
      <PointerEffects />
    </div>
  );
}
