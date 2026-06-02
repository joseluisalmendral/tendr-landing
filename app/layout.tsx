import type { Metadata } from "next";
import localFont from "next/font/local";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AxeReporter } from "@/components/a11y/AxeReporter";
import { Providers } from "@/components/Providers";

// Display: Clash Display (Fontshare, libre comercial) self-hosteada.
const clashDisplay = localFont({
  src: [
    { path: "./fonts/ClashDisplay-Semibold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/ClashDisplay-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-clash-display",
  display: "swap",
});

// Body: Hanken Grotesk (OFL).
const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken-grotesk",
  display: "swap",
});

// Mono: JetBrains Mono (OFL) para metadata/labels.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
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
        clashDisplay.variable,
        hankenGrotesk.variable,
        jetbrainsMono.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <AxeReporter />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
