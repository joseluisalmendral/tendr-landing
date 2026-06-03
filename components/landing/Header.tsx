import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Header: top navigation bar (Server Component, static).
 *
 * Skeleton for F5: brand wordmark + 3 in-page nav links + single primary CTA.
 * One line at desktop, height under 80px. The CTA shares the page's single
 * signup intent ("Empezar gratis") with the Hero primary CTA, so there is no
 * duplicate-intent violation.
 *
 * TODO(F5): floating nav pill treatment (Cal-style) and a mobile menu. For now
 * the nav links are desktop-only; mobile shows brand + CTA.
 */
const NAV_LINKS = [
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Funciones", href: "#funciones" },
  { label: "Precios", href: "#precios" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-6 md:px-8">
        <Link
          href="/"
          className="font-display text-h3 text-text-primary"
          aria-label="Tendr, inicio"
        >
          Tendr
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-body-sm text-text-secondary underline-offset-4 hover:text-text-primary hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Button
          asChild
          className="rounded-md bg-accent-primary border border-border-strong text-body-sm text-on-accent h-auto px-4 py-2 transition-all hover:bg-accent-primary-hover active:translate-y-px"
        >
          <Link href="#precios">Empezar gratis</Link>
        </Button>
      </div>
    </header>
  );
}
