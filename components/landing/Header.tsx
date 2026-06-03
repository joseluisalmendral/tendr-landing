import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Header: top navigation bar (Server Component, static).
 *
 * Brand wordmark + 3 in-page nav links + single primary CTA. One line at
 * desktop, 64px tall (≤72px cap). The CTA shares the page's single signup
 * intent ("Empezar gratis") with the Hero primary CTA, so there is no
 * duplicate-intent violation.
 *
 * v2 distinctive treatment (design §2, §3):
 *  - Wordmark in display (Bricolage) with the tight display tracking, and the
 *    period of "Tendr." rendered in the wisp firma hue (--color-support). The
 *    dot is a real glyph tied to the letterform, not a decorative status dot,
 *    so it reads as a brand mark and stays within the support="firma" role.
 *  - Nav links carry the buttermilk subrayador sweep (.nav-underline) — the
 *    brand Mark device as a motivated hover/focus affordance (links are
 *    interactive). CSS-only scaleX, reduced-motion safe.
 *  - Cleaner sticky: hairline bottom + a slightly stronger surface blur so the
 *    bar reads as frosted warm-white over content, not an opaque slab.
 *
 * TODO(F5): mobile menu. For now the nav links are desktop-only; mobile shows
 * brand + CTA.
 */
const NAV_LINKS = [
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Funciones", href: "#funciones" },
  { label: "Precios", href: "#precios" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-hairline bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-6 md:px-8">
        <Link
          href="/"
          className="focus-ring rounded-sm font-display text-h3 font-semibold tracking-tight text-text-primary"
          aria-label="Tendr, inicio"
        >
          Tendr<span className="text-support" aria-hidden="true">.</span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-underline focus-ring rounded-sm text-body-sm text-text-secondary transition-colors duration-fast hover:text-text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Button
          asChild
          // Primary CTA = ink fill (#101010) + white text (19:1), radius-md, no
          // border/shadow (ink fill is the affordance). Hover darkens via opacity
          // since v2 dropped the accent-primary-hover token. :active push-down for
          // tactile feedback. focus-ring utility = 2px surface + 4px ink offset.
          className="focus-ring rounded-md bg-accent-primary text-body-sm text-accent-fg h-auto px-4 py-2 transition-[opacity,transform] duration-fast hover:opacity-90 active:translate-y-px"
        >
          <Link href="#precios">Empezar gratis</Link>
        </Button>
      </div>
    </header>
  );
}
