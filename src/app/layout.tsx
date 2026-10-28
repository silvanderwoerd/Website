import type { Metadata } from "next";
import localFont from "next/font/local";
import { InspectorMount } from "@/inspector/InspectorMount";
import "./globals.css";

// Lato 2, self-hosted (decisions #6). Weights 500/600 fall back to 400/700 as on the live site.
const lato = localFont({
  src: [
    { path: "../../public/fonts/lato-300.woff2", weight: "300" },
    { path: "../../public/fonts/lato-400.woff2", weight: "400" },
    { path: "../../public/fonts/lato-700.woff2", weight: "700" },
    { path: "../../public/fonts/lato-900.woff2", weight: "900" },
  ],
  variable: "--font-lato-file",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Studio Birthplace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={lato.variable} suppressHydrationWarning>
      <head>
        {/* Marks that scripts run, so motion's starting states (hidden words, the
            preloader) only apply when something will animate them away. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === "development" ? <InspectorMount /> : null}
      </body>
    </html>
  );
}
