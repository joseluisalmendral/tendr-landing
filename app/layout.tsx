import { Bricolage_Grotesque, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AxeReporter } from "@/components/a11y/AxeReporter";
import { Providers } from "@/components/Providers";
import { baseMetadata } from "@/components/seo/metadata";

// Display: Bricolage Grotesque (Google variable font, OFL).
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-bricolage",
  display: "swap",
});

// Body: Plus Jakarta Sans (Google variable font, OFL).
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jakarta",
  display: "swap",
});

// Mono: Geist Mono (OFL) para numerales/metadata/labels.
const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
  display: "swap",
});

// Root metadata via the shared helper: this is the ONLY place `metadataBase`
// is set, and Next.js needs it in the metadata tree to absolutize the relative
// `alternates.canonical` and `openGraph.url` that the per-route helpers emit.
// Defining a bare metadata object here (the previous build) silently dropped
// `metadataBase`, so canonical/og:url shipped as relative paths (SEO defect).
export const metadata = baseMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn(
        "antialiased",
        bricolage.variable,
        jakarta.variable,
        geistMono.variable,
      )}
    >
      {/* body owns the full-viewport min-height via min-h-dvh (a self-contained
          viewport unit) instead of min-h-full, so <html> no longer needs h-full.
          Removing h-full on <html> avoids a Safari quirk where a 100%-height root
          can interfere with BFCache scroll restoration on back/forward nav. The
          flex column + min-h-dvh keeps the sticky-footer layout identical: the
          body is still at least one viewport tall and grows with content. */}
      <body className="min-h-dvh flex flex-col">
        <AxeReporter />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
