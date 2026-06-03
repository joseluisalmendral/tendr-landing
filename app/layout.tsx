import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AxeReporter } from "@/components/a11y/AxeReporter";
import { Providers } from "@/components/Providers";

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

export const metadata: Metadata = {
  title: "Tendr · tu mini-CRM de clientes",
  description:
    "Tendr organiza tu cartera de clientes, te recuerda a quien seguir y la IA te avisa que cliente esta en riesgo. El CRM agil para freelancers y perfiles junior.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn(
        "h-full antialiased",
        bricolage.variable,
        jakarta.variable,
        geistMono.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <AxeReporter />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
