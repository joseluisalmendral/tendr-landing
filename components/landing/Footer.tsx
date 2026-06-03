import Link from "next/link";
import { GithubLogo, LinkedinLogo, XLogo } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";

import { JsonLd } from "@/components/seo/JsonLd";
import { siteUrl } from "@/components/seo/metadata";

/**
 * Footer (spec §7): sober closing block on sunken paper (Server Component).
 *
 * Four columns on desktop, single-column stack on mobile, plus a bottom row with
 * the copyright and a (placeholder) legal address. Emits an Organization JSON-LD
 * block (brand identity for SEO / answer engines) including sameAs (the social
 * profiles), foundingDate and a postal address.
 *
 * TODO: real social profiles, legal pages and registered address. The social
 * URLs, the /logo.png asset and the postal address below are placeholders.
 * TODO(opcional): pre-footer roles marquee (the page's only marquee).
 */

// Social profiles: reused for the visible links AND the JSON-LD `sameAs`.
const SOCIALS: { label: string; href: string; icon: Icon }[] = [
  { label: "X", href: "https://x.com/tendrapp", icon: XLogo },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/tendrapp", icon: LinkedinLogo },
  { label: "GitHub", href: "https://github.com/tendrapp", icon: GithubLogo },
];

const PRODUCT_LINKS = [
  { label: "Pricing", href: "#precios" },
  { label: "Features", href: "#funciones" },
  { label: "Cómo funciona", href: "#como-funciona" },
];

const COMPANY_LINKS = [
  { label: "Planes", href: "/pricing" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contacto", href: "#" },
];

const headingClass = "font-mono text-meta uppercase text-text-tertiary";
const linkClass =
  "text-body-sm text-text-secondary underline-offset-4 hover:text-text-primary hover:underline";

export function Footer() {
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
          sameAs: SOCIALS.map((s) => s.href),
          foundingDate: "2026",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Calle Ejemplo 1",
            addressLocality: "Madrid",
            postalCode: "28001",
            addressCountry: "ES",
          },
        }}
      />

      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-12 px-6 py-16 md:grid-cols-4 md:px-8">
        {/* Col 1: brand + tagline */}
        <div className="flex flex-col gap-3">
          <span className="font-display text-h3 text-text-primary">Tendr</span>
          <p className="max-w-[32ch] text-body-sm text-text-secondary">
            Tu cartera de clientes, casos y seguimientos en un solo sitio.
          </p>
        </div>

        {/* Col 2: Producto */}
        <nav aria-label="Producto" className="flex flex-col gap-3">
          <span className={headingClass}>Producto</span>
          {PRODUCT_LINKS.map((link) => (
            <Link key={link.label} href={link.href} className={linkClass}>
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

        {/* Col 4: Redes */}
        <nav aria-label="Redes" className="flex flex-col gap-3">
          <span className={headingClass}>Redes</span>
          {SOCIALS.map(({ label, href, icon: SocialIcon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 ${linkClass}`}
            >
              <SocialIcon size={18} weight="regular" aria-hidden="true" />
              {label}
            </a>
          ))}
        </nav>
      </div>

      {/* Bottom row: copyright + legal address placeholder */}
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-2 border-t border-border px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="font-mono text-meta uppercase text-text-tertiary">
          © 2026 Tendr
        </p>
        <p className="text-meta font-mono uppercase text-text-tertiary">
          Calle Ejemplo 1, 28001 Madrid, España
        </p>
      </div>
    </footer>
  );
}
