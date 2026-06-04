import Link from "next/link";

import { JsonLd } from "@/components/seo/JsonLd";
import { siteUrl } from "@/components/seo/metadata";

/**
 * Footer (spec §7): the page's closing moment on sunken paper (Server Component).
 *
 * v2 distinctive treatment (design §3, §5): a large display wordmark anchors the
 * block (warm-ink, Bricolage, generous size) with ONE hand-drawn touch — a single
 * wisp underline (--color-support firma stroke) swiped beneath it. Hairline top +
 * generous breathing (space-24). The link columns are organized under the
 * wordmark; a single short tagline carries the voice. The bottom row is just the
 * copyright (no locale/address strip, no version footer).
 *
 * Emits an Organization JSON-LD block (brand identity for SEO / answer engines)
 * including sameAs (the social profiles) and foundingDate.
 *
 * NOTE: social links (X, LinkedIn, GitHub) are removed until real profile URLs
 * exist. The "Redes" column returns when profiles are live. /logo.png is also
 * a placeholder pending the real asset.
 */

// Placeholder sameAs URLs kept for JSON-LD only — not shown as visible links
// until real social profiles exist.
const SOCIAL_SAME_AS = [
  "https://x.com/tendrapp",
  "https://www.linkedin.com/company/tendrapp",
  "https://github.com/tendrapp",
];

const PRODUCT_ANCHORS = [
  { label: "Pricing", anchor: "precios" },
  { label: "Features", anchor: "funciones" },
  { label: "Cómo funciona", anchor: "como-funciona" },
];

const COMPANY_LINKS = [
  { label: "Planes", href: "/pricing" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

const headingClass = "font-mono text-meta uppercase text-text-tertiary";
const linkClass =
  "text-body-sm text-text-secondary underline-offset-4 hover:text-text-primary hover:underline";

export function Footer({ anchorBase = "/" }: { anchorBase?: string }) {
  // Normalise anchorBase: strip trailing slash so `${base}#id` is always clean.
  const base = anchorBase === "/" ? "" : anchorBase.replace(/\/$/, "");
  return (
    <footer className="w-full border-t border-border bg-surface-sunken">
      <JsonLd
        type="Organization"
        data={{
          name: "Tendr",
          url: siteUrl.toString(),
          logo: new URL("/logo.png", siteUrl).toString(),
          description:
            "Mini-CRM con IA para profesionales B2B junior y freelancers que gestionan clientes externos.",
          sameAs: SOCIAL_SAME_AS,
          foundingDate: "2026",
        }}
      />

      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-12 px-6 py-24 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        {/* Col 1: brand anchor — large display wordmark + the ONE hand-drawn
            wisp underline (firma) + a single short tagline. */}
        <div className="flex flex-col gap-4">
          <span className="relative inline-flex w-fit flex-col font-display text-display-lg font-bold tracking-tight text-text-primary">
            Tendr<span className="text-support" aria-hidden="true">.</span>
            {/* Wisp underline (design §3): a single hand-drawn support stroke,
                the footer's only flourish. Sits below the wordmark baseline. */}
            <svg
              className="mt-1 h-2 w-[5.5rem] text-support"
              viewBox="0 0 120 12"
              fill="none"
              aria-hidden="true"
              preserveAspectRatio="none"
            >
              <path
                d="M3 8C26 4 52 3 78 5c14 1 28 2 39 1"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <p className="max-w-[32ch] text-body-sm text-text-secondary">
            Tu cartera de clientes, casos y seguimientos en un solo sitio.
          </p>
        </div>

        {/* Col 2: Producto */}
        <nav aria-label="Producto" className="flex flex-col gap-3">
          <span className={headingClass}>Producto</span>
          {PRODUCT_ANCHORS.map((link) => (
            <Link key={link.label} href={`${base}#${link.anchor}`} className={linkClass}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Col 3: Empresa */}
        <nav aria-label="Empresa" className="flex flex-col gap-3">
          <span className={headingClass}>Empresa</span>
          {COMPANY_LINKS.map((link) => (
            <Link key={link.label} href={link.href} className={linkClass}>
              {link.label}
            </Link>
          ))}
        </nav>

      </div>

      {/* Bottom row: copyright only (no locale strip, no version footer). */}
      <div className="mx-auto w-full max-w-[1280px] border-t border-border-hairline px-6 py-6 md:px-8">
        <p className="font-mono text-meta uppercase text-text-tertiary">
          © 2026 Tendr
        </p>
      </div>
    </footer>
  );
}
