import { notFound } from "next/navigation";
import {
  Bricolage_Grotesque,
  Plus_Jakarta_Sans,
  Geist_Mono,
} from "next/font/google";

import { DesignPlayground } from "./playground";

// v2 candidate fonts, loaded ONLY for this dev playground. They expose CSS
// variables scoped to the playground wrapper so the rest of the app keeps
// using the v1 font stack from the root layout.
const displayV2 = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display-v2",
  display: "swap",
});

const bodyV2 = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body-v2",
  display: "swap",
});

const monoV2 = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono-v2",
  display: "swap",
});

/**
 * Dev-only playground for the v2 visual system (docs/curso/design-md-v2.md).
 * Goal: validate the accent color live before refining design.md. All v2
 * tokens are defined locally in the playground wrapper; nothing leaks into
 * the production token layer.
 */
export default function DesignShowcasePage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return (
    <main
      className={`${displayV2.variable} ${bodyV2.variable} ${monoV2.variable}`}
    >
      <DesignPlayground />
    </main>
  );
}
